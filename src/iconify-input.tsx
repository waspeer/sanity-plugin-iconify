import { Flex, Stack, Text } from '@sanity/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ObjectInputProps, set, unset } from 'sanity';
import { IconifyCombobox } from './combobox';
import { IconOptions, IconifyPluginConfig } from './lib/types';
import { usePrettyIconName } from './lib/use-pretty-icon-name';

const queryClient = new QueryClient();

interface IconifyInputProps extends ObjectInputProps {
  config: IconifyPluginConfig;
}

export function IconifyInput(props: IconifyInputProps) {
  const { config, value, onChange: pushChange, schemaType } = props;

  const selectedIcon = value?.name ?? null;
  const prettyName = usePrettyIconName(selectedIcon);

  const options: IconOptions = schemaType.options;
  const collections =
    (!options?.collections?.length && options.collections) ||
    (!config?.collections?.length && config.collections) ||
    null;
  const showName = options?.showName ?? config?.showName ?? false;

  const handleSelect = useCallback(
    (icon: string) => {
      pushChange(icon === '' ? unset() : set(icon, ['name']));
    },
    [pushChange],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Stack space={2}>
        <IconifyCombobox
          selectedIcon={selectedIcon}
          onSelect={handleSelect}
          collections={collections}
        />

        {showName && selectedIcon ? (
          <Flex gap={1}>
            <Text size={1} muted>
              Selected:
            </Text>

            <Text size={1} weight="semibold">
              {prettyName?.name ?? selectedIcon}
            </Text>

            {prettyName?.collection && (
              <Text size={1} muted style={{ fontStyle: 'italic' }}>
                by {prettyName?.collection}
              </Text>
            )}
          </Flex>
        ) : null}
      </Stack>
    </QueryClientProvider>
  );
}
