This is an official [PublicSquare](https://publicsquare.com) demo app that showcases how to integrate PublicSquare Payment Services with your Ecommerce or Platform of choice.

This app uses Javascript, React & Next.js, but you are free to use whatever language you would like. Refer to the [developer documentation](https://developers.publicsquare.com/) for detailed explanations for each language.

## Quick start

### Toolchain

[mise](https://mise.jdx.dev/) is the single source of truth for this project's runtimes.
`mise.toml` at the repo root declares Bun 1.4.x and Node 24 — the same versions CI installs.

```bash
mise install
```

### Dependencies

Bun is the package manager for this repo; `bun.lock` is the checked-in lockfile.

```bash
bun install
```

### Git hooks

[hk](https://hk.jdx.dev/) manages the git hooks; `hk.pkl` defines them. `mise install` installs
the hooks via its `postinstall` hook, so there is no separate setup step. The `pre-commit` hook
runs Prettier and ESLint over staged files and stages the fixes.

```bash
hk check --all   # lint the whole repo (what CI runs)
hk fix --all     # lint and auto-fix the whole repo
HK=0 git commit  # commit without running hooks
```

### Environment Configuration

Rename the `.env.example` file to `.env` and update the api key variables named `NEXT_PUBLIC_PUBLICSQUARE_API_URI`, `NEXT_PUBLIC_PUBLICSQUARE_API_KEY` and `PUBLICSQUARE_API_SECRET` from your account in the [PublicSquare portal](https://portal.publicsquare.com/developers/api-keys).

#### Apple Pay domain association per processor

The file `public/.well-known/apple-developer-merchantid-domain-association` is processor-specific. When testing Apple Pay with the **Moov** or **Nuvei** processor, replace the contents of that file with the corresponding version found in `public/.well-known/moov/` or `public/.well-known/nuvei/`.

If you add support for a new processor that needs Apple Pay, include its own domain association file under `public/.well-known/<processor-name>/` and swap it into `public/.well-known/apple-developer-merchantid-domain-association` when testing that processor.

### Run the development server:

```bash
bun dev
```

Then open [http://localhost:3000/ecommerce](http://localhost:3000/ecommerce) with your browser to see the Ecommerce demo.

## Scripts

| Command            | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `bun dev`          | Start the Next.js dev server on http://localhost:3000 |
| `bun run build`    | Production build                                      |
| `bun start`        | Serve the production build                            |
| `bun run lint`     | Run ESLint                                            |
| `bun run lint:fix` | Run ESLint with `--fix`                               |
| `bun run prettier` | Format with Prettier                                  |
| `bun audit`        | Check dependencies for known vulnerabilities          |
