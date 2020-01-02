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
import { excludeTag, includeTag } from '../../store/tasksSlice';
import { useTheme } from '@material-ui/core/styles';
import { fetchedTasksSelector } from '../../store/selectors';

const log = debug('TagsList');

export const TagsList: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const tasks = useSelector(fetchedTasksSelector);
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
        const isActive = !excludedTags.includes(tag);
        return (
          <Button
            key={tag}
            onClick={() =>
              dispatch(isActive ? excludeTag(tag) : includeTag(tag))
            }
            style={{
              color: isActive ? 'inherit' : theme.palette.grey.A700,
            }}
          >
            {tag}
          </Button>
        );
      })}
    </Box>
  );
};

export default memo(TagsList);
