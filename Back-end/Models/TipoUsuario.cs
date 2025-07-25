namespace Horizon.Models
{
    public class TipoUsuario
    {
        public int IdTipoUsuario { get; set; }

        public required string Nome { get; set; } // Aqui seria a função do usuario: "Cliente", "Administrador" e "Atendente".

        public required string Descricao { get; set; } // Descrição do tipo de usuário, por exemplo, "Usuário comum", "Administrador do sistema", "Atendente de suporte".]


    }
}
