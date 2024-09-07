import { Icon } from '@iconify/react';
import { Button } from '@sanity/ui';
import type { UseComboboxGetItemPropsOptions, UseComboboxGetItemPropsReturnValue } from 'downshift';
import { forwardRef } from 'react';
import { MessageWrapper } from './iconify-combobox.styles';

type GetItemProps = (
  options: UseComboboxGetItemPropsOptions<string>,
) => UseComboboxGetItemPropsReturnValue;

export interface SearchResultsProps extends React.HTMLAttributes<HTMLUListElement> {
  state: 'initial' | 'loading' | 'error' | 'empty' | 'data' | 'stale';
  data?: string[];
  getItemProps: GetItemProps;
  highlightedIndex: number;
}

export const SearchResults = forwardRef<HTMLUListElement, SearchResultsProps>((props, ref) => {
  const { state, data, getItemProps, highlightedIndex, ...rest } = props;

  return (
    <>
      {(() => {
        switch (state) {
          case 'initial':
            return <MessageWrapper>Search for icons</MessageWrapper>;
          case 'loading':
            return <MessageWrapper>Searching...</MessageWrapper>;
          case 'error':
            return <MessageWrapper>Something went wrong...</MessageWrapper>;
          case 'empty':
            return <MessageWrapper>No icons found</MessageWrapper>;
        }
      })()}

      <ul {...rest} ref={ref} style={{ opacity: state === 'stale' ? 0.5 : 1 }}>
        {(state === 'data' || state === 'stale') &&
          data?.map((icon, index) => (
            <li key={icon} {...getItemProps({ item: icon, index })}>
              <Button padding={3} mode="bleed" selected={index === highlightedIndex}>
                <Icon icon={icon} width="100%" height="100%" />
              </Button>
            </li>
          ))}
      </ul>
    </>
  );
});
