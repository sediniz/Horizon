using Stripe;

namespace Horizon.Services.Interfaces
{
    public interface IStripeService
    {
        Task<PaymentIntent> CreatePaymentIntentAsync(decimal amount, string currency = "brl");
        Task<PaymentIntent> GetPaymentIntentAsync(string paymentIntentId);
    }
}
