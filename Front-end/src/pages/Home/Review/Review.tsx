import React from 'react';
import img1 from '../../../assets/img1.jpeg';

const Review: React.FC = () => {
  return (
    <div className="Review max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Lado esquerdo: Conteúdo da review */}
        <div className="flex-1 space-y-4">
          {/* Perfil */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">MC</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Maria Carolina</h3>
              <p className="text-gray-500 text-sm">Viajante verificada</p>
            </div>
          </div>

          {/* Pontuação de estrelas */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 font-medium">5.0</span>
          </div>

          {/* Texto da avaliação */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xl text-gray-800">
              "Uma experiência absolutamente incrível!"
            </h4>
            <p className="text-gray-600 leading-relaxed">
              A viagem foi perfeita do início ao fim. O hotel tinha uma vista deslumbrante, 
              o atendimento foi excepcional e cada detalhe foi cuidadosamente planejado. 
              Definitivamente superou todas as minhas expectativas. Recomendo para qualquer 
              pessoa que busca uma experiência de viagem inesquecível.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Avaliado em 15 de julho, 2025</span>
              <span>•</span>
              <span>Viagem em família</span>
            </div>
          </div>
        </div>

        {/* Lado direito: Imagem grande do destino */}
        <div className="flex-1 lg:flex-none lg:w-80">
          <div className="relative overflow-hidden rounded-lg shadow-md">
            <img
              src={img1}
              alt="Destino avaliado"
              className="w-full h-64 lg:h-80 object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
