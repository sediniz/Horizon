import Carousel from '../../Carousel/Carousel';
import ContentBlock from '../../ContentBlock/ContentBlock';
import Review from '../../Review/Review';

// Importando as imagens corretamente
import img1 from '../../../assets/cancun.png';
import img2 from '../../../assets/Paris2.png';
import img3 from '../../../assets/Praia01.png';

const imageList = [
  img1,
  img2,
  img3,
];

function Home() {
  return (
    <div className="Home">
      <Carousel images={imageList} />
      <ContentBlock />
      <Review />
    </div>
  );
}

export default Home;