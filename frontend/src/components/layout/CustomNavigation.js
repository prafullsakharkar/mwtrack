import Navigation from '@/components/core/Navigation';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNavigation } from '@/stores/core/navigationSlice';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import { navbarCloseMobile } from '@/stores/core/navbarSlice';

function CustomNavigation(props) {
  const navigation = useSelector(selectNavigation);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const dispatch = useDispatch();

  return useMemo(() => {
    function handleItemClick(item) {
      if (isMobile) {
        dispatch(navbarCloseMobile());
      }
    }

    return (
      <Navigation
        className={clsx('navigation', props.className)}
        navigation={navigation}
        layout={props.layout}
        dense={props.dense}
        active={props.active}
        onItemClick={handleItemClick}
      />
    );
  }, [dispatch, isMobile, navigation, props.active, props.className, props.dense, props.layout]);
}

CustomNavigation.defaultProps = {
  layout: 'vertical',
};

export default memo(CustomNavigation);
