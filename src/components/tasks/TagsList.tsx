import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import React, { memo } from 'react';
import {
  tasksSelector,
  excludedTagsSelector,
} from '../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { excludeTag } from '../../store/tasksSlice';

const log = debug('TagsList');

export const TagsList: React.FC<{}> = () => {
  const dispatch = useDispatch();

  const tasks = useSelector(tasksSelector);
  const excludedTags = useSelector(excludedTagsSelector);

  if (!tasks) return null;

  let allTags: string[] = [];
  (tasks || [])
    .filter(t => !isEmpty(t.tags))
    .forEach(t => {
      (t.tags as string[]).forEach(tag => allTags.push(tag));
    });
  const uniqueTags = uniq(allTags);

  log('allTags.length: ', allTags.length);
  log('uniqueTags.length', uniqueTags.length);

  return (
    <Box>
      {uniqueTags.map(tag => {
        const isInactive = excludedTags.includes(tag);
        const onClick = () => dispatch(excludeTag(tag));
        return (
          <Button disabled={isInactive} key={tag} onClick={onClick}>
            {tag}
          </Button>
        );
      })}
    </Box>
  );
};

export default memo(TagsList);
