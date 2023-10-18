import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import { styled, useTheme } from '@mui/material/styles';
import { useDebounce } from '@/hooks/index';
import Grow from '@mui/material/Grow';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { Manager, Popper, Reference } from 'react-popper';
import withRouter from '@/components/core/withRouter';
import NavBadge from '../../NavBadge';
import NavItem from '../../NavItem';
import SvgIcon from '../../../SvgIcon';
import { Grid, IconButton, ImageListItem, ImageListItemBar, Paper, Typography } from '@mui/material';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  minHeight: 48,
  '&.active, &.active:hover, &.active:focus': {
    backgroundColor: `${theme.palette.secondary.main}!important`,
    color: `${theme.palette.secondary.contrastText}!important`,

    '&.open': {
      backgroundColor: 'rgba(0,0,0,.08)',
    },

    '& > .core-list-item-text': {
      padding: '0 0 0 16px',
    },

    '& .core-list-item-icon': {
      color: 'inherit',
    },
  },
}));

function isUrlInChildren(parent, url) {
  if (!parent.children) {
    return false;
  }

  for (let i = 0; i < parent.children.length; i += 1) {
    if (parent.children[i].children) {
      if (isUrlInChildren(parent.children[i], url)) {
        return true;
      }
    }

    if (parent.children[i].url === url || url.includes(parent.children[i].url)) {
      return true;
    }
  }

  return false;
}

function NavHorizontalCollapse(props) {
  const [opened, setOpened] = useState(false);
  const { item, nestedLevel, dense } = props;
  const theme = useTheme();

  const handleToggle = useDebounce((open) => {
    setOpened(open);
  }, 150);

  return useMemo(
    () => (
      <ul className="relative px-0">
        <Manager>
          <Reference>
            {({ ref }) => (
              <div ref={ref}>
                <StyledListItem
                  button
                  className={clsx(
                    opened && 'open',
                    isUrlInChildren(item, props.location.pathname) && 'active'
                  )}
                  onMouseEnter={() => handleToggle(true)}
                  onMouseLeave={() => handleToggle(false)}
                  aria-owns={opened ? 'menu-core-list-grow' : null}
                  aria-haspopup="true"
                  component={item.url ? NavLinkAdapter : 'li'}
                  to={item.url}
                  end={item.end}
                  role="button"
                  sx={item.sx}
                  disabled={item.disabled}
                >
                  {item.thumbnail ? (
                    <Grid className=''>
                      <Paper
                        sx={{
                          height: 60,
                          width: 120,
                          // backgroundColor: (theme) =>
                          //   theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                        }}
                      >
                        <ImageListItem key={item.title} className="cursor-pointer">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="max-w-120 max-h-60 rounded-16"
                            onClick={() => history.push("/entity/project/" + item.id + "/overview")}
                            srcSet={item.thumbnail}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <Typography variant='h6'>

                              {item.title}
                            </Typography>
                          </div>
                        </ImageListItem>
                      </Paper>
                    </Grid>
                  ) : (<>
                    {item.icon && (
                      <SvgIcon
                        color="action"
                        className={clsx('core-list-item-icon shrink-0', item.iconClass)}
                      >
                        {item.icon}
                      </SvgIcon>
                    )}

                    <ListItemText
                      className="core-list-item-text"
                      primary={item.title}
                      classes={{ primary: 'text-13 truncate' }}
                    />

                    {item.badge && <NavBadge className="mx-4" badge={item.badge} />}
                  </>)}
                  <IconButton
                    disableRipple
                    className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0"
                    color="inherit"
                    size="large"
                  >
                    <SvgIcon size={16} className="arrow-icon">
                      {theme.direction === 'ltr'
                        ? 'heroicons-outline:arrow-sm-right'
                        : 'heroicons-outline:arrow-sm-left'}
                    </SvgIcon>
                  </IconButton>
                </StyledListItem>
              </div>
            )}
          </Reference>
          {ReactDOM.createPortal(
            <Popper
              placement={theme.direction === 'ltr' ? 'right' : 'left'}
              eventsEnabled={opened}
              positionFixed
            >
              {({ ref, style, placement, arrowProps }) =>
                opened && (
                  <div
                    ref={ref}
                    style={{
                      ...style,
                      zIndex: 999 + nestedLevel + 1,
                    }}
                    data-placement={placement}
                    className={clsx('z-999', !opened && 'pointer-events-none')}
                  >
                    <Grow in={opened} id="menu-core-list-grow" style={{ transformOrigin: '0 0 0' }}>
                      <Paper
                        className="rounded-8"
                        onMouseEnter={() => handleToggle(true)}
                        onMouseLeave={() => handleToggle(false)}
                      >
                        {item.children && (
                          <ul className={clsx('popper-navigation-list', dense && 'dense', 'px-0')}>
                            {item.children.map((_item) => (
                              <NavItem
                                key={_item.id}
                                type={`horizontal-${_item.type}`}
                                item={_item}
                                nestedLevel={nestedLevel + 1}
                                dense={dense}
                              />
                            ))}
                          </ul>
                        )}
                      </Paper>
                    </Grow>
                  </div>
                )
              }
            </Popper>,
            document.querySelector('#root')
          )}
        </Manager>
      </ul>
    ),
    [dense, handleToggle, item, nestedLevel, opened, props.location.pathname, theme.direction]
  );
}

NavHorizontalCollapse.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.array,
  }),
};

NavHorizontalCollapse.defaultProps = {};

export default withRouter(memo(NavHorizontalCollapse));
