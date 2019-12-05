import React from 'react';
import ChipInput from 'material-ui-chip-input';
import { changeTags } from '../../store/index';
import { useTypedTranslate } from '../../services/index';

interface Props {
  taskId: string;
  tags?: string[];
}

export const TagsForm: React.FC<Props> = props => {
  const t = useTypedTranslate();
  return (
    <ChipInput
      label={t('tags')}
      defaultValue={props.tags}
      onChange={tags => changeTags(props.taskId, tags)}
    />
  );
};

export default TagsForm;
