import type { IconifyIconName } from '@iconify/utils';
import { stringToIcon } from '@iconify/utils';
import { sentenceCase } from 'change-case';
import { useMemo } from 'react';
import { useIconSetInfo } from './api';

interface UsePrettyIconNameProps {
  name?: string | null;
  iconMeta?: IconifyIconName | null;
}

export function usePrettyIconName(props: UsePrettyIconNameProps) {
  const { name } = props;
  const iconMeta = useMemo(
    () => props.iconMeta ?? (name ? stringToIcon(name) : null),
    [name, props.iconMeta],
  );
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
