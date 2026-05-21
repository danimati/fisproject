# Reusable Components Design System

## Overview
This document outlines the design system for creating reusable components that will ensure consistency, maintainability, and scalability across the maritime logistics application.

## 1. Component Architecture

### 1.1 Design Principles
- **Consistency**: Unified look and feel across all components
- **Reusability**: Components designed for multiple use cases
- **Composability**: Small components that combine into larger ones
- **Accessibility**: Built-in accessibility features
- **Performance**: Optimized for speed and memory usage

### 1.2 Component Categories

#### **Foundation Components**
Basic building blocks that compose all other components:
- Typography (Text, Heading, Caption)
- Colors (Color palette, semantic colors)
- Spacing (Margin, Padding, Gap)
- Layout (Box, Grid, Stack, Container)

#### **Form Components**
Interactive form elements:
- Input (Text, Email, Number, Password, Tel)
- Select (Single, Multi, Searchable)
- Checkbox & Radio
- Switch (Toggle)
- Textarea
- DatePicker
- FileUpload
- Button (Primary, Secondary, Tertiary, Danger)

#### **Data Display Components**
Components for presenting information:
- Table (Sortable, Filterable, Paginated)
- Card (Basic, Stats, Chart)
- Badge (Status, Category, Notification)
- Progress (Bar, Circle, Steps)
- Timeline (Vertical, Horizontal)
- Chart (Line, Bar, Pie, Map)

#### **Navigation Components**
Components for moving through the application:
- Sidebar (Collapsible, Fixed)
- Header (With search, notifications)
- Breadcrumb
- Tabs
- Pagination
- Menu (Dropdown, Context)

#### **Feedback Components**
Components for user feedback:
- Modal (Dialog, Alert, Confirm)
- Tooltip
- Toast/Notification
- Loading (Spinner, Skeleton)
- Alert (Success, Warning, Error, Info)

## 2. Component Breakdown

### 2.1 Button Component System

#### **Button Variants**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  children: ReactNode;
}
```

#### **Button States**
- **Default**: Normal appearance
- **Hover**: Slightly darker/lighter shade
- **Active**: Pressed state
- **Disabled**: Grayed out, not clickable
- **Loading**: Spinner, disabled state

#### **Button Sizes**
- **Small (sm)**: 32px height, compact padding
- **Medium (md)**: 40px height, standard padding
- **Large (lg)**: 48px height, generous padding

### 2.2 Form Component System

#### **Input Field Component**
```typescript
interface InputProps {
  type: 'text' | 'email' | 'number' | 'password' | 'tel';
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}
```

#### **Input States**
- **Default**: Normal appearance
- **Focus**: Blue border, shadow
- **Error**: Red border, error message
- **Success**: Green border, checkmark
- **Disabled**: Grayed out, not interactive

#### **Select Component**
```typescript
interface SelectProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string | string[];
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  multi?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  onChange?: (value: string | string[]) => void;
}
```

### 2.3 Data Table Component

#### **Table Features**
```typescript
interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
    onSort: (field: string) => void;
  };
  filtering?: {
    filters: FilterState[];
    onFilterChange: (filters: FilterState[]) => void;
  };
  selection?: {
    selectedRows: T[];
    onSelectionChange: (rows: T[]) => void;
  };
  rowActions?: ActionDef<T>[];
  emptyState?: ReactNode;
}
```

#### **Table Column Definition**
```typescript
interface ColumnDef<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  render?: (value: any, record: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}
```

### 2.4 Modal Component System

#### **Modal Types**
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}

// Specialized modals
interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  content: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error';
}

interface FormModalProps<T> extends ModalProps {
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  validation?: (data: T) => ValidationError[];
}
```

## 3. Design Tokens

### 3.1 Color System
```typescript
const colors = {
  // Brand colors
  primary: {
    50: '#EFF6FF',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
  
  // Semantic colors
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
  
  // Neutral colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
};
```

### 3.2 Typography Scale
```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
};
```

### 3.3 Spacing System
```typescript
const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};
```

## 4. Component Composition Patterns

### 4.1 Compound Components
Components that work together as a group:
```typescript
// Example: Card compound component
<Card>
  <Card.Header>
    <Card.Title>Dashboard</Card.Title>
    <Card.Actions>
      <Button size="sm">Export</Button>
    </Card.Actions>
  </Card.Header>
  <Card.Body>
    <Card.Content>
      {/* Main content */}
    </Card.Content>
  </Card.Body>
  <Card.Footer>
    <Card.FooterText>Last updated: 2 hours ago</Card.FooterText>
  </Card.Footer>
</Card>
```

### 4.2 Render Props Pattern
Components that accept functions as children:
```typescript
<DataTable
  data={vessels}
  columns={columns}
  renderRow={(record, index) => (
    <tr key={record.id}>
      <td>{record.name}</td>
      <td>{record.imoNumber}</td>
      <td>
        <Badge status={record.status}>
          {record.status}
        </Badge>
      </td>
    </tr>
  )}
/>
```

### 4.3 Provider Pattern
Components that provide context to children:
```typescript
<ThemeProvider theme="light">
  <FormProvider>
    <VesselForm />
  </FormProvider>
</ThemeProvider>
```

## 5. State Management Integration

### 5.1 Form State Management
```typescript
// Using React Hook Form with custom components
const { control, handleSubmit, formState } = useForm<VesselData>();

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Controller
      name="name"
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          label="Vessel Name"
          error={fieldState.error?.message}
          required
        />
      )}
    />
  </form>
);
```

### 5.2 Data Fetching Integration
```typescript
// Using React Query for server state
const { data, loading, error } = useQuery({
  queryKey: ['vessels', page, pageSize],
  queryFn: () => vesselService.getVessels({ page, pageSize }),
});

return (
  <Table
    data={data?.items || []}
    loading={loading}
    pagination={{
      page,
      pageSize,
      total: data?.total || 0,
      onPageChange: setPage,
      onPageSizeChange: setPageSize,
    }}
  />
);
```

## 6. Testing Strategy

### 6.1 Unit Testing
- Test component rendering with different props
- Test user interactions (click, change, submit)
- Test component states (loading, error, success)
- Test accessibility features

### 6.2 Integration Testing
- Test component composition
- Test form submission and validation
- Test data flow between components
- Test API integration

### 6.3 Visual Testing
- Storybook for component documentation
- Visual regression testing
- Responsive design testing
- Cross-browser testing

## 7. Documentation

### 7.1 Component Documentation
Each component should include:
- **Description**: What the component does
- **Props**: All available properties with types
- **Examples**: Common usage patterns
- **Accessibility**: ARIA attributes and keyboard navigation
- **Best Practices**: When and how to use the component

### 7.2 Design Guidelines
- **Usage Guidelines**: When to use specific variants
- **Content Guidelines**: Text length, formatting rules
- **Interaction Patterns**: Expected user behavior
- **Error Handling**: How to display and handle errors

## 8. Performance Optimization

### 8.1 Component Optimization
- **Memoization**: Use React.memo for expensive components
- **Lazy Loading**: Load components only when needed
- **Virtual Scrolling**: For large lists and tables
- **Code Splitting**: Separate vendor and application code

### 8.2 Bundle Optimization
- **Tree Shaking**: Remove unused code
- **Dynamic Imports**: Load components on demand
- **Asset Optimization**: Compress images and fonts
- **Caching Strategy**: Browser and CDN caching

## 9. Migration Strategy

### 9.1 Phase 1: Foundation
1. Set up design tokens and base styles
2. Create basic form components
3. Implement layout components
4. Set up Storybook

### 9.2 Phase 2: Core Components
1. Build data display components
2. Implement navigation components
3. Create feedback components
4. Add state management integration

### 9.3 Phase 3: Advanced Features
1. Build specialized components
2. Implement advanced patterns
3. Add accessibility features
4. Optimize performance

### 9.4 Phase 4: Migration
1. Replace existing components gradually
2. Update existing pages
3. Remove deprecated components
4. Update documentation

## 10. Maintenance and Governance

### 10.1 Component Versioning
- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Breaking Changes**: Documented and communicated
- **Deprecation Policy**: Clear timeline for removal
- **Backward Compatibility**: Maintain when possible

### 10.2 Code Review Process
- **Component Review**: Design and implementation review
- **Accessibility Review**: ARIA and keyboard navigation
- **Performance Review**: Bundle size and runtime performance
- **Testing Review**: Test coverage and quality

### 10.3 Continuous Improvement
- **Usage Analytics**: Track component usage patterns
- **User Feedback**: Collect and analyze user feedback
- **Performance Monitoring**: Monitor component performance
- **Regular Updates**: Keep dependencies and patterns current
