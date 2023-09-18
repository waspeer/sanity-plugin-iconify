import { stringToIcon } from '@iconify/utils';
import { sentenceCase } from 'change-case';
import { useMemo } from 'react';
import { useIconSetInfo } from './api';

export function usePrettyIconName(name?: string | null) {
  const iconMeta = useMemo(() => (name ? stringToIcon(name) : null), [name]);
  const iconSetInfo = useIconSetInfo({ prefix: iconMeta?.prefix ?? null });

  return useMemo(
    () =>
      iconMeta
        ? {
            name: sentenceCase(iconMeta.name),
            collection: iconSetInfo.data?.name ?? iconMeta.prefix,
          }
        : null,
    [iconMeta, iconSetInfo.data?.name],
  );
}
