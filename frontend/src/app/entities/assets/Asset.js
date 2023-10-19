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
import AssetDialog from './AssetDialog';
import AssetList from './AssetList';
// import { getAsset, selectAsset } from './store/assetsSlice';
import EntityHeader from '@/components/core/Header/EntityHeader';
import { getUtilSteps } from 'src/app/utilities/util-steps/store/utilStepSlice';
import { getUsers } from 'src/app/accounts/users/store/userSlice';

function AssetApp() {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const assetDialog = useSelector(({ assetApp }) => assetApp.assets.assetDialog);
	const assetIds = useSelector(({ assetApp }) => assetApp.assets.ids);
	const totalCount = useSelector(({ assetApp }) => assetApp.assets.totalCount);

	useEffect(() => {
		dispatch(getUtilSteps({ entity: 'Asset' }));
		dispatch(getUsers());
	}, []);

	return (
		<>
			<PageCarded
				header={<EntityHeader entity='Asset' totalCount={totalCount} />}
				content={<AssetList />}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<AssetDialog
				assetDialog={assetDialog}
				assetIds={assetIds}
			/>
		</>
	);
}

export default withReducer('assetApp', reducer)(AssetApp);

