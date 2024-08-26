# E-Shop MERN Stack Application

## Project Overview

E-Shop is a full-stack e-commerce application built using the MERN stack (MongoDB, Express, React, Node.js). This project serves as a minimal setup template for React with Vite, providing a modern frontend build tool with Hot Module Replacement (HMR) and some ESLint rules. The backend is powered by Express and MongoDB, with JWT-based authentication and other essential features.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Scripts](#scripts)
- [License](#license)

## Features

- User authentication & authorization with JWT
- Product management
- Shopping cart functionality
- Order processing
- Responsive design with Material-UI
- API documentation with Swagger
- Unit testing with Jest

## Technologies Used

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Nodemailer
- Swagger

### Frontend

- React
- Vite
- Redux Toolkit
- Material-UI
- Axios
- React Router
- UUID

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository:
   git clone https://github.com/marius-pieptea/e-shop.git
   cd e-shop
2. Install the dependencies for both backend and frontend:
    cd backend
    npm install
    cd ../frontend
    npm install

## Backend Setup

1. Create a .env file in the backend directory and add the following environment variables:
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
2. Start the backend server:
    npm start

## Frontend Setup

1. Start the development server:
    npm run dev
2. Open your browser and navigate to http://localhost:5173.

## Scripts

### Backend
    npm start: Runs the server using node server.js.
    npm test: Runs the tests using jest.

### Frontend
    npm run dev: Starts the development server using vite.
    npm run build: Builds the production-ready application using vite build.
    npm run lint: Runs ESLint to check the codebase for potential errors.
    npm run preview: Starts the development server with a preview feature using vite preview.

## License
This project is licensed under the ISC License.
