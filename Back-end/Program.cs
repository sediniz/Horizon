using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Implementations;
using Horizon.Repositories.Interface;
using Horizon.Services.Implementations;
using Horizon.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuração do DbContext
builder.Services.AddDbContext<HorizonDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registro do repositorio
builder.Services.AddScoped<Horizon.Services.Interfaces.IService<Quarto>, QuartoService>();
builder.Services.AddScoped<Horizon.Services.Interfaces.IService<Avaliacao>, AvaliacaoService>();
builder.Services.AddScoped<Horizon.Services.Interfaces.IService<Reserva>, ReservaService>();
builder.Services.AddScoped<Horizon.Services.Interfaces.IService<Pagamento>, PagamentoService>();
builder.Services.AddScoped<Horizon.Services.Interfaces.IService<Usuario>, UsuarioService>();
builder.Services.AddScoped<IPacote, PacoteService>();

// Configuração do JWT
var jwtKey = "Wksv5Ypv"; // Troque por uma chave forte em produção

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication(); // Adicione esta linha para JWT funcionar
app.UseAuthorization();

app.MapControllers();

app.Run();





