import authRoles from '@/auth/authRoles';
const navigationConfig = [
  {
    id: 'mytasks',
    title: 'My Tasks',
    type: 'group',
    icon: 'material-outline:assignment_ind',
    url: '/taskboard',
    // auth: authRoles.artist,
  },
  {
    id: 'accounts',
    title: 'Accounts',
    subtitle: 'Accounts information',
    type: 'group',
    icon: 'heroicons-outline:user-circle',
    translate: 'Accounts',
    // auth: authRoles.admin,
    children: [
      {
        id: 'accounts.users',
        title: 'Users',
        type: 'item',
        icon: 'heroicons-outline:user',
        url: '/accounts/users',
      },
      {
        id: 'accounts.groups',
        title: 'Groups',
        type: 'item',
        icon: 'heroicons-outline:user-group',
        url: '/accounts/groups',
      },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    subtitle: 'Projects information',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'Projects',
    children: [
      {
        id: 'projects.showall',
        title: 'Show All',
        type: 'item',
        icon: 'heroicons-outline:briefcase',
        url: '/projects',
      },
      {
        id: 'projects.create',
        title: 'Create Project',
        type: 'item',
        icon: 'heroicons-outline:plus-circle',
        url: '/projects/new/edit',
      },
      {
        id: 'divider-1',
        type: 'divider',
      },
    ],
  },
  {
    id: 'utilities',
    title: 'Utilities',
    subtitle: 'Custom made utilities',
    type: 'group',
    icon: 'apps',
    translate: 'Utilities',
    // auth: authRoles.developer,
    children: [
      {
        id: 'utilities.status',
        title: 'Status',
        type: 'item',
        icon: 'heroicons-outline:presentation-chart-line',
        url: '/utilities/statuses',
      },
      {
        id: 'utilities.step',
        title: 'Step',
        type: 'item',
        icon: 'heroicons-solid:chart-bar',
        url: '/utilities/steps',
        auth: authRoles.developer,
      },
    ]
  },
];

export default navigationConfig;
