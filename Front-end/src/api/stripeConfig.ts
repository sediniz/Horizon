import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe('pk_test_51RqZIDHp912zo4E6vCqAZtEsS8eEmiC4ZlIsRreSVig6tDdd5HI0croHRa4fQRYkcnqcYcTPcH1NEY9j2DzCgXDT004yRJN2Ej');

// export const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);
