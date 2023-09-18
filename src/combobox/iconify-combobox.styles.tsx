import { Box, Card, Grid, Text } from '@sanity/ui';
import { ReactNode } from 'react';
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
    grid-template-columns: repeat(10, minmax(min(100%, 1rem), 1fr));
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  & [role='option'] {
    display: grid;
    place-items: center;

    & button {
      aspect-ratio: 1;
      cursor: pointer;
      width: 100%;
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
