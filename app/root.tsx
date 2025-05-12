import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";

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
  useEffect(() => {
    // Check if user has manually set a theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // If user has manually set a theme, use that
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // If no manual preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);

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
        <ThemeScripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

export function ThemeScripts() {
  return (
    <>
      {/* Prevent flash of wrong theme */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Immediately apply the stored theme to prevent flash
            function applyStoredTheme() {
              const theme = localStorage.getItem('theme');
              const root = document.documentElement;
              
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                root.classList.add('dark');
                root.setAttribute('data-theme', 'dark');
                root.setAttribute('data-mode', 'dark');
                root.setAttribute('data-color-mode', 'dark');
                document.body.style.backgroundColor = 'rgb(3, 7, 17)';
              } else {
                root.classList.remove('dark');
                root.setAttribute('data-theme', 'light');
                root.setAttribute('data-mode', 'light');
                root.setAttribute('data-color-mode', 'light');
                document.body.style.backgroundColor = 'rgb(243, 244, 246)';
              }
            }
            
            // Run immediately
            applyStoredTheme();
            
            // Also run on visibility change (when user returns to the tab)
            document.addEventListener('visibilitychange', function() {
              if (document.visibilityState === 'visible') {
                applyStoredTheme();
              }
            });
          })();
        `
      }} />
      {/* Other scripts */}
    </>
  );
}
