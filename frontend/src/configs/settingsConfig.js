import themesConfig from '@/configs/themesConfig';

const settingsConfig = {
  layout: {
    style: 'layout',
    config: {},
  },
  customScrollbars: true,
  direction: 'ltr',
  theme: {
    main: themesConfig.greyDark,
    navbar: themesConfig.greyDark,
    toolbar: themesConfig.greyDark,
    footer: themesConfig.greyDark,
  },
  /*
   To make whole app auth protected by default set defaultAuth:['admin','staff','user']
   To make whole app accessible without authorization by default set defaultAuth: null
   *** The individual route configs which has auth option won't be overridden.
   */
  defaultAuth: ['admin'],
  /*
    Default redirect url for the logged-in user,
   */
  loginRedirectUrl: '/',
};

export default settingsConfig;
