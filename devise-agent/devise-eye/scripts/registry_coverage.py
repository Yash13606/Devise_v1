#!/usr/bin/env python3
"""Registry coverage report.

For each domain in ai_tools_registry.json, resolves its IP(s) and checks
whether those IPs would be useful (non-CDN, unambiguous). Outputs a summary
and exits with code 1 if coverage falls below the TARGET threshold.

Usage:
    cd devise-agent/devise-eye
    python scripts/registry_coverage.py [--target 75]
"""

import argparse
import ipaddress
import json
import socket
import sys
from collections import defaultdict
from pathlib import Path

REGISTRY_PATH = Path(__file__).parent.parent / "data" / "ai_tools_registry.json"
CDN_RANGES_PATH = Path(__file__).parent.parent / "data" / "cdn_ip_ranges.json"
DNS_TIMEOUT = 3.0


def load_cdn_networks():
    with open(CDN_RANGES_PATH) as f:
        data = json.load(f)
    networks = []
    for entry in data.get("ranges", []):
        try:
            networks.append(ipaddress.IPv4Network(entry["cidr"], strict=False))
        except (ValueError, KeyError):
            pass
    return networks


def is_cdn_ip(ip: str, networks) -> bool:
    try:
        addr = ipaddress.IPv4Address(ip)
        return any(addr in net for net in networks)
    except ValueError:
        return False


def resolve_domain(domain: str) -> list[str]:
    socket.setdefaulttimeout(DNS_TIMEOUT)
    try:
        results = socket.getaddrinfo(domain, None)
        return list({r[4][0] for r in results})
    except Exception:
        return []


def main():
    parser = argparse.ArgumentParser(description="Registry coverage report")
    parser.add_argument("--target", type=int, default=75,
                        help="Minimum acceptable coverage % (default 75)")
    args = parser.parse_args()

    with open(REGISTRY_PATH) as f:
        data = json.load(f)

    tools = data.get("tools", [])
    cdn_networks = load_cdn_networks()

    # Track IP->domains for ambiguity detection
    ip_to_domains: dict[str, list[str]] = defaultdict(list)
    domain_to_ips: dict[str, list[str]] = {}

    print(f"\nResolving {len(tools)} registry domains …\n")

    for tool in tools:
        domain = tool["domain"]
        ips = resolve_domain(domain)
        domain_to_ips[domain] = ips
        for ip in ips:
            ip_to_domains[ip].append(domain)

    # Report per-domain
    resolved_count = 0
    cdn_only_count = 0
    unresolvable_count = 0
    ambiguous_count = 0
    usable_count = 0

    rows = []
    for tool in tools:
        domain = tool["domain"]
        tool_name = tool["tool_name"]
        ips = domain_to_ips.get(domain, [])

        if not ips:
            status = "UNRESOLVABLE"
            unresolvable_count += 1
        else:
            resolved_count += 1
            all_cdn = all(is_cdn_ip(ip, cdn_networks) for ip in ips)
            any_ambiguous = any(len(ip_to_domains[ip]) > 1 for ip in ips)

            if all_cdn:
                status = "CDN-ONLY"
                cdn_only_count += 1
            elif any_ambiguous:
                status = "AMBIGUOUS"
                ambiguous_count += 1
            else:
                status = "USABLE"
                usable_count += 1

        rows.append((domain, tool_name, status, ips[:2]))

    # Print table
    print(f"{'Domain':<50} {'Tool':<30} {'Status':<15} {'Sample IPs'}")
    print("-" * 130)
    for domain, tool_name, status, ips in sorted(rows, key=lambda r: r[2]):
        ip_str = ", ".join(ips) if ips else "—"
        print(f"{domain:<50} {tool_name:<30} {status:<15} {ip_str}")

    total = len(tools)
    coverage_pct = round(usable_count / total * 100, 1)

    print(f"""
=== Registry Coverage Summary ===
Total entries:     {total}
Resolved:          {resolved_count}
  Usable IPs:      {usable_count}   ({coverage_pct}%)
  CDN-only:        {cdn_only_count}  (hostname matching required)
  Ambiguous:       {ambiguous_count}  (multiple tools share IP)
Unresolvable:      {unresolvable_count}

Coverage (usable / total): {usable_count}/{total} = {coverage_pct}%
Target:                    {args.target}%
""")

    if coverage_pct < args.target:
        print(f"FAIL: coverage {coverage_pct}% is below target {args.target}%")
        sys.exit(1)
    else:
        print(f"PASS: coverage {coverage_pct}% meets target {args.target}%")


if __name__ == "__main__":
    main()
