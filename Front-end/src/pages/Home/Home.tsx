import Carousel from './Carousel/Carousel';
import Search from './Search/Search';
import ContentBlock from './ContentBlock/ContentBlock';
import Review from './Review/Review';

// Importando as imagens corretamente
import img1 from '../../assets/cancun.png';
import img2 from '../../assets/Paris2.png';
import img3 from '../../assets/Praia01.png';

const imageList = [
  img1,
  img2,
  img3,
];

function Home() {
  return (
    <div className="Home min-h-screen bg-gray-50">
      
      {/* Seção principal com espaçamento */}
      <main className="space-y-16 pb-16">
        {/* Search Component */}
        <section className="pt-12">
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