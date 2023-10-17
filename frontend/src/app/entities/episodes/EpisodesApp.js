import FusePageCarded from '@fuse/core/FusePageCarded';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from './store';
import EpisodeDialog from './EpisodeDialog';
import EpisodesList from './EpisodesList';
// import { getEpisodes, selectEpisodes } from './store/episodesSlice';
import EntityHeader from 'app/shared-components/header/EntityHeader';

function EpisodesApp() {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const episodeDialog = useSelector(({ episodesApp }) => episodesApp.episodes.episodeDialog);
	const episodeIds = useSelector(({ episodesApp }) => episodesApp.episodes.ids);
	const totalCount = useSelector(({ episodesApp }) => episodesApp.episodes.totalCount);

	// useEffect(() => {
	// 	dispatch(getEpisodes(routeParams));
	// }, [routeParams]);

	return (
		<>
			<FusePageCarded
				header={<EntityHeader entity='Episodes' totalCount={totalCount} />}
				content={<EpisodesList />}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<EpisodeDialog
				episodeDialog={episodeDialog}
				episodeIds={episodeIds}
			/>
		</>
	);
}

export default withReducer('episodesApp', reducer)(EpisodesApp);

