# Sistema Horizon - Documentação Técnica para Leigos

## Índice
1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Como o Sistema Funciona](#como-o-sistema-funciona)
4. [Principais Funcionalidades](#principais-funcionalidades)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [Tecnologias Utilizadas](#tecnologias-utilizadas)
7. [Guia de Instalação](#guia-de-instalação)
8. [Como Usar o Sistema](#como-usar-o-sistema)

---

## Visão Geral do Sistema

O **Sistema Horizon** é uma plataforma de turismo digital que funciona como uma agência de viagens online. Imagine como o Booking.com ou Decolar, mas focado especificamente em pacotes de viagem completos.

### O que o sistema faz:
- ✈️ **Venda pacotes de viagem** (hotel + passagem + serviços)
- 🏨 **Gerencia reservas** de hotéis e pacotes
- 💳 **Processa pagamentos** de forma segura
- ⭐ **Permite avaliações** de viagens realizadas
- 👤 **Controla perfis** de usuários
- 📱 **Interface moderna** e responsiva (funciona em celular, tablet e computador)

---

## Estrutura do Projeto

Pense no projeto como uma **casa bem organizada**, onde cada cômodo tem uma função específica:

```
📁 Horizon (A casa inteira)
├── 📁 Front-end (A parte que o usuário vê - como a fachada da casa)
│   ├── 📁 src (Onde ficam os cômodos principais)
│   │   ├── 📁 pages (Os cômodos da casa)
│   │   │   ├── 🏠 Home (Página inicial - sala de estar)
│   │   │   ├── 📦 PacotesGerais (Catálogo de viagens - quarto dos pais)
│   │   │   ├── 📋 Reserva (Histórico de reservas - escritório)
│   │   │   ├── 💳 Pagamento (Pagamentos - cofre)
│   │   │   └── 👤 Perfil (Dados pessoais - quarto pessoal)
│   │   ├── 📁 components (Peças reutilizáveis - móveis que podem ser usados em vários cômodos)
│   │   ├── 📁 api (Comunicação com o servidor - sistema elétrico da casa)
│   │   └── 📁 assets (Imagens e arquivos - decoração da casa)
│   └── 📄 Arquivos de configuração (As plantas da casa)
```

### Explicação Detalhada das Pastas:

#### 🏠 **Pages (Páginas)**
São as "telas" que o usuário vê:

- **Home**: Página inicial com busca de viagens e destaques
- **PacotesGerais**: Lista todos os pacotes disponíveis com filtros
- **InfoPacote**: Detalhes de um pacote específico
- **Reserva**: Histórico de todas as reservas do usuário
- **Pagamento**: Tela para finalizar compras
- **Perfil**: Dados pessoais do usuário
- **Admin**: Área administrativa (só para funcionários)

#### 🧩 **Components (Componentes)**
São "peças" que podem ser reutilizadas em várias páginas:

- **Header**: Cabeçalho do site (logo, menu, login)
- **Footer**: Rodapé com informações da empresa
- **Carousel**: Carrossel de imagens
- **AuthModal**: Janela de login/cadastro
- **Rating**: Sistema de estrelas para avaliações

#### 🔌 **API (Interface com o Servidor)**
Arquivos que fazem a comunicação com o banco de dados:

- **config.ts**: Configurações gerais da comunicação
- **reservas.ts**: Gerencia todas as operações de reservas
- **hoteis.ts**: Informações sobre hotéis
- **pagamento.ts**: Processamento de pagamentos
- **pacotes.ts**: Gerenciamento de pacotes de viagem

---

## Como o Sistema Funciona

### 1. **Fluxo Básico do Usuário**

```
🏠 Página Inicial 
    ↓ (usuário busca viagem)
📦 Lista de Pacotes 
    ↓ (usuário escolhe um pacote)
ℹ️ Detalhes do Pacote 
    ↓ (usuário clica "Reservar")
💳 Pagamento 
    ↓ (pagamento aprovado)
✅ Reserva Confirmada
    ↓ (após a viagem)
⭐ Avaliação da Viagem
```

### 2. **Como os Dados Fluem**

Imagine o sistema como uma **conversa entre três pessoas**:

1. **👤 Usuário (Frontend)**: "Quero ver os pacotes para Cancún"
2. **🤖 Sistema (API)**: "Vou buscar no banco de dados..."
3. **🗄️ Banco de Dados (Backend)**: "Aqui estão 15 pacotes para Cancún"
4. **🤖 Sistema (API)**: "Usuário, aqui estão os pacotes formatados"
5. **👤 Usuário (Frontend)**: Vê a lista na tela

---

## Principais Funcionalidades

### 🔍 **1. Busca e Filtros**
- Buscar por destino, data, preço
- Filtrar por categoria de hotel, avaliação
- Ordenar por preço, popularidade

### 🛒 **2. Sistema de Reservas**
- Selecionar pacote
- Escolher datas e quantidade de pessoas
- Adicionar observações especiais
- Gerar código único da reserva

### 💳 **3. Pagamentos**
- Integração com Stripe (como PagSeguro)
- Pagamento via cartão de crédito
- Parcelamento disponível
- Confirmação automática

### ⭐ **4. Sistema de Avaliações**
- Avaliar após viagem concluída
- Múltiplos critérios (limpeza, localização, serviço)
- Comentários opcionais
- Média automática de avaliações

### 👤 **5. Perfil do Usuário**
- Dados pessoais
- Histórico de viagens
- Ações rápidas (avaliar, planejar nova viagem)

---

## Fluxo de Dados

### Exemplo Prático: "Como funciona uma reserva"

1. **Usuário clica em "Reservar"**
   ```
   Tela → envia dados (pacoteId, datas, pessoas)
   ```

2. **Sistema processa**
   ```javascript
   // O código "pergunta" ao servidor
   const novaReserva = {
     pacoteId: 123,
     userId: 456,
     pessoas: 2,
     dataViagem: "2025-12-25"
   };
   ```

3. **Banco de dados salva**
   ```
   Servidor → cria nova reserva → gera ID único → confirma
   ```

4. **Usuário recebe confirmação**
   ```
   Tela mostra: "Reserva HZ2025001 confirmada!"
   ```

---

## Tecnologias Utilizadas

### 🎨 **Frontend (Parte Visual)**
- **React**: Framework para criar a interface
- **TypeScript**: JavaScript mais seguro e organizado
- **Tailwind CSS**: Estilização rápida e moderna
- **Vite**: Ferramenta de desenvolvimento rápida

### 🔧 **Ferramentas de Desenvolvimento**
- **VS Code**: Editor de código
- **Git**: Controle de versão (histórico de mudanças)
- **npm**: Gerenciador de pacotes

### 🔌 **APIs e Integrações**
- **Stripe**: Processamento de pagamentos
- **Axios**: Comunicação com o servidor
- **React Router**: Navegação entre páginas

---

## Guia de Instalação

### Pré-requisitos (O que precisa ter instalado):

1. **Node.js** (versão 18 ou superior)
   - É como o "motor" que faz o JavaScript funcionar
   - Download: https://nodejs.org

2. **VS Code** (Editor de código)
   - Onde você edita os arquivos
   - Download: https://code.visualstudio.com

3. **Git** (Controle de versão)
   - Para baixar e gerenciar o código
   - Download: https://git-scm.com

### Passos de Instalação:

1. **Baixar o projeto**
   ```bash
   git clone [url-do-repositorio]
   cd Horizon/Front-end
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```
   > Isso baixa todas as "peças" que o projeto precisa

3. **Iniciar o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   > O site ficará disponível em http://localhost:5173

---

## Como Usar o Sistema

### 👤 **Para Usuários Finais:**

1. **Acesse a página inicial**
2. **Busque por destino ou data**
3. **Escolha um pacote**
4. **Preencha os dados da reserva**
5. **Faça o pagamento**
6. **Acompanhe sua reserva na área "Minhas Reservas"**

### 👨‍💼 **Para Administradores:**

1. **Acesse a área administrativa**
2. **Cadastre novos hotéis e pacotes**
3. **Monitore reservas e pagamentos**
4. **Responda avaliações de clientes**

---

## Estrutura de Arquivos Importantes

### 📄 **package.json**
É como a "receita" do projeto. Diz quais ingredientes (bibliotecas) são necessários:

```json
{
  "name": "horizon-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.1.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.17"
  }
}
```

### ⚙️ **vite.config.ts**
Configurações de como o projeto é "construído" e executado:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
```

### 🎨 **tailwind.config.js**
Define as cores, fontes e estilos do projeto:

```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981'
      }
    }
  }
}
```

---

## Explicação do Código Principal

### 🏠 **Home.tsx (Página Inicial)**
```typescript
// Isso cria a página inicial
function Home() {
  return (
    <div>
      <Header />        {/* Cabeçalho com menu */}
      <Search />        {/* Caixa de busca */}
      <Carousel />      {/* Carrossel de destinos */}
      <ContentBlock />  {/* Blocos de conteúdo */}
      <Footer />        {/* Rodapé */}
    </div>
  );
}
```

### 📋 **ReservaHist.tsx (Histórico de Reservas)**
```typescript
// Busca as reservas do usuário
const [reservas, setReservas] = useState([]);

useEffect(() => {
  // Quando a página carrega, busca as reservas
  reservasApi.buscarReservas(userId)
    .then(setReservas)
    .catch(console.error);
}, []);
```

### 🔌 **reservas.ts (API)**
```typescript
// Função que se comunica com o servidor
async buscarReservas(userId: number) {
  // Faz uma "pergunta" para o servidor
  const response = await fetch(`/api/reservas?userId=${userId}`);
  
  // Converte a resposta para um formato que o JavaScript entende
  const dados = await response.json();
  
  // Organiza os dados no formato que nossa tela espera
  return dados.map(reserva => ({
    id: reserva.reservaId,
    codigo: `HZ${reserva.reservaId}`,
    destino: reserva.destino,
    // ... outros campos
  }));
}
```

---

## Fluxo de Desenvolvimento

### Como uma nova funcionalidade é criada:

1. **Planejamento**: "Precisamos de uma função para cancelar reservas"

2. **Backend**: Criar endpoint `/reservas/{id}/cancelar`

3. **API**: Adicionar função `cancelarReserva()` em `reservas.ts`

4. **Interface**: Criar botão "Cancelar" na tela de reservas

5. **Integração**: Conectar botão com a função da API

6. **Testes**: Verificar se tudo funciona

7. **Deploy**: Colocar no ar para os usuários

---

## Conceitos Importantes

### 🔄 **Estado (State)**
É como a "memória" temporária da tela:

```typescript
const [reservas, setReservas] = useState([]);
// reservas = lista atual de reservas
// setReservas = função para atualizar a lista
```

### 🎣 **Hooks**
São "ganchos" que conectam funcionalidades:

- `useState`: Guarda informações temporárias
- `useEffect`: Executa ações quando algo muda
- `useNavigate`: Navega entre páginas

### 🧩 **Componentes**
São "peças de lego" reutilizáveis:

```typescript
// Componente de botão que pode ser usado em qualquer lugar
function BotaoReservar({ pacoteId, preco }) {
  return (
    <button onClick={() => reservar(pacoteId)}>
      Reservar por R$ {preco}
    </button>
  );
}
```

---

## Segurança

### 🔐 **Como o sistema se protege:**

1. **Autenticação**: Só usuários logados podem fazer reservas
2. **Validação**: Todos os dados são verificados antes de serem salvos
3. **HTTPS**: Comunicação criptografada
4. **Sanitização**: Dados são "limpos" para evitar ataques
5. **Tokens**: Senhas nunca são guardadas em texto puro

---

## Manutenção e Atualizações

### 🔧 **Como manter o sistema funcionando:**

1. **Monitoramento**: Verificar se tudo está funcionando
2. **Logs**: Registrar erros para correção
3. **Backups**: Cópias de segurança dos dados
4. **Atualizações**: Manter bibliotecas sempre atualizadas
5. **Testes**: Verificar funcionalidades regularmente

---

## Glossário de Termos

- **API**: Interface que permite comunicação entre sistemas
- **Backend**: Parte do sistema que fica no servidor
- **Frontend**: Parte do sistema que o usuário vê
- **Componente**: Peça reutilizável da interface
- **Estado**: Dados temporários de uma tela
- **Hook**: Função especial do React
- **Props**: Dados passados entre componentes
- **Rota**: Caminho de uma página (ex: /home, /reservas)
- **Build**: Processo de "construir" o projeto para produção
- **Deploy**: Colocar o sistema no ar

---

## Conclusão

O Sistema Horizon é uma plataforma completa de turismo que:

- ✅ **É organizado** em pastas lógicas e fáceis de entender
- ✅ **É escalável** pode crescer sem quebrar
- ✅ **É seguro** protege dados dos usuários
- ✅ **É moderno** usa tecnologias atuais
- ✅ **É funcional** atende todas as necessidades de uma agência

Para qualquer dúvida ou melhoria, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento.

---

*Documentação criada em: Agosto de 2025*  
*Versão do Sistema: 1.0.0*  
*Última atualização: 06/08/2025*
