import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7202/api';

// Modo de desenvolvimento - permite fallback para mock
export const isDevelopmentMode = import.meta.env.DEV;

// Função para verificar se a API está disponível
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 segundos de timeout
    });
    return response.ok;
  } catch (error) {
    console.warn('API não está disponível:', error);
    return false;
  }
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Função para obter o token do localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('horizon_token');
};

// Criar instância do axios com interceptadores
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: defaultHeaders,
});

// Interceptor para adicionar automaticamente o token a todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Token adicionado à requisição: ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.log(` Nenhum token encontrado para: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error(' Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas de erro (ex: token expirado)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Resposta recebida: ${response.status} para ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('Token inválido ou expirado. Redirecionando para login...');
      // Limpar token inválido
      localStorage.removeItem('horizon_token');
      localStorage.removeItem('horizon_user');
      // Redirecionar para login ou página inicial
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const apiRequest = async (
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  try {
    console.log(`Fazendo requisição: ${options.method?.toUpperCase() || 'GET'} ${endpoint}`);
    
    if (options.data) {
      console.log('Dados enviados:', options.data);
    }
    
    const response = await apiClient({
      url: endpoint,
      method: options.method || 'GET',
      ...options,
    });
    
    console.log(`Resposta recebida: ${response.status}`, response.data);
    return response.data;
  } catch (error: any) {
    console.error('API Request Error:', error);
    console.error('Endpoint da requisição:', endpoint);
    console.error('Opções:', options);
    
    if (error.response) {
      console.error('Resposta do servidor:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      
      // Log detalhado dos erros de validação
      if (error.response.data?.errors) {
        console.error('Erros de validação detalhados:', error.response.data.errors);
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          console.error(`Campo "${field}":`, messages);
        });
      }
      
      // Tentar extrair mensagem mais específica
      let errorMessage = `HTTP error! status: ${error.response.status}`;
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage += ` - ${error.response.data}`;
        } else if (error.response.data.message) {
          errorMessage += ` - ${error.response.data.message}`;
        } else if (error.response.data.title) {
          errorMessage += ` - ${error.response.data.title}`;
        } else if (error.response.data.errors) {
          // Erro de validação do ASP.NET Core
          const validationErrors = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          errorMessage += ` - Validation errors: ${validationErrors}`;
        }
      }
      
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('Nenhuma resposta recebida:', error.request);
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } else {
      console.error('Erro na configuração:', error.message);
      throw new Error(`Erro na requisição: ${error.message}`);
    }
  }
};
