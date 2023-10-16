const navigationConfig = [
  {
    id: 'accounts',
    title: 'Accounts',
    subtitle: 'Accounts information',
    type: 'group',
    icon: 'heroicons-outline:users',
    translate: 'ACCOUNTS',
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
    id: 'example-component',
    title: 'Example',
    translate: 'EXAMPLE',
    type: 'item',
    icon: 'heroicons-outline:star',
    url: 'example',
  },
];

export default navigationConfig;
