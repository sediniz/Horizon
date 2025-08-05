import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { usuario, isAuthenticated } = useAuth();

  const isAdmin = () => {
    return isAuthenticated && usuario?.tipoUsuario === 'Admin';
  };

  const isCliente = () => {
    return isAuthenticated && usuario?.tipoUsuario === 'Cliente';
  };

  const hasRole = (role: string) => {
    return isAuthenticated && usuario?.tipoUsuario === role;
  };

  const canAccessAdmin = () => {
    return isAdmin();
  };

  return {
    isAdmin,
    isCliente,
    hasRole,
    canAccessAdmin,
    currentUser: usuario,
    isAuthenticated,
  };
};

export default usePermissions;
