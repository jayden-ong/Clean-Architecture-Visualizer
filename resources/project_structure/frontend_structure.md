frontend/src/
├── i18n/                   # i18n configuration
│   ├── config.ts           # i18next initialization & plugin setup
│   └── locales/            # Translation JSON files
│       ├── en/
│       │   ├── common.json     # "Refresh", "Home", "Logo Alt Text"
│       │   ├── learning.json   # CA definitions (e.g., Controller, Entities) 
│       │   └── checker.json    # "Violations Detected", "Suggestions" 
│       └── fr/                 # Future support for other languages
│           └── ...
│       └── cn/                 
│           └── ...
├── api/                    # API service layer
│   ├── apiClient.ts        # Axios instance
│   ├── analysis.api.ts     # Triggers codebase scan & returns violations
│   ├── project.api.ts      # Template generation & "Add Use Case" logic
│   └── learning.api.ts     # Fetches CA concept definitions
│
├── actions/                # Data actions (React Query hooks)
│   ├── useAnalysis.ts      # Queries for violations & use cases
│   ├── useTemplates.ts     # Mutations for project scaffolding
│   └── useDiagram.ts       # Manages React Flow node/edge data
│
├── components/
│   ├── common/             # Reusable UI
│   │   ├── Button.tsx      # Refresh, Add Files buttons
│   │   └── Dropdown.tsx    # Use Case selection
│   ├── layout/             # Structural components
│   │   ├── Header.tsx      # "Clean Architecture Visualizer" title
│   │   └── Sidebar/        # Violation lists & Suggestions
│   ├── diagram/            # React Flow custom logic
│   │   ├── CADiagram.tsx   # The canvas
│   │   ├── nodes/          # Custom Nodes (Controller, Entities, etc.)
│   │   ├── edges/          # Custom Edges (Red/Dashed logic)
│   │   └── Popover.tsx     # Concept explanation popups
│   │   ├── Legend.tsx          # Floating legend for arrows and node types 
│   │   └── LearningPopup.tsx   # Interactive pop-ups with component descriptions [cite: 340, 343, 354]
│   └── code/               # Codebase interaction
│       ├── FileExplorer.ts # Tree view of src folder
│       └── CodeViewer.tsx  # Syntax highlighted Java code
│
├── pages/
│   ├── Home.tsx            # Main landing/Dashboard
│   ├── LearningMode.tsx    # Interactive diagram tutorials
│   ├── CheckerMode.tsx     # Active analysis & violation highlighting
│   └── ProjectStarter.tsx  # Form to generate new templates
│
├── lib/
│   ├── types.ts            # Shared types: Violation, NodeData, UseCase
│   ├── constants.ts        # CA Layer colors & Legend data
│   └── theme.ts            # UI styling
│
├── utils/
│   ├── diagramHelpers.ts   
│   ├── pathUtils.ts        
│   └── i18nHelpers.ts      # Helpers for switching locales or formatting
└── assets/                 
    ├── locales/            # 
    └── react.svg