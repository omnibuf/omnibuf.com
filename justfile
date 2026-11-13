# List available recipes
default:
    @just --list

# Install dependencies via pnpm
install:
    pnpm install --frozen-lockfile

# Start the Astro site dev server
dev:
    pnpm run dev

# Build the static Astro site into dist/
build:
    pnpm run build

# Preview the production Astro build locally
preview:
    pnpm run preview

# Lint and typecheck the Astro frontend (ESLint + astro check)
lint:
    pnpm run lint

# Format the Astro frontend using Prettier
fmt:
    pnpm run fmt

# Check Astro frontend formatting without modifying files
fmt-check:
    pnpm run fmt:check

# Preview the built site locally under Cloudflare Pages runtime (Wrangler)
pages-preview:
    pnpm run pages:preview

# Deploy dist/ to Cloudflare Pages (project: omnibuf, domain: omnibuf.com)
pages-deploy:
    pnpm run pages:deploy

# Run site verification tests
test:
    pnpm run test

# Run full CI checks (format check, lint/typecheck, production build, and site tests)
ci: fmt-check lint build test
