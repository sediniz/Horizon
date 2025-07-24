namespace Horizon.Models
{
    public class Reserva
    {
        public int IdReserva { get; set; }

        public Enum Status { get; set; } // Status da reserva, por exemplo, "Pendente", "Confirmada", "Cancelada"

        public required DateTime DataReserva { get; set; } // Data e hora da reserva

    }
}
