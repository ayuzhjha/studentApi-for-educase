# School Management REST API

A Node.js and Express.js based REST API to manage school data, including locations, and list them sorted by proximity to a given user location using the Haversine formula.

## 🚀 Features

- **Add a School**: Add new school entries containing details like name, address, latitude, and longitude.
- **List Schools by Proximity**: Retrieve a list of schools automatically sorted by their distance from a given geographic coordinate.
- **Auto-Database Initialization**: Automatically sets up the required database tables if they do not exist when the server starts.

## 🛠️ Tech Stack

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database**: MySQL (using `mysql2` with promises)
- **Environment Management**: `dotenv`
- **Development Tool**: `nodemon`

## 📋 Prerequisites

Before running the project, make sure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v14 or higher recommended)
- [MySQL](https://www.mysql.com/) database

## ⚙️ Installation & Setup

1. **Clone the repository** (if not already local)
2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory with your MySQL database credentials:
   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   DB_PORT=3306
   PORT=3000
   ```

4. **Run the Application**

   For development (uses nodemon for auto-reloading):
   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000` (or the port defined in `.env`).

## 🗄️ Database Schema

The API handles the creation of the `schools` table automatically upon startup.
- `id` (INT, Primary Key, Auto-increment)
- `name` (VARCHAR)
- `address` (VARCHAR)
- `latitude` (FLOAT)
- `longitude` (FLOAT)

## 📡 API Endpoints

### 1. Health Check
Checks if the API is up and running.

- **URL:** `/`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "School Management API is running."
  }
  ```

### 2. Add School
Adds a new school to the database.

- **URL:** `/addSchool`
- **Method:** `POST`
- **Body Parameters:**
  ```json
  {
    "name": "Springfield High",
    "address": "123 Main St, Springfield",
    "latitude": 39.7817,
    "longitude": -89.6501
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "message": "School added successfully.",
    "schoolId": 1
  }
  ```
- **Error Responses:** `400 Bad Request` or `500 Server Error`

### 3. List Schools
Lists all schools sorted by proximity to the provided geographic coordinates.

- **URL:** `/listSchools`
- **Method:** `GET`
- **Query Parameters:**
  - `latitude` (Float, Required)
  - `longitude` (Float, Required)
- **Example Request:**
  `/listSchools?latitude=39.75&longitude=-89.60`
- **Success Response:** `200 OK`
  ```json
  {
    "count": 1,
    "schools": [
      {
        "id": 1,
        "name": "Springfield High",
        "address": "123 Main St, Springfield",
        "latitude": 39.7817,
        "longitude": -89.6501,
        "distance_km": 5.52
      }
    ]
  }
  ```
- **Error Responses:** `400 Bad Request` or `500 Server Error`

## 🧠 Core Logic

**Distance Calculation:** 
The application utilizes the **Haversine formula** to measure the shortest distance over the earth's surface between two points given their latitude and longitude.

---

> _This README was generated based on the project's source code files._
