import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchedTasksSelector,
  tagsOfFetchedTasksSelector,
} from '../../store/selectors';
import { excludeTag, includeTag } from '../../store/tasksSlice';
import { activeTagsSelector } from '../../store/selectors';

export const TagsList: React.FC<{}> = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const tasks = useSelector(fetchedTasksSelector);
  const activeTags = useSelector(activeTagsSelector);
  const uniqueTags = useSelector(tagsOfFetchedTasksSelector);

  if (!tasks) return null;
  else
    return (
      <Box>
        {uniqueTags.map(tag => {
          const isActive = activeTags.includes(tag);
          const color = isActive
            ? 'inherit'
            : theme.palette.grey.A700;

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
