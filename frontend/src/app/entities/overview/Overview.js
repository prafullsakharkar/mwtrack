import PageSimple from '@/components/core/PageSimple';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import withReducer from '@/stores/withReducer';
import reducer from './store';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OverviewList from './OverviewList';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import { getProject, selectProjectById } from 'src/app/entities/projects/store/projectSlice';
import { getAsset, selectAssetById } from 'src/app/entities/assets/store/assetSlice';
import { getEpisode, selectEpisodeById } from 'src/app/entities/episodes/store/episodeSlice';
import { getSequence, selectSequenceById } from 'src/app/entities/sequences/store/sequenceSlice';
import { getShot, selectShotById } from 'src/app/entities/shots/store/shotSlice';
import { getStep, selectStepById } from 'src/app/entities/steps/store/stepSlice';
import { getTask, selectTaskById } from 'src/app/entities/tasks/store/taskSlice';
import { getVersion, selectVersionById } from 'src/app/entities/versions/store/versionSlice';

import NoteDialog from '../notes/NoteDialog';

import { getStatuses } from 'src/app/utilities/statuses/store/statusSlice';
import { getUsers } from 'src/app/accounts/users/store/userSlice';
import OverviewHeader from './OverviewHeader';


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
  '& .PageSimple-toolbar': {},
  '& .PageSimple-content': {},
  '& .PageSimple-sidebarHeader': {},
  '& .PageSimple-sidebarContent': {},
}));

function OverviewApp() {
  const dispatch = useDispatch();
  const routeParams = useParams();

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const entity = routeParams.entity;
  const uid = routeParams.uid;

  const users = useSelector(({ overviewApp }) => overviewApp.users.entities);
  const statuses = useSelector(({ overviewApp }) => overviewApp.statuses.entities);

  const noteDialog = useSelector(({ overviewApp }) => overviewApp.notes.noteDialog);
  const noteIds = useSelector(({ overviewApp }) => overviewApp.notes.ids);

  useEffect(() => {
    dispatch(getStatuses());
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
      header={<OverviewHeader data={data} />}
      content={
        <div className="flex flex-auto justify-center w-full mx-auto p-24 sm:p-32">
          <OverviewList
            entity={entity}
            data={data}
            users={users}
            statuses={statuses}
          />
        </div>
      }
      scroll={isMobile ? 'normal' : 'content'}
    />
    <NoteDialog
      noteDialog={noteDialog}
      noteIds={noteIds}
    />
  </>
  );
}

export default withReducer('overviewApp', reducer)(OverviewApp);
