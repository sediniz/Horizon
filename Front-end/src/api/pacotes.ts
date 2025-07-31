import { apiRequest } from './config';

// Interface que corresponde ao modelo Pacote do backend
export interface PacoteAPI {
  pacoteId: number;
  titulo: string;
  descricao: string;
  destino: string;
  duracao: number;
  quantidadeDePessoas: number;
  valorTotal: number;
}

// Interface para filtros de busca
export interface PacoteFiltros {
  destino?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  duracao?: number;
  quantidadePessoas?: number;
}

// Função para buscar todos os pacotes
export const getAllPacotes = async (): Promise<PacoteAPI[]> => {
  try {
    const response = await apiRequest('/pacotes');
    console.log('Pacotes recebidos da API:', response);
    return response;
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    throw new Error('Falha ao carregar pacotes');
  }
};

// Função para buscar pacote por ID
export const getPacoteById = async (id: number): Promise<PacoteAPI> => {
  try {
    const response = await apiRequest(`/pacotes/${id}`);
    return response;
  } catch (error) {
    console.error(`Erro ao buscar pacote ${id}:`, error);
    throw new Error('Falha ao carregar pacote');
  }
};

// Função para buscar pacotes com filtros (implementação futura)
export const getPacotesComFiltros = async (filtros: PacoteFiltros): Promise<PacoteAPI[]> => {
  try {
    // Por enquanto retorna todos os pacotes
    // No futuro, pode implementar filtros no backend
    const allPacotes = await getAllPacotes();
    
    let pacotesFiltrados = allPacotes;
    
    // Aplicar filtros no frontend por enquanto
    if (filtros.destino) {
      pacotesFiltrados = pacotesFiltrados.filter(pacote => 
        pacote.destino.toLowerCase().includes(filtros.destino!.toLowerCase())
      );
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
    throw new Error('Falha ao criar pacote');
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
