# Installed skills verification

Verified 2026-10-24. **156 project-local skills** with valid entry points.

Gstack 1.91.186.0: native Codex project setup, browser navigation/snapshot/screenshot verified against the running local UI. Source is outside the Codex skills tree to avoid duplicate source/fixture discovery. Codex support is experimental upstream; optional contained CSO execution requires a supported Linux/macOS host.

Installations are ignored by Git. Full per-file hashes and logs are local in `.agents/setup/installed-skills.json` and `.agents/setup/`.

## Pinned source revisions

| Source | Revision |
| --- | --- |
| https://github.com/DietrichGebert/ponytail | `09c434ab73ca43761c5d8b0c5d341926c2fba710` |
| https://github.com/JuliusBrussee/caveman | `1f951fb4ad40ba63302c6e7f987147e034d599d9` |
| https://github.com/garrytan/gstack | `00100f1598dcfc192f0f0f2d3345b6825737932a` |
| https://github.com/mattpocock/skills | `5beb35b040e3de97e54fa9e386d7e42d15c295c2` |
| https://github.com/midudev/autoskills | `2dbab03b41988327e5c714d3fb233ebbce915e8c` |
| https://github.com/obra/superpowers | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` |

The AIHero architecture article maps to Matt Pocock's installed `improve-codebase-architecture` skill. Caveman is installed as local skills; its cloud-routing CLI was not required. Autoskill detection was run at the root and inspected separately for the nested frontend; relevant frontend selections were installed into the same project directory. Tailwind 4 migration advice was deliberately excluded because this project uses Tailwind 3.

See [SKILLS_AND_WORKFLOW.md](SKILLS_AND_WORKFLOW.md) for task routing. Newly discovered skills are available on subsequent turns and can be read directly now.
