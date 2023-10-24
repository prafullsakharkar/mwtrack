import PageCarded from '@/components/core/PageCarded';
import withReducer from '@/stores/withReducer';
import { useSelector } from 'react-redux';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from '@/components/core/Header/EntityHeader';
import SequenceDialog from './SequenceDialog';
import SequenceList from './SequenceList';

function SequenceApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const sequenceDialog = useSelector(({ sequenceApp }) => sequenceApp.sequences.sequenceDialog);
	const sequenceIds = useSelector(({ sequenceApp }) => sequenceApp.sequences.ids);
	const episodeIds = useSelector(({ sequenceApp }) => sequenceApp.episodes.ids);
	const totalCount = useSelector(({ sequenceApp }) => sequenceApp.sequences.totalCount);

	return (
		<>
			<PageCarded
				header={<EntityHeader entity='Sequence' totalCount={totalCount} />}
				content={<SequenceList />}
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

export default withReducer('sequenceApp', reducer)(SequenceApp);

