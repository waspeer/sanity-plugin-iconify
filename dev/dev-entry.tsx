import { Stack, ThemeProvider, ToastProvider } from '@sanity/ui';
import { buildTheme } from '@sanity/ui/theme';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { IconifyCombobox } from '../src/combobox';
import { IconifyNameDisplay } from '../src/iconify-input';
import { QueryClientProvider } from '../src/lib/query-client';

/**
 * This file is a playground to quickly iterate on the react input components.
 * It's basically a scratch pad for development, not a real example.
 */

function App() {
  const [selectedIcon, setSelectedIcon] = React.useState<string | null>(null);

  return (
    <Stack space={2}>
      <IconifyCombobox
        collections={['fa']}
        selectedIcon={selectedIcon}
        onSelect={setSelectedIcon}
      />
      <IconifyNameDisplay name={selectedIcon} />
    </Stack>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={buildTheme()}>
      <ToastProvider>
        <QueryClientProvider>{children}</QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Providers>
    <App />
  </Providers>,
);
