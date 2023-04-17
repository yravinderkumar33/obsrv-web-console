const useAuth = () => {
  const context = {
    isLoggedIn: true
  }

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useAuth;
