// Funções para consumir a API de Pacotes
export interface Pacote {
  pacoteId: number;
  titulo: string;
  descricao: string;
  destino: string;
  duracao: number;
  quantidadeDePessoas: number;
  valorTotal: number;
}

const API_URL = '/api/pacotes';

export async function getPacoteById(id: number): Promise<Pacote> {
  const resp = await fetch(`${API_URL}/${id}`);
  if (!resp.ok) throw new Error('Erro ao buscar pacote');
  return resp.json();
}

export async function updatePacote(pacote: Pacote): Promise<void> {
  const resp = await fetch(`${API_URL}/${pacote.pacoteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pacote),
  });
  if (!resp.ok) throw new Error('Erro ao atualizar pacote');
}
