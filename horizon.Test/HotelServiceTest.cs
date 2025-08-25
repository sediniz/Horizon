using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Implementations;
using Moq;

namespace horizon.Test;

public class HotelServiceTest

{
    private readonly Mock<IHotelRepository> _hotelRepositoryMock;// Mock do repositório de hotéis
    private readonly HotelService _hotelService;// Serviço de hotéis a ser testado

    public HotelServiceTest()
    {
        _hotelRepositoryMock = new Mock<IHotelRepository>();// Inicializa o mock do repositório
        _hotelService = new HotelService(_hotelRepositoryMock.Object);// Inicializa o serviço com o mock do repositório
    }


    [Fact]
    [Trait("categoria", "validação")]
    public async Task AddAsync_DeveLancarExcecao_SeNomeForInvalido()
    {
        // Arrange
        var hotel = new Hotel { Nome = "", ValorDiaria = 100 };

        // Act
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => _hotelService.AddAsync(hotel));

        // Assert
        Assert.Equal("O nome do hotel é obrigatório e deve ter no máximo 30 caracteres.", exception.Message);
    }



}
