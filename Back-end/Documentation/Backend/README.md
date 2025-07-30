## Backend do Projeto Horizon

Este documento descreve a arquitetura e estrutura do backend da aplicação, desenvolvido em **.NET 8** seguindo os princípios de **Clean Architecture** e boas práticas de desenvolvimento.

## Dependências para instalação

Para o correto funcionamento do backend, é necessário instalar as seguintes dependências do NuGet:

Que são essenciais para o Entity Framework Core e a conexão com o SQL Server:

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.1
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.1
dotnet add package Microsoft.EntityFrameworkCore.Core --version 8.0.1
```

## Estrutura do Projeto

```plaintext
Backend/
├── Controllers/
├── Data/
├── Models/
├── Services/
├── Repositories/
├── Migrations/
├── Program.cs
```
## Descrição das Pastas

- **Controllers**: Contém os controladores da API, responsáveis por gerenciar as requisições HTTP e interagir com os serviços.
- **Data**: Contém a configuração do banco de dados, incluindo o contexto do Entity Framework e as migrations.
- **Models**: Define os modelos de dados utilizados na aplicação, representando as entidades do domínio.
- **Services**: Implementa a lógica de negócio da aplicação, encapsulando as regras de negócio e interações com os repositórios.
- **Repositories**: Implementa o padrão Repository, fornecendo uma abstração para o acesso aos dados, permitindo a interação com o banco de dados de forma desacoplada.
- **Migrations**: Contém as migrations do Entity Framework, que são utilizadas para gerenciar as alterações no esquema do banco de dados.
- **Program.cs**: Ponto de entrada da aplicação, onde são configurados os serviços, middlewares e o pipeline de requisições.

## Controllers 

No nosso controlador, utilizamos o padrão RESTful para expor os endpoints da API. Cada controlador é responsável por uma entidade específica do sistema, como Usuário, Pacote, Reserva, etc. 

Os métodos HTTP **(GET, POST, PUT, DELETE)** são utilizados para realizar as operações CRUD (Create, Read, Update, Delete) nas entidades.

Como exemplo, o controlador de Usuário pode ter os seguintes endpoints:
- `GET /api/usuarios`: Retorna a lista de usuários.
- `GET /api/usuarios/{id}`: Retorna um usuário específico pelo ID.
- `POST /api/usuarios`: Cria um novo usuário.
- `PUT /api/usuarios/{id}`: Atualiza um usuário existente.



## Data

A pasta Data contém a configuração do banco de dados, incluindo o contexto do Entity Framework e as migrations. 

O contexto é responsável por mapear as entidades para as tabelas do banco de dados e gerenciar as operações de CRUD.



## Models

A pasta Models define os modelos de dados utilizados na aplicação, representando as entidades do domínio. 

Cada modelo é uma classe que corresponde a uma tabela no banco de dados e contém propriedades que representam as colunas dessa tabela.

## Repositories

A pasta Repositories implementa o padrão Repository, fornecendo uma abstração para o acesso aos dados.

Isso permite que a lógica de acesso aos dados seja separada da lógica de negócio, facilitando a manutenção e os testes.

Cada repositório é responsável por uma entidade específica do sistema, como Usuário, Pacote, Reserva, etc.

Os repositórios geralmente implementam uma interface que define os métodos de acesso aos dados, como:

```csharp
public interface IUsuarioRepository
{
	Task<Usuario> GetUsuarioByIdAsync(int id);
	Task<IEnumerable<Usuario>> GetAllUsuariosAsync();
	Task<Usuario> CreateUsuarioAsync(Usuario usuario);
	Task<Usuario> UpdateUsuarioAsync(int id, Usuario usuario);
	Task DeleteUsuarioAsync(int id);
}
```


## Services

A pasta Services implementa a lógica de negócio da aplicação, encapsulando as regras de negócio e interações com os repositórios.

Cada serviço é responsável por uma funcionalidade específica do sistema, como autenticação de usuários, gerenciamento de reservas, etc.

Nós criamos interfaces para os serviços, permitindo a injeção de dependências e facilitando os testes unitários.

Como exemplo, o serviço de Usuário pode ter métodos como:

```csharp
public interface IUsuarioService
{
	Task<Usuario> GetUsuarioByIdAsync(int id);
	Task<IEnumerable<Usuario>> GetAllUsuariosAsync();
	Task<Usuario> CreateUsuarioAsync(Usuario usuario);
	Task<Usuario> UpdateUsuarioAsync(int id, Usuario usuario);
	Task DeleteUsuarioAsync(int id);
}
```

## Migrations

As migrations são utilizadas para gerenciar as alterações no esquema do banco de dados.

As migrations são geradas automaticamente pelo Entity Framework quando há alterações nos modelos de dados. Elas permitem que você atualize o banco de dados sem perder os dados existentes.

## Program.cs

O arquivo Program.cs é o ponto de entrada da aplicação, onde são configurados os serviços, middlewares e o pipeline de requisições.


Para o funcionamento completo da aplicação, as seguintes configurações foram adicionadas:

#### 1. Configuração do Entity Framework e Banco de Dados

```csharp
builder.Services.AddDbContext<HorizonDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

#### 2. Configuração de Repositórios e Serviços
```csharp
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
```

