# 🌊 TripHarbour

TripHarbour is a powerful and scalable RESTful API designed to streamline tour management, user authentication, and review handling. Built for travel businesses, tour operators, and adventure enthusiasts, TripHarbour enables seamless interaction with a comprehensive tour database. Users can browse and filter tours, view statistics, manage bookings, and leave detailed reviews.

The API also supports secure user authentication, profile management, and password recovery, making it easy to integrate with travel platforms. With an intuitive structure and robust CRUD operations, TripHarbour ensures an efficient and user-friendly experience for both developers and end users. Whether you're building a travel booking app or a tour recommendation engine, TripHarbour is your all-in-one solution for managing travel experiences.

## 🚀 Live Demo

🌐 [Visit TripHarbour](https://tripharbour.onrender.com/)

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

## ⚙️ Running Locally

```bash
# Clone the repo
git clone https://github.com/your-username/tripharbour.git
cd tripharbour

# Install dependencies
npm install

# Add environment variables to .env (see .env.example)

# Run the app
npm run dev
