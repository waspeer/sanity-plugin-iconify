import { Flex, Stack, Text, ThemeProvider } from '@sanity/ui';
import { buildTheme } from '@sanity/ui/theme';
import { memo, useCallback } from 'react';
import type { ObjectInputProps } from 'sanity';
import { set, unset } from 'sanity';
import { IconifyCombobox } from './combobox';
import { QueryClientProvider } from './lib/query-client';
import type { IconifyPluginConfig, IconOptions } from './lib/types';
import { usePrettyIconName } from './lib/use-pretty-icon-name';

const theme = buildTheme();

interface IconifyInputProps extends ObjectInputProps {
  config: IconifyPluginConfig;
}

export const IconifyInput = memo(function IconifyInput(props: IconifyInputProps) {
  const { config, value, onChange: pushChange, schemaType, elementProps, focused } = props;

  const selectedIcon: string | null = value?.name ?? null;

  const options: IconOptions = schemaType.options;
  const collections =
    (!!options?.collections?.length && options.collections) ||
    (!!config?.collections?.length && config.collections) ||
    null;
  const showName = options?.showName ?? config?.showName ?? false;

  const handleSelect = useCallback(
    (icon: string) => {
      pushChange(icon === '' ? unset() : set(icon, ['name']));
    },
    [pushChange],
  );

  return (
    <QueryClientProvider>
      <ThemeProvider theme={theme}>
        <Stack space={2}>
          <IconifyCombobox
            selectedIcon={selectedIcon}
            onSelect={handleSelect}
            collections={collections}
            studioElementProps={elementProps}
            fieldFocused={focused}
          />

          {showName && selectedIcon ? <IconifyNameDisplay name={selectedIcon} /> : null}
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
});

interface IconifyNameDisplayProps {
  name?: string | null;
}

export function IconifyNameDisplay(props: IconifyNameDisplayProps) {
  const { name } = props;
  const prettyName = usePrettyIconName({ name });

  return (
    <Flex gap={1}>
      <Text size={1} muted>
        Selected:
      </Text>

      <Text size={1} weight="semibold">
        {prettyName?.name ?? name}
      </Text>

      {prettyName?.collection && (
        <Text size={1} muted style={{ fontStyle: 'italic' }}>
          by {prettyName?.collection}
        </Text>
      )}
    </Flex>
  );
}
