import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  excludedTagsSelector,
  includedTagsSelector,
  tagsOfFetchedTasksSelector,
} from '../../store/selectors';
import { toggleTag } from '../../store/tasksSlice';

const log = debug('TagsList');

const useStyles = makeStyles((theme: Theme) => ({
  isInactive: {
    color: theme.palette.action.disabled,
  },
  button: {
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: 100,
  },
}));

const TagsList: React.FC<{}> = memo(() => {
  const cx = useStyles();
  const dispatch = useDispatch();

  const uniqueTags = useSelector(tagsOfFetchedTasksSelector);
  const exludedTags = useSelector(excludedTagsSelector);
  const includedTags = useSelector(includedTagsSelector);

  log('uniqueTags: ', uniqueTags);
  log('exludedTags: ', exludedTags);
  log('includedTags: ', includedTags);

  if (isEmpty(uniqueTags)) return null;
  return (
    <Box textAlign="center">
      {uniqueTags.map((tag) => {
        const classNames = classnames({
          [cx.button]: true,
          [cx.isInactive]: !includedTags.includes(tag),
        });

        return (
          <Button
            key={tag}
            className={classNames}
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
