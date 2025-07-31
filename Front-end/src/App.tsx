import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import InfoPacote from './pages/InfoPacote/InfoPacote';
import './output.css';


function App() {
  return (
    <div className="App">
      <Header /> 
      <InfoPacote />
      <Footer />
    </div>
  );
}

export default App;