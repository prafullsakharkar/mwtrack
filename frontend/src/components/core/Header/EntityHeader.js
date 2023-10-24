import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import history from '@/history';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  color: 'inherit!important',
  textDecoration: 'none!important',
  height: 40,
  width: '100%',
  borderRadius: 20,
  paddingLeft: 16,
  paddingRight: 16,
  marginBottom: 8,
  fontWeight: 500,
  '&.active': {
    backgroundColor: "#0c5680",
    pointerEvents: 'none',
    '& .list-item-icon': {
      color: theme.palette.secondary.main,
    },
  }
}));

function EntityHeader(props) {
  const entity = props.entity;
  const totalCount = props.totalCount;
  const path = props.path;

  const { pathname } = history.location;
  const routeParams = useParams();
  const url = '/entity/' + routeParams.entity + '/' + routeParams.uid
  const [listEntities, setListEntities] = useState([])

  const projects = useSelector(({ core }) => core.projects.entities)
  const project = routeParams?.uid?.split(':')[0]

  const navigate = useNavigate()
  // if (!projects.includes(project)){
  //   navigate("/pages/error/404", { replace: true });
  // }

  useEffect(() => {
    if (routeParams.entity === 'project') {
      if (projects[project]?.is_episodic) {
        setListEntities([
          "overview", "notes", "assets", "episodes", "sequences", "shots", "steps", "tasks", "versions",
        ])
      } else {
        setListEntities([
          "overview", "notes", "assets", "sequences", "shots", "steps", "tasks", "versions",
        ]);
      }
    }

    if (routeParams.entity === 'asset') setListEntities(["overview", "notes", "steps", "tasks", "versions",]);
    if (routeParams.entity === 'episode') setListEntities([
      "overview", "notes", "sequences", "shots", "steps", "tasks", "versions",
    ]);
    if (routeParams.entity === 'sequence') setListEntities(["overview", "notes", "shots", "steps", "tasks", "versions",]);
    if (routeParams.entity === 'shot') setListEntities(["overview", "notes", "steps", "tasks", "versions",]);
    if (routeParams.entity === 'step') setListEntities(["overview", "notes", "tasks", "versions",]);
    if (routeParams.entity === 'task') setListEntities(["overview", "notes", "versions",]);
    if (routeParams.entity === 'version') setListEntities(["overview", "notes",]);

  }, [routeParams, projects])

  return (
    <div className="p-8 w-full flex flex-col sm:flex-row space-y-8 sm:space-y-0 items-center justify-between">
      <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 min-w-320">
        <motion.span
          className="flex items-end"
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
        >
          <Typography
            component={Link}
            to={pathname}
            className="mx-16 text-20 md:text-24 font-extrabold tracking-tight leading-none"
            role="button"
          >
            {routeParams.uid.toLocaleUpperCase()}
          </Typography>
          {/* {path?.length > 0 && (
            <Breadcrumbs
              aria-label="breadcrumb"
              className="mx-12"
              separator={<NavigateNextIcon fontSize="small" />}
            >
              <div />
              {path.map((item, index) =>
                index + 1 === path.length ? (
                  <Typography key={index}>{item.name}</Typography>
                ) : (
                  <Link key={index} color="text.primary" to={`/apps/file-manager/${item.id}`}>
                    {item.name}
                  </Link>
                )
              )}
            </Breadcrumbs>
          )} */}
        </motion.span>
        {/* <Typography
          component={motion.span}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          delay={500}
          className="text-14 font-medium mx-2"
          color="text.secondary"
        >
          {routeParams?.entity?.toLocaleUpperCase()} {totalCount && `: ${totalCount} ${entity}`}
        </Typography> */}
      </div>

      <div className="flex items-center -mx-8 overflow-auto">
        {listEntities.map((row, index) =>

          <React.Fragment key={row + '-' + index}>
            {/* {(index !== 0) && <div className="lg:flex h-32 mx-8 border-l-2" />} */}
            <StyledListItem
              key={row}
              component={NavLinkAdapter}
              to={url + '/' + row}
              activeClassName="active"
              end
            >
              <ListItemText className="truncate" primary={row.toLocaleUpperCase()} disableTypography />
            </StyledListItem>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default EntityHeader;
