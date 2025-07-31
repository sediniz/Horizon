import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Reserva from './pages/Reserva/ReservaHist';
import './output.css';


function App() {
  return (
    <div className="App">
      <Header /> 
      <Reserva />
      <Footer />
    </div>
  );
}

export default App;