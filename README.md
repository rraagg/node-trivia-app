# Trivia App

This project is a full-stack trivia application allowing users to log in, manage trivia questions, and play a trivia game. The backend uses **Node.js** with **Express** and **GraphQL**, while the frontend is built with **Next.js**. Authentication is implemented using sessions with **Express-Session** and cookies.

---

## Features

### **1. User Authentication**
- **Register and Login**: Users can register and log in using an email and password.
- **Session Management**: User sessions are stored securely in the backend using `express-session` with a MongoDB session store.
- **Middleware Protection**: Middleware ensures protected routes (e.g., `/questions`, `/play-trivia`) are only accessible to authenticated users.

### **2. Trivia Questions Management**
- **Add Questions**: Admins can add new trivia questions with multiple-choice answers and categories.
- **Update/Delete Questions**: Existing questions can be edited or removed.
- **CSV Upload**: Bulk upload trivia questions via a CSV file.

### **3. Play Trivia**
- Users can play a trivia game by selecting categories and the number of questions.
- The game randomizes the order of questions and answers.
- Users receive feedback on correct or incorrect answers and a final score at the end of the game.

### **4. Search and Pagination**
- **Search**: Filter trivia questions by keywords.
- **Pagination**: View questions in paginated format.

---

## Tech Stack

### **Frontend**
- **Next.js**: React-based framework for building the user interface.
- **Apollo Client**: For GraphQL integration.
- **Tailwind CSS**: For styling the application.

### **Backend**
- **Node.js** with **Express**: Server-side framework.
- **GraphQL**: API for managing questions and categories.
- **MongoDB**: Database for storing users, questions, and sessions.
- **Express-Session**: For session management.

---

## Setup Instructions

### Prerequisites
- **Node.js**: Install [Node.js](https://nodejs.org/).
- **MongoDB**: Set up a MongoDB instance locally or via a cloud provider (e.g., MongoDB Atlas).

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd trivia-app
```

### **2. Install Dependencies**
#### Frontend:
```bash
cd frontend
npm install
```

#### Backend:
```bash
cd backend
npm install
```

### **3. Environment Variables**
Create `.env` files in both `frontend` and `backend` directories.

#### Frontend `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### Backend `.env`:
```env
PORT=4000
MONGO_URI=<your-mongodb-uri>
SESSION_SECRET=<your-secret>
```

### **4. Start the Application**
#### Backend:
```bash
cd backend
npm run dev
```

#### Frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

### **Frontend**
```
frontend/
├── app
│   ├── add-question
│   │   └── page.tsx
│   ├── play-trivia
│   │   └── page.tsx
│   ├── questions
│   │   └── page.tsx
│   ├── register
│   │   └── page.tsx
│   ├── login
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ApolloProviderWrapper.tsx
├── context
│   └── AuthContext.tsx
├── styles
│   └── globals.css
└── ...
```

### **Backend**
```
backend/
├── app.js
├── routes
│   ├── graphql.js
│   ├── register.js
│   ├── upload-csv.js
│   └── auth.js
├── models
│   ├── User.js
│   └── Question.js
├── graphql
│   ├── resolvers.js
│   └── typeDefs.js
├── utils
│   └── logger.js
├── config
│   └── db.js
└── ...
```

---

## API Endpoints

### **GraphQL (Backend)**
- **Endpoint**: `/graphql`

#### Example Query:
```graphql
query GetQuestions($categories: [String!], $numQuestions: Int!) {
  getQuestions(categories: $categories, numQuestions: $numQuestions) {
    id
    questionText
    correctAnswer
    categories
  }
}
```

### **REST Endpoints (Backend)**
- **Register**: `POST /api/register`
- **Login**: `POST /api/auth/login`
- **Logout**: `POST /api/auth/logout`
- **Auth Status**: `GET /api/auth/auth-status`
- **Upload CSV**: `POST /api/upload-csv`

---

## Best Practices and Lessons Learned

1. **Authentication**:
   - Use `httpOnly` and `secure` cookies for session management.
   - Validate tokens in middleware to protect sensitive routes.

2. **GraphQL**:
   - Separate `typeDefs` and `resolvers` for cleaner organization.
   - Use GraphQL queries for flexible data fetching.

3. **Styling**:
   - Tailwind CSS allows for quick and consistent UI styling.

4. **Pagination and Search**:
   - Implement server-side pagination for scalable data handling.
   - Optimize search functionality to debounce input changes.

5. **Frontend and Backend Separation**:
   - Use REST for authentication and GraphQL for domain-specific data.

---

## Future Improvements
- Implement OAuth2 for social logins.
- Add role-based access control (e.g., admin vs regular user).
- Improve the UI with animations and loading indicators.
- Enhance question management with bulk edit/delete functionality.

---

## License
This project is licensed under the MIT License.

