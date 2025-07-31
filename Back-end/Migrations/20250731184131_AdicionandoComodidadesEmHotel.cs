using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Horizon.Migrations
{
    /// <inheritdoc />
    public partial class AdicionandoComodidadesEmHotel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllInclusive",
                table: "Hoteis",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Almoco",
                table: "Hoteis",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CafeDaManha",
                table: "Hoteis",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Jantar",
                table: "Hoteis",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllInclusive",
                table: "Hoteis");

            migrationBuilder.DropColumn(
                name: "Almoco",
                table: "Hoteis");

            migrationBuilder.DropColumn(
                name: "CafeDaManha",
                table: "Hoteis");

            migrationBuilder.DropColumn(
                name: "Jantar",
                table: "Hoteis");
        }
    }
}
