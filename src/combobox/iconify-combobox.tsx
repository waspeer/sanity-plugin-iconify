import { Combobox } from '@headlessui/react';
import { Popover, useToast } from '@sanity/ui';
import { ChangeEventHandler, useCallback, useEffect, useId, useRef } from 'react';
import { match } from 'ts-pattern';
import { useSearch } from '../lib/api';
import { ComboboxWrapper, OptionsWrapper } from './iconify-combobox.styles';
import { SearchInput } from './search-input';
import { SearchResults, SearchResultsProps } from './search-result';
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

  const { term, setTerm, debouncedTerm, isInitialLoading, isError, error, data, isPreviousData } =
    useSearch({
      collections,
    });

  const handleTermChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => setTerm(event.target.value),
    [setTerm],
  );

  const handleSelect = useCallback(
    (icon: string) => {
      pushSelection(icon);
      setTerm('', true);
    },
    [pushSelection, setTerm],
  );

  const handleUnset = useCallback(() => handleSelect(''), [handleSelect]);

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
    <ComboboxWrapper>
      <Combobox onChange={handleSelect}>
        {({ open }) => (
          <>
            <SearchInput
              ref={inputRef}
              term={term}
              selectedIcon={selectedIcon}
              onChange={handleTermChange}
            />

            <Popover
              open={open}
              placement="bottom"
              arrow={false}
              matchReferenceWidth
              portal
              constrainSize
              referenceElement={inputRef.current}
              content={
                <OptionsWrapper>
                  <SearchResults
                    state={match<boolean>(true)
                      .returnType<SearchResultsProps['state']>()
                      .with(isInitialLoading, () => 'loading')
                      .with(!debouncedTerm, () => 'initial')
                      .with(isError, () => 'error')
                      .with(!data || data.length === 0, () => 'empty')
                      .with(isPreviousData, () => 'stale')
                      .otherwise(() => 'data')}
                    data={data}
                  />
                </OptionsWrapper>
              }
            />
          </>
        )}
      </Combobox>

      {selectedIcon ? <UnsetButton onUnset={handleUnset} /> : null}
    </ComboboxWrapper>
  );
}
