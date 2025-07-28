import Header from './components/Header/Header';
import Carousel from './components/Carousel/Carousel';
import ContentBlock from './components/ContentBlock/ContentBlock';
import EvaluationRedirection from './components/Avaliation/Avaliation';
import Footer from './components/Footer/Footer';
import './App.css';
import './output.css';

// Importando as imagens corretamente
import img1 from './assets/img1.jpeg';
import img2 from './assets/img2.png';
import img3 from './assets/img3.png';

// Fallback com URLs funcionais caso as imagens locais falhem
const fallbackImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop',
];

const imageList = [
  img1,
  img2,
  img3,
];
function App() {
  return (
    <div className="App">
      <Header />
      <Carousel images={imageList} />
      <ContentBlock />
      <EvaluationRedirection />
      <Footer />
    </div>
  );
}

export default App;