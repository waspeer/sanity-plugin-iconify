import { Icon } from '@iconify/react';
import { TextInput } from '@sanity/ui';
import { forwardRef } from 'react';

interface SearchInputProps extends React.HTMLAttributes<HTMLInputElement> {
  selectedIcon: string | null;
  suffix?: React.ReactNode;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const { selectedIcon, suffix, ...rest } = props;

  return (
    <TextInput
      {...rest}
      ref={ref}
      inputMode="search"
      icon={selectedIcon ? <Icon icon={selectedIcon} /> : null}
      placeholder={selectedIcon ? 'Search and replace selected icon...' : 'Search for an icon...'}
      suffix={suffix}
    />
  );
});

SearchInput.displayName = 'SearchInput';
