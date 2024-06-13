import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query';
import type { ReactNode } from 'react';

export const queryClient = new QueryClient();

export function QueryClientProvider(props: { children: ReactNode }) {
  return <ReactQueryClientProvider client={queryClient}>{props.children}</ReactQueryClientProvider>;
}
