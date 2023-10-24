import PageCarded from '@/components/core/PageCarded';
import withReducer from '@/stores/withReducer';
import { useSelector } from 'react-redux';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from '@/components/core/Header/EntityHeader';
import ShotDialog from './ShotDialog';
import ShotList from './ShotList';

function ShotApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const shotDialog = useSelector(({ shotApp }) => shotApp.shots.shotDialog);
	const totalCount = useSelector(({ shotApp }) => shotApp.shots.totalCount);
	const episodeIds = useSelector(({ shotApp }) => shotApp.episodes.ids);
	const sequenceIds = useSelector(({ shotApp }) => shotApp.sequences.ids);
	const shotIds = useSelector(({ shotApp }) => shotApp.shots.ids);

	return (
		<>
			<PageCarded
				header={<EntityHeader entity='Shots' totalCount={totalCount} />}
				content={<ShotList />}
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

export default withReducer('shotApp', reducer)(ShotApp);

