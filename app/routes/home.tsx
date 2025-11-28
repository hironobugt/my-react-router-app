import { Suspense } from "react";
import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Button, ClientOnly } from "~/components/shared";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Welcome />
      <div className="mt-8 p-4 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Module Federation Demo</h2>
        <p className="mb-4 text-gray-600">
          This button is loaded from the atomic-shared remote application via Module Federation:
        </p>
        <ClientOnly fallback={<div>読み込み中...</div>}>
          {() => (
            <Suspense fallback={<div>読み込み中...</div>}>
              <Button variant="primary" onClick={() => alert("Module Federation is working!")}>
                Test Shared Component
              </Button>
            </Suspense>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}
