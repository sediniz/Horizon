import React, { useState } from 'react';
import { useAvaliacoes } from '../../../hooks/useAvaliacoes';
import type { AvaliacaoFormatada } from '../../../services/avaliacaoService';

const Review: React.FC = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const { reviews, loading, error } = useAvaliacoes();

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Loading state
  if (loading) {
    return (
      <div className="Review max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Carregando avaliações...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && reviews.length === 0) {
    return (
      <div className="Review max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se não há reviews, não renderiza o componente
  if (!loading && reviews.length === 0) {
    return null;
  }

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
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
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

              {/* Informações do hotel */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{review.hotel.rooms} quartos</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>R$ {review.hotel.dailyRate.toLocaleString('pt-BR')}/noite</span>
                </div>
              </div>

              {/* Descrição do hotel */}
              {review.hotel.description && (
                <div>
                  <p className="text-xs text-gray-600 italic">{review.hotel.description}</p>
                </div>
              )}

              {/* Comodidades */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Comodidades:</p>
                <div className="flex flex-wrap gap-1">
                  {review.hotel.amenities.map((amenity: string, index: number) => (
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
        {reviews.map((_: AvaliacaoFormatada, index: number) => (
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

      {/* Status da fonte dos dados (apenas para desenvolvimento) */}
      {error && (
        <div className="text-center mt-2">
          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
            Exibindo dados de exemplo
          </span>
        </div>
      )}
    </div>
  );
};

export default Review;
