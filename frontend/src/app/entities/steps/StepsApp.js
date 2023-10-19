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
import StepDialog from './StepDialog';
import StepsList from './StepsList';
import { getStatuses } from 'src/app/utilities/statuses/store/statusesSlice';
import { getPriorities } from 'src/app/utilities/priorities/store/prioritiesSlice';

function StepsApp() {
	const dispatch = useDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const stepDialog = useSelector(({ stepsApp }) => stepsApp.steps.stepDialog);
	const totalCount = useSelector(({ stepsApp }) => stepsApp.steps.totalCount);

	const statuses = useSelector(({ stepsApp }) => stepsApp.status.entities);
	const priorities = useSelector(({ stepsApp }) => stepsApp.priorities.entities);
	const utilSteps = useSelector(({ stepsApp }) => stepsApp.utilSteps.entities)

	const episodeIds = useSelector(({ stepsApp }) => stepsApp.episodes.ids)
	const sequenceIds = useSelector(({ stepsApp }) => stepsApp.sequences.ids)
	const shotIds = useSelector(({ stepsApp }) => stepsApp.shots.ids)
	const stepIds = useSelector(({ stepsApp }) => stepsApp.steps.ids)
	const assetIds = useSelector(({ stepsApp }) => stepsApp.assets.ids)

	useEffect(() => {
		dispatch(getStatuses());
		dispatch(getPriorities());
	}, []);

	return (
		<>
			<PageCarded
				header={<EntityHeader entity='Steps' totalCount={totalCount} />}
				content={<StepsList
					statuses={statuses}
					priorities={priorities}
				/>}
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
				priorities={priorities}
			/>
		</>
	);
}

export default withReducer('stepsApp', reducer)(StepsApp);

