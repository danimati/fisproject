# Gateway Admin Configuration - Angular Frontend

A comprehensive Angular frontend for managing the Maritime Gateway API, providing complete control over authentication, security, monitoring, and system configuration.

## 🚀 Features

### **Dashboard Overview**
- Real-time statistics (users, sessions, requests, security events)
- Performance metrics and response time monitoring
- System health indicators
- Auto-refresh functionality

### **User Management**
- Complete CRUD operations for users
- Session viewing and management
- User activation/deactivation
- Advanced search and filtering
- Role assignment capabilities

### **Security Management**
- IP blocking/unblocking interface
- Security event monitoring
- Failed login tracking
- Rate limiting configuration
- Real-time security alerts

### **Audit & Logging**
- Comprehensive audit log viewing
- Event type filtering
- Search functionality
- Real-time log updates
- Detailed request tracking

### **Role & Permission Management**
- Role creation and management
- Permission synchronization from backend
- User-role assignment interface
- User-permission management
- Access control visualization

### **Performance Monitoring**
- Response time metrics
- Status code distribution
- Top endpoint tracking
- System health indicators
- Performance trend analysis

### **System Settings**
- Rate limiting configuration
- Security settings management
- Logging preferences
- System customization options

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 21.x
- **Styling**: Tailwind CSS 4.x
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Angular Reactive Forms
- **Icons**: Font Awesome 6.x
- **TypeScript**: 5.x

## 📁 Project Structure

```
src/app/
├── components/
│   ├── login/              # Authentication component
│   ├── layout/             # Main layout with navigation
│   ├── dashboard/          # Dashboard overview
│   ├── users/              # User management
│   ├── security/           # Security management (TODO)
│   ├── audit/              # Audit logs (TODO)
│   ├── roles/              # Role & permission management (TODO)
│   ├── performance/        # Performance monitoring (TODO)
│   └── settings/           # System settings (TODO)
├── services/
│   ├── auth.service.ts     # Authentication service
│   └── gateway.service.ts  # Gateway API service
├── guards/
│   └── auth.guard.ts       # Authentication guard
├── app.routes.ts           # Application routing
├── app.config.ts           # Application configuration
├── app.ts                  # Root component
└── app.html                # Root template
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18.x or higher
- npm 10.x or higher
- Gateway API running on `http://localhost:8080`

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   ng serve
   ```

3. **Access the Application**
   Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## 🔐 Authentication

The application uses JWT token-based authentication with the Gateway API:

1. **Login**: Users authenticate via `/auth/login` endpoint
2. **Token Storage**: JWT tokens are stored in localStorage
3. **Auto-refresh**: Tokens are automatically refreshed
4. **Route Protection**: All protected routes require authentication

## 🌐 API Integration

### Gateway API Endpoints

The frontend integrates with the following gateway endpoints:

#### Authentication
- `POST /auth/login` - User authentication
- `GET /auth/me` - Current user information
- `POST /auth/logout` - User logout

#### Admin Management
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - User management
- `GET /admin/security/blocked-ips` - Security management
- `GET /admin/audit/logs` - Audit logs
- `GET /admin/performance/metrics` - Performance data

#### CRUD Operations
- `GET /crud/roles` - Role management
- `GET /crud/permissions` - Permission management
- `GET /crud/role-users` - Role assignments
- `GET /crud/user-permits` - User permissions

### Service Architecture

- **AuthService**: Handles authentication, token management, and user state
- **GatewayService**: Manages all API communication with the gateway
- **Auth Guard**: Protects routes requiring authentication

## 🎨 UI/UX Features

### Design System
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional interface with smooth animations
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Dark Mode Ready**: Easy to implement dark theme support

### Navigation
- **Sidebar Navigation**: Collapsible sidebar with icon indicators
- **Breadcrumb Trail**: Clear navigation path indication
- **Search Functionality**: Global search across all sections
- **Quick Actions**: Context-sensitive action buttons

### Data Visualization
- **Real-time Charts**: Live updating performance charts
- **Status Indicators**: Color-coded status badges
- **Progress Bars**: Visual representation of metrics
- **Data Tables**: Sortable and filterable data tables

## 🔒 Security Features

### Authentication & Authorization
- **JWT Token Management**: Secure token storage and refresh
- **Session Tracking**: Monitor active user sessions
- **Role-based Access**: Different access levels for different user types
- **Auto-logout**: Automatic logout on token expiration

### Data Protection
- **Input Validation**: Client-side validation for all forms
- **XSS Prevention**: Proper data sanitization
- **CSRF Protection**: Built-in Angular CSRF protection
- **Secure Headers**: Proper security headers configuration

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### E2E Tests
```bash
ng e2e
```

### Linting
```bash
ng lint
```

## 📦 Deployment

### Development Deployment
```bash
ng serve --host 0.0.0.0 --port 4200
```

### Production Build
```bash
ng build --configuration production
```

### Docker Deployment
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/adminConfigurations /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Gateway API Configuration
GATEWAY_API_URL=http://localhost:8080

# Application Configuration
NODE_ENV=development
PORT=4200
```

### API Configuration

Update the API base URL in `src/app/services/gateway.service.ts`:

```typescript
private readonly API_BASE = 'http://your-gateway-url:port';
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the Gateway API allows requests from your frontend URL
   - Check CORS configuration in the Gateway API

2. **Authentication Issues**
   - Verify Gateway API is running and accessible
   - Check admin user credentials
   - Ensure JWT tokens are properly configured

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Angular CLI version compatibility

4. **Performance Issues**
   - Enable production mode for better performance
   - Check for memory leaks in the application
   - Optimize change detection strategies

## 🤝 Contributing

### Development Guidelines
1. Follow Angular Style Guide
2. Use TypeScript strict mode
3. Implement proper error handling
4. Add unit tests for new features
5. Follow Git conventional commits

### Code Structure
- Use standalone components (Angular 15+)
- Implement proper dependency injection
- Use reactive programming with RxJS
- Follow component composition patterns

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Gateway API Documentation](../gateway/README.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

This frontend is part of the Maritime Trade Management System project.

---

**Note**: This Angular frontend requires the Gateway API to be running and properly configured. Ensure all backend services are operational before accessing the admin panel.
