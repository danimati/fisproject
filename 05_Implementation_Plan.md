# Implementation Plan

## Overview
This document provides a comprehensive implementation plan for developing the maritime logistics application frontend, integrating the Stitch mockups with the functional API endpoints. The plan is structured in phases to ensure systematic development and delivery.

## 1. Project Setup and Foundation

### 1.1 Development Environment Setup

#### **Technology Stack**
- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **UI Library**: TailwindCSS + Headless UI
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library + Playwright
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode

#### **Project Structure**
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   ├── forms/           # Form components
│   ├── tables/          # Table components
│   └── layout/         # Layout components
├── pages/               # Page components
│   ├── dashboard/
│   ├── vessels/
│   ├── containers/
│   ├── shipments/
│   └── admin/
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── store/               # Redux store configuration
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── constants/           # Application constants
└── assets/              # Static assets
```

#### **Initial Setup Commands**
```bash
# Create React app with Vite
npm create vite@latest maritime-frontend -- --template react-ts
cd maritime-frontend

# Install dependencies
npm install @reduxjs/toolkit react-redux react-router-dom
npm install @headlessui/react @heroicons/react
npm install react-hook-form @hookform/resolvers zod
npm install tailwindcss @tailwindcss/forms
npm install axios react-query
npm install @tanstack/react-query

# Install dev dependencies
npm install -D @types/node
npm install -D eslint prettier
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D playwright

# Initialize TailwindCSS
npx tailwindcss init -p
```

### 1.2 Configuration Files

#### **TailwindCSS Configuration**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        success: {
          50: '#F0FDF4',
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

#### **TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/pages/*": ["src/pages/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/services/*": ["src/services/*"],
      "@/store/*": ["src/store/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"],
      "@/constants/*": ["src/constants/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 2. Phase 1: Foundation Components (Weeks 1-2)

### 2.1 Design System Implementation

#### **Color Palette and Typography**
```typescript
// src/constants/design-tokens.ts
export const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // ... other colors
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
} as const;
```

#### **Base Components**
```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        destructive: 'bg-error-600 text-white hover:bg-error-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        link: 'underline-offset-4 hover:underline text-primary-600',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

```typescript
// src/components/ui/Input.tsx
import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <input
          type={type}
          className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-error-500' : ''} ${className}`}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-error-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
```

### 2.2 Layout Components

#### **App Shell**
```typescript
// src/components/layout/AppShell.tsx
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
```

#### **Sidebar Navigation**
```typescript
// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ShipIcon,
  CubeIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
  MapIcon,
  CurrencyDollarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Vessels', href: '/vessels', icon: ShipIcon },
  { name: 'Containers', href: '/containers', icon: CubeIcon },
  { name: 'Shipments', href: '/shipments', icon: ArchiveBoxIcon },
  { name: 'Clients', href: '/clients', icon: UserGroupIcon },
  { name: 'Routes & Ports', href: '/routes', icon: MapIcon },
  { name: 'Finance', href: '/finance', icon: CurrencyDollarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && <h1 className="text-xl font-bold text-gray-900">Maritime Log</h1>}
        <button
          onClick={onToggle}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
```

### 2.3 Form Components

#### **Form Validation with Zod**
```typescript
// src/types/vessel.ts
import { z } from 'zod';

export const vesselSchema = z.object({
  name: z.string().min(1, 'Vessel name is required'),
  imoNumber: z.string().regex(/^\d{7}$/, 'IMO number must be 7 digits'),
  flagState: z.string().min(1, 'Flag state is required'),
  type: z.enum(['container', 'bulk', 'tanker', 'ro-ro']),
  capacityTeu: z.number().min(1, 'Capacity must be greater than 0'),
  builtYear: z.number().min(1900).max(new Date().getFullYear()),
  owner: z.string().min(1, 'Owner is required'),
  status: z.enum(['active', 'inactive', 'maintenance', 'in_transit']),
  grossTonnage: z.number().min(0),
  flagCountry: z.string().min(1, 'Flag country is required'),
  deadweightTonnage: z.number().min(0),
  vesselType: z.string().min(1, 'Vessel type is required'),
});

export type VesselForm = z.infer<typeof vesselSchema>;
```

```typescript
// src/components/forms/VesselForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vesselSchema, type VesselForm } from '@/types/vessel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

interface VesselFormProps {
  initialData?: Partial<VesselForm>;
  onSubmit: (data: VesselForm) => void;
  isLoading?: boolean;
}

export const VesselForm: React.FC<VesselFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VesselForm>({
    resolver: zodResolver(vesselSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Vessel Name"
          {...register('name')}
          error={errors.name?.message}
        />
        
        <Input
          label="IMO Number"
          {...register('imoNumber')}
          error={errors.imoNumber?.message}
        />
        
        <Input
          label="Flag State"
          {...register('flagState')}
          error={errors.flagState?.message}
        />
        
        <Select
          label="Vessel Type"
          {...register('type')}
          error={errors.type?.message}
          options={[
            { value: 'container', label: 'Container Ship' },
            { value: 'bulk', label: 'Bulk Carrier' },
            { value: 'tanker', label: 'Tanker' },
            { value: 'ro-ro', label: 'Ro-Ro Vessel' },
          ]}
        />
        
        <Input
          label="Capacity (TEU)"
          type="number"
          {...register('capacityTeu', { valueAsNumber: true })}
          error={errors.capacityTeu?.message}
        />
        
        <Input
          label="Built Year"
          type="number"
          {...register('builtYear', { valueAsNumber: true })}
          error={errors.builtYear?.message}
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Vessel'}
        </Button>
      </div>
    </form>
  );
};
```

## 3. Phase 2: Core Components (Weeks 3-4)

### 3.1 Data Table Component

#### **Generic Table Component**
```typescript
// src/components/tables/Table.tsx
import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onRowClick?: (record: T) => void;
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (!onSort) return;
    
    const newDirection = 
      sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  column.align === 'center' ? 'text-center' : 
                  column.align === 'right' ? 'text-right' : ''
                }`}
                style={{ width: column.width }}
              >
                {column.sortable ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>{column.title}</span>
                    {sortKey === column.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="h-4 w-4" /> :
                        <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  column.title
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((record, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(record)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {column.render ? 
                    column.render(record[column.key], record) :
                    record[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### **Pagination Component**
```typescript
// src/components/tables/Pagination.tsx
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Per page:</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 py-2 text-gray-500">...</span>}
            </>
          )}
          
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                page === currentPage
                  ? 'text-primary-600 bg-primary-50 border-primary-500 z-10'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              } border`}
            >
              {page}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 py-2 text-gray-500">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 3.2 API Service Layer

#### **Base API Client**
```typescript
// src/services/api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient(process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001');
```

#### **Vessel Service**
```typescript
// src/services/vessel-service.ts
import { apiClient } from './api-client';

export interface Vessel {
  id: string;
  name: string;
  imoNumber: string;
  flagState: string;
  type: string;
  capacityTeu: number;
  builtYear: number;
  owner: string;
  status: 'active' | 'inactive' | 'maintenance' | 'in_transit';
  grossTonnage: number;
  flagCountry: string;
  deadweightTonnage: number;
  vesselType: string;
}

export interface GetVesselsParams {
  skip?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export class VesselService {
  async getVessels(params: GetVesselsParams = {}): Promise<PaginatedResponse<Vessel>> {
    return apiClient.get('/vessels', { params });
  }

  async getVessel(id: string): Promise<Vessel> {
    return apiClient.get(`/vessels/${id}`);
  }

  async createVessel(data: Omit<Vessel, 'id'>): Promise<Vessel> {
    return apiClient.post('/vessels', data);
  }

  async updateVessel(id: string, data: Partial<Vessel>): Promise<Vessel> {
    return apiClient.put(`/vessels/${id}`, data);
  }

  async deleteVessel(id: string): Promise<void> {
    return apiClient.delete(`/vessels/${id}`);
  }
}

export const vesselService = new VesselService();
```

### 3.3 Redux Store Setup

#### **Store Configuration**
```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { vesselApi } from './api/vessel-api';
import { containerApi } from './api/container-api';
import { shipmentApi } from './api/shipment-api';
import uiReducer from './slices/ui-slice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [vesselApi.reducerPath]: vesselApi.reducer,
    [containerApi.reducerPath]: containerApi.reducer,
    [shipmentApi.reducerPath]: shipmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      vesselApi.middleware,
      containerApi.middleware,
      shipmentApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### **Vessel API Slice**
```typescript
// src/store/api/vessel-api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Vessel, GetVesselsParams, PaginatedResponse } from '@/services/vessel-service';

export const vesselApi = createApi({
  reducerPath: 'vesselApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/vessels',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Vessel'],
  endpoints: (builder) => ({
    getVessels: builder.query<PaginatedResponse<Vessel>, GetVesselsParams>({
      query: (params) => ({
        url: '',
        params,
      }),
      providesTags: ['Vessel'],
    }),
    getVessel: builder.query<Vessel, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Vessel', id }],
    }),
    createVessel: builder.mutation<Vessel, Omit<Vessel, 'id'>>({
      query: (vessel) => ({
        url: '',
        method: 'POST',
        body: vessel,
      }),
      invalidatesTags: ['Vessel'],
    }),
    updateVessel: builder.mutation<Vessel, { id: string; vessel: Partial<Vessel> }>({
      query: ({ id, vessel }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: vessel,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Vessel', id }, 'Vessel'],
    }),
    deleteVessel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vessel'],
    }),
  }),
});

export const {
  useGetVesselsQuery,
  useGetVesselQuery,
  useCreateVesselMutation,
  useUpdateVesselMutation,
  useDeleteVesselMutation,
} = vesselApi;
```

## 4. Phase 3: Page Implementation (Weeks 5-6)

### 4.1 Dashboard Page

#### **Dashboard Component**
```typescript
// src/pages/dashboard/Dashboard.tsx
import React from 'react';
import { useGetVesselsQuery } from '@/store/api/vessel-api';
import { useGetShipmentsQuery } from '@/store/api/shipment-api';
import { useGetContainersQuery } from '@/store/api/container-api';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentShipments } from '@/components/dashboard/RecentShipments';
import { VesselStatusChart } from '@/components/dashboard/VesselStatusChart';

export const Dashboard: React.FC = () => {
  const { data: vesselsData } = useGetVesselsQuery({ limit: 1 });
  const { data: shipmentsData } = useGetShipmentsQuery({ limit: 1 });
  const { data: containersData } = useGetContainersQuery({ limit: 1 });

  const vesselStats = React.useMemo(() => {
    if (!vesselsData?.items) return { total: 0, active: 0, maintenance: 0 };
    
    const vessels = vesselsData.items;
    return {
      total: vesselsData.total,
      active: vessels.filter(v => v.status === 'active').length,
      maintenance: vessels.filter(v => v.status === 'maintenance').length,
    };
  }, [vesselsData]);

  const shipmentStats = React.useMemo(() => {
    if (!shipmentsData?.items) return { total: 0, thisMonth: 0, delayed: 0 };
    
    const shipments = shipmentsData.items;
    const thisMonth = new Date().getMonth();
    
    return {
      total: shipmentsData.total,
      thisMonth: shipments.filter(s => new Date(s.etd).getMonth() === thisMonth).length,
      delayed: shipments.filter(s => s.status === 'delayed').length,
    };
  }, [shipmentsData]);

  const containerStats = React.useMemo(() => {
    if (!containersData?.items) return { total: 0, occupied: 0, available: 0 };
    
    const containers = containersData.items;
    return {
      total: containersData.total,
      occupied: containers.filter(c => c.status !== 'empty').length,
      available: containers.filter(c => c.status === 'empty').length,
    };
  }, [containersData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Vessels"
          value={vesselStats.total}
          change={{ value: vesselStats.active, type: 'increase' }}
          icon="ship"
          color="blue"
        />
        <StatsCard
          title="Active Shipments"
          value={shipmentStats.total}
          change={{ value: shipmentStats.thisMonth, type: 'increase' }}
          icon="archive"
          color="green"
        />
        <StatsCard
          title="Container Utilization"
          value={`${Math.round((containerStats.occupied / containerStats.total) * 100)}%`}
          change={{ value: containerStats.occupied, type: 'neutral' }}
          icon="cube"
          color="yellow"
        />
        <StatsCard
          title="Delayed Shipments"
          value={shipmentStats.delayed}
          change={{ value: shipmentStats.delayed, type: 'decrease' }}
          icon="exclamation"
          color="red"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VesselStatusChart vessels={vesselsData?.items || []} />
        <RecentShipments shipments={shipmentsData?.items || []} />
      </div>
    </div>
  );
};
```

### 4.2 Vessel Management Page

#### **Vessel List Component**
```typescript
// src/pages/vessels/VesselList.tsx
import React, { useState } from 'react';
import { useGetVesselsQuery } from '@/store/api/vessel-api';
import { Table } from '@/components/tables/Table';
import { Pagination } from '@/components/tables/Pagination';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { Vessel } from '@/services/vessel-service';

export const VesselList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useGetVesselsQuery({
    skip: (page - 1) * pageSize,
    limit: pageSize,
    search,
    status: statusFilter,
  });

  const columns = [
    {
      key: 'name' as keyof Vessel,
      title: 'Vessel Name',
      sortable: true,
      render: (value: string, record: Vessel) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">IMO: {record.imoNumber}</div>
        </div>
      ),
    },
    {
      key: 'type' as keyof Vessel,
      title: 'Type',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'capacityTeu' as keyof Vessel,
      title: 'Capacity (TEU)',
      align: 'right' as const,
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'flagCountry' as keyof Vessel,
      title: 'Flag',
    },
    {
      key: 'status' as keyof Vessel,
      title: 'Status',
      render: (value: string) => {
        const variants = {
          active: 'success',
          inactive: 'secondary',
          maintenance: 'warning',
          in_transit: 'info',
        } as const;
        
        return (
          <Badge variant={variants[value as keyof typeof variants]}>
            {value.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'actions' as keyof Vessel,
      title: 'Actions',
      render: (_: any, record: Vessel) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.href = `/vessels/${record.id}`}
          >
            View
          </Button>
          <Button
            size="sm"
            onClick={() => window.location.href = `/vessels/${record.id}/edit`}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const handleSort = (key: keyof Vessel, direction: 'asc' | 'desc') => {
    // Handle sorting logic
    console.log('Sort by', key, direction);
  };

  const handleRowClick = (record: Vessel) => {
    window.location.href = `/vessels/${record.id}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vessel Management</h1>
        <Button onClick={() => window.location.href = '/vessels/create'}>
          Add Vessel
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          placeholder="Search vessels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border-gray-300 py-2 px-3 text-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
          <option value="in_transit">In Transit</option>
        </select>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => {
            setSearch('');
            setStatusFilter('');
            setPage(1);
          }}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        data={data?.items || []}
        columns={columns}
        loading={isLoading}
        onSort={handleSort}
        onRowClick={handleRowClick}
        emptyMessage="No vessels found"
      />

      {/* Pagination */}
      {data && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(data.total / pageSize)}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={data.total}
        />
      )}
    </div>
  );
};
```

## 5. Phase 4: Advanced Features (Weeks 7-8)

### 5.1 Real-time Updates

#### **WebSocket Integration**
```typescript
// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';
import { store } from '@/store';
import { vesselApi } from '@/store/api/vessel-api';

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'VESSEL_STATUS_UPDATE':
          // Update Redux cache
          store.dispatch(
            vesselApi.util.updateQueryData(
              'getVessels',
              undefined,
              (draft) => {
                const index = draft.items.findIndex(v => v.id === message.payload.id);
                if (index !== -1) {
                  draft.items[index] = { ...draft.items[index], ...message.payload };
                }
              }
            )
          );
          break;
        case 'SHIPMENT_LOCATION_UPDATE':
          // Handle shipment updates
          break;
        case 'CONTAINER_STATUS_CHANGE':
          // Handle container updates
          break;
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        ws.current?.close();
      }, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.current?.close();
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, sendMessage };
};
```

### 5.2 Map Integration

#### **Routes and Ports Map**
```typescript
// src/components/maps/RoutesMap.tsx
import React, { useEffect, useRef } from 'react';
import { useGetPortsQuery } from '@/store/api/port-api';
import { useGetRoutesQuery } from '@/store/api/route-api';

export const RoutesMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { data: ports } = useGetPortsQuery();
  const { data: routes } = useGetRoutesQuery();

  useEffect(() => {
    if (!mapRef.current || !ports) return;

    // Initialize map (using Leaflet or similar)
    const map = L.map(mapRef.current).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add port markers
    ports.items.forEach(port => {
      const marker = L.marker([port.latitude, port.longitude])
        .addTo(map)
        .bindPopup(`
          <div>
            <h3>${port.name}</h3>
            <p>Country: ${port.country}</p>
            <p>Capacity: ${port.annual_teu_capacity.toLocaleString()} TEU</p>
          </div>
        `);
    });

    // Add route lines
    routes?.items.forEach(route => {
      const originPort = ports.items.find(p => p.id === route.origin_port_id);
      const destinationPort = ports.items.find(p => p.id === route.destination_port_id);
      
      if (originPort && destinationPort) {
        L.polyline([
          [originPort.latitude, originPort.longitude],
          [destinationPort.latitude, destinationPort.longitude]
        ], {
          color: '#3B82F6',
          weight: 2,
          opacity: 0.7
        }).addTo(map)
          .bindPopup(`
            <div>
              <h4>${route.name}</h4>
              <p>Distance: ${route.distance_nautical_miles} NM</p>
              <p>Transit Time: ${route.transit_time_days} days</p>
            </div>
          `);
      }
    });

    return () => {
      map.remove();
    };
  }, [ports, routes]);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};
```

## 6. Testing Strategy

### 6.1 Unit Testing

#### **Component Testing**
```typescript
// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-600');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-error-600');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });
});
```

#### **Hook Testing**
```typescript
// src/hooks/useWebSocket.test.ts
import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from './useWebSocket';

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  
  readyState = MockWebSocket.OPEN;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  
  constructor(public url: string) {}
  
  send(data: string) {
    // Mock implementation
  }
  
  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent('close'));
  }
}

global.WebSocket = MockWebSocket as any;

describe('useWebSocket', () => {
  it('connects to WebSocket on mount', () => {
    const { result } = renderHook(() => useWebSocket('ws://localhost:8080'));
    
    expect(result.current.isConnected).toBe(true);
  });

  it('handles incoming messages', () => {
    const { result } = renderHook(() => useWebSocket('ws://localhost:8080'));
    
    act(() => {
      // Simulate incoming message
      const ws = (global.WebSocket as any).mock.instances[0];
      ws.onmessage?.(new MessageEvent('message', {
        data: JSON.stringify({
          type: 'VESSEL_STATUS_UPDATE',
          payload: { id: '1', status: 'maintenance' }
        })
      }));
    });
    
    // Verify Redux store was updated
    // This would require mocking the Redux store
  });
});
```

### 6.2 Integration Testing

#### **E2E Testing with Playwright**
```typescript
// tests/e2e/vessel-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Vessel Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should display vessel list', async ({ page }) => {
    await page.goto('/vessels');
    
    // Check if page loads
    await expect(page.locator('h1')).toContainText('Vessel Management');
    
    // Check if table is displayed
    await expect(page.locator('[data-testid="vessels-table"]')).toBeVisible();
    
    // Check if pagination is displayed
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible();
  });

  test('should create new vessel', async ({ page }) => {
    await page.goto('/vessels');
    
    // Click "Add Vessel" button
    await page.click('[data-testid="add-vessel-button"]');
    
    // Fill form
    await page.fill('[data-testid="vessel-name"]', 'Test Vessel');
    await page.fill('[data-testid="imo-number"]', '1234567');
    await page.selectOption('[data-testid="vessel-type"]', 'container');
    await page.fill('[data-testid="capacity-teu"]', '10000');
    
    // Submit form
    await page.click('[data-testid="save-button"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
    await expect(page.locator('text=Test Vessel')).toBeVisible();
  });

  test('should search and filter vessels', async ({ page }) => {
    await page.goto('/vessels');
    
    // Search for vessel
    await page.fill('[data-testid="search-input"]', 'Test');
    await page.waitForTimeout(500); // Debounce
    
    // Verify search results
    await expect(page.locator('text=Test Vessel')).toBeVisible();
    
    // Filter by status
    await page.selectOption('[data-testid="status-filter"]', 'active');
    await page.waitForTimeout(500);
    
    // Verify filter results
    const activeVessels = page.locator('[data-testid="vessel-row"]');
    for (const vessel of await activeVessels.all()) {
      await expect(vessel.locator('[data-testid="status-badge"]')).toContainText('active');
    }
  });
});
```

## 7. Deployment and CI/CD

### 7.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e-test:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  deploy:
    runs-on: ubuntu-latest
    needs: [test, e2e-test]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to production
        run: |
          # Deployment commands
          echo "Deploying to production..."
```

### 7.2 Docker Configuration

```dockerfile
# Dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Enable gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 8. Performance Optimization

### 8.1 Bundle Analysis

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

### 8.2 Performance Monitoring

```typescript
// src/utils/performance.ts
export class PerformanceMonitor {
  static measurePageLoad(pageName: string) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      // Send to analytics
      this.trackMetric('page_load_time', {
        page: pageName,
        duration: loadTime,
        device: this.getDeviceType(),
      });
      
      // Alert on slow loads
      if (loadTime > 3000) {
        console.warn(`Slow page load detected: ${pageName} took ${loadTime}ms`);
      }
    });
  }
  
  static measureApiCall(endpoint: string, duration: number, success: boolean) {
    this.trackMetric('api_call', {
      endpoint,
      duration,
      success,
      timestamp: Date.now(),
    });
    
    if (duration > 5000) {
      console.warn(`Slow API call: ${endpoint} took ${duration}ms`);
    }
  }
  
  private static trackMetric(name: string, data: any) {
    // Send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // analytics.track(name, data);
    }
  }
  
  private static getDeviceType(): string {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
}
```

## 9. Security Considerations

### 9.1 Content Security Policy

```typescript
// src/utils/security.ts
export const securityConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.REACT_APP_API_BASE_URL],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: {
    features: {
      camera: ['none'],
      microphone: ['none'],
      geolocation: ['none'],
    },
  },
};
```

### 9.2 Input Sanitization

```typescript
// src/utils/sanitization.ts
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: [],
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};
```

## 10. Timeline and Milestones

### 10.1 Development Timeline

| Week | Phase | Deliverables |
|-------|-------|-------------|
| 1-2 | Foundation | Project setup, design system, base components |
| 3-4 | Core Components | Tables, forms, API integration, Redux setup |
| 5-6 | Page Implementation | Dashboard, vessel management, container management |
| 7-8 | Advanced Features | Real-time updates, map integration, advanced filtering |
| 9-10 | Testing & QA | Unit tests, integration tests, E2E tests |
| 11-12 | Deployment & Optimization | CI/CD setup, performance optimization, security hardening |

### 10.2 Success Criteria

#### **Functional Requirements**
- [ ] All CRUD operations working for vessels, containers, shipments
- [ ] Real-time updates for vessel status and shipment tracking
- [ ] Responsive design working on mobile, tablet, desktop
- [ ] Map integration displaying routes and ports
- [ ] Dashboard with accurate statistics and charts

#### **Performance Requirements**
- [ ] Page load time under 3 seconds
- [ ] API response time under 1 second
- [ ] Bundle size under 1MB (gzipped)
- [ ] Lighthouse score above 90

#### **Security Requirements**
- [ ] Authentication and authorization implemented
- [ ] Input validation and sanitization
- [ ] HTTPS enforced in production
- [ ] Content Security Policy configured

#### **Quality Requirements**
- [ ] Unit test coverage above 80%
- [ ] All critical user flows covered by E2E tests
- [ ] Zero critical security vulnerabilities
- [ ] Accessibility compliance (WCAG 2.1 AA)

This comprehensive implementation plan provides a structured approach to building the maritime logistics application frontend, ensuring all requirements are met while maintaining high quality standards and best practices.
