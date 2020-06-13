import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  excludedTagsSelector,
  fetchedTasksSelector,
  tagsOfFetchedTasksSelector,
} from '../../store/selectors';
import { toggleTag } from '../../store/tasksSlice';

export const TagsList: React.FC<{}> = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const tasks = useSelector(fetchedTasksSelector);
  const uniqueTags = useSelector(tagsOfFetchedTasksSelector);
  const exludedTags = useSelector(excludedTagsSelector);

  if (!tasks) return null;
  else
    return (
      <Box>
        {uniqueTags.map(tag => {
          const isActive = !exludedTags.includes(tag);
          const color = isActive
            ? 'inherit'
            : theme.palette.grey[300];

          return (
            <Button
              key={tag}
              style={{ color }}
              onClick={() => dispatch(toggleTag(tag))}
            >
              {tag}
            </Button>
          );
        })}
      </Box>
    );
};

export default memo(TagsList);
