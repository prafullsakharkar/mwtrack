import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import withRouter from '@/components/core/withRouter';
import NavBadge from '../../NavBadge';
import SvgIcon from '../../../SvgIcon';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none!important',
  minHeight: 48,
  '&.active': {
    backgroundColor: `${theme.palette.secondary.main}!important`,
    color: `${theme.palette.secondary.contrastText}!important`,
    pointerEvents: 'none',
    '& .core-list-item-text-primary': {
      color: 'inherit',
    },
    '& .core-list-item-icon': {
      color: 'inherit',
    },
  },
  '& .core-list-item-icon': {},
  '& .core-list-item-text': {
    padding: '0 0 0 16px',
  },
}));

function NavHorizontalLink(props) {
  const { item } = props;

  return useMemo(
    () => (
      <StyledListItem
        button
        component="a"
        href={item.url}
        target={item.target ? item.target : '_blank'}
        className={clsx('core-list-item')}
        role="button"
        sx={item.sx}
        disabled={item.disabled}
      >
        {item.icon && (
          <SvgIcon
            className={clsx('core-list-item-icon shrink-0', item.iconClass)}
            color="action"
          >
            {item.icon}
          </SvgIcon>
        )}

        <ListItemText
          className="core-list-item-text"
          primary={item.title}
          classes={{ primary: 'text-13 core-list-item-text-primary truncate' }}
        />

        {item.badge && <NavBadge className="ltr:ml-8 rtl:mr-8" badge={item.badge} />}
      </StyledListItem>
    ),
    [item.badge, item.icon, item.iconClass, item.target, item.title, item.url]
  );
}

NavHorizontalLink.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    url: PropTypes.string,
    target: PropTypes.string,
  }),
};

NavHorizontalLink.defaultProps = {};

export default withRouter(memo(NavHorizontalLink));
