import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import debug from 'debug';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  excludedTagsSelector,
  fetchedTasksSelector,
  tagsOfFetchedTasksSelector,
} from '../../store/selectors';
import { excludeTag, includeTag } from '../../store/tasksSlice';

const log = debug('TagsList');

export const TagsList: React.FC<{}> = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const tasks = useSelector(fetchedTasksSelector);
  const excludedTags = useSelector(excludedTagsSelector);
  const uniqueTags = useSelector(tagsOfFetchedTasksSelector);

  if (!tasks) return null;

  log('uniqueTags.length', uniqueTags.length);

  return (
    <Box>
      {uniqueTags.map(tag => {
        const isActive = !excludedTags.includes(tag);
        const color = isActive ? 'inherit' : theme.palette.grey.A700;
        function toggleTag() {
          dispatch(isActive ? excludeTag(tag) : includeTag(tag));
        }

        return (
          <Button key={tag} onClick={toggleTag} style={{ color }}>
            {tag}
          </Button>
        );
      })}
    </Box>
  );
};

export default memo(TagsList);
