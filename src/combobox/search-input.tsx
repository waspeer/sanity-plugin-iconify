import { Combobox } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { TextInput } from '@sanity/ui';
import { ChangeEventHandler, forwardRef } from 'react';

// ------------ //
// SEARCH INPUT //
// ------------ //

interface SearchInputProps {
  term: string;
  selectedIcon: string | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const { term, selectedIcon, onChange } = props;

  return (
    <Combobox.Input
      as={TextInput}
      ref={ref}
      inputMode="search"
      value={term}
      onChange={onChange}
      icon={selectedIcon ? <Icon icon={selectedIcon} /> : null}
      placeholder={selectedIcon ? 'Search and replace selected icon...' : 'Search for an icon...'}
    />
  );
});

SearchInput.displayName = 'SearchInput';
