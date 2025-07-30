import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import './output.css';
function App() {
  return (
    <div className="App">
      <Header /> 
      <Home />
      <Footer />
    </div>
  );
}

export default App;