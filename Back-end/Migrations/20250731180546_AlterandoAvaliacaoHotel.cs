using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Horizon.Migrations
{
    /// <inheritdoc />
    public partial class AlterandoAvaliacaoHotel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IdPacote",
                table: "Avaliacoes",
                newName: "hotelId");

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_hotelId",
                table: "Avaliacoes",
                column: "hotelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Avaliacoes_Hoteis_hotelId",
                table: "Avaliacoes",
                column: "hotelId",
                principalTable: "Hoteis",
                principalColumn: "HotelId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Avaliacoes_Hoteis_hotelId",
                table: "Avaliacoes");

            migrationBuilder.DropIndex(
                name: "IX_Avaliacoes_hotelId",
                table: "Avaliacoes");

            migrationBuilder.RenameColumn(
                name: "hotelId",
                table: "Avaliacoes",
                newName: "IdPacote");
        }
    }
}
