import PageCarded from '@/components/core/PageCarded';
import withReducer from '@/stores/withReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from '@/components/core/header/EntityHeader';
import ShotDialog from './ShotDialog';
import ShotsList from './ShotsList';
import { getUtilSteps } from 'src/app/utilities/steps/store/stepsSlice';
import { getUsers } from 'src/app/accounts/users/store/userSlice';

function ShotsApp() {
	const dispatch = useDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const shotDialog = useSelector(({ shotsApp }) => shotsApp.shots.shotDialog);
	const totalCount = useSelector(({ shotsApp }) => shotsApp.shots.totalCount);

	const episodeIds = useSelector(({ shotsApp }) => shotsApp.episodes.ids);
	const sequenceIds = useSelector(({ shotsApp }) => shotsApp.sequences.ids);
	const shotIds = useSelector(({ shotsApp }) => shotsApp.shots.ids);

	useEffect(() => {
		dispatch(getUtilSteps({ entity: 'Shot' }));
		dispatch(getUsers());
	}, []);

	return (
		<>
			<PageCarded
				header={<EntityHeader entity='Shots' totalCount={totalCount} />}
				content={<ShotsList />}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<ShotDialog
				shotDialog={shotDialog}
				episodeIds={episodeIds}
				sequenceIds={sequenceIds}
				shotIds={shotIds}
			/>
		</>
	);
}

export default withReducer('shotsApp', reducer)(ShotsApp);

