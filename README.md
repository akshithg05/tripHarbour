# 🌊 TripHarbour

TripHarbour is a powerful and scalable RESTful API designed to streamline tour management, user authentication, and review handling. Built for travel businesses, tour operators, and adventure enthusiasts, TripHarbour enables seamless interaction with a comprehensive tour database. Users can browse and filter tours, view statistics, manage bookings, and leave detailed reviews.

The API also supports secure user authentication, profile management, and password recovery, making it easy to integrate with travel platforms. With an intuitive structure and robust CRUD operations, TripHarbour ensures an efficient and user-friendly experience for both developers and end users. Whether you're building a travel booking app or a tour recommendation engine, TripHarbour is your all-in-one solution for managing travel experiences.

## 🚀 Live Demo

🌐 [Visit TripHarbour](https://tripharbour.onrender.com/)

## 📚 API Documentation

📘 [View Full API Docs](https://documenter.getpostman.com/view/28453867/2sAYkAQ2Wx)

## ✨ Features

- 🔐 JWT-based Authentication (Login, Signup, Logout)
- 📧 Forgot Password with Nodemailer integration
- 💳 Secure Stripe Integration for Tour Payments
- 🗺️ Browse, filter, and book tours
- 📅 Manage bookings and see your history
- 📝 Leave and view tour reviews
- 📊 Admin dashboard for managing tours and users
- 🖼️ Clean, responsive UI with Pug templates

## 🛠 Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: Pug Templates
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Cookies
- **Payments**: Stripe
- **Emails**: Nodemailer

## How To Use 🤔

### Book a tour

- Login to the site
- Search for tours that you want to book
- Book a tour
- Proceed to the payment checkout page
- Enter the card details (Test Mood):
  ```
  - Card No. : 4242 4242 4242 4242
  - Expiry date: 02 / 22
  - CVV: 222
  ```
- Finished!

### Manage your booking

- Check the tour you have booked on the "Manage Booking" page in your user settings. You'll be automatically redirected to this
  page after you have completed the booking.

### Update your profile

- You can update your own username, profile photo, email, and password.

## API Usage

Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add:

```
- {{URL}} with your hostname as value (Eg. http://127.0.0.1:3000 or http://www.example.com)
- {{password}} with your user password as value.
```

## ⚙️ Running Locally

```bash
# Clone the repo
git clone https://github.com/akshithg05/tripharbour.git
cd tripharbour

# Install dependencies
npm install

# Add environment variables to config.env (see config.env.example)
# Create config.env and add the required environment variables

# Run the app
node server.js
