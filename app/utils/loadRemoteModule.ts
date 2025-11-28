/**
 * Dynamically load Module Federation remote modules
 * This approach works with SSR by loading remotes only on the client side
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

type RemoteModule = {
  get: (module: string) => Promise<() => any>;
  init: (shared: any) => void;
};

const remoteUrl = "http://localhost:5001/assets/remoteEntry.js";
let remoteModule: RemoteModule | null = null;
let remoteInitialized = false;

async function loadRemoteEntry(): Promise<RemoteModule> {
  if (typeof window === "undefined") {
    throw new Error("Remote modules can only be loaded on the client side");
  }

  if (remoteModule) {
    console.log("[MF] Remote entry already loaded");
    return remoteModule;
  }

  console.log(`[MF] Loading remote entry from: ${remoteUrl}`);
  
  // Import the remote entry as an ES module
  const remote = await import(/* @vite-ignore */ remoteUrl);
  console.log("[MF] Remote entry loaded:", remote);
  
  remoteModule = remote as RemoteModule;
  return remoteModule;
}

async function initRemote(): Promise<void> {
  if (remoteInitialized) {
    return;
  }

  const remote = await loadRemoteEntry();

  // Initialize with shared dependencies
  remote.init({
    react: {
      "19.2.0": {
        get: () => Promise.resolve(() => React),
        loaded: true,
        from: "host",
      },
    },
    "react-dom": {
      "19.2.0": {
        get: () => Promise.resolve(() => ReactDOM),
        loaded: true,
        from: "host",
      },
    },
  });

  remoteInitialized = true;
  console.log("[MF] Remote initialized");
}

export async function loadRemoteModule<T = any>(moduleName: string): Promise<T> {
  // Only run on client side
  if (typeof window === "undefined") {
    throw new Error("Remote modules can only be loaded on the client side");
  }

  try {
    console.log(`[MF] Loading remote module: ${moduleName}`);
    await initRemote();

    if (!remoteModule) {
      throw new Error("Remote not initialized");
    }

    console.log(`[MF] Getting module: ${moduleName}`);
    const factory = await remoteModule.get(moduleName);
    const module = factory();
    console.log(`[MF] Module loaded successfully: ${moduleName}`, module);
    return module;
  } catch (error) {
    console.error(`[MF] Failed to load module ${moduleName}:`, error);
    throw error;
  }
}
