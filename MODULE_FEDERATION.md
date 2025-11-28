# Module Federation Setup

This document explains how to use the Module Federation integration with atomic-shared components.

## Overview

The React Router app is configured to consume shared UI components from the `atomic-shared` application using Module Federation. This allows us to share components across multiple applications without duplicating code.

## Configuration

### Vite Configuration

The `vite.config.ts` includes the Module Federation plugin:

```typescript
federation({
  name: "react-router-app",
  remotes: {
    atomicShared: "http://localhost:5001/assets/remoteEntry.js",
  },
  shared: ["react", "react-dom"],
})
```

### TypeScript Types

Type definitions for remote components are located in `app/types/atomic-shared.d.ts`. These provide full TypeScript support for the shared components.

## Usage

### Method 1: Direct Import (Recommended)

Import components from the shared module:

```typescript
import { Button, Input, UserForm } from '~/components/shared';

function MyComponent() {
  return (
    <Button variant="primary" onClick={() => console.log('clicked')}>
      Click Me
    </Button>
  );
}
```

### Method 2: Direct Module Import

You can also import directly from the remote module:

```typescript
import { Button } from 'atomicShared/Button';
```

## Available Components

### Atoms
- **Button**: Basic button component with variants (primary, secondary, danger)
- **Input**: Text input with validation error support
- **Label**: Form label with required indicator

### Molecules
- **FormField**: Combined label + input + error message

### Organisms
- **UserForm**: Complete user registration/edit form
- **UserCard**: User display card with actions

## Development

### Starting the Applications

1. **Start atomic-shared** (must be running first):
   ```bash
   cd atomic-shared
   npm run dev
   ```
   This runs on `http://localhost:5001`

2. **Start react-router-app**:
   ```bash
   cd my-react-router-app
   npm run dev
   ```

### Important Notes

- The atomic-shared application **must be running** before starting the React Router app
- The remote URL is configured for development (`http://localhost:5001`)
- For production, update the remote URL in `vite.config.ts`

## Troubleshooting

### Components Not Loading

1. Ensure atomic-shared is running on port 5001
2. Check browser console for Module Federation errors
3. Verify the remote entry URL is accessible: `http://localhost:5001/assets/remoteEntry.js`

### TypeScript Errors

If you see TypeScript errors for remote imports:
1. Ensure `app/types/atomic-shared.d.ts` exists
2. Run `npm run typecheck` to verify configuration
3. Restart your TypeScript server in your IDE

### Build Issues

For production builds:
1. Build atomic-shared first: `cd atomic-shared && npm run build`
2. Serve atomic-shared: `npm run preview`
3. Update the remote URL in vite.config.ts if needed
4. Build react-router-app: `cd my-react-router-app && npm run build`
