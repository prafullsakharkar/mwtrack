const aliases = (prefix = `src`) => ({
  '@/auth': `${prefix}/auth`,
  '@/stores': `${prefix}/stores`,
  '@/hooks': `${prefix}/hooks`,
  '@/libs': `${prefix}/libs`,
  '@/configs': `${prefix}/configs`,
  '@/components': `${prefix}/components`,
  '@/history': `${prefix}/history`,
  '@/lodash': `${prefix}/lodash`,
  '@/mock-api': `${prefix}/mock-api`,
  '@/theme-layouts': `${prefix}/theme-layouts`,
  'app/AppContext': `${prefix}/app/AppContext`,
});

module.exports = aliases;
