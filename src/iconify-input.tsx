import { Flex, RootTheme, Stack, Text, ThemeProvider, studioTheme, useTheme } from '@sanity/ui';
import { useCallback, useMemo } from 'react';
import { ObjectInputProps, set, unset } from 'sanity';
import { IconifyCombobox } from './combobox';
import { QueryClientProvider } from './lib/query-client';
import { IconOptions, IconifyPluginConfig } from './lib/types';
import { usePrettyIconName } from './lib/use-pretty-icon-name';

// -------------- //
// ICONIFY INPUT //
// -------------- //

interface IconifyInputProps extends ObjectInputProps {
  config: IconifyPluginConfig;
}

export function IconifyInput(props: IconifyInputProps) {
  const { config, value, onChange: pushChange, schemaType } = props;

  const selectedIcon: string | null = value?.name ?? null;

  const options: IconOptions = schemaType.options;
  const collections =
    (!!options?.collections?.length && options.collections) ||
    (!!config?.collections?.length && config.collections) ||
    null;
  const showName = options?.showName ?? config?.showName ?? false;

  const parentTheme = useTheme();
  const theme: RootTheme = useMemo(
    () => (parentTheme ? { ...parentTheme.sanity, color: studioTheme.color } : studioTheme),
    [parentTheme],
  );

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
          />

          {showName && selectedIcon ? <IconifyNameDisplay name={selectedIcon} /> : null}
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

interface IconifyNameDisplayProps {
  name?: string | null;
}

function IconifyNameDisplay(props: IconifyNameDisplayProps) {
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
