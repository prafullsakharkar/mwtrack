import PageCarded from '@/components/core/PageCarded';
import withReducer from '@/stores/withReducer';
import { useSelector } from 'react-redux';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from '@/components/core/Header/EntityHeader';
import NoteDialog from './NoteDialog';
import NotesList from './NoteList';

function NoteApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const noteDialog = useSelector(({ noteApp }) => noteApp.notes.noteDialog);
	const noteIds = useSelector(({ noteApp }) => noteApp.notes.ids);
	const totalCount = useSelector(({ noteApp }) => noteApp.notes.totalCount);

	return (
		<>
			<PageCarded
				header={<EntityHeader entity='Notes' totalCount={totalCount} />}
				content={<NotesList />}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<NoteDialog
				noteDialog={noteDialog}
				noteIds={noteIds}
			/>
		</>
	);
}

export default withReducer('noteApp', reducer)(NoteApp);

