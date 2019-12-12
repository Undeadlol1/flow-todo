import React, { memo } from 'react';
import { useTypedSelector, Task } from '../../store/index';
import Box from '@material-ui/core/Box';
import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import Button from '@material-ui/core/Button';

const log = debug('TagsList');

export const TagsList: React.FC<{}> = () => {
  const { activeTasks }: { activeTasks: Task[] } = useTypedSelector(
    s => s.firestore.ordered,
  );

  let tags: string[] = [];
  (activeTasks || [])
    .filter(t => !isEmpty(t.tags))
    .forEach(t => {
      (t.tags as string[]).forEach(tag => tags.push(tag));
    });
  tags = uniq(tags);
  log('tags.length: ', tags.length);

  if (!activeTasks) return null;
  return (
    <Box>
      {tags.map(tag => (
        <Button key={tag}>{tag}</Button>
      ))}
    </Box>
  );
};

export default memo(TagsList);
