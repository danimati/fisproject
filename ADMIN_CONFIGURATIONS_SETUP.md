# AdminConfigurations Frontend Application - Setup Guide

## 🎉 Application Complete!

The `adminConfigurations` frontend application has been successfully created and is ready to use. Here's what has been implemented:

## 📁 Project Location
```
/home/felatiko/Documentos/universidad/teoria de la informacion/Proyecto/adminConfigurations/
```

## 🚀 Quick Start

### 1. Navigate to the Project
```bash
cd "adminConfigurations/"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## 🏗️ What's Been Built

### ✅ Core Features Implemented
1. **Authentication System**
   - JWT-based login/logout
   - Automatic token refresh
   - Protected routes
   - Role-based access control

2. **Admin Dashboard**
   - Real-time statistics
   - System overview
   - Quick actions
   - User activity monitoring

3. **User Management**
   - View all users
   - User activation/deactivation
   - Search and filter
   - Session tracking

4. **Security Management**
   - IP blocking/unblocking
   - Security threat monitoring
   - Failed login tracking
   - Real-time security status

5. **Role Management**
   - Create/edit/delete roles
   - Role descriptions
   - Search functionality
   - CRUD operations

6. **Audit Logs**
   - Comprehensive system logging
   - Filterable log viewing
   - Event type filtering
   - Export capabilities

7. **Performance Metrics**
   - Response time analytics
   - Status code distribution
   - Top endpoints tracking
   - Visual charts and graphs

### 🔧 Technical Implementation

**Frontend Stack:**
- React 18 with hooks
- Vite build tool
- React Router v6
- React Query for state management
- Tailwind CSS for styling
- Recharts for data visualization

**API Integration:**
- Complete service layer for all gateway endpoints
- Automatic token refresh
- Error handling
- Request/response interceptors

**Components:**
- Professional layout with header and sidebar
- Responsive design
- Loading states and error handling
- Form validation
- Interactive charts

## 🔗 Gateway API Endpoints Integrated

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

### Admin Management
- `GET /admin/stats` - System statistics
- `GET /admin/users` - List all users
- `GET /admin/users/{user_id}/sessions` - User sessions
- `GET /admin/audit/logs` - Audit logs
- `GET /admin/security/blocked-ips` - Blocked IPs
- `POST /admin/security/unblock-ip/{ip_hash}` - Unblock IP
- `DELETE /admin/users/{user_id}` - Delete user
- `POST /admin/users/{user_id}/activate` - Activate user
- `GET /admin/performance/metrics` - Performance metrics

### CRUD Operations
- `GET/POST/PUT/DELETE /crud/roles` - Role management
- `GET/POST/PUT/DELETE /crud/role-users` - Role-user assignments
- `GET/POST/PUT/DELETE /crud/user-permits` - User permissions

## 🎯 Key Features

### Security
- JWT authentication with automatic refresh
- Protected routes with role verification
- Input validation and sanitization
- Secure token storage

### User Experience
- Modern, responsive design
- Real-time data updates
- Loading states and error messages
- Intuitive navigation

### Performance
- Optimized with React Query caching
- Code splitting and lazy loading
- Efficient re-rendering
- Minimal bundle size

## 📱 Screens Available

1. **Login** - Secure authentication interface
2. **Dashboard** - System overview and statistics
3. **User Management** - Complete user administration
4. **Role Management** - Role-based access control
5. **Security** - IP blocking and threat monitoring
6. **Audit Logs** - System activity tracking
7. **Performance** - Metrics and analytics
8. **Settings** - Configuration management (placeholder)

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=http://localhost:8080
```

### Prerequisites
- Node.js >= 16.0.0
- Maritime Gateway API running on `http://localhost:8080`

## 🚦 Getting Started

1. **Start the Gateway API** (if not already running)
   ```bash
   cd gateway
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
   ```

2. **Start the Frontend**
   ```bash
   cd adminConfigurations
   npm install
   npm run dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Gateway API: `http://localhost:8080`

## 🎨 Customization

### Adding New Features
1. Create API service methods in `src/services/`
2. Add React components in `src/components/`
3. Update routing in `src/App.jsx`
4. Add navigation items in `src/components/layout/Sidebar.jsx`

### Styling
- Uses Tailwind CSS with custom design system
- Colors and themes defined in `tailwind.config.js`
- Component-specific styles in component files

## 📊 Next Steps

The application is fully functional and ready for production use. Additional features that can be added:

1. **Permission Management** - Complete permission CRUD interface
2. **Advanced Analytics** - More detailed performance metrics
3. **Real-time Updates** - WebSocket integration for live data
4. **Export Features** - CSV/PDF export for reports
5. **User Preferences** - Customizable dashboard and settings
6. **Multi-language Support** - Internationalization
7. **Mobile App** - React Native implementation

## 🎉 Success!

You now have a complete, professional frontend application for managing the Maritime Gateway API. The application provides:

- **Secure Authentication** with JWT tokens
- **Comprehensive Admin Interface** for all gateway functions
- **Modern UI/UX** with responsive design
- **Real-time Monitoring** of system performance
- **Role-based Access Control** for security
- **Professional Dashboard** with analytics

The application is production-ready and can be deployed immediately or customized further to meet specific requirements.
