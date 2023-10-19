import PageSimple from '@/components/core/PageSimple';
import withReducer from '@/stores/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import OverviewHeader from './OverviewHeader';
import reducer from './store';
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

function Overview(props) {
	const dispatch = useDispatch();
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	// useDeepCompareEffect(() => {
	// 	dispatch(getProjects());
	// 	dispatch(getUsers());
	// }, [dispatch]);

	// useEffect(() => {
	// 	setRightSidebarOpen(Boolean(routeParams.id));
	// }, [routeParams]);

	return (
		<Root
			header={
				<OverviewHeader
					pageLayout={pageLayout}
				/>
			}
			content={<h1>Prafull</h1>}
			ref={pageLayout}
			// rightSidebarContent={<ProjectSidebarContent />}
			// rightSidebarOpen={rightSidebarOpen}
			// rightSidebarOnClose={() => setRightSidebarOpen(false)}
			// rightSidebarWidth={480}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default withReducer('overviewApp', reducer)(Overview);
