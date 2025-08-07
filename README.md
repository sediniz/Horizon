# 🌍 Projeto Horizon

<div align="center">

![Horizon Logo](https://via.placeholder.com/200x80/6366f1/ffffff?text=HORIZON)

**Sistema web completo para uma agência de viagens digital**

[![.NET 8.0](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoftsqlserver)](https://www.microsoft.com/sql-server)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

## 📖 Sobre o Projeto

O **Horizon** é um sistema web completo para uma agência de viagens digital, desenvolvido como parte do programa **FullStack Avanade DecolaTech VI**. O sistema oferece uma plataforma moderna e intuitiva para gerenciamento de pacotes turísticos, reservas, pagamentos e usuários, com foco em usabilidade, segurança e escalabilidade.

### ✨ Principais Funcionalidades

- 🏨 **Gestão de Hotéis**: Cadastro completo com amenidades, localização e preços
- 📦 **Pacotes Turísticos**: Criação automática de pacotes com cálculo inteligente de preços
- 🔍 **Sistema de Busca Avançada**: Filtros por destino, datas, hóspedes e quartos
- 👥 **Gestão de Usuários**: Sistema de autenticação com perfis Cliente e Admin
- 💳 **Gestão de Reservas**: Processo completo de reserva com validações
- 💰 **Controle de Pagamentos**: Integração com diferentes métodos de pagamento
- ⭐ **Sistema de Avaliações**: Feedback dos clientes sobre hotéis e pacotes
- 📱 **Design Responsivo**: Interface otimizada para desktop, tablet e mobile

## 🏗️ Arquitetura do Sistema

### Backend (.NET 8.0)
- **API RESTful** com ASP.NET Core
- **Entity Framework Core** para ORM
- **SQL Server** como banco de dados
- **JWT Authentication** para segurança
- **Repository Pattern** para organização do código
- **Swagger** para documentação da API

### Frontend (React 18)
- **React** com **TypeScript** para type safety
- **React Router** para navegação SPA
- **Tailwind CSS** para estilização responsiva
- **Vite** como build tool para performance
- **Axios** para comunicação com API
- **React Hook Form** para formulários otimizados

### Banco de Dados
- **SQL Server** com Entity Framework Migrations
- **Relacionamentos bem definidos** entre entidades
- **Índices otimizados** para consultas eficientes
- **Validações de integridade** referencial

## 🛠️ Tecnologias Utilizadas

### Backend
- ![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet) **ASP.NET Core 8.0**
- ![Entity Framework](https://img.shields.io/badge/Entity%20Framework-8.0-512BD4) **Entity Framework Core**
- ![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoftsqlserver) **SQL Server 2022**
- ![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens) **JWT Authentication**
- ![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?logo=swagger) **Swagger/OpenAPI**

### Frontend
- ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) **React 18**
- ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript) **TypeScript 5.0**
- ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite) **Vite 5.0**
- ![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-3.0-06B6D4?logo=tailwindcss) **Tailwind CSS**
- ![React Router](https://img.shields.io/badge/React%20Router-6.0-CA4245?logo=reactrouter) **React Router**

## 🚀 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **[.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)** - Framework backend
- **[Node.js 18+](https://nodejs.org/)** - Runtime para frontend
- **[SQL Server 2022](https://www.microsoft.com/sql-server)** - Banco de dados
- **[Visual Studio Code](https://code.visualstudio.com/)** ou **Visual Studio 2022** - IDE recomendada
- **[Git](https://git-scm.com/)** - Controle de versão

## ⚡ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/sediniz/Horizon.git
cd Horizon
```

### 2. Configuração do Backend

#### 2.1. Navegue para o diretório do backend
```bash
cd Back-end
```

#### 2.2. Restaure os pacotes NuGet
```bash
dotnet restore
```

#### 2.3. Configure a string de conexão
Edite o arquivo `appsettings.json` e configure sua string de conexão do SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HorizonDB;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

#### 2.4. Execute as migrações do banco
```bash
dotnet ef database update
```

#### 2.5. Execute o backend
```bash
dotnet run
```
O backend estará rodando em: `https://localhost:7202`

### 3. Configuração do Frontend

#### 3.1. Navegue para o diretório do frontend
```bash
cd ../Front-end
```

#### 3.2. Instale as dependências
```bash
npm install
```

#### 3.3. Execute o frontend
```bash
npm run dev
```
O frontend estará rodando em: `http://localhost:5173`

## 📊 Estrutura do Projeto

```
ProjetoHorizon/
├── 📁 Back-end/                    # API .NET Core
│   ├── 📁 Controllers/             # Controladores da API
│   ├── 📁 Models/                  # Modelos de dados
│   ├── 📁 Data/                    # Context do Entity Framework
│   ├── 📁 Repositories/            # Camada de acesso aos dados
│   ├── 📁 Services/                # Lógica de negócio
│   ├── 📁 Migrations/              # Migrações do banco
│   └── 📄 Program.cs               # Configuração da aplicação
├── 📁 Front-end/                   # Aplicação React
│   ├── 📁 src/
│   │   ├── 📁 components/          # Componentes reutilizáveis
│   │   ├── 📁 pages/               # Páginas da aplicação
│   │   ├── 📁 api/                 # Serviços de API
│   │   ├── 📁 utils/               # Utilitários
│   │   └── 📄 main.tsx             # Ponto de entrada
│   ├── 📄 package.json             # Dependências do Node.js
│   ├── 📄 vite.config.ts           # Configuração do Vite
│   └── 📄 tailwind.config.js       # Configuração do Tailwind
└── 📄 README.md                    # Este arquivo
```

## 🎯 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Login/Registro de usuários
- Autenticação JWT
- Perfis diferenciados (Cliente/Admin)
- Proteção de rotas

### 🏨 Gestão de Hotéis
- Cadastro completo de hotéis
- Gestão de amenidades (WiFi, Piscina, Pet Friendly, etc.)
- Upload de imagens
- Controle de disponibilidade e preços

### 📦 Pacotes Turísticos
- Criação automática de pacotes
- Cálculo inteligente de preços baseado em:
  - Valor da diária do hotel
  - Duração da viagem
  - Número de pessoas
- Descrições detalhadas (até 400 caracteres)

### 🔍 Sistema de Busca
- **SmartSearch**: Busca inteligente por destinos
- Filtros por:
  - Destino (busca por cidade)
  - Datas de check-in/check-out
  - Número de quartos, adultos e crianças
- Normalização de texto para busca eficiente

### 💳 Gestão de Reservas
- Processo completo de reserva
- Cálculo automático de valores
- Controle de status das reservas
- Histórico de reservas por usuário

### ⭐ Sistema de Avaliações
- Avaliações de hotéis pelos clientes
- Sistema de notas e comentários
- Média de avaliações por hotel

## 🎨 Interface do Usuário

### 🌟 Características do Design
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Tema Moderno**: Interface limpa com gradientes roxo/azul
- **Experiência Intuitiva**: Navegação fluida e componentes bem organizados
- **Acessibilidade**: Componentes acessíveis com boas práticas de UX

### 📱 Páginas Principais
- **Home**: Busca de pacotes com calendário inline
- **Pacotes**: Listagem e filtros avançados
- **Detalhes**: Informações completas do pacote/hotel
- **Admin**: Painel de gestão para administradores
- **Perfil**: Gestão de conta do usuário

## 🛡️ Segurança

- **Autenticação JWT** com tokens seguros
- **Validação de dados** no frontend e backend
- **Sanitização** de inputs do usuário
- **CORS** configurado adequadamente
- **Validações de negócio** em múltiplas camadas

## 📈 Performance

- **Vite** para build rápido do frontend
- **Lazy Loading** de componentes React
- **Índices otimizados** no banco de dados
- **Repository Pattern** para queries eficientes
- **Caching** de dados frequentes

## Design e Prototipação

### Modelagem de Dados
O projeto foi modelado utilizando **Miro** para definição da arquitetura e relacionamentos entre entidades:

🔗 **[Visualizar Modelagem no Miro](https://miro.com/app/board/uXjVJfeCSKY=/)**

### Prototipação de Interface
O design das interfaces foi prototipado no **Figma** com foco em UX/UI moderno e responsivo:

🔗 **[Visualizar Protótipo no Figma](https://www.figma.com/design/jt0T8bd5pGnxzguiBZ420I/Projeto-Avanade---Grupo-04?node-id=0-1&p=f&t=vBw23pXvPVm9y4hV-0)**

## 👥 Equipe

| Membro | Função | GitHub |
|--------|---------|---------|
| **Matheus Sena** | Project Owner | [@sediniz](https://github.com/sediniz) |
| **Matheus Garcia** | Full Stack Developer | [@matheusmgs22](https://github.com/garcia-profile) |
| **Lucas Roberto** | Full Stack Developer |[@DaffodilSum6788](https://github.com/DaffodilSum6788) |
| **Matheus Chaves** | Full Stack Developer | [@MateusChavito](https://github.com/MateusChavito) |
| **Manoel Santana** | Full Stack Developer | [@adreamawaken](https://github.com/adreamawaken) |
| **Raul Melo** | Full Stack Developer | [@MaedreV](https://github.com/MaedreV) |


---

<div align="center">

Desenvolvido com ❤️ pela equipe Horizon

</div>
