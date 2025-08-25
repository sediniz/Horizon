using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Implementations;
using Moq;

namespace horizon.Test;

public class HotelServiceTest

{
    private readonly Mock<IHotelRepository> _hotelRepositoryMock;// Mock do reposit�rio de hot�is
    private readonly HotelService _hotelService;// Servi�o de hot�is a ser testado

    public HotelServiceTest()
    {
        _hotelRepositoryMock = new Mock<IHotelRepository>();// Inicializa o mock do reposit�rio
        _hotelService = new HotelService(_hotelRepositoryMock.Object);// Inicializa o servi�o com o mock do reposit�rio
    }


    [Fact]
    [Trait("categoria", "valida��o")]
    public async Task AddAsync_DeveLancarExcecao_SeNomeForInvalido()
    {
        // Arrange
        var hotel = new Hotel { Nome = "", ValorDiaria = 100 };

        // Act
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => _hotelService.AddAsync(hotel));

        // Assert
        Assert.Equal("O nome do hotel � obrigat�rio e deve ter no m�ximo 30 caracteres.", exception.Message);
    }



}
