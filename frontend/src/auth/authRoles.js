/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  owner: ['admin', 'owner'],
  production: ['admin', 'owner', 'production'],
  supervisor: ['admin', 'owner', 'production', 'supervisor'],
  artist: ['admin', 'owner', 'production', 'supervisor', 'artost'],
  onlyGuest: [],
};

export default authRoles;
