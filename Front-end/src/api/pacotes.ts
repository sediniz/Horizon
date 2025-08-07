import { apiRequest } from './config';
import type { HotelAPI } from './hoteis';

// Interface que corresponde ao modelo Pacote do backend
export interface PacoteAPI {
  pacoteId: number;
  titulo: string;
  descricao: string;
  destino: string;
  duracao: number;
  quantidadeDePessoas: number;
  valorTotal: number;
  hotelId: number; 
  hotel?: HotelAPI; 
}

// Interface para filtros de busca
export interface PacoteFiltros {
  destino?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  duracao?: number;
  quantidadePessoas?: number;
}

// Dados mock para fallback quando a API falha
const pacotesMock: PacoteAPI[] = [
  {
    pacoteId: 1,
    titulo: "Cancún Paradise - 7 Dias de Sonho",
    descricao: "Uma experiência única no Caribe mexicano com praias paradisíacas, cultura rica e gastronomia excepcional. Inclui hotel all-inclusive, passeios e muito mais.",
    destino: "Cancún, México",
    duracao: 7,
    quantidadeDePessoas: 2,
    valorTotal: 4999.99,
    hotelId: 1,
    hotel: {
      hotelId: 1,
      quantidadeDeQuartos: 300,
      nome: "Hotel Paradise Cancún",
      localizacao: "Zona Hoteleira, Cancún",
      descricao: "Luxuoso resort all-inclusive com vista para o mar do Caribe",
      estacionamento: true,
      petFriendly: false,
      piscina: true,
      wifi: true,
      cafeDaManha: true,
      almoco: true,
      jantar: true,
      allInclusive: true,
      datasDisponiveis: "2025-01-01,2025-12-31",
      valorDiaria: 350.00,
      imagens: "/images/cancun-paradise.jpg"
    }
  },
  {
    pacoteId: 2,
    titulo: "Paris Romance - 5 Dias Inesquecíveis",
    descricao: "Descubra a cidade do amor com este pacote romântico incluindo hospedagem em hotel boutique e tours pelos principais pontos turísticos.",
    destino: "Paris, França",
    duracao: 5,
    quantidadeDePessoas: 2,
    valorTotal: 6999.99,
    hotelId: 2,
    hotel: {
      hotelId: 2,
      quantidadeDeQuartos: 85,
      nome: "Hotel Le Marais",
      localizacao: "Le Marais, Paris",
      descricao: "Charme parisiense no coração da cidade histórica",
      estacionamento: false,
      petFriendly: true,
      piscina: false,
      wifi: true,
      cafeDaManha: true,
      almoco: false,
      jantar: false,
      allInclusive: false,
      datasDisponiveis: "2025-01-01,2025-12-31",
      valorDiaria: 280.00,
      imagens: "/images/paris-le-marais.jpg"
    }
  }
];

// Função para buscar todos os pacotes com fallback
export const getAllPacotes = async (): Promise<PacoteAPI[]> => {
  try {
    console.log('🔍 Buscando todos os pacotes na API...');
    const response = await apiRequest('/pacotes');
    console.log('✅ Pacotes recebidos da API:', response);
    return response;
  } catch (error) {
    console.warn('⚠️ Erro na API para todos os pacotes, usando dados mock:', error);
    
    // Fallback para dados mock
    console.log('✅ Retornando pacotes mock');
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return pacotesMock;
  }
};

// Função para buscar pacote por ID com fallback robusto
export const getPacoteById = async (id: number): Promise<PacoteAPI> => {
  try {
    console.log(`🔍 Buscando pacote ID ${id} na API...`);
    const response = await apiRequest(`/pacotes/${id}`);
    console.log(`✅ Pacote ${id} encontrado na API:`, response);
    return response;
  } catch (error) {
    console.warn(`⚠️ Erro na API para pacote ${id}, usando dados mock:`, error);
    
    // Fallback para dados mock em caso de erro 500 ou API indisponível
    const pacoteMock = pacotesMock.find(p => p.pacoteId === id);
    
    if (pacoteMock) {
      console.log(`✅ Pacote ${id} encontrado nos dados mock:`, pacoteMock);
      
      // Simular delay da API para realismo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return pacoteMock;
    } else {
      console.error(`❌ Pacote ${id} não encontrado nem na API nem nos dados mock`);
      throw new Error(`Pacote ${id} não encontrado. Verifique se o ID está correto.`);
    }
  }
};

export const getPacotesComFiltros = async (filtros: PacoteFiltros): Promise<PacoteAPI[]> => {
  try {
  
    const allPacotes = await getAllPacotes();
    
    let pacotesFiltrados = allPacotes;
    
    if (filtros.destino) {
      // Busca flexível - aceita nome da cidade ou destino completo
      const searchTerm = filtros.destino.toLowerCase();
      pacotesFiltrados = pacotesFiltrados.filter(pacote => {
        const destino = pacote.destino.toLowerCase();
        // Busca tanto no texto completo quanto apenas na primeira parte (cidade)
        const cityName = destino.split(',')[0].trim();
        return destino.includes(searchTerm) || cityName.includes(searchTerm);
      });
    }
    
    if (filtros.valorMinimo !== undefined) {
      pacotesFiltrados = pacotesFiltrados.filter(pacote => 
        pacote.valorTotal >= filtros.valorMinimo!
      );
    }
    
    if (filtros.valorMaximo !== undefined) {
      pacotesFiltrados = pacotesFiltrados.filter(pacote => 
        pacote.valorTotal <= filtros.valorMaximo!
      );
    }
    
    if (filtros.duracao !== undefined) {
      pacotesFiltrados = pacotesFiltrados.filter(pacote => 
        pacote.duracao === filtros.duracao
      );
    }
    
    return pacotesFiltrados;
  } catch (error) {
    console.error('Erro ao buscar pacotes com filtros:', error);
    throw new Error('Falha ao filtrar pacotes');
  }
};

// Função para criar um novo pacote (admin)
export const createPacote = async (pacote: Omit<PacoteAPI, 'pacoteId'>): Promise<PacoteAPI> => {
  try {
    const response = await apiRequest('/pacotes', {
      method: 'POST',
      data: pacote,
    });
    return response;
  } catch (error) {
    console.error('Erro ao criar pacote:', error);
    console.error('Dados que foram enviados:', pacote);
    
    // Tentar extrair mais informações do erro
    if (error instanceof Error) {
      console.error('📝 Mensagem do erro:', error.message);
      console.error('🔍 Stack trace:', error.stack);
    }
    
    throw new Error(`Falha ao criar pacote: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Função para atualizar um pacote (admin)
export const updatePacote = async (id: number, pacote: Partial<PacoteAPI>): Promise<PacoteAPI> => {
  try {
    const response = await apiRequest(`/pacotes/${id}`, {
      method: 'PUT',
      data: pacote,
    });
    
    return response;
  } catch (error) {
    console.error(`Erro ao atualizar pacote ${id}:`, error);
    throw new Error('Falha ao atualizar pacote');
  }
};

// Função para deletar um pacote (admin)
export const deletePacote = async (id: number): Promise<void> => {
  try {
    await apiRequest(`/pacotes/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Erro ao deletar pacote ${id}:`, error);
    throw new Error('Falha ao deletar pacote');
  }
};
