import { Icon } from '@iconify/react';
import { TextInput } from '@sanity/ui';
import { forwardRef, memo } from 'react';

interface SearchInputProps extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
  // downshift's getInputProps() returns onChange typed against the generic
  // `Element` (React.ChangeEventHandler with no element parameter), which is
  // wider than HTMLAttributes' onChange. Accept that signature so the props
  // spread from getInputProps() stays type-compatible.
  onChange?: React.ChangeEventHandler;
  selectedIcon: string | null;
  suffix?: React.ReactNode;
}

export const SearchInput = memo(
  forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
    const { selectedIcon, suffix, onChange, ...rest } = props;

    return (
      <TextInput
        {...rest}
        // downshift types onChange against the generic `Element`; Sanity UI's
        // TextInput expects an HTMLInputElement handler. The handler is only
        // forwarded to the underlying <input>, so the element-generic
        // difference is purely a type-variance mismatch with no runtime effect.
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement> | undefined}
        ref={ref}
        inputMode="search"
        icon={selectedIcon ? <Icon icon={selectedIcon} /> : null}
        placeholder={selectedIcon ? 'Search and replace selected icon...' : 'Search for an icon...'}
        suffix={suffix}
      />
    );
  }),
);

SearchInput.displayName = 'SearchInput';
