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
