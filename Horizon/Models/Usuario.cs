using System.ComponentModel.DataAnnotations;

namespace Horizon.Models
{
    public class Usuario
    {

        public int IdUsuario { get; set; }

        public required string Nome { get; set; }

        public required string Email { get; set; }

        public required string Senha { get; set; }

        public required string Telefone { get; set; }

        public required string Cpf_Passaporte { get; set; }

        public required string TipoUsuario { get; set; } // "Cliente", "Administrador" e "Atendente". 

    }
}
