import { Combobox } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { Button } from '@sanity/ui';
import { MessageWrapper } from './iconify-combobox.styles';

// -------------- //
// SEARCH RESULTS //
// -------------- //

export interface SearchResultsProps {
  state: 'initial' | 'loading' | 'error' | 'empty' | 'data' | 'stale';
  data?: string[];
}

export function SearchResults(props: SearchResultsProps) {
  const { state, data } = props;

  if (state === 'initial') {
    return <MessageWrapper>Search for icons</MessageWrapper>;
  }

  if (state === 'loading') {
    return <MessageWrapper>Searching...</MessageWrapper>;
  }

  if (state === 'error') {
    return <MessageWrapper>Something went wrong...</MessageWrapper>;
  }

  if (state === 'empty') {
    return <MessageWrapper>No icons found</MessageWrapper>;
  }

  return (
    <Combobox.Options style={{ opacity: state === 'stale' ? 0.5 : 1 }}>
      {data!.map((icon) => (
        <Combobox.Option key={icon} value={icon}>
          {({ active }) => <Button mode="bleed" icon={<Icon icon={icon} />} selected={active} />}
        </Combobox.Option>
      ))}
    </Combobox.Options>
  );
}
