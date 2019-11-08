import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import useToggle from 'react-use-toggle';

const useStyles = makeStyles(theme => ({
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
}));

function Collapsible(props) {
  const cx = useStyles();
  const [t] = useTranslation();

  const [isExpanded, toggleExpanded] = useToggle(props.isOpen);
  const iconClasses = clsx(cx.animate, isExpanded && cx.expandOpen);
  const handleClick = event => event.stopPropagation() && toggleExpanded();

  return (
    <Card>
      <CardActions onClick={handleClick}>
        <Typography className={cx.collapsibleTitle}>
          {t('A note')}
        </Typography>
        <IconButton
          className={iconClasses}
          aria-expanded={isExpanded}
          aria-label="show more"
          onClick={handleClick}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse unmountOnExit timeout="auto" in={isExpanded}>
        <CardContent>
          {props.children}
        </CardContent>
      </Collapse>
    </Card>
  );
}

Collapsible.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

export default Collapsible;
