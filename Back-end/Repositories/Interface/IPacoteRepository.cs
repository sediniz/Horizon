﻿using Horizon.Models;

namespace Horizon.Repositories.Interface
{
    public interface IPacoteRepository : IService<Pacote>
    {

        // Buscar por destino
        Task<IEnumerable<Pacote>> GetByDestinoAsync(string destino);

        // Buscar por duração
        Task<IEnumerable<Pacote>> GetByDuracaoAsync(int duracao);

        // Buscar por quantidade de pessoas
        Task<IEnumerable<Pacote>> GetByQuantidadePessoasAsync(int quantidadePessoas);

        // Buscar pacotes disponíveis (filtros combinados)
        Task<IEnumerable<Pacote>> GetPacotesDisponiveis(string? destino = null,
            decimal? precoMax = null, int? duracaoMax = null);

    }
}
