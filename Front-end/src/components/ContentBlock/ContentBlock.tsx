// src/components/TravelPackages.tsx

import React from 'react';
import PraiaImg from '../../assets/Praia01.png';
import Paris2Img from '../../assets/Paris2.png';
import CancunImg from '../../assets/cancun.png';

type PackageProps = {
  title: string;
  price: string;
  duration: string;
  image: string;
};

const packages: PackageProps[] = [
  {
    title: 'Pacote de Praia',
    price: 'R$ 2.500',
    duration: '7 dias',
    image: PraiaImg,
  },
  {
    title: 'Pacote em Paris',
    price: 'R$ 4.800',
    duration: '5 dias',
    image: Paris2Img,
  },
  {
    title: 'Pacote em Cancún',
    price: 'R$ 3.200',
    duration: '6 dias',
    image: CancunImg,
  },
];

const TravelPackages: React.FC = () => {
  return (
    <section className="bg-white py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-black mb-8">Nossos Pacotes</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="w-64 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="h-40 w-full overflow-hidden rounded-t-md bg-gray-200">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800">{pkg.title}</h3>
              <p className="text-black font-bold text-sm mt-1">{pkg.price}</p>
              <p className="text-gray-600 text-sm mb-4">{pkg.duration}</p>
              <button className="bg-teal-500 text-white py-2 px-4 text-sm rounded hover:bg-teal-600">
                Ver mais
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TravelPackages;