import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import navigationConfig from '@/configs/navigationConfig';
import Utils from '@/libs/Utils';
import _ from '@/lodash';

const navigationAdapter = createEntityAdapter();
const emptyInitialState = navigationAdapter.getInitialState();
const initialState = navigationAdapter.upsertMany(emptyInitialState, navigationConfig);

export const appendNavigationItem = (item, parentId) => (dispatch, getState) => {
  const navigation = selectNavigationAll(getState());

  return dispatch(setNavigation(Utils.appendNavItem(navigation, item, parentId)));
};

export const prependNavigationItem = (item, parentId) => (dispatch, getState) => {
  const navigation = selectNavigationAll(getState());

  return dispatch(setNavigation(Utils.prependNavItem(navigation, item, parentId)));
};

export const updateNavigationItem = (id, item) => (dispatch, getState) => {
  const navigation = selectNavigationAll(getState());

  return dispatch(setNavigation(Utils.updateNavItem(navigation, id, item)));
};

export const removeNavigationItem = (id) => (dispatch, getState) => {
  const navigation = selectNavigationAll(getState());

  return dispatch(setNavigation(Utils.removeNavItem(navigation, id)));
};

export const {
  selectAll: selectNavigationAll,
  selectIds: selectNavigationIds,
  selectById: selectNavigationItemById,
} = navigationAdapter.getSelectors((state) => state.core.navigation);

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setNavigation: navigationAdapter.setAll,
    resetNavigation: (state, action) => initialState,
  },
});

export const { setNavigation, resetNavigation } = navigationSlice.actions;

const getUserRole = (state) => state.user.role;

export const selectNavigation = createSelector(
  [selectNavigationAll, getUserRole],
  (navigation, language, userRole) => {
    function setTranslationValues(data) {
      // loop through every object in the array
      return data.map((item) => {
        // see if there is a children node
        if (item.children) {
          // run this function recursively on the children array
          item.children = setTranslationValues(item.children);
        }
        return item;
      });
    }

    return setTranslationValues(
      _.merge(
        [],
        filterRecursively(navigation, (item) => Utils.hasPermission(item.auth, userRole))
      )
    );
  }
);

function filterRecursively(arr, predicate) {
  return arr.filter(predicate).map((item) => {
    item = { ...item };
    if (item.children) {
      item.children = filterRecursively(item.children, predicate);
    }
    return item;
  });
}

export const selectFlatNavigation = createSelector([selectNavigation], (navigation) =>
  Utils.getFlatNavigation(navigation)
);

export default navigationSlice.reducer;
