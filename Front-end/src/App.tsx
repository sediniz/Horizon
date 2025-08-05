import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import InfoPacote from './pages/InfoPacote/InfoPacote';
import Home from './pages/Home/Home';
import PacotesGerais from './pages/PacotesGerais/PacotesGerais';
import Favoritos from './pages/Favoritos/Favoritos';
import Pagamento from './pages/Pagamento/Pagamento';
import Perfil from './pages/Perfil/Perfil';
import ReservaHist from './pages/Reserva/ReservaHist';
import Admin from './pages/Admin/Admin';
import SecurityDemo from './pages/SecurityDemo/SecurityDemo';
import AuthTest from './pages/AuthTest/AuthTest';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritosProvider } from './contexts/FavoritosContext';
import './output.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <AuthProvider>
      <FavoritosProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pacotes" element={<PacotesGerais />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/pacote/:id" element={<InfoPacote />} />
            <Route path="/pagamento" element={<Pagamento />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/reservas" element={<ReservaHist />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="Admin">
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route path="/security-demo" element={<SecurityDemo />} />
          </Routes> 
          <Footer />
        </div>
      </BrowserRouter>
      </FavoritosProvider>
    </AuthProvider>
  );
}

export default App;