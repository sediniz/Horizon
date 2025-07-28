using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Implementations;
using Horizon.Repositories.Interface;
using Horizon.Services.Implementations;
using Horizon.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuração do DbContext
builder.Services.AddDbContext<HorizonDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registro do repositorio
//builder.Services.AddScoped<IService<Hotel>, HotelService>();
builder.Services.AddScoped<IService<Quarto>, QuartoService>();
builder.Services.AddScoped<IService<Avaliacao>, AvaliacaoService>();
//builder.Services.AddScoped<IServicey<Reserva>, ReservaService>();

// builder.Services.AddScoped<IService<Pagamento>, PagamentoService>();
builder.Services.AddScoped<IService<Usuario>, UsuarioService>();
// builder.Services.AddScoped<IPacote<Pacote>, PacoteService>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
