# BookList Frontend

A React-based frontend for the BookList application with real-time updates and advanced UI/UX features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run linting
npm run lint

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── utils/              # Utility functions and services
│   ├── apiService.js   # Centralized API calls
│   ├── errorHandler.js # Error handling utilities
│   └── constants.js    # Application constants
├── BookUserDashboard.js    # Reader dashboard
├── BookOwnerDashboard.js   # Owner dashboard
├── App.js              # Main application component
└── config.js           # Environment configuration
```

## 🛠 Development Guidelines

### Code Quality
- ✅ **Always run linting before commits**: `npm run lint:check`
- ✅ **Use centralized error handling**: Import from `utils/errorHandler.js`
- ✅ **Use API service**: Import from `utils/apiService.js`
- ✅ **Use constants**: Import from `utils/constants.js`

### Error Prevention Checklist
- [ ] No unused imports or variables
- [ ] All API calls use centralized error handling
- [ ] All magic numbers/strings replaced with constants
- [ ] Proper error boundaries in place
- [ ] Console statements removed for production

### Pre-commit Hooks
The following scripts run automatically:
- `prebuild`: Runs linting before build
- `predeploy`: Runs type checking before deployment

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production (includes linting)
- `npm test` - Run tests
- `npm run lint` - Fix linting issues automatically
- `npm run lint:check` - Check for linting issues
- `npm run type-check` - Run linting and build check

## 🚨 Common Issues & Solutions

### Build Failures
1. **ESLint errors**: Run `npm run lint` to auto-fix
2. **Undefined variables**: Check imports and variable declarations
3. **Unused imports**: Remove or use imported items

### Deployment Issues
1. **Environment variables**: Ensure all required env vars are set
2. **Build directory**: Verify `build/` directory is created
3. **API endpoints**: Check `config.js` for correct URLs

## 📦 Dependencies

### Core
- React 18
- Material-UI (MUI)
- Socket.io Client
- Framer Motion
- Notistack

### Development
- ESLint
- ESLint Plugin Unused Imports

## 🔒 Security

- Environment variables for sensitive data
- Input validation on all forms
- XSS protection through React
- CORS configuration in backend

## 🚀 Deployment

### Environment Variables
Create `.env` files based on templates:
- `env.development` - Development settings
- `env.production` - Production settings

### Build Process
1. Install dependencies: `npm install`
2. Set environment variables
3. Run build: `npm run build`
4. Deploy `build/` directory

## 📝 Contributing

1. Follow the development guidelines
2. Run linting before committing
3. Test thoroughly before deployment
4. Update documentation as needed
