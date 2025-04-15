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

Check [TripHarbour API Documentation](https://documenter.getpostman.com/view/28453867/2sAYkAQ2Wx) for more info.

<b> API Features: </b>

Tours List 👉🏻 https://tripharbour.onrender.com/api/v1/tours 

Tours State 👉🏻 https://tripharbour.onrender.com//api/v1/tours/tour-stats

Get Top 5 Cheap Tours 👉🏻 https://tripharbour.onrender.com//api/v1/tours/top-5-cheap

Get Tours Within Radius 👉🏻 https://tripharbour.onrender.com//api/v1/tours/tours-within/200/center/34.098453,-118.096327/unit/mi

## 📚 What I Learned

This project served as a comprehensive journey through full-stack web development. Below are some of the key concepts and technologies I explored and implemented:

### 🛠️ Advanced MongoDB & Mongoose
- Designed and built scalable NoSQL data models using Mongoose.
- Implemented complex query middleware, aggregation pipelines, and advanced filtering/sorting using query strings.
- Practiced parent-child referencing to create relationships between collections.

### 🔗 Virtual Population
- Learned how to relate documents using Mongoose **virtual populate**.
- For example, each tour displays its associated reviews without embedding them in the database, keeping the data model normalized and efficient.

### 🌐 RESTful API Design
- Built a fully functional RESTful API with complete CRUD functionality.
- Incorporated features like pagination, rate limiting, and parameter sanitization.
- Modularized route handling and controller logic for scalability and clarity.

### 🔐 JWT Authentication & Authorization
- Implemented secure user authentication using **JSON Web Tokens (JWT)**.
- Managed access control through role-based permissions.
- Stored JWTs in HTTP-only cookies for added security, and created middleware to protect sensitive routes.

### ⚠️ Robust Error Handling
- Distinguished between **operational** and **programming** errors.
- Built a global error-handling middleware to return clear messages for users and detailed logs for developers.
- Used a centralized `AppError` utility class and custom error types.

### 💳 Stripe Payment Integration
- Integrated Stripe Checkout to handle real-time payments securely.
- Created dynamic checkout sessions and processed webhooks for booking confirmations.

### 🖥️ Server-Side Rendering with Pug
- Built dynamic, SEO-optimized pages using **Pug templates** and **server-side rendering (SSR)**.
- Used **Parcel** as a bundler to manage and compile front-end assets efficiently.
![image](https://github.com/user-attachments/assets/aecf0e4c-c498-42dd-b4d0-323fdef687bf)


