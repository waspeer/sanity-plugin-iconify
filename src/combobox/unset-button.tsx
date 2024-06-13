import { TrashIcon } from '@sanity/icons';
import { Button, Card } from '@sanity/ui';

// ------------ //
// UNSET BUTTON //
// ------------ //

interface UnsetButtonProps {
  onUnset: () => void;
}

export function UnsetButton(props: UnsetButtonProps) {
  const { onUnset } = props;

  return (
    <Card border borderLeft={false} padding={1} display="flex" radius={2}>
      <Button icon={<TrashIcon />} onClick={onUnset} mode="bleed" fontSize={1} padding={2} />
    </Card>
  );
}
