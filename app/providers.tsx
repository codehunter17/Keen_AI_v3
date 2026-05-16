"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { TabSync } from "@/components/tab-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Match cross-tab sync cadence — fresh enough to stay honest,
            // long enough to not spam the network on every render.
            staleTime: 60 * 1000,
            // When a tab regains focus, react-query should refetch any
            // active query so the UI matches the DB without a hard reload.
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TabSync />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
