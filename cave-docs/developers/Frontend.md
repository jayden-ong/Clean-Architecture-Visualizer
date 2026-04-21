---
sidebar_position: 4
---

# CAVE Frontend

## Tech Stack

The project utilizes a modern development stack to ensure a responsive and maintainable codebase for the UofT Blueprint team:

* **React and Vite**: We use Vite to provide a fast development environment and an optimized production build process.
* **Material UI (MUI)**: This library is our primary source for standardized UI components and iconography.
* **Custom Components**: In addition to MUI, we have developed internal custom components specifically tailored for the unique requirements of Clean Architecture visualization.
* **Mock Service Worker (MSW)**: We use MSW to provide mock data and simulate backend endpoints. This allow simultaneous development of frontend and backend.
* **TypeScript**: We use TypeScript throughout the project to ensure type safety and code quality.
* **Vitest**: This is our primary framework for executing unit and integration tests.
* **Playwright**: We utilize Playwright for comprehensive end-to-end testing to ensure the visualizer functions correctly across different browsers.

## Frontend File Structure

The frontend app lives in `frontend/src`. Use this structure as the default guide for where code should go:

```text
frontend/src/
   actions/     # React Query hooks and action-level data logic
   api/         # API clients and endpoint wrappers
   assets/      # Static assets used by the app
   components/  # Reusable UI components
   hooks/       # Reusable React hooks
   i18n/        # Translation setup and locale resources
   lib/         # Shared types, constants, themes, and core frontend models
   mocks/       # MSW handlers and mock data
   pages/       # Route-level page components
   styles/      # Shared/global style utilities
   utils/       # Pure helper functions
   App.tsx      # Root app composition
   main.tsx     # Frontend entry point
```

Placement rules:

* Put route-level UI in `pages/`, and reusable pieces in `components/`.
* Put data fetching and server interaction in `api/` + `actions/` (not inside presentational components).
* Put shared cross-feature definitions in `lib/`.
* Put generic helpers in `utils/` and reusable hooks in `hooks/`.

## i18n
TODO: Add a short i18n section that explains where translation files live, how to add new keys, and how to use `useTranslation` in components.

## UI Styling Conventions

### Using the MUI colour palette

Use theme palette values instead of hardcoded hex values whenever possible. This keeps colours consistent across the app and makes future theme updates easier.

Recommended approach:

1. Add or update palette tokens in the shared MUI theme.
2. Reference tokens with `theme.palette.*` in styled components.
3. Use semantic names (`primary`, `secondary`, `error`, `warning`, `success`, `info`) rather than one-off colour values.

Example:

```tsx
import { styled } from '@mui/material/styles';

export const Panel = styled('section')(({ theme }) => ({
   backgroundColor: theme.palette.background.paper,
   color: theme.palette.text.primary,
   border: `1px solid ${theme.palette.divider}`,
}));
```

If a new colour is needed, prefer adding it to the theme first, then consuming it from components.

### Component file separation: `index.tsx` + `styles.ts`

For most reusable UI components, separate structure/logic from styling:

* `index.tsx`: component logic, props, hooks, and JSX structure.
* `styles.ts`: styled wrappers and visual primitives.

Benefits:

* Keeps component logic readable.
* Makes style reuse and review easier.
* Reduces merge conflicts when one person changes logic and another changes styling.

Suggested pattern:

```tsx
// index.tsx
import { Container, Title } from './styles';

type Props = {
   title: string;
};

export default function FeatureCard({ title }: Props) {
   return (
      <Container>
         <Title>{title}</Title>
      </Container>
   );
}
```

```ts
// styles.ts
import { styled } from '@mui/material/styles';

export const Container = styled('article')(({ theme }) => ({
   backgroundColor: theme.palette.background.paper,
   borderRadius: theme.shape.borderRadius,
   padding: theme.spacing(2),
}));

export const Title = styled('h3')(({ theme }) => ({
   color: theme.palette.text.primary,
   margin: 0,
}));
```

Notes:

* Small one-file components are fine when separation adds unnecessary overhead.
* For larger components, default to this split to keep files maintainable.

Example folder structure:

```text
frontend/src/components/FeatureCard/
   index.tsx
   styles.ts
frontend/src/components/AnotherComponent/
   index.tsx
   styles.ts
```

### Good examples in this codebase

New developers can use these files as references:

* `frontend/src/components/code/CodeViewer/index.tsx` + `frontend/src/components/code/CodeViewer/styles.ts`
   * Good example of a component that keeps view logic in `index.tsx` and palette-driven styled components in `styles.ts`.
* `frontend/src/components/code/FileExplorer/index.tsx` + `frontend/src/components/code/FileExplorer/styles.ts`
   * Good example of conditional styling using `theme.palette.*` for active, hover, and text states.
* `frontend/src/components/diagram/ViolationsSideBarContent/index.tsx` + `frontend/src/components/diagram/ViolationsSideBarContent/styles.ts`
   * Good example of separating rendering/data-state logic from visual primitives.
* `frontend/src/components/diagram/SideBar/index.tsx` + `frontend/src/components/diagram/SideBar/styles.ts`
   * Good example of layout-focused styled components with theme spacing and palette tokens.

Related pattern:

* `frontend/src/pages/CheckerMode/index.tsx` + `frontend/src/pages/CheckerMode/styles.ts`
   * Uses a shared `styles` object consumed via MUI `sx`, which is also acceptable for page-level styling.

## Reusable Types and Constants

Define reusable values once and import them everywhere they are needed.

* If a type or constant is used in more than one file, it should live in `src/lib`.
* Shared types go in `frontend/src/lib/types.ts`.
* Shared constants go in `frontend/src/lib/storageKeys.ts` (and similar files in `src/lib` when needed).
* Before creating new definitions, check `src/lib` and reuse what already exists.

## File Naming Conventions

Keep file names predictable and consistent:

* Use `index.tsx` for a component entry file and `styles.ts` for its styled definitions.
* Use `PascalCase` folder names for components and pages (for example: `CodeViewer`, `CheckerMode`).
* Use `camelCase` for utility/lib files (for example: `storageKeys.ts`).
* Use descriptive names for hooks and tests (for example: `useSomething.ts`, `ComponentName.test.tsx`).

## Accessibility

Build accessibility in by default:

* Use semantic HTML and MUI components that provide built-in accessibility support.
* Ensure all interactive elements are keyboard accessible and have visible focus states.
* Add accessible names for controls (`aria-label`, `aria-labelledby`, or visible text labels).
* Keep color contrast readable; do not rely on color alone to communicate status.
   * This website is good for checking colour contrast: https://webaim.org/resources/contrastchecker/
* Provide alt text for meaningful images and icons, and hide decorative icons from screen readers.
* For dialogs, accordions, and navigation, verify correct ARIA relationships and focus behavior.

Quick check before merging:

* Navigate key flows using keyboard only (Tab, Shift+Tab, Enter, Space, Escape).
* Confirm screen reader labels are present for key actions.
* Validate error and success states are understandable without color cues.
* In Chrome, open DevTools and run **Lighthouse > Accessibility > Analyze page load** for a quick built-in audit.
* In Chrome DevTools, inspect a text element and hover the contrast indicator in the color picker to see the current contrast ratio.

## Launching the frontend

### Option 1: Via the CLI (recommended)

From the project root that you wish to validate your adherence to clean architecture (or anywhere after `npm link`):

```bash
cave start
```

e.g. from the package root:

```bash
cave start clean-architecture-visualizer
```

This will:

1. Read the directory
2. Start the Vite dev server for this React app (port 5173)
3. Open your browser to `http://localhost:5173`

### Option 2: Run the dev server manually

If you want to see the frontend without connecting to any backend endpoints, and instead use the MSW data:

1. Install dependencies (from this directory):

   ```bash
   cd frontend
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option 3: Build and preview production

```bash
cd frontend
npm install
npm run build
npm run preview
```

Then open the URL shown (e.g. `http://localhost:5173`).


## Command Map

The following scripts are defined for development, testing, and deployment:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server at `http://localhost:5173`. |
| `npm run build` | Compiles the TypeScript code and minifies assets for production. |
| `npm run preview` | Serves the local production build for final verification. |
| `npm run test:unit` | Executes the Vitest suite to verify individual components and logic. |
| `npm run test:e2e` | Launches Playwright to perform full end-to-end browser testing. |
| `npm run test:e2e --ui ` | Launches Playwright with UI to perform full end-to-end browser testing. |


