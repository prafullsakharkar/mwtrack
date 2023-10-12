import { injectReducer } from '@/stores/index';

const withReducer = (key, reducer) => (WrappedComponent) => {
  injectReducer(key, reducer);

  return (props) => <WrappedComponent {...props} />;
};

export default withReducer;
