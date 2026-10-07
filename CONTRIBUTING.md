# Contributing

Use Node.js 24 and pnpm 11. Install with `pnpm install --frozen-lockfile`, then run `pnpm run build`, `pnpm run lint` and `pnpm test`. Tests use a mocked HTTP boundary. Live media generation requires an explicit test plan and service credentials; do not place credentials in commits or fixtures.

Open a pull request with the behavior change, affected API contract, tests and example updates. Keep runtime dependencies limited to n8n-workflow. Releases are published from merged source through the provenance-enabled workflow.
