import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 text-gray-800 py-12">
      <style>{`
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass-effect rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
          {/* Navegação principal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Seção Hospedagem */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Hospedagem</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Acomodações</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Hotéis</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Pousadas</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Resorts</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Apartamentos</a></li>
              </ul>
            </div>

            {/* Seção Experiências */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Experiências</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Passeios</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Aventuras</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Cultura Local</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Gastronomia</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Atividades</a></li>
              </ul>
            </div>

            {/* Seção Suporte */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Central de Ajuda</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Cancelamento</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Opções de segurança</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Contato</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Feedback</a></li>
              </ul>
            </div>

            {/* Seção Empresa */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Horizon Travel</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Sobre nós</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Carreiras</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Imprensa</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Investidores</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors text-sm">Blog</a></li>
              </ul>
            </div>
          </div>

          {/* Linha divisória */}
          <div className="border-t border-gray-300/30 pt-8">
            {/* Informações de contato */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Telefone</h4>
                    <span className="text-gray-600 text-sm">(11) 99999-9999</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Email</h4>
                    <span className="text-gray-600 text-sm">contato@horizon.com</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Localização</h4>
                    <span className="text-gray-600 text-sm">São Paulo, Brasil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção inferior com copyright e links legais */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>&copy; 2025 Horizon Travel, Inc.</span>
                <span>•</span>
                <a href="#" className="hover:text-sky-600 transition-colors">Privacidade</a>
                <span>•</span>
                <a href="#" className="hover:text-sky-600 transition-colors">Termos</a>
                <span>•</span>
                <a href="#" className="hover:text-sky-600 transition-colors">Mapa do site</a>
                <span>•</span>
                <a href="#" className="hover:text-sky-600 transition-colors">Informações da empresa</a>
              </div>

              {/* Redes sociais */}
              <div className="flex items-center gap-4">
                <a href="#" className="w-8 h-8 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.45 8.87 8 9.8v-6.93h-2.4v-2.87H10V9.63c0-2.38 1.42-3.69 3.59-3.69 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.87H13V21.8c4.55-.93 8-4.96 8-9.8z"/>
  </svg>
</a>
                <a href="#" className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.402-.293 1.19-.334 1.358-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;