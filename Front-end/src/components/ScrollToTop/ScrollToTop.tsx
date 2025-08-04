import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll para o topo sempre que a rota mudar
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
