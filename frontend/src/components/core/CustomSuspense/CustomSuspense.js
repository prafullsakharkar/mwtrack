import Loading from '@/components/core/Loading';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

/**
 * React Suspense defaults
 * For to Avoid Repetition
 */

function CustomSuspense(props) {
  return <Suspense fallback={<Loading {...props.loadingProps} />}>{props.children}</Suspense>;
}

CustomSuspense.propTypes = {
  loadingProps: PropTypes.object,
};

CustomSuspense.defaultProps = {
  loadingProps: {
    delay: 0,
  },
};

export default CustomSuspense;
