import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7202/api';

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const apiRequest = async (
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: AxiosRequestConfig = {
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    ...options,
    url,
    method: options.method || 'GET',
  };

  try {
    console.log(`🌐 Fazendo requisição: ${config.method?.toUpperCase()} ${url}`);
    if (config.data) {
      console.log('📤 Dados enviados:', config.data);
    }
    
    const response = await axios(config);
    console.log(`✅ Resposta recebida: ${response.status}`, response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ API Request Error:', error);
    console.error('🔗 URL da requisição:', url);
    console.error('⚙️ Configuração:', config);
    
    if (error.response) {
      console.error('📝 Resposta do servidor:', error.response.data);
      console.error('🔢 Status:', error.response.status);
      console.error('🏷️ Headers:', error.response.headers);
      
      // Log detalhado dos erros de validação
      if (error.response.data?.errors) {
        console.error('🚨 Erros de validação detalhados:', error.response.data.errors);
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          console.error(`❌ Campo "${field}":`, messages);
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
      console.error('📡 Nenhuma resposta recebida:', error.request);
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } else {
      console.error('⚠️ Erro na configuração:', error.message);
      throw new Error(`Erro na requisição: ${error.message}`);
    }
  }
};
