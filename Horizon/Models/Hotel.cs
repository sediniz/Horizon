using Horizon.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class TabelaHotel
{
    
    public int HotelId { get; set; }

    public int QuantidadeDeQuartos { get; set; }
    public string Nome { get; set; }
    public string Localizacao { get; set; }
    public string Descricao { get; set; }
    public bool Estacionamento { get; set; }
    public bool PetFriendly { get; set; }
    public bool Piscina { get; set; }
    public bool Wifi { get; set; }
    public DateTime DatasDisponiveis { get; set; }

    public decimal ValorDiaria { get; set; }

    public string Imagens { get; set; }

    
    [ForeignKey("Quarto")]
    public int IdTiposDeQuarto { get; set; }

    public Quarto TipoDeQuarto { get; set; }
}