# 📚 Real-time Book Management System

A full-stack web application for managing books with real-time updates, featuring separate interfaces for book readers and book owners.

## ✨ Features

### 🎯 Core Features
- **Real-time Updates**: Live synchronization across all connected users
- **Role-based Access**: Separate interfaces for Book Readers and Book Owners
- **Book Management**: Add, edit, delete, and view books
- **Return Date Tracking**: Set and monitor book return dates
- **Favorites System**: Like/favorite books with real-time count updates
- **Search & Filter**: Find books by title or author
- **Pagination**: Efficient handling of large book collections

### 🎨 Advanced UI/UX
- **Modern Design**: Glass morphism effects and gradient backgrounds
- **Dark Theme**: Sophisticated dark color schemes
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Real-time Notifications**: Toast notifications for all actions

### 🔧 Technical Features
- **WebSocket Communication**: Socket.io for real-time updates
- **Persistent Storage**: JSON file-based data persistence
- **RESTful API**: Clean API endpoints for CRUD operations
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd booklist
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm start
   ```
   The backend will run on `http://localhost:4000`

5. **Start the frontend application**
   ```bash
   cd ../frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
booklist/
├── backend/
│   ├── server.js          # Express server with Socket.io
│   ├── books.json         # Persistent data storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── BookUserDashboard.js    # Reader interface
│   │   ├── BookOwnerDashboard.js   # Owner interface
│   │   └── ...
│   └── package.json
└── README.md
```

## 🔧 Data Persistence

### Current Implementation: JSON File Storage
The application uses a JSON file (`backend/books.json`) for data persistence. This ensures that:
- ✅ Data survives server restarts
- ✅ Data is shared across all users
- ✅ No database setup required
- ✅ Easy backup and migration

### Data Structure
```json
[
  {
    "id": 1703123456789,
    "title": "Book Title",
    "author": "Author Name",
    "returnDateTime": "2024-12-25T14:30:00.000Z",
    "favorites": ["user1", "user2"],
    "createdAt": "2024-12-20T10:00:00.000Z",
    "updatedAt": "2024-12-20T10:00:00.000Z"
  }
]
```

## 🌐 Deployment

### Option 1: Heroku Deployment

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set up environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   ```

3. **Deploy backend**
   ```bash
   cd backend
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

4. **Deploy frontend**
   ```bash
   cd ../frontend
   # Update API URL in frontend code
   npm run build
   # Deploy build folder to your hosting service
   ```

### Option 2: Vercel + Railway

1. **Deploy backend to Railway**
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Deploy automatically

2. **Deploy frontend to Vercel**
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Set build command: `npm run build`
   - Set output directory: `build`

### Option 3: Docker Deployment

1. **Create Dockerfile for backend**
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 4000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t booklist-backend ./backend
   docker run -p 4000:4000 booklist-backend
   ```

## 🔄 Data Migration & Backup

### Backup Data
```bash
# Copy the books.json file
cp backend/books.json backup/books-backup-$(date +%Y%m%d).json
```

### Restore Data
```bash
# Replace the current books.json with backup
cp backup/books-backup-20241220.json backend/books.json
```

### Database Migration (Future)
When upgrading to a proper database:

1. **Export current data**
   ```bash
   node scripts/export-data.js
   ```

2. **Import to new database**
   ```bash
   node scripts/import-data.js
   ```

## 🔒 Security Considerations

### Current Implementation
- Basic CORS configuration
- Input validation on API endpoints
- Error handling for malformed requests

### Recommended Enhancements
- **Authentication**: JWT tokens for user management
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent API abuse
- **Input Sanitization**: Protect against XSS attacks
- **HTTPS**: Secure communication in production

## 🧪 Testing

### Manual Testing
1. **Add books** through the Book Owner interface
2. **Edit books** and verify changes persist
3. **Delete books** and confirm removal
4. **Test real-time updates** with multiple browser tabs
5. **Verify return dates** are displayed correctly
6. **Test favorites** functionality

### Automated Testing (Future)
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🐛 Troubleshooting

### Common Issues

1. **Data not persisting**
   - Check file permissions for `books.json`
   - Verify the backend has write access to the directory

2. **Real-time updates not working**
   - Check Socket.io connection in browser console
   - Verify CORS configuration matches frontend URL

3. **Port conflicts**
   - Change backend port in `server.js`
   - Update frontend API calls accordingly

4. **Build errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility

### Logs
```bash
# Backend logs
cd backend
npm start

# Check books.json for data integrity
cat books.json | jq .
```

## 📈 Performance Optimization

### Current Optimizations
- Efficient pagination (9 books per page)
- Debounced search functionality
- Optimized re-renders with React hooks

### Future Enhancements
- **Caching**: Redis for frequently accessed data
- **CDN**: Static asset delivery
- **Database Indexing**: For large datasets
- **Image Optimization**: For book covers
- **Lazy Loading**: For better initial load times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the deployment documentation

---

**Note**: This application is designed for educational and demonstration purposes. For production use, consider implementing proper authentication, authorization, and database solutions. 