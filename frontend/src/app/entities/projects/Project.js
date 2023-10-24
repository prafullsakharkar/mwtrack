import PageSimple from '@/components/core/PageSimple';
import withReducer from '@/stores/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import ProjectSidebarContent from './ProjectSidebar';
import ProjectList from './ProjectList';
import reducer from './store';
import { getUsers } from 'src/app/accounts/users/store/userSlice';
import { getProjects, setProjectSearchText, selectProjectSearchText } from './store/projectSlice';
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

function ProjectApp(props) {
	const dispatch = useDispatch();
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const searchText = useSelector(selectProjectSearchText);

	useDeepCompareEffect(() => {
		dispatch(getProjects());
		dispatch(getUsers());
	}, [dispatch]);

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.uid));
	}, [routeParams]);

	return (
		<Root
			header={
				<Header
					pageLayout={pageLayout}
					entity="Projects"
					searchText={searchText}
					setSearchText={setProjectSearchText}
				/>
			}
			content={<ProjectList />}
			ref={pageLayout}
			rightSidebarContent={<ProjectSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={480}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default withReducer('projectApp', reducer)(ProjectApp);
