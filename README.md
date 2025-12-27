# QuizHub - Knowledge Testing Platform

QuizHub is a comprehensive web application that enables users to take quizzes across various topics, track their performance in real-time, and compare their knowledge with other users through leaderboards. The platform features a modern, responsive interface and robust backend architecture.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Quiz Question Types](#quiz-question-types)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Features
- **User Authentication**: Secure registration and login with JWT token-based authentication
- **Quiz Browsing**: Browse and filter available quizzes by category and difficulty
- **Quiz Taking**: Take timed quizzes with automatic submission on time expiry
- **Real-time Results**: Instant feedback after quiz completion with detailed answer review
- **Personal Dashboard**: Track quiz history and performance statistics
- **Global Leaderboard**: Compare scores with other users across all quizzes

### Admin Features
- **Quiz Management**: Full CRUD operations for quizzes and questions
- **Quiz Categorization**: Organize quizzes by categories and difficulty levels
- **User Results Overview**: View and analyze results from all users
- **Quiz Versioning**: Support for quiz updates while maintaining result history

### Quiz Capabilities
- **Multiple Question Types**:
  - Single Choice (one correct answer)
  - Multiple Choice (multiple correct answers)
  - True/False
  - Fill in the Blank
- **Timed Quizzes**: Configurable time limits with countdown timer
- **Point System**: Weighted scoring based on question difficulty
- **Automatic Grading**: Instant score calculation and feedback

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 5.0
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: BCrypt
- **Object Mapping**: AutoMapper
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Create React App

## System Architecture

The application follows a three-tier architecture:

1. **Presentation Layer** (React Frontend)
   - Component-based UI architecture
   - Context API for state management
   - Service layer for API communication

2. **Business Logic Layer** (ASP.NET Core Backend)
   - RESTful API controllers
   - Service layer with dependency injection
   - Business logic and validation

3. **Data Access Layer** (Entity Framework Core)
   - Database context and models
   - Repository pattern
   - Migrations for schema management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- .NET 5.0 SDK
- Microsoft SQL Server (2017 or higher)
- Visual Studio 2019/2022 or VS Code (recommended)

## Installation

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd QuizHub
```

2. **Navigate to backend directory**
```bash
cd QuizHubBackend
```

3. **Restore NuGet packages**
```bash
dotnet restore
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd QuizHubFrontend
```

2. **Install dependencies**
```bash
npm install
```

## Configuration

### Backend Configuration

1. **Update `appsettings.json`** with your database connection string and JWT secret:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your_server;Database=QuizHubDB;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "SecretKey": "your-super-secret-jwt-key-min-32-characters",
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

### Frontend Configuration

1. **Create `.env` file** in the frontend root directory:

```env
REACT_APP_API_URL=http://localhost:44398
```

## Database Setup

1. **Create database migrations** (if not already present):
```bash
cd QuizHubBackend
dotnet ef migrations add InitialCreate
```

2. **Apply migrations to database**:
```bash
dotnet ef database update
```

### Database Schema

The application uses the following main tables:
- **Users**: User accounts with hashed passwords
- **Quizzes**: Quiz metadata and configuration
- **Questions**: Quiz questions with types and points
- **Answers**: Answer options with correctness flags
- **QuizResults**: User quiz completion records

## Running the Application

### Start Backend

1. **Navigate to backend directory**:
```bash
cd QuizHubBackend
```

2. **Run the application**:
```bash
dotnet run
```

The API will be available at `https://localhost:44398` (or as configured)

3. **Access Swagger documentation**:
Navigate to `https://localhost:44398/swagger` to view API documentation

### Start Frontend

1. **Navigate to frontend directory**:
```bash
cd QuizHubFrontend
```

2. **Start development server**:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/users/register
Content-Type: multipart/form-data

{
  "username": "string",
  "email": "string",
  "password": "string",
  "profileImage": "file"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: JWT token
```

### Quiz Endpoints

#### Get All Quizzes
```http
GET /api/quizzes/getAllQuizzes
```

#### Create Quiz (Admin only)
```http
POST /api/quizzes/createQuiz
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "difficulty": "Easy|Medium|Hard",
  "category": "string",
  "timeDuration": integer (seconds),
  "questions": [...]
}
```

#### Submit Quiz
```http
POST /api/quizzes/doQuiz/{quizId}
Content-Type: application/json

{
  "userId": integer,
  "quizId": integer,
  "answers": [...],
  "timeLeft": integer
}
```

#### Get User Results
```http
GET /api/quizzes/getMyResults/{userId}
Authorization: Bearer {token}
```

#### Get All Results (Admin only)
```http
GET /api/quizzes/getAllResults
Authorization: Bearer {token}
```

#### Update Quiz (Admin only)
```http
POST /api/quizzes/updateQuiz
Authorization: Bearer {token}
```

#### Delete Quiz (Admin only)
```http
PUT /api/quizzes/deleteQuiz/{quizId}
Authorization: Bearer {token}
```

### User Endpoints

#### Get All Users (Admin only)
```http
GET /api/users/getAllUsers
Authorization: Bearer {token}
```

## User Roles

### Regular User
- Browse and take quizzes
- View personal results and history
- Access global leaderboard
- Filter quizzes by category and difficulty

### Admin
- All user capabilities
- Create, update, and delete quizzes
- Manage questions and answers
- View all users' results
- Categorize and organize quizzes

## Quiz Question Types

### 1. Single Choice (OneCorrect)
- 4 answer options
- Exactly one correct answer
- User selects one option

### 2. Multiple Choice (MultipleChoice)
- Multiple answer options
- Multiple correct answers possible
- User must select all correct answers to earn points

### 3. True/False (TrueFalse)
- Binary question
- User selects True or False

### 4. Fill in the Blank (FillTheBlank)
- Text input questions
- User enters answer(s) manually
- Supports multiple blanks per question (use `___` in question text)

## Security Features

- **Password Hashing**: BCrypt with salt
- **JWT Authentication**: Secure token-based authentication
- **Token Validation**: Signature and expiration validation
- **Protected Routes**: Role-based access control
- **CORS Configuration**: Controlled cross-origin requests
- **SQL Injection Prevention**: Entity Framework parameterized queries

## Best Practices Implemented

### Backend
- Three-layer architecture with dependency injection
- Separate DTOs and database models
- RESTful API conventions
- Comprehensive error handling
- AutoMapper for object mapping
- Asynchronous operations for better performance

### Frontend
- Component-based architecture
- Service layer for API calls
- Context API for state management
- Environment variables for configuration
- Responsive design with Tailwind CSS
- Clean code organization

## Future Enhancements

Potential extensions as described in the project specification:

### Option 1: Real-time Competition (Live Quiz Arena)
- SignalR/WebSocket integration
- Live multi-user quiz rooms
- Synchronized question display
- Real-time leaderboard updates
- Bonus points for faster responses

### Option 2: Microservices Architecture
- Split into multiple microservices
- API Gateway (Ocelot) implementation
- Separate databases per service
- Activity logging to files and console
- Inter-service communication

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify SQL Server is running
   - Check connection string in `appsettings.json`
   - Ensure database exists and migrations are applied

2. **CORS Errors**
   - Verify frontend URL in `Startup.cs` CORS configuration
   - Check that both frontend and backend are running

3. **JWT Token Issues**
   - Ensure SecretKey in `appsettings.json` is at least 32 characters
   - Check token expiration time
   - Verify token is being sent in Authorization header

4. **Frontend API Calls Failing**
   - Check API URL in `.env` file
   - Ensure backend is running
   - Verify network connectivity

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



**Note**: This application is part of an academic project and should be used for educational purposes. Ensure proper security measures are implemented before deploying to production environments.
