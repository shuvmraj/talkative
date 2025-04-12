# Talkative Chat App - Backend

This is the backend server for the Talkative real-time chat application. It provides APIs for user authentication, friend management, chat functionality, and real-time messaging.

## Features

- User registration and authentication using JWT
- Friend adding functionality through unique usernames
- Real-time messaging with Socket.io
- Password recovery via email
- Chat management (create, update, delete)

## Technologies Used

- Node.js and Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Nodemailer for email services

## Prerequisites

- Node.js (v14+)
- MongoDB connection (local or Atlas)
- Gmail account for sending emails

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_email
EMAIL_PASSWORD=your_gmail_app_password
```

## Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### User Routes

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/forgot-password` - Recover password
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/update-profile` - Update user profile
- `GET /api/users/find/:username` - Find user by username
- `POST /api/users/add-friend` - Add a friend

### Chat Routes

- `POST /api/chats` - Access or create a chat
- `GET /api/chats` - Get all chats for a user
- `POST /api/chats/group` - Create a group chat
- `PUT /api/chats/:chatId/wallpaper` - Update chat wallpaper
- `DELETE /api/chats/:chatId` - Delete a chat

### Message Routes

- `POST /api/messages` - Send a message
- `GET /api/messages/:chatId` - Get all messages in a chat
- `DELETE /api/messages/:messageId` - Delete a message

## Socket Events

- `user_connected` - User has connected
- `join_chat` - User joins a chat room
- `send_message` - User sends a message
- `receive_message` - Receive a new message
- `user_disconnected` - User has disconnected

## Security Note

This application stores passwords in plain text as per requirement for the password recovery feature. In a production environment, it is recommended to use proper password hashing for security.

## License

MIT 