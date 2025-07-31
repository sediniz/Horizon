using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Horizon.Migrations
{
    /// <inheritdoc />
    public partial class AddHotelIdToPacotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "Pacotes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Pacotes_HotelId",
                table: "Pacotes",
                column: "HotelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pacotes_Hoteis_HotelId",
                table: "Pacotes",
                column: "HotelId",
                principalTable: "Hoteis",
                principalColumn: "HotelId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pacotes_Hoteis_HotelId",
                table: "Pacotes");

            migrationBuilder.DropIndex(
                name: "IX_Pacotes_HotelId",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "Pacotes");
        }
    }
}
