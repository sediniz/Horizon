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
                return BadRequest("ID n�o corresponde ao pagamento informado.");
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
                
                // Criar um registro de pagamento com status pendente
                var pagamento = new Pagamento
                {
                    ReservaId = request.ReservaId,
                    TipoPagamento = request.TipoPagamento ?? "Cart�o de Cr�dito",
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

        [HttpPost("confirmar-pagamento/{id}")]
        public async Task<IActionResult> ConfirmarPagamento(int id)
        {
            var pagamento = await _pagamentoService.GetByIdAsync(id);
            if (pagamento == null)
            {
                return NotFound(new { mensagem = "Pagamento n�o encontrado" });
            }

            if (string.IsNullOrEmpty(pagamento.StripePaymentIntentId))
            {
                return BadRequest(new { mensagem = "Este pagamento n�o possui um ID de intent do Stripe" });
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
                    return Ok(new { mensagem = "Pagamento ainda n�o foi processado ou foi recusado", status = intent.Status });
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
                    "whsec_sua_chave_webhook_aqui" // Substitua pela sua chave de webhook
                );

                // Processar eventos relevantes do Stripe
                if (stripeEvent.Type == "payment_intent.succeeded") // Corrigido para usar a string literal correta
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

                // Para usuário convidado (ID 1), permitir sem verificação
                // Para outros usuários, verificar se existe no sistema
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