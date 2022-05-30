import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import isEmpty from 'lodash/isEmpty';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { tagsOfFetchedTasksSelector } from '../../store/selectors';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: 100,
  },
}));

const SuggestedTags: React.FC<{
  onClick: (arg0: string) => void;
}> = memo((props) => {
  const cx = useStyles();

  const uniqueTags = useSelector(tagsOfFetchedTasksSelector);

  if (isEmpty(uniqueTags)) return null;
  return (
    <Box textAlign="center">
      {uniqueTags.map((tag) => {
        return (
          <Button
            key={tag}
            className={cx.button}
            onClick={() => props.onClick(tag)}
          >
            {tag}
          </Button>
        );
      })}
    </Box>
  );
});

const componentName = 'SuggestedTags';
SuggestedTags.displayName = componentName;

export { SuggestedTags };

export default memo(SuggestedTags);
