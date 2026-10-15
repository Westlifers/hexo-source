# Blog development

- Work on `feature/afterlight-theme` for Afterlight. See `afterlight-planning/PLAN.md` for the design direction.
- Git operations may create local commits. Do not push, publish, deploy, or change remote state unless the user explicitly requests it. This applies to later turns too.
- Preserve existing articles, their media, URLs, and the Icarus installation. Prefer theme-side compatibility.
- Keep `_config.yml` on Icarus. Use the isolated Afterlight preview commands; do not use the deploy command for validation.
- `npm run build:afterlight` builds into ignored `.afterlight-preview/`; `npm run preview:afterlight` builds and serves on loopback.
- Check real articles and desktop/mobile layouts. Record untested features accurately; the first stage is a design preview, not a completed migration.
