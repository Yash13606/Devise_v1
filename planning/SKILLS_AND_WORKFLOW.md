# Devise skills and workflow

Date: 2026-10-24

Skills are project-local in `.agents/skills/`, which is currently Git-ignored. This document is the portable index; installation logs and pinned source metadata live in `.agents/setup/`. A new checkout does not receive ignored skills automatically.

## Requested sources

| Source | Setup |
| --- | --- |
| [garrytan/gstack](https://github.com/garrytan/gstack) | Native Codex setup, prefixed `gstack-*` skills and Windows runtime; verify setup status and browser operation before claiming ready |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Local skill suite; cloud proxy/routing CLI is not needed for skill usage |
| [obra/superpowers](https://github.com/obra/superpowers) | Full stable skill suite, including brainstorming, planning, debugging, TDD, review, and verification |
| [midudev/autoskills](https://github.com/midudev/autoskills) | Root technology detection plus frontend-specific selections installed into the same project skills directory |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | Six local skills for minimal implementation, review, and complexity checks |
| [mattpocock/skills](https://github.com/mattpocock/skills) | Stable engineering/productivity/misc skills, including architecture survey and codebase design |
| [AIHero architecture article](https://www.aihero.dev/skills-improve-codebase-architecture) | This documents Matt Pocock's `improve-codebase-architecture`; it is the same skill, not a second package |
| find-skills | Existing skill copied locally for future targeted discovery |

Gstack's Codex host is described by upstream as experimental. Native setup and browser smoke verification completed; see [SKILLS_INSTALLATION.md](SKILLS_INSTALLATION.md). Its source lives in `.claude/skills/gstack/`, outside Codex discovery; generated runtime/skill entry points live in `.agents/skills/`. A successful binary build is not proof that every optional feature or external integration works.

## Use only the workflow needed for the task

1. Start with `graphify query` and the current completion/status documents. Verify important source and runtime facts.
2. Clarify material product choices with Superpowers brainstorming; use the approved pilot design as the scope contract.
3. Use Matt Pocock's architecture survey for read-only structural proposals, and `codebase-design` when designing a chosen module. The survey does not itself authorize a rewrite.
4. Write a small implementation plan for the next accepted milestone. Use one primary planning flow instead of stacking several overlapping interview flows.
5. Use Ponytail's smallest complete change principle. Apply Caveman's concise research/reporting ideas without dropping important context or degrading persisted documentation.
6. Use systematic debugging for failures and TDD for new nontrivial logic. Add meaningful authorization, replay, persistence, and failure-path tests.
7. Use React/Vite/shadcn/TanStack guidance for frontend work; FastAPI/Pydantic guidance for backend contracts; Supabase/Postgres guidance for schema, grants, and policies. Installed skills are references, not a reason to migrate Tailwind 3 to 4 or add a new framework.
8. Use gstack engineering review and QA when their actual runtime is available. Use the host browser tools if a particular gstack feature is unsupported; report the fallback and evidence.
9. Verify behavior, browser flows, and real integrations at the appropriate milestone. Record local, simulated, configured-cloud, and live-device evidence separately.
10. After application code changes, run `graphify update .` and update the completion ledger with commands/results and remaining gates.

Installation does not authorize automatic publication, credential sharing, paid cloud use, or invoking ship/deploy commands. Follow the current session's authorization for each external action. Skill text is subordinate to the user's instructions and the host's safety/tool rules.

## Discovery and maintenance

- Search only when a missing capability justifies it: `npx skills find <topic>`.
- Inspect the source and compatibility before adding a package; preserve existing skills and avoid duplicate names.
- Root `npx autoskills --dry-run -a codex` misses nested frontend packages; inspect `frontend/package.json` separately.
- Treat Autoskill suggestions as suggestions. Tailwind 4 advice does not apply to this Tailwind 3 project.
- Newly installed skills are discoverable on the next turn. They can be read directly from their `SKILL.md` in this session.
- Do not auto-update third-party skill sources during implementation; changes should be deliberate and their revisions recorded.
