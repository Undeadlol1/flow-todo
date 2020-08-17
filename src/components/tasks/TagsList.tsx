import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useTheme, makeStyles } from '@material-ui/styles';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  excludedTagsSelector,
  fetchedTasksSelector,
  tagsOfFetchedTasksSelector,
} from '../../store/selectors';
import { toggleTag } from '../../store/tasksSlice';
import debug from 'debug';
import { Theme } from '@material-ui/core';

const log = debug('TagsList');

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: 100,
  },
}));

export const TagsList: React.FC<{}> = () => {
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
};

export default memo(TagsList);
