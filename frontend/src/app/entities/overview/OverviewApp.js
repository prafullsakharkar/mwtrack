import PageSimple from '@/components/core/PageSimple';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import withReducer from '@/stores/withReducer';
import reducer from './store';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import OverviewList from './OverviewList';
import EntityHeader from '@/components/core/header/EntityHeader';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import { getProject, selectProjectById } from 'src/app/entities/projects/store/projectsSlice';
import { getAsset, selectAssetById } from 'src/app/entities/assets/store/assetsSlice';
import { getEpisode, selectEpisodeById } from 'src/app/entities/episodes/store/episodesSlice';
import { getSequence, selectSequenceById } from 'src/app/entities/sequences/store/sequencesSlice';
import { getShot, selectShotById } from 'src/app/entities/shots/store/shotsSlice';
import { getStep, selectStepById } from 'src/app/entities/steps/store/stepsSlice';
import { getTask, selectTaskById } from 'src/app/entities/tasks/store/tasksSlice';
import { getVersion, selectVersionById } from 'src/app/entities/versions/store/versionsSlice';

import NoteDialog from '../notes/NoteDialog';

import { getStatuses } from 'src/app/utilities/statuses/store/statusesSlice';
import { getPriorities } from 'src/app/utilities/priorities/store/prioritiesSlice';
import { getUsers } from 'src/app/accounts/users/store/userSlice';


const Root = styled(PageSimple)(({ theme }) => ({
  '& .PageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    '& > .container': {
      maxWidth: '100%',
    },
  },
}));

function OverviewApp() {
  const dispatch = useDispatch();
  const routeParams = useParams();

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const entity = routeParams.entity;
  const uid = routeParams.uid;

  const users = useSelector(({ overviewApp }) => overviewApp.users.entities);
  const statuses = useSelector(({ overviewApp }) => overviewApp.statuses.entities);
  const priorities = useSelector(({ overviewApp }) => overviewApp.priorities.entities);

  const noteDialog = useSelector(({ overviewApp }) => overviewApp.notes.noteDialog);
  const noteIds = useSelector(({ overviewApp }) => overviewApp.notes.ids);

  useEffect(() => {
    dispatch(getStatuses());
    dispatch(getPriorities());
    dispatch(getUsers());
  }, [])

  useEffect(() => {
    if (entity === 'project') {
      dispatch(getProject(routeParams));
    } else if (entity === 'asset') {
      dispatch(getAsset(routeParams));
    } else if (entity === 'episode') {
      dispatch(getEpisode(routeParams));
    } else if (entity === 'sequence') {
      dispatch(getSequence(routeParams));
    } else if (entity === 'shot') {
      dispatch(getShot(routeParams));
    } else if (entity === 'step') {
      dispatch(getStep(routeParams));
    } else if (entity === 'task') {
      dispatch(getTask(routeParams));
    } else if (entity === 'version') {
      dispatch(getVersion(routeParams));
    }
  }, [entity, routeParams]);

  const data = useSelector((state) =>
    entity === 'project'
      ? selectProjectById(state, routeParams.uid)
      : entity === 'asset'
        ? selectAssetById(state, routeParams.uid)
        : entity === 'episode'
          ? selectEpisodeById(state, routeParams.uid)
          : entity === 'sequence'
            ? selectSequenceById(state, routeParams.uid)
            : entity === 'shot'
              ? selectShotById(state, routeParams.uid)
              : entity === 'step'
                ? selectStepById(state, routeParams.uid)
                : entity === 'task'
                  ? selectTaskById(state, routeParams.uid)
                  : entity === 'version'
                    ? selectVersionById(state, routeParams.uid)
                    : null
  );

  return (<>
    <Root
      header={
        <div className="flex flex-col">
          <img
            className="h-160 md:h-240 xl:h-320 object-cover w-full"
            src="static/images/pages/profile/entity_cover.jpg"
            alt="Overview Cover"
          />
          {/* <video width="100%" height="240" src="static/images/pages/profile/cover.mp4" controls>
              Your browser does not support the video tag.
          </video>  */}

          <div className="flex flex-col flex-0 lg:flex-row items-center w-full mx-auto px-32 lg:h-72">
            <div className="-mt-96 lg:-mt-88 rounded-16">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1 } }}>
                <Avatar
                  sx={{ borderColor: 'background.paper' }}
                  className="ml-16 w-160 h-128 border-4 rounded-16"
                  src={data?.thumbnail || "static/images/thumbnail/no_entity_thumbnail.jpg"}
                  alt="Thumbnail"
                />
              </motion.div>
            </div>

            <EntityHeader />

          </div>
        </div>
      }
      content={
        <div className="flex flex-auto justify-center w-full mx-auto p-24 sm:p-32">
          <OverviewList
            entity={entity}
            data={data}
            users={users}
            statuses={statuses}
            priorities={priorities}
          />
        </div>
      }
      scroll={isMobile ? 'normal' : 'page'}
    />
    <NoteDialog
      noteDialog={noteDialog}
      noteIds={noteIds}
    />
  </>
  );
}

export default withReducer('overviewApp', reducer)(OverviewApp);
