import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import history from '@/history';
import { Link } from 'react-router-dom';
import SvgIcon from '@/components/core/SvgIcon';
import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import { setProjectSearchText, selectProjectSearchText } from './store/projectSlice';

function ProjectsHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectProjectSearchText);
  const { pathname } = history.location;

  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-8 px-16 md:px-16">
      <Typography
        component={Link}
        to={pathname}
        role="button"
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 font-bold tracking-tight"
      >
        Projects
      </Typography>

      <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
        <Paper className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0">
          <Input
            placeholder="Search project"
            className="flex flex-1"
            disableUnderline
            fullWidth
            value={searchText}
            inputProps={{
              'aria-label': 'Search',
            }}
            onChange={(ev) => dispatch(setProjectSearchText(ev))}
          />
          <SvgIcon color="disabled">heroicons-solid:search</SvgIcon>
        </Paper>
        <Button
          variant="contained"
          color="secondary"
          component={NavLinkAdapter}
          to="new/edit"
        >
          <SvgIcon size={20}>heroicons-outline:plus</SvgIcon>
          <span className="mx-8">Create</span>
        </Button>
      </div>
    </div>
  );
}

export default ProjectsHeader;

