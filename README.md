
# Weather Monitoring App

A **Real-Time Weather Monitoring Application** built with the MERN stack (MongoDB, Express, React, Node.js) that retrieves weather data using the **OpenWeatherMap API**, performs real-time rollups and aggregates, triggers alerts, and displays weather summaries and trends.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Build Instructions](#build-instructions)
- [Docker Setup](#docker-setup)
- [Design Choices](#design-choices)
- [Running Tests](#running-tests)
- [Usage](#usage)
- [License](#license)

---

## Prerequisites

Before starting the setup, ensure you have the following dependencies installed:

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (v6.0 or higher)
- **Docker** (optional, for containerized setup)
- **Nodemon** (for development environment)
- **Git** (to clone the repository)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/weather-monitoring-app.git
   cd weather-monitoring-app
   ```

2. **Install Backend Dependencies** (Node.js/Express):
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies** (React.js):
   ```bash
   cd ../frontend
   npm install
   ```

4. **MongoDB Setup**:
   - If MongoDB is installed locally, ensure the service is running:
     ```bash
     sudo service mongod start
     ```

   - If using Docker, skip to the [Docker Setup](#docker-setup) section.

## Environment Variables

Create a `.env` file in the `backend` directory to configure environment variables for the server:

```bash
# OpenWeatherMap API Key
WEATHER_API_KEY=your-api-key-here

# MongoDB Connection URL
MONGO_URI=mongodb://localhost:27017/weatherDB

# Server Port
PORT=5000

# Alert Thresholds
TEMP_THRESHOLD=35
```

Replace `your-api-key-here` with your actual OpenWeatherMap API key.

## Build Instructions

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Start the React application:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

### Docker Setup

You can run both MongoDB and the backend service in containers using Docker.

1. **Pull MongoDB Docker Image**:
   ```bash
   docker pull mongo
   ```

2. **Run MongoDB in a Docker Container**:
   ```bash
   docker run --name weather-db -p 27017:27017 -d mongo
   ```

3. **Create a Dockerfile for Backend**:
   Create a `Dockerfile` in the backend directory:
   ```Dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

4. **Build and Run Backend Container**:
   ```bash
   docker build -t weather-backend .
   docker run -p 5000:5000 --env-file .env --name weather-app -d weather-backend
   ```

5. **Verify** that MongoDB and the backend are running correctly using:
   ```bash
   docker ps
   ```

## Design Choices

- **MERN Stack**: Chosen for its full-stack JavaScript support and ability to efficiently manage both frontend and backend operations.
  
- **Real-time Data Processing**: The backend retrieves weather data from the OpenWeatherMap API at regular intervals and processes the data for rollups and alerts. This design was chosen to handle time-series data efficiently.

- **Threshold Alerts**: Users can define thresholds (e.g., temperature above 35°C) for triggering alerts. Alerts are designed to be customizable and scalable.

- **MongoDB**: Chosen for storing historical weather data, as it allows flexible schema designs, ideal for evolving weather conditions and new data parameters.

- **React**: Used to create a dynamic user interface for displaying weather summaries, trends, and alerts in real-time.

- **Docker**: Added containerization support for easy deployment and scaling of both backend and MongoDB services.

## Running Tests

Tests are essential for validating the functionality of the app. Below are the steps to run unit tests:

1. **Backend Unit Tests**:
   Navigate to the backend directory and run:
   ```bash
   npm test
   ```

2. **Frontend Unit Tests**:
   Navigate to the frontend directory and run:
   ```bash
   npm test
   ```

## Usage

Once the app is running, you can:

- **View real-time weather data** for multiple metros (e.g., Delhi, Mumbai).
- **Set custom thresholds** for temperature alerts.
- **View daily summaries** of weather conditions, including average, max, and min temperatures.

### API Endpoints

1. **GET /api/weather/summary**: Fetch daily weather summaries.
2. **GET /api/weather/alerts**: Retrieve triggered alerts.
3. **POST /api/weather/settings**: Update user-defined alert thresholds.
