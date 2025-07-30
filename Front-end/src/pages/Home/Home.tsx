import Carousel from './Carousel/Carousel';
import Search from './Search/Search';
import ContentBlock from './ContentBlock/ContentBlock';
import Review from './Review/Review';

// Importando as imagens corretamente
import image1 from '../../assets/4k/image1.jpg';
import image2 from '../../assets/4k/image2.jpg';
import image3 from '../../assets/4k/image3.jpg';
import image4 from '../../assets/4k/image4.jpg';
import image5 from '../../assets/4k/image5.jpg';
import image6 from '../../assets/4k/image6.jpg';
import image7 from '../../assets/4k/image7.jpg';
import image8 from '../../assets/4k/image8.jpg';
import image9 from '../../assets/4k/image9.jpg';
import image10 from '../../assets/4k/image10.jpg';
import image11 from '../../assets/4k/image11.jpg';
import image12 from '../../assets/4k/image12.jpg';


const imageList = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12
];

function Home() {
  return (
    <div className="Home min-h-screen bg-gray-50">
      
      {/* Seção principal com espaçamento */}
      <main className="space-y-0 pb-0">

         {/* Search Component */}
        <section className="pt-0">
          <Search />
        </section>

      {/* Carousel */}
        <section>
          <Carousel images={imageList} />
        </section>

       
    
        
        {/* Content Block */}
        <section className="px-4">
          <ContentBlock />
        </section>
        
        {/* Review Section */}
        <section className="px-4">
          <Review />
        </section>
      </main>
      
    </div>
  );
}

export default Home;