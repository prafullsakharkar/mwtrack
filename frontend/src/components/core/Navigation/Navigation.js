import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import { memo } from 'react';
import _ from 'src/lodash';
import GlobalStyles from '@mui/material/GlobalStyles';
import NavHorizontalLayout1 from './horizontal/NavHorizontalLayout1';
import NavHorizontalCollapse from './horizontal/types/NavHorizontalCollapse';
import NavHorizontalGroup from './horizontal/types/NavHorizontalGroup';
import NavHorizontalItem from './horizontal/types/NavHorizontalItem';
import NavHorizontalLink from './horizontal/types/NavHorizontalLink';
import { registerComponent } from './NavItem';

const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      '.popper-navigation-list': {
        '& .core-list-item': {
          padding: '8px 12px 8px 12px',
          height: 40,
          minHeight: 40,
          '& .core-list-item-text': {
            padding: '0 0 0 8px',
          },
        },
        '&.dense': {
          maxHeight: 180,
          overflow: 'auto',
          '& .core-list-item': {
            minHeight: 32,
            height: 32,
            minWidth: 120,
            '& .core-list-item-text': {
              padding: '0 0 0 8px',
            },
          },
        },
      },
    })}
  />
);

/*
Register  Navigation Components
 */
registerComponent('horizontal-group', NavHorizontalGroup);
registerComponent('horizontal-collapse', NavHorizontalCollapse);
registerComponent('horizontal-item', NavHorizontalItem);
registerComponent('horizontal-link', NavHorizontalLink);
registerComponent('horizontal-divider', () => <Divider className="my-8" />);

function Navigation(props) {
  const options = _.pick(props, [
    'navigation',
    'layout',
    'active',
    'dense',
    'className',
    'onItemClick',
    'firstLevel',
    'selectedId',
  ]);
  if (props.navigation.length > 0) {
    return (
      <>
        {inputGlobalStyles}
        {props.layout === 'horizontal' && <NavHorizontalLayout1 {...options} />}
      </>
    );
  }
  return null;
}

Navigation.propTypes = {
  navigation: PropTypes.array.isRequired,
};

Navigation.defaultProps = {
  layout: 'horizontal',
};

export default memo(Navigation);
