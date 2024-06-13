import { Box, Card, Grid, Text } from '@sanity/ui';
import type { ReactNode } from 'react';
import styled from 'styled-components';

export const ComboboxWrapper = styled(Grid)`
  grid-template-columns: 1fr min-content;
  position: relative;
`;

export const OptionsWrapper = styled(Box)`
  box-sizing: border-box;
  padding: 0.5rem;

  & [role='listbox'] {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 2.5rem), 1fr));
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;

    @media (min-width: 650px) {
      grid-template-columns: repeat(10, minmax(min(100%, 2.5rem), 1fr));
    }
  }

  & [role='option'] {
    display: grid;
    place-items: center;

    & button {
      cursor: pointer;
      aspect-ratio: 1;
      width: 100%;

      & > [data-ui='Box'] {
        display: flex;
      }
    }
  }
`;

export function MessageWrapper({ children }: { children: ReactNode }) {
  return (
    <Card padding={4}>
      <Text align="center" muted>
        {children}
      </Text>
    </Card>
  );
}
