# YogiTrack - Yoga Studio Management System

A full-stack MERN application for managing yoga studio operations including instructors, customers, class schedules, and attendance tracking.

## 🚀 Features

### Implemented (Project Part 1)

- **Instructor Management** (Use Case 1)
  - Add new instructors with duplicate name validation
  - CRUD operations for instructor data
  - Automatic ID generation (I001, I002, etc.)
  - Email/phone confirmation messages

- **Customer Management** (Use Case 4)
  - Add new customers with senior discounts
  - CRUD operations for customer data
  - Class balance tracking
  - Automatic ID generation (C001, C002, etc.)
  - Email/phone confirmation messages

### Tech Stack

- **Frontend**: React 19, React Router, Webpack, Babel
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Deployment**: Heroku with CI/CD pipeline
- **Development**: Hot reloading, modular components

## 🏗️ Architecture

```text
yogitrack/
├── src/                  # React frontend source
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   └── utils/            # API services & utilities
├── controllers/          # Express route controllers
├── models/               # MongoDB/Mongoose models
├── routes/               # Express routes
├── public/               # Static assets & built React app
└── config/               # Database configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20.x
- MongoDB (local or Atlas)
- Git

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/rghamilton3/yogitrack-prototype.git
   cd yogitrack-prototype
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file (optional for local development)
   MONGO_URI=mongodb://localhost:27017/yogidb
   PORT=8080
   ```

4. **Start development servers**

   ```bash
   # Terminal 1: Start backend server
   npm run dev:server

   # Terminal 2: Start React development server
   npm run dev
   ```

5. **Access the application**
   - Backend API: <http://localhost:8080>
   - React Dev Server: <http://localhost:3000> (with API proxy)

### Production Build

```bash
# Build React application
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Heroku Deployment

1. **Create Heroku app**

   ```bash
   heroku create your-app-name
   ```

2. **Configure environment variables**

   ```bash
   heroku config:set MONGO_URI="your-mongodb-atlas-uri"
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**

   ```bash
   git push heroku main
   ```

### CI/CD Pipeline

The project includes GitHub Actions for automated deployment:

- **On Push to Main**: Builds React app and deploys to Heroku

Required GitHub Secrets:

- `HEROKU_API_KEY`: Your Heroku API key
- `HEROKU_APP_NAME`: Your Heroku app name
- `HEROKU_EMAIL`: Your Heroku account email

## 📋 API Endpoints

### Instructors

- `GET /api/instructor/getInstructorIds` - List all instructors
- `GET /api/instructor/getInstructor?instructorId=I001` - Get instructor details
- `GET /api/instructor/getNextId` - Get next available ID
- `POST /api/instructor/add` - Add new instructor
- `POST /api/instructor/addConfirmed` - Add instructor (confirmed duplicate)
- `DELETE /api/instructor/deleteInstructor?instructorId=I001` - Delete instructor

### Customers

- `GET /api/customer/getCustomerIds` - List all customers
- `GET /api/customer/getCustomer?customerId=C001` - Get customer details
- `GET /api/customer/getNextId` - Get next available ID
- `POST /api/customer/add` - Add new customer
- `POST /api/customer/addConfirmed` - Add customer (confirmed duplicate)
- `DELETE /api/customer/deleteCustomer?customerId=C001` - Delete customer

## 🔧 Development

```bash
# Start development environment
npm run dev:server  # Backend
npm run dev         # Frontend with hot reload
```

## 📁 Project Structure

### Use Cases Implemented

1. **Add Instructor** - Complete with validation and confirmation
2. **Add Customer** - Complete with senior status and class balance

### Future Enhancements (Project Part 2)

- Package management
- Class scheduling
- Attendance tracking
- Reporting system
- Payment processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of a course assignment and is for educational purposes.

## 🏫 Academic Context

This application is developed as part of a MERN stack course project, implementing real-world yoga studio management requirements with proper software engineering practices including:

- Use case driven development
- RESTful API design
- React component architecture
- Database modeling
- CI/CD pipeline implementation
- Cloud deployment

---

**YogiTrack** - Bringing peace to yoga studio management 🧘‍♀️
