import PageCarded from '@/components/core/PageCarded';
import withReducer from '@/stores/withReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from '@/components/core/Header/EntityHeader';
import VersionDialog from './VersionDialog';
import VersionsList from './VersionList';
import { getStatuses } from 'src/app/utilities/statuses/store/statusSlice';


function VersionApp() {
	const dispatch = useDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const versionDialog = useSelector(({ versionApp }) => versionApp.versions.versionDialog);
	const versionIds = useSelector(({ versionApp }) => versionApp.versions.ids);
	const totalCount = useSelector(({ versionApp }) => versionApp.versions.totalCount);

	const versionEntities = useSelector(({ versionApp }) => versionApp.versions.entities);
	const utilStepEntities = useSelector(({ versionApp }) => versionApp.utilSteps.entities);

	const episodeIds = useSelector(({ versionApp }) => versionApp.episodes.ids)
	const sequenceIds = useSelector(({ versionApp }) => versionApp.sequences.ids)
	const shotIds = useSelector(({ versionApp }) => versionApp.shots.ids)
	const assetIds = useSelector(({ versionApp }) => versionApp.assets.ids)

	const users = useSelector(({ versionApp }) => versionApp.users.entities);
	const statuses = useSelector(({ versionApp }) => versionApp.status.entities);

	useEffect(() => {
		dispatch(getStatuses());
	}, []);

	return (
		<>
			<PageCarded
				header={<EntityHeader
					entity='Versions'
					totalCount={totalCount}
				/>}
				content={<VersionsList
					users={users}
					statuses={statuses}
				/>}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<VersionDialog
				versionDialog={versionDialog}
				versionEntities={versionEntities}
				users={users}
				statuses={statuses}
				episodeIds={episodeIds}
				sequenceIds={sequenceIds}
				shotIds={shotIds}
				assetIds={assetIds}
				versionIds={versionIds}
				utilSteps={utilStepEntities}
			/>
		</>
	);
}

export default withReducer('versionApp', reducer)(VersionApp);

