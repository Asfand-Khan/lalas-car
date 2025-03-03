"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const TanstackQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Don't refetch when user switches tabs
        refetchOnReconnect: true, // Refetch when internet reconnects
        retry: 2, // Retry failed queries twice before throwing an error
        staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default TanstackQueryClientProvider;
