using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Implementations;
using Horizon.Repositories.Interface;
using Horizon.Services.Implementations;
using Horizon.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Substitua pela URL do seu Vite
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Controllers e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Horizon API", Version = "v1" });

    // Configuração para aceitar JWT no Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT no formato: Bearer {seu token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// DbContext
builder.Services.AddDbContext<HorizonDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositórios
builder.Services.AddScoped<IQuartoRepository, QuartoRepository>();
builder.Services.AddScoped<IAvaliacaoRepository, AvaliacaoRepository>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();
builder.Services.AddScoped<IPagamentoRepository, PagamentoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IPacoteRepository, PacoteRepository>();
builder.Services.AddScoped<IHotelRepository, HotelRepository>();

// Serviços
builder.Services.AddScoped<IQuartoService, QuartoService>();
builder.Services.AddScoped<IAvaliacaoService, AvaliacaoService>();
builder.Services.AddScoped<IReservaService, ReservaService>();
builder.Services.AddScoped<IPagamentoService, PagamentoService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IPacoteService, PacoteService>();
builder.Services.AddScoped<IHotelService, HotelService>();
builder.Services.AddScoped<IStripeService, StripeService>();

// JWT
var jwtKey = "wKsv5YpvwKsv5YpvwKsv5YpvwKsv5Ypv"; // Use uma chave mais forte em produção

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

builder.Services.AddAuthorization();

var app = builder.Build();

// Middleware
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
