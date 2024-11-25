const ROOTS = {
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  TEMPLATES: "/templates",
};

export const paths = {
  login: "/login",
  register: "/register",
  logout: "/logout",
  support: "/support",
  dashboard: {
    root: ROOTS.DASHBOARD,
    document: `${ROOTS.DASHBOARD}/document`,
  },
  settings: {
    root: ROOTS.SETTINGS,
  },
  templates: {
    root: ROOTS.TEMPLATES,
  },
};
