import { Icon } from '@iconify/react';
import { IconifyIconName, stringToIcon } from '@iconify/utils';
import { PreviewProps } from 'sanity';

import { QueryClientProvider } from './lib/query-client';
import { usePrettyIconName } from './lib/use-pretty-icon-name';

// --------------- //
// ICONIFY PREVIEW //
// --------------- //

export function IconifyPreview(props: PreviewProps) {
  const { title } = props;
  const iconName = typeof props.title === 'string' ? stringToIcon(props.title) : null;

  // We check this double to avoid the TS error
  if (typeof title === 'string' && iconName) {
    return (
      <QueryClientProvider>
        <IconifyPreviewInner {...props} iconName={title} iconMeta={iconName} />
      </QueryClientProvider>
    );
  }

  return props.renderDefault(props);
}

// --------------------- //
// ICONIFY PREVIEW INNER //
// --------------------- //

interface IconifyPreviewInnerProps extends PreviewProps {
  iconName: string;
  iconMeta: IconifyIconName;
}

function IconifyPreviewInner(props: IconifyPreviewInnerProps) {
  const { iconMeta, iconName, ...previewProps } = props;
  const prettyName = usePrettyIconName({ iconMeta });

  return props.renderDefault({
    ...previewProps,
    media: <Icon icon={iconName} />,
    title: prettyName?.name ?? iconName,
    subtitle: prettyName?.collection,
  });
}
