import { Icon } from '@iconify/react';
import { PreviewProps } from 'sanity';
import { usePrettyIconName } from './lib/use-pretty-icon-name';

export function IconifyPreview(props: PreviewProps) {
  const { title } = props;
  const prettyName = usePrettyIconName(typeof title === 'string' ? title : null);

  // We check this double to avoid the TS error
  if (typeof title === 'string' && prettyName) {
    return props.renderDefault({
      ...props,
      media: <Icon icon={title} />,
      title: prettyName.name,
      subtitle: prettyName.collection,
    });
  }

  return props.renderDefault(props);
}
