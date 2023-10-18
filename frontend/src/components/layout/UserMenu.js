import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import SvgIcon from '@/components/core/SvgIcon';
import { selectUser } from '@/stores/userSlice';
import { appendNavigationItem, resetNavigation, updateNavigationItem } from '@/stores/core/navigationSlice';
import authRoles from '@/auth/authRoles';

function UserMenu(props) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const projects = useSelector(({ core }) => core.projects.entities);

  useEffect(() => {
    dispatch(resetNavigation());
    projects && Object.values(projects)?.map((item, id) => {

      const projNav = {
        id: item.uid,
        title: item.code,
        type: 'collapse',
        icon: (item.is_episodic) ? 'material-solid:movie' : 'heroicons-solid:film',
        thumbnail: item.thumbnail,
        children: [
          {
            id: item.uid + '-overview',
            title: 'Overview',
            type: 'item',
            url: '/entity/project/' + item.uid + '/overview',
          },
          {
            id: item.uid + '-assign-task',
            title: 'Task Assignment',
            type: 'item',
            url: '/entity/project/' + item.uid + '/assign-task',
          },
          {
            id: item.uid + '-assets',
            title: 'Assets',
            type: 'item',
            url: '/entity/project/' + item.uid + '/assets',
          },
          (item.is_episodic) ? {
            id: item.uid + '-episodes',
            title: 'Episodes',
            type: 'item',
            url: '/entity/project/' + item.uid + '/episodes',
          } : { id: item.uid + '-episodes' },
          {
            id: item.uid + '-sequences',
            title: 'Sequences',
            type: 'item',
            url: '/entity/project/' + item.uid + '/sequences',
          },
          {
            id: item.uid + '-shots',
            title: 'Shots',
            type: 'item',
            url: '/entity/project/' + item.uid + '/shots',
          },
          {
            id: item.uid + '-steps',
            title: 'Steps',
            type: 'item',
            url: '/entity/project/' + item.uid + '/steps',
          },
          {
            id: item.uid + '-tasks',
            title: 'Tasks',
            type: 'item',
            url: '/entity/project/' + item.uid + '/tasks',
          },
          {
            id: item.uid + '-versions',
            title: 'Versions',
            type: 'item',
            url: '/entity/project/' + item.uid + '/versions',
          },
          {
            id: item.uid + '-publishes',
            title: 'Publishes',
            type: 'item',
            url: '/entity/project/' + item.uid + '/publishes',
          },
          {
            id: item.uid + '-notes',
            title: 'Notes',
            type: 'item',
            url: '/entity/project/' + item.uid + '/notes',
          },
        ]
      }

      dispatch(appendNavigationItem(
        projNav, "projects"
      ))
    })

  }, [projects])



  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="text.secondary">
            {user?.role && user?.role + " | " + user?.username}
          </Typography>
        </div>

        {user?.avatar ? (
          <Avatar className="md:mx-4" alt="user photo" src={user?.avatar} />
        ) : (
          <Avatar className="md:mx-4">{user?.first_name?.charAt(0)}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/sign-in" role="button">
              <ListItemIcon className="min-w-40">
                <SvgIcon>heroicons-outline:lock-closed</SvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
            <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <SvgIcon>heroicons-outline:user-add </SvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/accounts/profile" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <SvgIcon>heroicons-outline:user-circle</SvgIcon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            <MenuItem
              component={NavLink}
              to="/sign-out"
              onClick={() => {
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <SvgIcon>heroicons-outline:logout</SvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;
