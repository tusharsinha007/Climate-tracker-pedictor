"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Handle theme and remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.className = isDarkMode ? "dark antialiased" : "antialiased";
    
    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      document.body.className = e.matches ? "dark antialiased" : "antialiased";
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <body className="antialiased" suppressHydrationWarning>
      {children}
    </body>
  );
}