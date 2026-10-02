# Quick Daily To-Do List

A minimalist daily task-manager React component with drag-and-drop prioritization. Tasks and deleted tasks persist in the browser's `localStorage`, and the UI includes a dark/light mode toggle plus a task-history view.

## Features

- **Add and delete tasks** — quick task entry and one-click removal
- **Drag-and-drop prioritization** — reorder tasks by dragging
- **Task history** — soft-deleted tasks are kept in a recoverable history
- **Persistent storage** — tasks saved in `localStorage`, survive reloads
- **Dark / light mode toggle** — built-in theme switch

## Tech Stack

- React (hooks: `useState`, `useEffect`)
- TypeScript (`Task` type definitions)
- shadcn/ui components (`Button`, `Card`, `Input`)
- `lucide-react` icons
- `localStorage` for client-side persistence

## Quick Start

This is a single self-contained component. Drop it into any React + TypeScript project:

```bash
# install peer dependencies
npm install lucide-react
# (shadcn/ui components: Button, Card, Input — add via your shadcn setup)
```

```tsx
import DailyTodo from "./DailyTodo";

export default function App() {
  return <DailyTodo />;
}
```

The component file was originally named `Quick Daily To-Do List` and renamed to `DailyTodo.tsx` for clarity; no logic was changed.

## Project Structure

```
.
├── DailyTodo.tsx   # The task-manager component (default export: DailyTodo)
├── LICENSE         # License
└── README.md       # This file
```

## Environment Variables

None — all state is local to the browser.

## Deployment

This repo is a code snippet, not a deployable website. To use it, integrate the component into a React app and deploy that app normally.

## License

See [LICENSE](./LICENSE).

---

**Built by Girish Lade** — https://ladestack.in
