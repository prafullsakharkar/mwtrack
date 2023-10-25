import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import { memo } from 'react';
import _ from '@/lodash';
import GlobalStyles from '@mui/material/GlobalStyles';
import NavHorizontalLayout1 from './horizontal/NavHorizontalLayout';
import NavVerticalLayout1 from './vertical/NavVerticalLayout';
import NavVerticalLayout2 from './vertical/NavVerticalLayout2';
import NavHorizontalCollapse from './horizontal/types/NavHorizontalCollapse';
import NavHorizontalGroup from './horizontal/types/NavHorizontalGroup';
import NavHorizontalItem from './horizontal/types/NavHorizontalItem';
import NavHorizontalLink from './horizontal/types/NavHorizontalLink';
import NavVerticalCollapse from './vertical/types/NavVerticalCollapse';
import NavVerticalGroup from './vertical/types/NavVerticalGroup';
import NavVerticalItem from './vertical/types/NavVerticalItem';
import NavVerticalLink from './vertical/types/NavVerticalLink';
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
          '& .core-list-item': {
            minHeight: 32,
            height: 32,
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
registerComponent('vertical-group', NavVerticalGroup);
registerComponent('vertical-collapse', NavVerticalCollapse);
registerComponent('vertical-item', NavVerticalItem);
registerComponent('vertical-link', NavVerticalLink);
registerComponent('horizontal-group', NavHorizontalGroup);
registerComponent('horizontal-collapse', NavHorizontalCollapse);
registerComponent('horizontal-item', NavHorizontalItem);
registerComponent('horizontal-link', NavHorizontalLink);
registerComponent('vertical-divider', () => <Divider className="my-16" />);
registerComponent('horizontal-divider', () => <Divider className="my-16" />);

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
        {props.layout === 'vertical' && <NavVerticalLayout1 {...options} />}
        {props.layout === 'vertical-2' && <NavVerticalLayout2 {...options} />}
      </>
    );
  }
  return null;
}

Navigation.propTypes = {
  navigation: PropTypes.array.isRequired,
};

Navigation.defaultProps = {
  layout: 'vertical',
};

export default memo(Navigation);
