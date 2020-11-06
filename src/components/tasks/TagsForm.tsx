import React from 'react';
import ChipInput from 'material-ui-chip-input';
import { changeTags } from '../../repositories/changeTags';
import { useTypedTranslate } from '../../services/index';

interface Props {
  taskId: string;
  tags?: string[];
}

export const TagsForm: React.FC<Props> = (props) => {
  const t = useTypedTranslate();
  return (
    <ChipInput
      fullWidth
      label={t('tags')}
      variant="outlined"
      defaultValue={props.tags}
      onChange={(tags) => changeTags(props.taskId, tags)}
    />
  );
};

export default TagsForm;
