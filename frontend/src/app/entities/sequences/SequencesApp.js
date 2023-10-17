import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from 'app/shared-components/header/EntityHeader';
import SequenceDialog from './SequenceDialog';
import SequencesList from './SequencesList';

function SequencesApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const sequenceDialog = useSelector(({ sequencesApp }) => sequencesApp.sequences.sequenceDialog);
	const sequenceIds = useSelector(({ sequencesApp }) => sequencesApp.sequences.ids);
	const episodeIds = useSelector(({ sequencesApp }) => sequencesApp.episodes.ids);

	const totalCount = useSelector(({ sequencesApp }) => sequencesApp.sequences.totalCount);

	return (
		<>
			<FusePageCarded
				header={<EntityHeader entity='Sequences' totalCount={totalCount} />}
				content={<SequencesList />}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<SequenceDialog
				sequenceDialog={sequenceDialog}
				episodeIds={episodeIds}
				sequenceIds={sequenceIds}
			/>
		</>
	);
}

export default withReducer('sequencesApp', reducer)(SequencesApp);

