import PageCarded from '@/components/core/PageCarded';
import withReducer from '@/stores/withReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from '@/components/core/Header/EntityHeader';
import StepDialog from './StepDialog';
import StepsList from './StepList';
import { getStatuses } from 'src/app/utilities/statuses/store/statusSlice';

function StepsApp() {
	const dispatch = useDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const stepDialog = useSelector(({ stepApp }) => stepApp.steps.stepDialog);
	const totalCount = useSelector(({ stepApp }) => stepApp.steps.totalCount);

	const statuses = useSelector(({ stepApp }) => stepApp.status.entities);
	const utilSteps = useSelector(({ stepApp }) => stepApp.utilSteps.entities)

	const episodeIds = useSelector(({ stepApp }) => stepApp.episodes.ids)
	const sequenceIds = useSelector(({ stepApp }) => stepApp.sequences.ids)
	const shotIds = useSelector(({ stepApp }) => stepApp.shots.ids)
	const stepIds = useSelector(({ stepApp }) => stepApp.steps.ids)
	const assetIds = useSelector(({ stepApp }) => stepApp.assets.ids)

	useEffect(() => {
		dispatch(getStatuses());
	}, []);

	return (
		<>
			<PageCarded
				header={<EntityHeader entity='Steps' totalCount={totalCount} />}
				content={<StepsList />}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<StepDialog
				stepDialog={stepDialog}
				episodeIds={episodeIds}
				sequenceIds={sequenceIds}
				shotIds={shotIds}
				stepIds={stepIds}
				assetIds={assetIds}
				utilSteps={utilSteps}
				statuses={statuses}
			/>
		</>
	);
}

export default withReducer('stepApp', reducer)(StepsApp);

