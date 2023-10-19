import PageCarded from '@/components/core/PageCarded';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import withReducer from '@/stores/withReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from '@/components/core/header/EntityHeader';
import PublishDialog from './PublishDialog';
import PublishesList from './PublishesList';
import { getStatuses } from 'src/app/utilities/statuses/store/statusesSlice';
import { getPriorities } from 'src/app/utilities/priorities/store/prioritiesSlice';


function publishesApp() {
	const dispatch = useDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const publishDialog = useSelector(({ publishesApp }) => publishesApp.publishes.publishDialog);
	const publishIds = useSelector(({ publishesApp }) => publishesApp.publishes.ids);
	const totalCount = useSelector(({ publishesApp }) => publishesApp.publishes.totalCount);

	const publishEntities = useSelector(({ publishesApp }) => publishesApp.publishes.entities);
	const utilStepEntities = useSelector(({ publishesApp }) => publishesApp.utilSteps.entities);

	const episodeIds = useSelector(({ publishesApp }) => publishesApp.episodes.ids)
	const sequenceIds = useSelector(({ publishesApp }) => publishesApp.sequences.ids)
	const shotIds = useSelector(({ publishesApp }) => publishesApp.shots.ids)
	const assetIds = useSelector(({ publishesApp }) => publishesApp.assets.ids)

	const users = useSelector(({ publishesApp }) => publishesApp.users.entities);
	const statuses = useSelector(({ publishesApp }) => publishesApp.status.entities);

	useEffect(() => {
		dispatch(getStatuses());
		dispatch(getPriorities());
	}, []);

	return (
		<>
			<PageCarded
				header={<EntityHeader
					entity='publishes'
					totalCount={totalCount}
				/>}
				content={<PublishesList
					users={users}
					statuses={statuses}
				/>}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<PublishDialog
				publishDialog={publishDialog}
				publishEntities={publishEntities}
				users={users}
				statuses={statuses}
				episodeIds={episodeIds}
				sequenceIds={sequenceIds}
				shotIds={shotIds}
				assetIds={assetIds}
				publishIds={publishIds}
				utilSteps={utilStepEntities}
			/>
		</>
	);
}

export default withReducer('publishesApp', reducer)(publishesApp);

