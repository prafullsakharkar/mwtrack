import PageSimple from '@/components/core/PageSimple';
import withReducer from '@/stores/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import GroupHeader from './GroupHeader';
import GroupList from './GroupList';
import reducer from './store';
import { getGroups } from './store/groupSlice';
import GroupDialog from './GroupDialog';

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

function GroupApp(props) {
	const dispatch = useDispatch();
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	useDeepCompareEffect(() => {
		dispatch(getGroups());
	}, [dispatch]);

	return (
		<>
			<Root
				header={<GroupHeader pageLayout={pageLayout} />}
				content={<GroupList />}
				ref={pageLayout}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<GroupDialog />
		</>
	);
}

export default withReducer('groupApp', reducer)(GroupApp);
