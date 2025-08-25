using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Horizon.Migrations
{
    /// <inheritdoc />
    public partial class atualizaçãoBanco : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservas_Hoteis_HotelId",
                table: "Reservas");

            migrationBuilder.AlterColumn<int>(
                name: "HotelId",
                table: "Reservas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataReserva",
                table: "Reservas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DataViagem",
                table: "Reservas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PacoteId",
                table: "Reservas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuantidadePessoas",
                table: "Reservas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "ValorTotal",
                table: "Reservas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_PacoteId",
                table: "Reservas",
                column: "PacoteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservas_Hoteis_HotelId",
                table: "Reservas",
                column: "HotelId",
                principalTable: "Hoteis",
                principalColumn: "HotelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservas_Pacotes_PacoteId",
                table: "Reservas",
                column: "PacoteId",
                principalTable: "Pacotes",
                principalColumn: "PacoteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservas_Hoteis_HotelId",
                table: "Reservas");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservas_Pacotes_PacoteId",
                table: "Reservas");

            migrationBuilder.DropIndex(
                name: "IX_Reservas_PacoteId",
                table: "Reservas");

            migrationBuilder.DropColumn(
                name: "DataReserva",
                table: "Reservas");

            migrationBuilder.DropColumn(
                name: "DataViagem",
                table: "Reservas");

            migrationBuilder.DropColumn(
                name: "PacoteId",
                table: "Reservas");

            migrationBuilder.DropColumn(
                name: "QuantidadePessoas",
                table: "Reservas");

            migrationBuilder.DropColumn(
                name: "ValorTotal",
                table: "Reservas");

            migrationBuilder.AlterColumn<int>(
                name: "HotelId",
                table: "Reservas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservas_Hoteis_HotelId",
                table: "Reservas",
                column: "HotelId",
                principalTable: "Hoteis",
                principalColumn: "HotelId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
