import { Popover, useToast } from '@sanity/ui';
import { useCombobox } from 'downshift';
import { useCallback, useEffect, useId, useRef } from 'react';
import { match } from 'ts-pattern';
import { useSearch } from '../lib/api';
import { OptionsWrapper } from './iconify-combobox.styles';
import { SearchInput } from './search-input';
import type { SearchResultsProps } from './search-result';
import { SearchResults } from './search-result';
import { UnsetButton } from './unset-button';

export interface IconifyComboboxProps {
  selectedIcon: string | null;
  onSelect: (newValue: string) => void;
  collections: string[] | null;
}

export function IconifyCombobox(props: IconifyComboboxProps) {
  const { selectedIcon, onSelect: pushSelection, collections } = props;

  const id = useId();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const { term, setTerm, debouncedTerm, isLoading, isError, error, data, isPreviousData } =
    useSearch({
      collections,
    });

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectItem,
    setInputValue,
  } = useCombobox({
    items: data ?? [],
    inputValue: term,
    onInputValueChange({ inputValue, selectedItem }) {
      if (inputValue !== selectedItem) {
        setTerm(inputValue);
      }
    },
    onSelectedItemChange({ selectedItem }) {
      pushSelection(selectedItem);
      setTerm('', true);
      setInputValue('');
    },
  });

  const handleUnset = useCallback(() => {
    pushSelection('');
    setTerm('', true);
    selectItem('');
  }, []);

  useEffect(() => {
    if (isError) {
      console.error('Iconify input error:', error);

      toast.push({
        id,
        status: 'error',
        title: 'Iconify input error',
        description: error?.message,
      });
    }
  }, [error, id, isError, toast]);

  return (
    <div>
      {/* @ts-expect-error wrong typings */}
      <SearchInput
        {...getInputProps({ ref: inputRef })}
        selectedIcon={selectedIcon}
        suffix={selectedIcon ? <UnsetButton onUnset={handleUnset} /> : null}
      />

      <Popover
        open={true}
        style={{ display: isOpen ? 'block' : 'none' }}
        placement="bottom"
        arrow={false}
        matchReferenceWidth
        constrainSize
        referenceElement={inputRef.current}
        content={
          <OptionsWrapper>
            <SearchResults
              {...getMenuProps()}
              state={match<boolean>(true)
                .returnType<SearchResultsProps['state']>()
                .with(isLoading, () => 'loading')
                .with(!debouncedTerm, () => 'initial')
                .with(isError, () => 'error')
                .with(!data || data.length === 0, () => 'empty')
                .with(isPreviousData, () => 'stale')
                .otherwise(() => 'data')}
              data={data}
              getItemProps={getItemProps}
              highlightedIndex={highlightedIndex}
            />
          </OptionsWrapper>
        }
      />
    </div>
  );
}
