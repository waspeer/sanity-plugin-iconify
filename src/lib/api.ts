import { IconifyInfo } from '@iconify/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IconifySearchResult } from './types';
import { useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';

const BASE_API_URL = 'https://api.iconify.design';

function fetchJson<T>({ url, signal }: { url: string | URL; signal?: AbortSignal }): Promise<T> {
  return fetch(url, { signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network error: status ${response.status}`);
      }

      return response.json();
    })
    .then(
      (result) => result as T,
      (error) => {
        if (error instanceof Error) {
          throw error;
        } else {
          console.error(`Unknown error: ${error}`);
          throw new Error('Something went wrong');
        }
      },
    );
}

export function useSearch({ collections }: { collections: string[] | null }) {
  const queryClient = useQueryClient();
  const [term, setTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useDebounce(term, 500);

  const updateTerm = useCallback(
    (newTerm: string, updateImmediately = false) => {
      setTerm(newTerm);

      if (updateImmediately) {
        setDebouncedTerm(newTerm);
      }
    },
    [setDebouncedTerm],
  );

  const { isInitialLoading, isError, error, data, isPreviousData } = useQuery<string[], Error>({
    queryKey: ['search', collections, debouncedTerm],
    queryFn: async ({ signal }) => {
      const url = new URL(`/search`, BASE_API_URL);

      url.searchParams.append('query', debouncedTerm);
      url.searchParams.append('limit', '60');

      if (collections) {
        url.searchParams.append('prefixes', collections.join(','));
      }

      const result = debouncedTerm ? await fetchJson<IconifySearchResult>({ url, signal }) : null;

      if (result) {
        // Cache the info for each collection
        Object.entries(result.collections).forEach(([prefix, info]) => {
          queryClient.setQueryData<IconifyInfo>(['iconSetInfo', prefix], info);
        });
      }

      return result?.icons ?? [];
    },
    enabled: debouncedTerm.length > 0,
    keepPreviousData: debouncedTerm.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    term,
    setTerm: updateTerm,
    debouncedTerm,
    isInitialLoading,
    isError,
    error,
    data,
    isPreviousData,
  };
}

export function useIconSetInfo({ prefix }: { prefix?: string | null }) {
  return useQuery<IconifyInfo | null, Error>({
    queryKey: ['iconSetInfo', prefix],
    queryFn: async ({ signal }) => {
      if (!prefix) return null;

      const url = new URL('/collection', BASE_API_URL);

      url.searchParams.append('prefix', prefix);
      url.searchParams.append('info', 'true');

      const result = await fetchJson<{ info: IconifyInfo }>({ url, signal });

      return result?.info ?? null;
    },
    staleTime: Infinity,
  });
}
