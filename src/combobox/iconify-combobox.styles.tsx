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
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  & [role='option'] {
    display: grid;
    place-items: center;
    width: clamp(3rem, 10vw, 4rem);

    & button {
      cursor: pointer;
      width: 100%;

      & > [data-ui='Box'] {
        display: flex;
      }

      & svg {
        aspect-ratio: 1;
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
