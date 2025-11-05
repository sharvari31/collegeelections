# College Election System

A full-stack voting application for college elections built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB connection (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sharvari31/collegeelections.git
   cd collegeelections
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for root, backend, and frontend.

3. **Configure environment variables**
   
   Navigate to `backend/server/.env` and update:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   FRONTEND_ORIGIN=http://localhost:5173
   ```

### Running the Application

#### ✨ Run Both Backend & Frontend Together (Recommended)
```bash
npm start
```
This single command will start:
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:5173`

#### Run Backend Only
```bash
npm run server
```

#### Run Frontend Only
```bash
npm run client
```

#### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
collegeelections/
├── backend/
│   └── server/
│       ├── config/          # Database configuration
│       ├── controllers/     # Request handlers
│       ├── middlewares/     # Authentication & authorization
│       ├── models/          # MongoDB schemas
│       ├── routes/          # API routes
│       ├── utils/           # Helper functions
│       ├── .env             # Environment variables
│       └── server.js        # Entry point
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   └── package.json
└── package.json             # Root package file
```

## 🌐 Deployment on Render.com

### Backend Setup
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend/server && npm install`
4. Set start command: `cd backend/server && npm start`
5. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT
   - `FRONTEND_ORIGIN`: Your frontend URL (e.g., `https://your-frontend.onrender.com`)

### Frontend Setup
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `cd client && npm install && npm run build`
4. Set publish directory: `client/dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

### Important: CORS Configuration
Make sure to set `FRONTEND_ORIGIN` environment variable on your backend Render service to match your frontend URL. This prevents CORS errors.

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run both backend and frontend concurrently |
| `npm run server` | Run backend only (development mode) |
| `npm run client` | Run frontend only (development mode) |
| `npm run install-all` | Install dependencies for all projects |
| `npm run build` | Build frontend for production |

## 🔧 Technologies Used

### Frontend
- React 19
- Vite
- React Router
- Axios
- Recharts
- Zustand (State Management)
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs
- CORS

## 📝 Environment Variables

### Backend (`backend/server/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend (`.env` in client folder, if needed)
```env
VITE_API_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC License

## 👤 Author

**Sharvari Gajendragadkar**

---

For issues or questions, please open an issue on GitHub.
