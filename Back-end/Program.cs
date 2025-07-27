using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Implementations;
using Horizon.Repositories.Interface;
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
builder.Services.AddScoped<IRepository<Hotel>, HotelRepository>();
builder.Services.AddScoped<IRepository<Quarto>, QuartoRepository>();
builder.Services.AddScoped<IRepository<Avaliacao>, AvaliacaoRepository>();
builder.Services.AddScoped<IRepository<Reserva>, ReservaRepository>();

// builder.Services.AddScoped<IRepository<Pagamento>, PagamentoRepository>();
builder.Services.AddScoped<IRepository<Usuario>, UsuarioRepository>();


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
