import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import useTheme from '@material-ui/core/styles/useTheme';
import { makeStyles } from '@material-ui/styles';
import debug from 'debug';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  excludedTagsSelector,
  fetchedTasksSelector,
  tagsOfFetchedTasksSelector,
} from '../../store/selectors';
import { toggleTag } from '../../store/tasksSlice';

const log = debug('TagsList');

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: 100,
  },
}));

const TagsList: React.FC<{}> = memo(() => {
  const cx = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const tasks = useSelector(fetchedTasksSelector);
  const uniqueTags = useSelector(tagsOfFetchedTasksSelector);
  const exludedTags = useSelector(excludedTagsSelector);

  log('uniqueTags: ', uniqueTags);
  log('exludedTags: ', exludedTags);

  if (!tasks) return null;
  else
    return (
      <Box textAlign="center">
        {uniqueTags.map(tag => {
          const isActive = !exludedTags.includes(tag);
          const color = isActive
            ? 'inherit'
            : theme.palette.grey[300];

          return (
            <Button
              key={tag}
              style={{ color }}
              className={cx.button}
              onClick={() => dispatch(toggleTag(tag))}
            >
              {tag}
            </Button>
          );
        })}
      </Box>
    );
});

TagsList.displayName = 'TagsList';

export { TagsList };

export default memo(TagsList);
