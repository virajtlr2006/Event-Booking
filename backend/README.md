# Event Booking Backend

A simple Express.js backend server for an event booking application with MongoDB integration.

## Features

- ✅ Express.js server with ES modules
- ✅ MongoDB integration with Mongoose
- ✅ CORS configuration
- ✅ Environment variables configuration
- ✅ Health check endpoint
- ✅ Ready for Clerk authentication integration

## Project Structure

```
├── config/
│   └── database.js          # MongoDB connection configuration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
└── server.js               # Main server file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. Navigate to the backend directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start MongoDB via Docker:
   ```bash
   npm run docker:up
   ```

5. Test the database connection:
   ```bash
   npm run test:connection
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`.

## Docker MongoDB Setup

This project uses Docker Compose to run MongoDB locally. See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed instructions.

### Quick Docker Commands

- `npm run docker:up` - Start MongoDB container
- `npm run docker:down` - Stop MongoDB container  
- `npm run docker:logs` - View container logs
- `npm run docker:reset` - Reset database (removes all data)
- `npm run test:connection` - Test database connection

### MongoDB Access

- **Database:** http://localhost:27017
- **Web UI:** http://localhost:8081 (MongoDB Express)
- **Credentials:** eventuser / eventpassword

## API Endpoints

### Health Check
- `GET /health` - Server health check

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventbooking
FRONTEND_URL=http://localhost:3000
```

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run docker:up` - Start MongoDB container
- `npm run docker:down` - Stop MongoDB container
- `npm run docker:logs` - View container logs
- `npm run test:connection` - Test database connection

### Next Steps

1. **Create API Routes** - Add routes for events and bookings
2. **Add Mongoose Models** - Create schemas for Events and Bookings
3. **Integrate with Clerk** - Add Clerk authentication middleware
4. **Add Validation** - Input validation for API endpoints

## Authentication

This backend is designed to work with Clerk for authentication. No JWT implementation is included as Clerk handles all authentication concerns.

## License

ISC