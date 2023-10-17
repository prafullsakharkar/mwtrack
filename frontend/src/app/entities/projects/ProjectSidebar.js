import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import IconButton from '@mui/material/IconButton';
import { Outlet } from 'react-router-dom';
import SvgIcon from '@/components/core/SvgIcon';

function ProjectSidebarContent(props) {

  return (
    <div className="flex flex-col flex-auto">
      <IconButton
        className="absolute top-0 right-0 my-16 mx-32 z-10"
        sx={{ color: 'white' }}
        component={NavLinkAdapter}
        to="/projects"
        size="large"
      >
        <SvgIcon>heroicons-outline:x</SvgIcon>
      </IconButton>

      <Outlet />
    </div>
  );
}

export default ProjectSidebarContent;
