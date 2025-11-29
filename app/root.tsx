import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Provider } from "react-redux";

import type { Route } from "./+types/root";
import "./app.css";
import { store } from "./store";
import { Navigation } from "./components/Navigation";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
      <Outlet />
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "エラーが発生しました";
  let details = "予期しないエラーが発生しました。";
  let statusCode: number | undefined;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    
    switch (error.status) {
      case 404:
        message = "ページが見つかりません";
        details = "お探しのページは存在しないか、移動した可能性があります。";
        break;
      case 401:
        message = "認証が必要です";
        details = "このページにアクセスするにはログインが必要です。";
        break;
      case 403:
        message = "アクセスが拒否されました";
        details = "このページにアクセスする権限がありません。";
        break;
      case 500:
        message = "サーバーエラー";
        details = "サーバーで問題が発生しました。しばらくしてから再度お試しください。";
        break;
      default:
        message = `エラー ${error.status}`;
        details = error.statusText || details;
    }
  } else if (error && error instanceof Error) {
    // In development, show detailed error information
    if (import.meta.env.DEV) {
      details = error.message;
      stack = error.stack;
    } else {
      // In production, show generic message
      details = "申し訳ございません。問題が発生しました。しばらくしてから再度お試しください。";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {statusCode && (
            <p className="text-6xl font-bold text-blue-600 mb-4">{statusCode}</p>
          )}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            {message}
          </h1>
          <p className="text-lg text-gray-600 mb-8">{details}</p>
          
          <div className="space-y-4">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
            >
              ホームに戻る
            </a>
            
            {statusCode === 401 && (
              <a
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
              >
                ログインページへ
              </a>
            )}
            
            {statusCode === 404 && (
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
              >
                ダッシュボードへ
              </a>
            )}
          </div>

          {stack && import.meta.env.DEV && (
            <div className="mt-8 text-left">
              <details className="bg-white rounded-lg shadow p-4">
                <summary className="cursor-pointer font-semibold text-gray-900 mb-2">
                  開発者向け情報
                </summary>
                <pre className="text-xs overflow-x-auto bg-gray-50 p-4 rounded border border-gray-200">
                  <code className="text-red-600">{stack}</code>
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
