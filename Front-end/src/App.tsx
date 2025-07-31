import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Perfil from './pages/Perfil/Perfil';
import './output.css';


function App() {
  return (
    <div className="App">
      <Header /> 
      <Perfil />
      <Footer />
    </div>
  );
}

export default App;