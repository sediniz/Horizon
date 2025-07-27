using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Horizon.Migrations
{
    /// <inheritdoc />
    public partial class CreateMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hoteis_Quartos_QuartoId",
                table: "Hoteis");

            migrationBuilder.AlterColumn<int>(
                name: "QuartoId",
                table: "Hoteis",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "Avaliacoes",
                columns: table => new
                {
                    IdAvaliacao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nota = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DataAvaliacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    IdPacote = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Avaliacoes", x => x.IdAvaliacao);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Hoteis_Quartos_QuartoId",
                table: "Hoteis",
                column: "QuartoId",
                principalTable: "Quartos",
                principalColumn: "QuartoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hoteis_Quartos_QuartoId",
                table: "Hoteis");

            migrationBuilder.DropTable(
                name: "Avaliacoes");

            migrationBuilder.AlterColumn<int>(
                name: "QuartoId",
                table: "Hoteis",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Hoteis_Quartos_QuartoId",
                table: "Hoteis",
                column: "QuartoId",
                principalTable: "Quartos",
                principalColumn: "QuartoId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
