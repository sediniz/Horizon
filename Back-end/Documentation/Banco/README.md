# Documentação do Banco de Dados - Sistema Horizon

Nessa documentação, você encontrará informações sobre o banco de dados utilizado no sistema Horizon, incluindo sua configuração, acesso, estrutura e relacionamentos entre tabelas.

Nosso objetivo é fornecer um guia completo para desenvolvedores e administradores que desejam entender e trabalhar com o banco de dados do sistema Horizon.

Nós seguimos o padrão ***Code First***, o que significa que o banco de dados é gerado a partir do código fonte do projeto. Isso garante que a estrutura do banco esteja sempre alinhada com as entidades e relacionamentos definidos no código.

## Índice
- [Visão Geral](#visão-geral)
- [Configuração do Banco](#configuração-do-banco)
- [Como Acessar o Banco](#como-acessar-o-banco)
- [Configuração do appsettings.json](#configuração-do-appsettings-json)
- [Comandos de Migration](#comandos-de-migration)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Relacionamentos](#relacionamentos)
- [Conclusão](#conclusão)

---

## Visão Geral

O sistema Horizon utiliza **SQL Server** como banco de dados principal, implementado com **Entity Framework Core** para .NET 8. O banco gerencia um sistema de reservas de hotéis com funcionalidades completas de pagamento e avaliações.

**Configurações Técnicas:**
- **SGBD:** SQL Server
- **Instância:** SQLEXPRESS
- **Nome do Banco:** HorizonDB
- **Framework:** Entity Framework Core (.NET 8)

---

## Configuração do Banco

### Pré-requisitos
- SQL Server ou SQL Server Express instalado na máquina. (Versão 21)
- .NET 8 SDK
- Entity Framework Core Tools (NuGet)

### Instalar EF Core Tools 

Execute o seguinte comando no terminal para instalar as ferramentas do Entity Framework Core:

```bash
dotnet tool install --global dotnet-ef
```

Se preferir, você também pode instalar as ferramentas do Entity Framework Core diretamente no Visual Studio. Para isso, abra o **Gerenciador de Pacotes NuGet** e busque por `Microsoft.EntityFrameworkCore.Tools`.

Ou instale através do terminal do NuGet Package Manager Console:
```bash
Install-Package Microsoft.EntityFrameworkCore.Tools
```
---

## Como Acessar o Banco

### Através do SQL Server Management Studio (SSMS)
1. **Server name:** `NOMEDOSEUPC\SQLEXPRESS`
2. **Database:** `HorizonDB`
3. **Authentication:** Windows Authentication (Trusted Connection)

Agora no aqui arquivo `appsettings.json` você pode configurar a string de conexão para o banco de dados.

Coloque o seguinte trecho no arquivo `appsettings.json` :
```json
,
  "ConnectionStrings": {
    "DefaultConnection": "Server=SEUPC\\SQLEXPRESS;Database=HorizonDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }

```

## Criando a primeira Migration

Para criar a primeira migration do banco de dados, execute o seguinte comando no terminal:
```bash
    migration add InitialCreate
```

Apos a criação da migration, você pode aplicar as alterações no banco de dados com o seguinte comando:
```bash
    update-database
```

Será criada uma migration inicial que irá criar todas as tabelas e relacionamentos necessários para o funcionamento do sistema Horizon.

## Compreendendo o Banco de Dados

Vamos compreender a pasta models em como o banco de dados é estruturado. Abaixo estão as principais tabelas e seus relacionamentos:

### Tabelas
- **Hotel**: Armazena informações sobre os hotéis.
- **Quarto**: Contém detalhes dos quartos disponíveis em cada hotel.
- **Reserva**: Registra as reservas feitas pelos usuários.
- **Pagamento**: Gerencia os pagamentos realizados para as reservas.
- **Usuario**: Armazena os dados dos usuários do sistema.
- **Avaliacao**: Permite que os usuários avaliem os hotéis e quartos.
- **Pacote**: Define pacotes de serviços adicionais oferecidos pelos hotéis.
- **TipoUsuario**: Classifica os usuários em diferentes tipos (admin, cliente, etc.).

### Resumo das Entidades

| Entidade | Atributos Principais |
|----------|---------------------|
| **Usuário** | nome, e-mail, senha (hash), telefone, CPF/passaporte, tipo (cliente, atendente, admin) |
| **Pacote** | título, descrição, destino, duração, datas disponíveis, valor, imagens/vídeos |
| **Reserva** | número, status (pendente, confirmada, cancelada), data, viajantes, pacote associado |
| **Pagamento** | forma (cartão, boleto), status, valor, comprovante, reserva associada |
| **Avaliação** | nota, comentário, data, cliente, pacote associado |


## Relacionamentos
- Um usuário pode fazer várias reservas.
- Uma reserva está associada a um pacote e um pagamento.
- Um pacote pode ter várias reservas e avaliações.
- Um pagamento está vinculado a uma única reserva.
- Um administrador pode gerenciar todos os dados do sistema.


## Conclusão
Esta documentação fornece uma visão geral do banco de dados utilizado no sistema Horizon, incluindo sua configuração, acesso e estrutura. 
Com essas informações, você deve ser capaz de trabalhar com o banco de dados de forma eficaz, seja para desenvolvimento, manutenção ou administração.
