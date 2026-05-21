# Data Flow and Information Architecture

## Overview
This document analyzes the data flow patterns and information architecture required to connect the UI components with the backend API, ensuring efficient state management and real-time updates across the maritime logistics application.

## 1. Data Flow Architecture

### 1.1 Data Flow Patterns

#### **Unidirectional Data Flow**
- **Description**: Data flows from backend → API layer → state management → UI components
- **Benefits**: Predictable state changes, easier debugging, better testability
- **Implementation**: Redux Toolkit or Zustand for global state, React Query for server state

#### **Bidirectional Data Flow**
- **Description**: User interactions trigger state changes that update both UI and backend
- **Use Cases**: Form submissions, real-time updates, collaborative features
- **Implementation**: Optimistic updates, WebSocket connections, event-driven architecture

### 1.2 State Management Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Components Layer                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │   Forms     │ │    Tables    │ │  Dashboard   │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   State Management Layer                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │ Local State  │ │ Global State │ │Server State │         │
│  │ (useState)  │ │  (Redux)    │ │(React Query)│         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Service Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │ HTTP Client │ │   Auth      │ │   Error     │         │
│  │   (Axios)   │ │  Service    │ │  Handling   │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │   REST API  │ │   WebSocket │ │   Events    │         │
│  │             │ │   (Real-time)│ │  System     │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 2. Component Data Dependencies

### 2.1 Dynamic Data Components

#### **Dashboard Components**
```typescript
interface DashboardData {
  vessels: {
    total: number;
    active: number;
    inTransit: number;
    maintenance: number;
  };
  shipments: {
    total: number;
    thisMonth: number;
    delayed: number;
    completed: number;
  };
  revenue: {
    monthly: number;
    yearly: number;
    growth: number;
  };
  containers: {
    total: number;
    occupied: number;
    available: number;
    utilization: number;
  };
}

// Data flow: Multiple API calls → Aggregation → Dashboard display
const useDashboardData = () => {
  const vesselsQuery = useQuery(['vessels'], vesselService.getVessels);
  const shipmentsQuery = useQuery(['shipments'], shipmentService.getShipments);
  const containersQuery = useQuery(['containers'], containerService.getContainers);
  
  return {
    data: aggregateDashboardData(vesselsQuery.data, shipmentsQuery.data, containersQuery.data),
    loading: vesselsQuery.isLoading || shipmentsQuery.isLoading || containersQuery.isLoading,
    error: vesselsQuery.error || shipmentsQuery.error || containersQuery.error
  };
};
```

#### **Vessel Management Table**
```typescript
interface VesselData {
  id: string;
  name: string;
  imoNumber: string;
  flagState: string;
  type: string;
  capacityTeu: number;
  status: 'active' | 'inactive' | 'maintenance' | 'in_transit';
  currentLocation?: string;
  nextDestination?: string;
  etd?: string;
  eta?: string;
}

// Data flow: API → State → Table → User Actions → API
const useVesselManagement = () => {
  const [filters, setFilters] = useState<VesselFilters>({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });
  
  const {
    data: vessels,
    loading,
    error,
    refetch
  } = useQuery(
    ['vessels', filters, pagination],
    () => vesselService.getVessels({ ...filters, ...pagination }),
    { keepPreviousData: true }
  );
  
  const createVesselMutation = useMutation(vesselService.createVessel, {
    onSuccess: () => refetch(),
    onError: (error) => showErrorToast(error.message)
  });
  
  const updateVesselMutation = useMutation(vesselService.updateVessel, {
    onSuccess: () => refetch(),
    onError: (error) => showErrorToast(error.message)
  });
  
  const deleteVesselMutation = useMutation(vesselService.deleteVessel, {
    onSuccess: () => refetch(),
    onError: (error) => showErrorToast(error.message)
  });
  
  return {
    vessels,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    createVessel: createVesselMutation.mutate,
    updateVessel: updateVesselMutation.mutate,
    deleteVessel: deleteVesselMutation.mutate
  };
};
```

#### **Shipment Timeline**
```typescript
interface ShipmentTimeline {
  shipment: Shipment;
  events: ShipmentEvent[];
  currentStatus: ShipmentStatus;
  milestones: Milestone[];
}

// Data flow: Shipment API + Events API → Timeline Component
const useShipmentTimeline = (shipmentId: string) => {
  const shipmentQuery = useQuery(
    ['shipment', shipmentId],
    () => shipmentService.getShipment(shipmentId)
  );
  
  const eventsQuery = useQuery(
    ['shipment-events', shipmentId],
    () => eventService.getShipmentEvents(shipmentId),
    { refetchInterval: 30000 } // Real-time updates every 30 seconds
  );
  
  return {
    shipment: shipmentQuery.data,
    events: eventsQuery.data || [],
    loading: shipmentQuery.isLoading || eventsQuery.isLoading,
    error: shipmentQuery.error || eventsQuery.error,
    refetchEvents: eventsQuery.refetch
  };
};
```

### 2.2 Form Data Management

#### **Vessel Registration Form**
```typescript
interface VesselFormData {
  name: string;
  imoNumber: string;
  flagState: string;
  type: string;
  capacityTeu: number;
  builtYear: number;
  owner: string;
  status: 'active' | 'inactive';
  grossTonnage: number;
  flagCountry: string;
  deadweightTonnage: number;
  vesselType: string;
}

const useVesselForm = (initialData?: Partial<VesselFormData>) => {
  const [formData, setFormData] = useState<VesselFormData>(
    getDefaultVesselData(initialData)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vessel name is required';
    }
    
    if (!formData.imoNumber.trim()) {
      newErrors.imoNumber = 'IMO number is required';
    } else if (!/^\d{7}$/.test(formData.imoNumber)) {
      newErrors.imoNumber = 'IMO number must be 7 digits';
    }
    
    if (formData.capacityTeu <= 0) {
      newErrors.capacityTeu = 'Capacity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (onSuccess?: () => void) => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await vesselService.updateVessel(initialData.id, formData);
      } else {
        await vesselService.createVessel(formData);
      }
      onSuccess?.();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    handleSubmit,
    validateField: (field: string) => validateField(field, formData)
  };
};
```

## 3. State Change Management

### 3.1 Application State Structure

```typescript
interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    permissions: Permission[];
    loading: boolean;
  };
  ui: {
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark';
    notifications: Notification[];
    modals: {
      [key: string]: boolean;
    };
  };
  entities: {
    vessels: EntityState<Vessel>;
    containers: EntityState<Container>;
    shipments: EntityState<Shipment>;
    clients: EntityState<Client>;
    ports: EntityState<Port>;
    personnel: EntityState<Personnel>;
  };
  filters: {
    vessels: VesselFilters;
    shipments: ShipmentFilters;
    containers: ContainerFilters;
  };
}

interface EntityState<T> {
  items: T[];
  selectedItem: T | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}
```

### 3.2 Real-time Updates

#### **WebSocket Integration**
```typescript
const useRealTimeUpdates = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws`);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'VESSEL_STATUS_UPDATE':
          dispatch(updateVesselStatus(message.payload));
          break;
        case 'SHIPMENT_LOCATION_UPDATE':
          dispatch(updateShipmentLocation(message.payload));
          break;
        case 'CONTAINER_STATUS_CHANGE':
          dispatch(updateContainerStatus(message.payload));
          break;
        case 'NEW_NOTIFICATION':
          dispatch(addNotification(message.payload));
          break;
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Real-time connection lost'
      }));
    };
    
    return () => ws.close();
  }, [dispatch]);
};
```

#### **Optimistic Updates**
```typescript
const useOptimisticVesselUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation(vesselService.updateVessel, {
    onMutate: async (updatedVessel) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['vessels']);
      
      // Snapshot the previous value
      const previousVessels = queryClient.getQueryData(['vessels']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['vessels'], (old: Vessel[]) =>
        old.map(vessel =>
          vessel.id === updatedVessel.id ? { ...vessel, ...updatedVessel } : vessel
        )
      );
      
      return { previousVessels };
    },
    onError: (err, updatedVessel, context) => {
      // Rollback on error
      queryClient.setQueryData(['vessels'], context.previousVessels);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['vessels']);
    }
  });
};
```

## 4. User Action Mapping

### 4.1 Form Submission Flow

```
User fills form → Client validation → Submit button click
     │                    │                    │
     ▼                    ▼                    ▼
Form state update    Error display        API call
     │                    │                    │
     └────────────────────┼────────────────────┘
                          │
                          ▼
                 API Response handling
                          │
               ┌──────────┴──────────┐
               │                     │
               ▼                     ▼
          Success handling       Error handling
               │                     │
               ▼                     ▼
    State update + UI refresh   Error message display
               │
               ▼
        Navigation/Redirect
```

### 4.2 Data Table Interactions

```typescript
const useDataTableInteractions = <T>(entityName: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const handleView = (item: T) => {
    navigate(`/${entityName}/${(item as any).id}`);
  };
  
  const handleEdit = (item: T) => {
    navigate(`/${entityName}/${(item as any).id}/edit`);
  };
  
  const handleDelete = async (item: T) => {
    const confirmed = await showConfirmDialog(
      `Are you sure you want to delete this ${entityName}?`
    );
    
    if (confirmed) {
      try {
        await deleteEntity(entityName, (item as any).id);
        queryClient.invalidateQueries([entityName]);
        showSuccessToast(`${entityName} deleted successfully`);
      } catch (error) {
        showErrorToast(`Failed to delete ${entityName}: ${error.message}`);
      }
    }
  };
  
  const handleBulkAction = async (action: string, selectedItems: T[]) => {
    try {
      await performBulkAction(entityName, action, selectedItems);
      queryClient.invalidateQueries([entityName]);
      showSuccessToast(`Bulk ${action} completed successfully`);
    } catch (error) {
      showErrorToast(`Bulk action failed: ${error.message}`);
    }
  };
  
  return {
    handleView,
    handleEdit,
    handleDelete,
    handleBulkAction
  };
};
```

## 5. Error Handling Strategy

### 5.1 Error Types and Handling

```typescript
enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN'
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}

const useErrorHandler = () => {
  const dispatch = useAppDispatch();
  
  const handleError = (error: any, context?: string) => {
    const appError: AppError = {
      type: determineErrorType(error),
      message: getErrorMessage(error),
      details: error.response?.data,
      timestamp: new Date()
    };
    
    // Log error for debugging
    console.error(`Error in ${context}:`, appError);
    
    // Show user-friendly message
    switch (appError.type) {
      case ErrorType.VALIDATION:
        dispatch(showFieldErrors(appError.details));
        break;
      case ErrorType.AUTHORIZATION:
        dispatch(showAuthError('You are not authorized to perform this action'));
        break;
      case ErrorType.NETWORK:
        dispatch(showNetworkError('Connection error. Please check your internet connection'));
        break;
      case ErrorType.SERVER_ERROR:
        dispatch(showServerError('Server error. Please try again later'));
        break;
      default:
        dispatch(showGenericError(appError.message));
    }
    
    // Report to error tracking service
    reportError(appError, context);
  };
  
  return { handleError };
};
```

### 5.2 Loading States Management

```typescript
const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  };
  
  const isLoading = (key: string) => loadingStates[key] || false;
  
  const withLoading = async <T>(key: string, operation: () => Promise<T>): Promise<T> => {
    setLoading(key, true);
    try {
      return await operation();
    } finally {
      setLoading(key, false);
    }
  };
  
  return {
    loadingStates,
    setLoading,
    isLoading,
    withLoading
  };
};
```

## 6. Performance Optimization

### 6.1 Data Caching Strategy

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    }
  }
});

// Entity-specific cache configuration
const cacheConfig = {
  vessels: { staleTime: 2 * 60 * 1000 }, // 2 minutes
  shipments: { staleTime: 1 * 60 * 1000 }, // 1 minute
  containers: { staleTime: 5 * 60 * 1000 }, // 5 minutes
  ports: { staleTime: 60 * 60 * 1000 }, // 1 hour (rarely changes)
  clients: { staleTime: 30 * 60 * 1000 } // 30 minutes
};
```

### 6.2 Pagination and Virtual Scrolling

```typescript
const useVirtualizedTable = <T>(
  fetchFunction: (params: FetchParams) => Promise<PaginatedResponse<T>>
) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetchFunction({ page, pageSize });
      setItems(prev => [...prev, ...response.items]);
      setHasMore(response.items.length === pageSize);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, fetchFunction]);
  
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, []);
  
  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset
  };
};
```

## 7. Data Synchronization

### 7.1 Conflict Resolution

```typescript
const useConflictResolution = () => {
  const resolveConflict = async (
    localData: any,
    serverData: any,
    entityType: string
  ): Promise<any> => {
    // Simple conflict resolution: server data wins
    // In a real app, this could be more sophisticated
    const resolved = {
      ...localData,
      ...serverData,
      _conflictResolved: true,
      _resolvedAt: new Date().toISOString()
    };
    
    // Log conflict for audit
    await logConflictResolution({
      entityType,
      localData,
      serverData,
      resolvedData: resolved,
      timestamp: new Date()
    });
    
    return resolved;
  };
  
  return { resolveConflict };
};
```

### 7.2 Offline Support

```typescript
const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const syncPendingActions = async () => {
    for (const action of pendingActions) {
      try {
        await executeAction(action);
        setPendingActions(prev => prev.filter(a => a.id !== action.id));
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
  };
  
  const queueOfflineAction = (action: OfflineAction) => {
    setPendingActions(prev => [...prev, action]);
  };
  
  return {
    isOnline,
    pendingActions,
    queueOfflineAction
  };
};
```

## 8. Testing Data Flow

### 8.1 Unit Testing Hooks

```typescript
// Example test for vessel management hook
describe('useVesselManagement', () => {
  it('should fetch vessels on mount', async () => {
    const mockVessels = [mockVessel1, mockVessel2];
    
    (vesselService.getVessels as jest.Mock).mockResolvedValue({
      items: mockVessels,
      total: 2
    });
    
    const { result } = renderHook(() => useVesselManagement());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.vessels).toEqual(mockVessels);
    });
    
    expect(vesselService.getVessels).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20
    });
  });
  
  it('should handle vessel creation', async () => {
    const newVessel = mockVessel1;
    (vesselService.createVessel as jest.Mock).mockResolvedValue(newVessel);
    
    const { result } = renderHook(() => useVesselManagement());
    
    await act(async () => {
      result.current.createVessel(newVessel);
    });
    
    expect(vesselService.createVessel).toHaveBeenCalledWith(newVessel);
  });
});
```

### 8.2 Integration Testing

```typescript
// Example integration test for complete data flow
describe('Vessel Management Integration', () => {
  it('should complete vessel creation flow', async () => {
    // Mock API responses
    (vesselService.createVessel as jest.Mock).mockResolvedValue(mockVessel1);
    (vesselService.getVessels as jest.Mock).mockResolvedValue({
      items: [mockVessel1],
      total: 1
    });
    
    const { getByText, getByLabelText } = render(<VesselManagement />);
    
    // Fill form
    fireEvent.change(getByLabelText('Vessel Name'), {
      target: { value: 'Test Vessel' }
    });
    fireEvent.change(getByLabelText('IMO Number'), {
      target: { value: '1234567' }
    });
    
    // Submit form
    fireEvent.click(getByText('Create Vessel'));
    
    // Verify API was called
    await waitFor(() => {
      expect(vesselService.createVessel).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Vessel',
          imoNumber: '1234567'
        })
      );
    });
    
    // Verify table shows new vessel
    await waitFor(() => {
      expect(getByText('Test Vessel')).toBeInTheDocument();
    });
  });
});
```

## 9. Monitoring and Analytics

### 9.1 Performance Monitoring

```typescript
const usePerformanceMonitoring = () => {
  const trackDataLoad = (entityType: string, duration: number, itemCount: number) => {
    // Send to analytics service
    analytics.track('data_load', {
      entity_type: entityType,
      duration_ms: duration,
      item_count: itemCount,
      timestamp: new Date().toISOString()
    });
  };
  
  const trackUserAction = (action: string, entityType: string, duration?: number) => {
    analytics.track('user_action', {
      action,
      entity_type: entityType,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    });
  };
  
  return { trackDataLoad, trackUserAction };
};
```

### 9.2 Error Tracking

```typescript
const useErrorTracking = () => {
  const trackError = (error: Error, context: string, additionalInfo?: any) => {
    errorTracker.captureException(error, {
      tags: {
        context,
        component: 'data_flow'
      },
      extra: additionalInfo
    });
  };
  
  const trackApiError = (error: any, endpoint: string, method: string) => {
    errorTracker.captureMessage('API Error', {
      level: 'error',
      tags: {
        endpoint,
        method,
        status: error.status
      },
      extra: {
        response: error.response?.data,
        request: error.config
      }
    });
  };
  
  return { trackError, trackApiError };
};
```

This comprehensive data flow architecture ensures efficient state management, real-time updates, and robust error handling across the maritime logistics application.
