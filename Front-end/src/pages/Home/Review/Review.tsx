import React, { useState } from 'react';
import img1 from '../../../assets/img1.jpeg';

// Dados das avaliações com informações detalhadas dos hotéis
const reviews = [
  {
    id: 1,
    name: "Maria Carolina",
    initials: "MC",
    verified: "Viajante verificada",
    rating: 5.0,
    title: "Uma experiência absolutamente incrível!",
    comment: "A viagem foi perfeita do início ao fim. O hotel tinha uma vista deslumbrante, o atendimento foi excepcional e cada detalhe foi cuidadosamente planejado. Definitivamente superou todas as minhas expectativas. Recomendo para qualquer pessoa que busca uma experiência de viagem inesquecível.",
    date: "15 de julho, 2025",
    type: "Viagem em família",
    image: img1,
    bgColor: "from-blue-400 to-blue-600",
    hotel: {
      name: "Resort Paradise Bahia",
      location: "Costa do Sauípe, Bahia",
      stars: 5,
      amenities: ["Piscina", "Spa", "All Inclusive", "Wi-Fi"],
      category: "Resort de Luxo"
    }
  },
  {
    id: 2,
    name: "João Pedro",
    initials: "JP",
    verified: "Viajante verificado",
    rating: 4.8,
    title: "Serviço impecável e localização perfeita!",
    comment: "Fiquei hospedado por uma semana e a experiência foi fantástica. A equipe do hotel foi muito atenciosa, os quartos eram limpos e confortáveis. A localização é privilegiada, próxima a pontos turísticos importantes. Com certeza voltarei!",
    date: "8 de julho, 2025",
    type: "Viagem de negócios",
    image: img1,
    bgColor: "from-green-400 to-green-600",
    hotel: {
      name: "Hotel Business Center",
      location: "Centro, São Paulo",
      stars: 4,
      amenities: ["Centro de Negócios", "Academia", "Wi-Fi", "Estacionamento"],
      category: "Hotel Executivo"
    }
  },
  {
    id: 3,
    name: "Ana Clara",
    initials: "AC",
    verified: "Viajante verificada",
    rating: 4.9,
    title: "Lua de mel dos sonhos!",
    comment: "Escolhemos este destino para nossa lua de mel e foi a decisão perfeita. O quarto tinha uma vista incrível para o mar, o spa era relaxante e as refeições estavam deliciosas. Cada momento foi especial e romântico. Recomendamos para todos os casais!",
    date: "25 de junho, 2025",
    type: "Lua de mel",
    image: img1,
    bgColor: "from-pink-400 to-pink-600",
    hotel: {
      name: "Romantic Beach Resort",
      location: "Copacabana, Rio de Janeiro",
      stars: 5,
      amenities: ["Vista para o Mar", "Spa de Casais", "Restaurante Gourmet", "Suíte Romântica"],
      category: "Resort Romântico"
    }
  }
];

const Review: React.FC = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const review = reviews[currentReview];
  return (
    <div className="Review max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg relative">
      {/* Botões de navegação */}
      <button
        onClick={prevReview}
        className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
      >
        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextReview}
        className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
      >
        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Lado esquerdo: Conteúdo da review */}
        <div className="flex-1 space-y-3">{/* Reduzi de space-y-4 para space-y-3 */}
          {/* Perfil */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${review.bgColor} rounded-full flex items-center justify-center`}>
              <span className="text-white font-bold text-xl">{review.initials}</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{review.name}</h3>
              <p className="text-gray-500 text-sm">{review.verified}</p>
            </div>
          </div>

          {/* Pontuação de estrelas */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 fill-current ${
                    star <= Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 font-medium">{review.rating}</span>
          </div>

          {/* Texto da avaliação */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg text-gray-800">
              "{review.title}"
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              {review.comment}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Avaliado em {review.date}</span>
              <span>•</span>
              <span>{review.type}</span>
            </div>
          </div>
        </div>

        {/* Lado direito: Imagem e informações do hotel */}
        <div className="flex-1 lg:flex-none lg:w-80">
          <div className="space-y-3">
            {/* Imagem do hotel */}
            <div className="relative overflow-hidden rounded-lg shadow-md">
              <img
                src={review.image}
                alt={review.hotel.name}
                className="w-full h-40 lg:h-44 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* Badge de categoria */}
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                  {review.hotel.category}
                </span>
              </div>
            </div>

            {/* Informações do hotel */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">{/* Reduzi padding e spacing */}
              {/* Nome e estrelas */}
              <div>
                <h5 className="font-bold text-lg text-gray-800">{review.hotel.name}</h5>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.hotel.stars ? 'text-yellow-400' : 'text-gray-300'
                        } fill-current`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{review.hotel.stars} estrelas</span>
                </div>
              </div>

              {/* Localização */}
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{review.hotel.location}</span>
              </div>

              {/* Comodidades */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Comodidades:</p>
                <div className="flex flex-wrap gap-1">
                  {review.hotel.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de navegação */}
      <div className="flex justify-center mt-4 space-x-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReview(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentReview
                ? 'bg-purple-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Review;
