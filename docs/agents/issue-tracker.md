# Issue tracker: GitHub Issues

Issues and PRDs for this repo live in GitHub Issues for `Fuucodi0X/addisSoftware`.

Do not create or use a local `.scratch/` issue tracker in this repo. GitHub Issues are the canonical source of truth for PRDs, implementation issues, and triage state.

## Conventions

- Use the `gh` CLI from this repository.
- PRDs should be published as GitHub issues.
- Implementation issues should be published as separate GitHub issues and linked back to their parent PRD issue.
- Triage state is represented with labels from `docs/agents/triage-labels.md`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue with `gh issue create` and apply the relevant triage label.

## When a skill says "fetch the relevant ticket"

Use `gh issue view` for the referenced GitHub issue number or URL.
