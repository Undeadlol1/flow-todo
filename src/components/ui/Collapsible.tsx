import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import useToggle from 'react-use-toggle';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  collapsibleTitle: {
    marginLeft: theme.spacing(1),
  },
  animate: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  actions: {
    justifyContent: 'space-between',
  },
}));

function Collapsible(props: {
  title: string;
  isOpen?: boolean;
  children: ReactElement;
}) {
  const cx = useStyles();
  const [t] = useTranslation();

  const [isExpanded, toggleExpanded] = useToggle(props.isOpen);
  const iconClasses = clsx(cx.animate, isExpanded && cx.expandOpen);

  function toggleComponent(event: React.MouseEvent) {
    event.stopPropagation();
    toggleExpanded();
  }

  return (
    <Card>
      <CardActions
        classes={{ root: cx.actions }}
        onClick={toggleComponent}
      >
        <Typography className={cx.collapsibleTitle}>
          {props.title || t('A note')}
        </Typography>
        <IconButton
          aria-label="show more"
          className={iconClasses}
          aria-expanded={isExpanded}
          onClick={toggleComponent}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse unmountOnExit timeout="auto" in={isExpanded}>
        <CardContent>{props.children}</CardContent>
      </Collapse>
    </Card>
  );
}

export default Collapsible;
