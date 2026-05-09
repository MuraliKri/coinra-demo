export function useAuth() {
  return {
    user: { name: "Krishna Nanda Kumar", email: "kishan.krishna.jb@gmail.com", id: "1" },
    loading: false,
    error: null,
    isAuthenticated: true,
    refresh: () => {},
    logout: async () => {},
  };
}
