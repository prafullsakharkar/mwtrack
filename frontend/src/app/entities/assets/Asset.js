import PageCarded from '@/components/core/PageCarded';
import withReducer from '@/stores/withReducer';
import { useSelector } from 'react-redux';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import AssetDialog from './AssetDialog';
import AssetList from './AssetList';
import EntityHeader from '@/components/core/Header/EntityHeader';

function AssetApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const assetDialog = useSelector(({ assetApp }) => assetApp.assets.assetDialog);
	const assetIds = useSelector(({ assetApp }) => assetApp.assets.ids);
	const totalCount = useSelector(({ assetApp }) => assetApp.assets.totalCount);

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

