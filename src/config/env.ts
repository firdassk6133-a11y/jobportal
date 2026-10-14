export const env = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    'https://3jbodl5qv1.execute-api.eu-north-1.amazonaws.com',
  isDev: import.meta.env.DEV,
};
