namespace Horizon.Models
{
    public class Avaliacao
    {
        public int IdAvaliacao { get; set; }

        public decimal Nota { get; set; }

        public string ? Comentario { get; set; }

        public DateTime DataAvaliacao { get; set; }

        public int IdUsuario { get; set; }

        public int IdPacote { get; set; }



    }
}
