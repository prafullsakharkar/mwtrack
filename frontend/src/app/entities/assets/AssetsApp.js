import FusePageCarded from '@fuse/core/FusePageCarded';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from './store';
import AssetDialog from './AssetDialog';
import AssetsList from './AssetsList';
// import { getAssets, selectAssets } from './store/assetsSlice';
import EntityHeader from 'app/shared-components/header/EntityHeader';
import { getUtilSteps } from 'src/app/main/apps/utilities/steps/store/stepsSlice';
import { getAccounts } from 'src/app/main/apps/users/accounts/store/accountsSlice';

function AssetsApp() {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const assetDialog = useSelector(({ assetsApp }) => assetsApp.assets.assetDialog);
	const assetIds = useSelector(({ assetsApp }) => assetsApp.assets.ids);
	const totalCount = useSelector(({ assetsApp }) => assetsApp.assets.totalCount);

	useEffect(() => {
		dispatch(getUtilSteps({entity: 'Asset'}));
		dispatch(getAccounts());
	}, []);

	return (
		<>
			<FusePageCarded
				header={<EntityHeader entity='Assets' totalCount={totalCount} />}
				content={<AssetsList />}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<AssetDialog
				assetDialog={assetDialog}
				assetIds={assetIds}
			/>
		</>
	);
}

export default withReducer('assetsApp', reducer)(AssetsApp);

