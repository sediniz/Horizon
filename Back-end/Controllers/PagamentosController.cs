using Horizon.Models;
using Horizon.Models.Requests;
using Horizon.Repositories.Interface;
using Horizon.Services.Implementations;
using Horizon.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagamentosController : ControllerBase
    {
        private readonly IPagamentoService _pagamentoService;
        private readonly IStripeService _stripeService;
        private readonly IUsuarioService _usuarioService;
        private readonly IPacoteService _pacoteService;
        private readonly IReservaService _reservaService;

        public PagamentosController(
            IPagamentoService pagamentoService, 
            IStripeService stripeService,
            IUsuarioService usuarioService,
            IPacoteService pacoteService,
            IReservaService reservaService)
        {
            _pagamentoService = pagamentoService;
            _stripeService = stripeService;
            _usuarioService = usuarioService;
            _pacoteService = pacoteService;
            _reservaService = reservaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pagamentos = await _pagamentoService.GetAllAsync();
            return Ok(pagamentos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pagamento = await _pagamentoService.GetByIdAsync(id);
            if (pagamento == null)
            {
                return NotFound();
            }
            return Ok(pagamento);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pagamento pagamento)
        {
            await _pagamentoService.AddAsync(pagamento);
            await _pagamentoService.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = pagamento.PagamentoId }, pagamento);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Pagamento pagamento)
        {
            if (id != pagamento.PagamentoId)
            {
                return BadRequest("ID nao corresponde ao pagamento informado.");
            }
            var existingPagamento = await _pagamentoService.GetByIdAsync(id);
            if (existingPagamento == null)
            {
                return NotFound();
            }
            await _pagamentoService.UpdateAsync(pagamento);
            await _pagamentoService.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pagamento = await _pagamentoService.GetByIdAsync(id);
            if (pagamento == null)
            {
                return NotFound();
            }
            await _pagamentoService.DeleteAsync(id);
            await _pagamentoService.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("criar-intent")]
        public async Task<IActionResult> CriarIntent([FromBody] PaymentIntentRequest request)
        {
            if (request.ValorTotal <= 0)
            {
                return BadRequest(new { mensagem = "Valor total deve ser maior que zero" });
            }

            try
            {
                var intent = await _stripeService.CreatePaymentIntentAsync(request.ValorTotal);
                
                // Se não temos uma reserva, só retornamos o clientSecret sem salvar no banco
                if (!request.ReservaId.HasValue)
                {
                    return Ok(new { 
                        clientSecret = intent.ClientSecret,
                        message = "Payment intent criado com sucesso"
                    });
                }
                
                // Se temos uma reserva, criar um registro de pagamento com status pendente
                var pagamento = new Pagamento
                {
                    ReservaId = request.ReservaId.Value,
                    TipoPagamento = request.TipoPagamento ?? "Cartão de Crédito",
                    StatusPagamento = "Pendente",
                    ValorPagamento = request.ValorTotal,
                    DataPagamento = DateTime.Now,
                    StripePaymentIntentId = intent.Id,
                    StripeClientSecret = intent.ClientSecret
                };

                await _pagamentoService.AddAsync(pagamento);
                await _pagamentoService.SaveChangesAsync();

                return Ok(new { 
                    pagamentoId = pagamento.PagamentoId,
                    clientSecret = intent.ClientSecret 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao criar intent de pagamento", erro = ex.Message });
            }
        }

        [HttpPost("confirmar-pagamento-stripe")]
        public async Task<IActionResult> ConfirmarPagamentoStripe([FromBody] ConfirmarPagamentoRequest request)
        {
            try
            {
                // Verificar o status do pagamento no Stripe
                var intent = await _stripeService.GetPaymentIntentAsync(request.PaymentIntentId);
                
                if (intent.Status != "succeeded")
                {
                    return BadRequest(new { mensagem = "Pagamento não foi processado com sucesso" });
                }

                // Buscar dados do pacote se fornecido
                Pacote? pacote = null;
                if (request.PacoteId.HasValue)
                {
                    pacote = await _pacoteService.GetByIdAsync(request.PacoteId.Value);
                    if (pacote == null)
                    {
                        return NotFound(new { mensagem = "Pacote não encontrado" });
                    }
                }

                // Buscar usuário
                var usuario = await _usuarioService.GetByIdAsync(request.UsuarioId);
                if (usuario == null)
                {
                    return NotFound(new { mensagem = "Usuário não encontrado" });
                }

                // Verificar se é uma reserva existente ou nova
                var dataViagem = request.DataViagem;
                var duracaoPacote = pacote?.Duracao ?? 7; 
                
                Console.WriteLine($"💳 Processando pagamento para Pacote {request.PacoteId} - Hotel {pacote?.HotelId}");
                Console.WriteLine($"📅 Datas: {dataViagem:yyyy-MM-dd} até {dataViagem.AddDays(duracaoPacote):yyyy-MM-dd}");
                
                Reserva reserva;
                
                if (request.ReservaId.HasValue && request.ReservaId.Value > 0)
                {
                    // Se temos uma reserva existente, atualizá-la
                    Console.WriteLine($" Atualizando reserva existente: {request.ReservaId}");
                    
                    reserva = await _reservaService.GetByIdAsync(request.ReservaId.Value);
                    if (reserva == null)
                    {
                        return NotFound(new { mensagem = "Reserva não encontrada" });
                    }
                    
                    // Atualizar os dados da reserva
                    reserva.DataInicio = dataViagem;
                    reserva.DataFim = dataViagem.AddDays(duracaoPacote);
                    reserva.DataViagem = request.DataViagem;
                    reserva.QuantidadePessoas = request.QuantidadePessoas;
                    reserva.ValorTotal = (decimal)intent.Amount / 100;
                    reserva.Status = StatusReserva.Confirmada;
                    
                    // Atualizar reserva existente
                    await _reservaService.UpdateAsync(reserva);
                }
                else
                {
                    // Criar uma nova reserva
                    Console.WriteLine($"🆕 Criando nova reserva");
                    
                    reserva = new Reserva
                    {
                        UsuarioId = request.UsuarioId,
                        DataInicio = dataViagem, // Data de início da viagem
                        DataFim = dataViagem.AddDays(duracaoPacote), // Data de fim baseada na duração do pacote
                        HotelId = pacote?.HotelId, // Incluir HotelId se tiver pacote
                        DataReserva = DateTime.Now,
                        DataViagem = request.DataViagem,
                        QuantidadePessoas = request.QuantidadePessoas,
                        ValorTotal = (decimal)intent.Amount / 100,
                        PacoteId = request.PacoteId,
                        Status = StatusReserva.Confirmada 
                    };
                    
                    // Adicionar nova reserva
                    await _reservaService.AddAsync(reserva);
                }
                await _reservaService.SaveChangesAsync();

                // Criar registro de pagamento vinculado à reserva
                var pagamento = new Pagamento
                {
                    ReservaId = reserva.ReservaId,
                    TipoPagamento = "Cartão de Crédito",
                    StatusPagamento = "Aprovado",
                    ValorPagamento = (decimal)intent.Amount / 100,
                    DataPagamento = DateTime.Now,
                    StripePaymentIntentId = intent.Id,
                    StripeClientSecret = intent.ClientSecret
                };

                await _pagamentoService.AddAsync(pagamento);
                await _pagamentoService.SaveChangesAsync();

                return Ok(new { 
                    mensagem = "Pagamento confirmado e reserva criada com sucesso",
                    reservaId = reserva.ReservaId,
                    pagamentoId = pagamento.PagamentoId,
                    valorPago = (decimal)intent.Amount / 100
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao confirmar pagamento", erro = ex.Message });
            }
        }

        [HttpPost("confirmar-pagamento/{id}")]
        public async Task<IActionResult> ConfirmarPagamento(int id)
        {
            var pagamento = await _pagamentoService.GetByIdAsync(id);
            if (pagamento == null)
            {
                return NotFound(new { mensagem = "Pagamento nao encontrado" });
            }

            if (string.IsNullOrEmpty(pagamento.StripePaymentIntentId))
            {
                return BadRequest(new { mensagem = "Este pagamento nao possui um ID de intent do Stripe" });
            }

            try
            {
                var intent = await _stripeService.GetPaymentIntentAsync(pagamento.StripePaymentIntentId);

                // Verificar status do pagamento no Stripe
                if (intent.Status == "succeeded")
                {
                    pagamento.StatusPagamento = "Aprovado";
                    await _pagamentoService.UpdateAsync(pagamento);
                    await _pagamentoService.SaveChangesAsync();
                    return Ok(new { mensagem = "Pagamento aprovado com sucesso" });
                }
                else
                {
                    return Ok(new { mensagem = "Pagamento ainda nao foi processado ou foi recusado", status = intent.Status });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao confirmar pagamento", erro = ex.Message });
            }
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = Stripe.EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    "whsec_sua_chave_webhook_aqui" 
                );

                if (stripeEvent.Type == "payment_intent.succeeded") 
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;

                    // Encontrar o pagamento correspondente no banco de dados
                    var pagamentos = await _pagamentoService.GetAllAsync();
                    var pagamento = pagamentos.FirstOrDefault(p => p.StripePaymentIntentId == paymentIntent.Id);

                    if (pagamento != null)
                    {
                        pagamento.StatusPagamento = "Aprovado";
                        await _pagamentoService.UpdateAsync(pagamento);
                        await _pagamentoService.SaveChangesAsync();
                    }
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro no webhook", erro = ex.Message });
            }
        }

        [HttpPost("processar")]
        public async Task<IActionResult> ProcessarPagamento([FromBody] ProcessarPagamentoRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { mensagem = "Dados de pagamento inválidos" });
            }

            try
            {
                // Validar se o UsuarioId é um número válido
                if (string.IsNullOrEmpty(request.UsuarioId) || !int.TryParse(request.UsuarioId, out int usuarioIdInt))
                {
                    return BadRequest(new { mensagem = $"ID do usuário inválido. Recebido: '{request.UsuarioId}'. Esperado: um número inteiro válido." });
                }

                
                if (usuarioIdInt != 1)
                {
                    var usuario = await _usuarioService.GetByIdAsync(usuarioIdInt);
                    if (usuario == null)
                    {
                        return BadRequest(new { mensagem = $"Usuário com ID {usuarioIdInt} não encontrado no sistema." });
                    }
                }

                // Obter informações do pacote
                var pacote = await _pacoteService.GetByIdAsync(request.PacoteId);
                if (pacote == null)
                {
                    return BadRequest(new { mensagem = "Pacote não encontrado" });
                }

                // Converter data da string para DateTime
                DateTime dataInicio;
                if (!DateTime.TryParse(request.Data, out dataInicio))
                {
                    dataInicio = DateTime.Now.AddDays(30); // Fallback: 30 dias a partir de hoje
                }

                // Calcular data de fim com base na duração do pacote
                int duracao = request.Duracao > 0 ? request.Duracao : pacote.Duracao;
                var dataFim = dataInicio.AddDays(duracao);

                // Criar uma nova reserva usando o modelo correto
                var reserva = new Reserva
                {
                    Status = StatusReserva.Confirmada,
                    DataInicio = dataInicio,
                    DataFim = dataFim,
                    UsuarioId = usuarioIdInt,
                    HotelId = pacote.HotelId
                };

                // Adicionar a reserva
                await _reservaService.AddAsync(reserva);
                await _reservaService.SaveChangesAsync();

                // Criar um pagamento associado à reserva
                var pagamento = new Pagamento
                {
                    ReservaId = reserva.ReservaId,
                    TipoPagamento = request.FormaPagamento,
                    StatusPagamento = "Aprovado",
                    ValorPagamento = request.ValorTotal,
                    DataPagamento = DateTime.Now,
                    StripePaymentIntentId = request.PaymentMethodId ?? string.Empty
                };

                // Adicionar o pagamento
                await _pagamentoService.AddAsync(pagamento);
                await _pagamentoService.SaveChangesAsync();

                // Retornar o resultado
                return Ok(new
                {
                    id = pagamento.PagamentoId.ToString(),
                    status = "aprovado",
                    valor = pagamento.ValorPagamento,
                    codigoPagamento = $"PAG{pagamento.PagamentoId}",
                    numeroPedido = $"RES{reserva.ReservaId}",
                    reservaId = reserva.ReservaId,
                    message = "Pagamento processado com sucesso"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao processar pagamento", erro = ex.Message });
            }
        }
    }


}