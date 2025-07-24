namespace Horizon.Models
{
    public class Pacote
    {
        public int IdPacote { get; set; }

        public required string Titulo { get; set; } 

        public required string Descricao { get; set; } 

        public required string Destino { get; set; } 

        public int Duracao { get; set; } 

        public int QuantidadeDePessoas { get; set; } 

        public decimal valorTotal { get; set; } 


    }
}
