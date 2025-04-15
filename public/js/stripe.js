import axios from 'axios';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51RDkhqEd5SZgOL8vgULNZZUiHlA7FwWsFa3GS98cydudIN3x4KmdZMLlIbClKjEX5Hg88wz8S7dsFnuelog24HNG00EPUjRaJV',
  );

  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/booking/checkout-session/${tourId}`,
    );

    // 2) Redirect to Stripe checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error('Booking failed:', err);
  }
};
