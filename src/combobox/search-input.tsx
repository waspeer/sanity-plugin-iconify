import { ComboboxInput } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { TextInput } from '@sanity/ui';
import type { ChangeEventHandler } from 'react';
import { forwardRef } from 'react';

// ------------ //
// SEARCH INPUT //
// ------------ //

interface SearchInputProps {
  term: string;
  selectedIcon: string | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
  suffix?: React.ReactNode;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const { term, selectedIcon, onChange, suffix } = props;

  return (
    <ComboboxInput
      as={TextInput}
      ref={ref}
      inputMode="search"
      value={term}
      onChange={onChange}
      icon={selectedIcon ? <Icon icon={selectedIcon} /> : null}
      placeholder={selectedIcon ? 'Search and replace selected icon...' : 'Search for an icon...'}
      suffix={suffix}
    />
  );
});

SearchInput.displayName = 'SearchInput';
