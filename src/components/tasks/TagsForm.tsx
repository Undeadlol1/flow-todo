import lowerFirst from 'lodash/lowerCase';
import ChipInput from 'material-ui-chip-input';
import React from 'react';
import { changeTags } from '../../repositories/changeTags';
import { useTypedTranslate } from '../../services/index';

interface Props {
  taskId: string;
  tags?: string[];
  isUseCaseCallDisabled?: boolean;
}

export const TagsForm: React.FC<Props> = (props) => {
  const t = useTypedTranslate();
  return (
    <ChipInput
      fullWidth
      label={t('tags')}
      variant="outlined"
      defaultValue={props.tags?.map(lowerFirst)}
      onChange={(tags) => {
        if (props.isUseCaseCallDisabled) return;
        changeTags(props.taskId, tags);
      }}
    />
  );
};

export default React.memo(TagsForm);
