# Development Guidelines & Workflows

## Objective
Establish strict quality controls, testing strategies, and a standardized Git workflow to ensure long-term maintainability of the `haReactUI` project.

## Tooling & Linting
1. **Language**: Strict TypeScript (`"strict": true` in `tsconfig.json`).
2. **Build Tool**: Vite for fast HMR and optimized production builds.
3. **Code Quality**:
   - **ESLint**: Enforce strict linting rules (e.g., no unused variables, React Hooks exhaustive deps).
   - **Prettier**: Automated code formatting to ensure a consistent style across the codebase.
   - *Pre-commit Hooks (Husky/lint-staged)*: Recommended to run ESLint and Prettier on changed files before allowing a commit.

## Testing Strategy
1. **Unit Tests (Vitest)**:
   - Primary focus: Domain Converters (`src/converters/`). Since these are pure functions, they should have near 100% test coverage to guarantee that messy HA states are perfectly normalized.
   - Secondary focus: Zustand store logic and utility functions.
2. **End-to-End Tests (Playwright)**:
   - Primary focus: Rendering the dashboard, interacting with Grid Layout elements (dragging, dropping), and validating the Edit Mode Configuration UI.
   - Use mocked WebSocket endpoints or a test HA instance to simulate state changes without relying on a live production house.

## Git & Branching Strategy
1. **Main Branch**: `main` (or `master`) is protected and always stable.
2. **Feature & Bugfix Branches**:
   - ALL work must happen on a dedicated branch (e.g., `feature/light-card`, `bugfix/connection-retry`).
   - Direct commits to `main` are strictly prohibited.
3. **Merging & Versioning**:
   - Every branch merge must include a **version bump** in `package.json` (SemVer: Major for breaking UI/API changes, Minor for features, Patch for bug fixes).
   - Merges must **NOT be squashed** (`--no-ff` or standard merge commits). We want to preserve the detailed commit history of how a feature was developed.
