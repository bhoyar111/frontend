export const withRole = (role, routes) => {
    return routes.map(route => ({
      ...route,
      handle: { ...(route.handle || {}), roles: [role] }
    }));
  };
