import { Popover, useToast } from '@sanity/ui';
import { useCombobox } from 'downshift';
import { memo, useCallback, useEffect, useId, useRef } from 'react';
import type { ObjectInputProps } from 'sanity';
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
  studioElementProps?: ObjectInputProps['elementProps'];
  fieldFocused?: boolean;
}

export const IconifyCombobox = memo(function IconifyCombobox(props: IconifyComboboxProps) {
  const {
    selectedIcon,
    onSelect: pushSelection,
    collections,
    studioElementProps,
    fieldFocused,
  } = props;

  const id = useId();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Compose our inputRef (used by the Popover for positioning) with Studio's focusRef.
  // Standard Sanity inputs spread all of elementProps onto the native element, which
  // lets Studio programmatically re-focus the field and track focus via onPathFocus/onPathBlur.
  const composedInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (studioElementProps?.ref) {
        (studioElementProps.ref as React.RefObject<HTMLInputElement | null>).current = node;
      }
    },
    [studioElementProps?.ref],
  );

  // Studio steals focus to its field-actions-trigger immediately after field activation, then
  // re-focuses the actual input — all within the same macrotask as the original focus event.
  // We suppress the onPathBlur for this activation blur so Studio's focused state stays accurate.
  // The flag is reset via setTimeout so any blur in a later macrotask (real user navigation) is
  // forwarded normally.
  const suppressNextBlur = useRef(false);

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      suppressNextBlur.current = true;
      setTimeout(() => {
        suppressNextBlur.current = false;
      }, 0);
      studioElementProps?.onFocus?.(event as unknown as React.FocusEvent<HTMLDivElement>);
    },
    [studioElementProps],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (suppressNextBlur.current) {
        suppressNextBlur.current = false;
        return;
      }
      studioElementProps?.onBlur?.(event as unknown as React.FocusEvent<HTMLDivElement>);
    },
    [studioElementProps],
  );

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
    closeMenu,
  } = useCombobox({
    items: data ?? [],
    inputValue: term,
    onInputValueChange({ inputValue, selectedItem }) {
      if (inputValue !== selectedItem) {
        setTerm(inputValue);
      }
    },
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) {
        pushSelection(selectedItem);
        setTerm('', true);
        setInputValue('');
      }
    },
  });

  // Close the menu when Studio considers the field unfocused. This is the state→UI equivalent
  // of the old stateReducer: instead of intercepting downshift's blur handling imperatively,
  // we let Studio's focused state drive whether the menu should be open.
  useEffect(() => {
    if (!fieldFocused) closeMenu();
  }, [fieldFocused, closeMenu]);

  const handleUnset = useCallback(() => {
    pushSelection('');
    setTerm('', true);
    selectItem('');
  }, [pushSelection, setTerm, selectItem]);

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

  // Destructure onBlur out so downshift's InputBlur doesn't close the menu —
  // menu lifecycle is now driven by fieldFocused via the effect above.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onBlur: _downshiftOnBlur, ...inputProps } = getInputProps({
    ref: composedInputRef,
    id: studioElementProps?.id,
    'aria-describedby': studioElementProps?.['aria-describedby'],
    onFocus: handleFocus,
  });

  return (
    <div>
      {/* @ts-expect-error wrong typings */}
      <SearchInput
        {...inputProps}
        onBlur={handleBlur}
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
});
