# Disaster Management System - Optimized & Production Ready

A comprehensive disaster management system for Sri Lanka, built with React and Node.js/Express. This system helps coordinate disaster response, manage help requests, track missing persons, and coordinate volunteers.

## 🚀 Quick Start

### Backend Setup
```bash
cd BackEnd
npm install
cp .env.example .env
# Edit .env with your MongoDB credentials
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📦 Production Deployment

### Backend
```bash
cd BackEnd
npm install
# Configure .env for production
node app.js
```

### Frontend
```bash
cd frontend
npm install
npm run build
# Serve the build folder with your web server
```

## 🔧 Environment Configuration

Create a `.env` file in the BackEnd directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=production
```

## ✨ Recent Optimizations

### Performance Improvements
- ✅ Removed all debug console.logs for faster response times
- ✅ Removed request logging middleware
- ✅ Optimized MongoDB connection settings
- ✅ Removed unused frontend dependencies (17 packages)
- ✅ Zero compilation warnings in production build

### Code Quality
- ✅ Clean, maintainable code
- ✅ Environment-based configuration
- ✅ Proper error handling without verbose logging
- ✅ ESLint compliant code
- ✅ Accessibility improvements

### Security
- ✅ Credentials moved to environment variables
- ✅ .gitignore configured to protect sensitive files
- ✅ JWT-based authentication

## 🎯 Features

### User Features
- Report help requests during disasters
- Report and search for missing persons
- Register as volunteer
- View active disasters
- Personal dashboard

### Admin Features
- Approve/reject help requests as active disasters
- Manage volunteers
- Manage users
- View comprehensive statistics
- Monitor all activities

### System Features
- Real-time disaster tracking
- Image upload support (Base64)
- Pagination and filtering
- Search functionality
- Responsive design

## 📊 API Endpoints

### Help Requests
- `POST /api/help-requests` - Create help request
- `GET /api/help-requests` - Get all help requests (with pagination)
- `GET /api/help-requests/:id` - Get specific help request
- `PUT /api/help-requests/:id/status` - Update status
- `DELETE /api/help-requests/:id` - Delete request

### Active Disasters
- `GET /api/active-disasters` - Get all active disasters
- `POST /api/active-disasters` - Create disaster (admin)
- `GET /api/active-disasters/stats` - Get statistics

### Missing Persons
- `POST /api/missing-persons` - Report missing person
- `GET /api/missing-persons/search` - Search missing persons
- `GET /api/missing-persons` - Get all reports

### Users & Authentication
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

### Volunteers
- `POST /api/volunteers` - Submit volunteer application
- `GET /api/volunteers` - Get all volunteers
- `PUT /api/volunteers/:id/status` - Update status

### Admins
- `POST /api/admins/register` - Register admin
- `POST /api/admins/login` - Admin login

## 🛠️ Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- dotenv for configuration

### Frontend
- React 19
- React Router DOM
- Axios
- jsPDF for PDF generation

## 📝 Development Notes

### Code Standards
- No console.logs in production code
- Environment variables for configuration
- Clean, commented code
- Error handling without verbose logging
- ESLint compliant

### Database Optimization
- Connection pooling (10 max, 2 min)
- Lean queries for better performance
- Indexed fields for fast searches
- Pagination support

## 🔒 Security Best Practices

- Never commit `.env` file
- Use strong JWT secrets in production
- Keep dependencies updated
- Use HTTPS in production
- Validate all user inputs
- Hash passwords with bcrypt

## 📈 Performance Tips

- Images are excluded by default in list queries (use `includeImages=true` if needed)
- Use pagination for large datasets
- MongoDB connection pooling configured
- Production build minified and optimized

## 🆘 Support

For issues or questions, please refer to the documentation or contact the development team.

---

**Version:** 2.0 (Optimized)  
**Last Updated:** January 2026  
**Status:** Production Ready ✅
