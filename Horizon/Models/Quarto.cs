namespace Horizon.Models
{
    public class Quarto
    {
        public int IdTiposDeQuarto { get; set; }

        public string? Descrição { get; set; }

        public bool AmbienteClimatizado { get; set; }

        public bool Tv { get; set; }

        public bool Varanda { get; set; }

        public bool Frigobar { get; set; }

        public bool Disponibilidade { get; set; }

        public decimal ValorDoQuarto { get; set; }


    }
}
