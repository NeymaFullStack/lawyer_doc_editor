const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  TEMPLATES: "/templates",
};

export const paths = {
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
  },

  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  settings: {
    root: ROOTS.TEMPLATES,
  },
  templates: {
    root: ROOTS.TEMPLATES,
  },
};
