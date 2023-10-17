import PageSimple from '@/components/core/PageSimple';
import withReducer from '@/stores/withReducer';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import StatusList from './StatusList';
import reducer from './store';
import { getStatuses, openNewStatusDialog } from './store/statusSlice';
import StatusDialog from './StatusDialog';
import Header from '@/components/core/Header/Header';

const Root = styled(PageSimple)(({ theme }) => ({
	'& .PageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider,
	},
	'& .PageSimple-toolbar': {},
	'& .PageSimple-content': {},
	'& .PageSimple-sidebarHeader': {},
	'& .PageSimple-sidebarContent': {},
}));

function StatusApp(props) {
	const dispatch = useDispatch();
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	useDeepCompareEffect(() => {
		dispatch(getStatuses());
	}, [dispatch]);

	return (
		<>
			<Root
				header={<Header pageLayout={pageLayout} entity="Statuses" openNewDialog={openNewStatusDialog()} />}
				content={<StatusList />}
				ref={pageLayout}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<StatusDialog />
		</>
	);
}

export default withReducer('statusApp', reducer)(StatusApp);
