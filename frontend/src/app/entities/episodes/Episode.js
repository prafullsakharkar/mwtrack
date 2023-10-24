import PageCarded from '@/components/core/PageCarded';
import withReducer from '@/stores/withReducer';
import { useSelector } from 'react-redux';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EpisodeDialog from './EpisodeDialog';
import EpisodeList from './EpisodeList';
import EntityHeader from '@/components/core/Header/EntityHeader';

function EpisodeApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const episodeDialog = useSelector(({ episodeApp }) => episodeApp.episodes.episodeDialog);
	const episodeIds = useSelector(({ episodeApp }) => episodeApp.episodes.ids);
	const totalCount = useSelector(({ episodeApp }) => episodeApp.episodes.totalCount);

	return (
		<>
			<PageCarded
				header={<EntityHeader entity='Episodes' totalCount={totalCount} />}
				content={<EpisodeList />}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<EpisodeDialog
				episodeDialog={episodeDialog}
				episodeIds={episodeIds}
			/>
		</>
	);
}

export default withReducer('episodeApp', reducer)(EpisodeApp);

