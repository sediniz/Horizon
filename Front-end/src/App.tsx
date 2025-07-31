import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import InfoPacote from './pages/InfoPacote/InfoPacote';
import Home from './pages/Home/Home';
import PacotesGerais from './pages/PacotesGerais/PacotesGerais';
import Pagamento from './pages/Pagamento/Pagamento';
import Perfil from './pages/Perfil/Perfil';
import Reserva from './pages/Reserva/Reserva';
import ReservaHist from './pages/Reserva/ReservaHist';
import './output.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pacotes" element={<PacotesGerais />} />
          <Route path="/pacote/:id" element={<InfoPacote />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/reserva" element={<Reserva />} />
          <Route path="/reservas" element={<ReservaHist />} />
        </Routes> 
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;