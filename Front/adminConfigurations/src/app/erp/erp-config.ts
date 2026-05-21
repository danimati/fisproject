export type EntityKey =
  | 'vessels'
  | 'containers'
  | 'cargo'
  | 'clients'
  | 'ports'
  | 'routes'
  | 'shipments'
  | 'events'
  | 'locations'
  | 'personnel'
  | 'contracts';

export type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'date' | 'datetime';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  relation?: EntityKey;
  options?: SelectOption[];
}

export interface ColumnConfig {
  key: string;
  label: string;
  kind?: 'text' | 'number' | 'date' | 'boolean' | 'badge';
  relation?: EntityKey;
}

export interface EntityConfig {
  key: EntityKey;
  title: string;
  description: string;
  endpoint: string;
  icon: string;
  searchHint: string;
  columns: ColumnConfig[];
  formFields: FieldConfig[];
  filters?: FieldConfig[];
  listLabel: (item: Record<string, any>) => string;
}

const BOOTSTRAP_ICON_MAP: Record<string, string> = {
  directions_boat: 'bi-window-dock',
  inventory_2: 'bi-boxes',
  inventory: 'bi-archive',
  groups: 'bi-people',
  anchor: ' bi-bookmark-check-fill',
  route: 'bi-signpost-2',
  local_shipping: 'bi-truck',
  timeline: 'bi-diagram-3',
  location_on: 'bi-geo-alt',
  badge: 'bi-person-badge',
  description: 'bi-file-earmark-text',
  warehouse: 'bi-box-seam',
  domain: 'bi-building',
  progress_activity: 'bi-arrow-repeat',
  dashboard: 'bi-speedometer2',
  admin_panel_settings: 'bi-shield-lock',
  logout: 'bi-box-arrow-right',
  search: 'bi-search',
  verified_user: 'bi-person-check',
  arrow_forward: 'bi-arrow-right'
};

export function getBootstrapIconClass(iconName: string): string {
  return BOOTSTRAP_ICON_MAP[iconName] || 'bi-circle';
}

const vesselStatuses: SelectOption[] = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
  { label: 'Mantenimiento', value: 'maintenance' },
  { label: 'Fuera de servicio', value: 'decommissioned' }
];

const containerTypes: SelectOption[] = [
  { label: 'Seco 20', value: 'dry_20' },
  { label: 'Seco 40', value: 'dry_40' },
  { label: 'Refrigerado 20', value: 'reefer_20' },
  { label: 'Refrigerado 40', value: 'reefer_40' },
  { label: 'Techo abierto', value: 'open_top' },
  { label: 'Plataforma', value: 'flat_rack' },
  { label: 'Tanque', value: 'tank' }
];

const containerStatuses: SelectOption[] = [
  { label: 'Vacío', value: 'empty' },
  { label: 'Cargado', value: 'loaded' },
  { label: 'En tránsito', value: 'in_transit' },
  { label: 'En puerto', value: 'at_port' },
  { label: 'Entregado', value: 'delivered' },
  { label: 'Dañado', value: 'damaged' },
  { label: 'Mantenimiento', value: 'maintenance' }
];

const cargoTypes: SelectOption[] = [
  { label: 'General', value: 'general' },
  { label: 'Perecedero', value: 'perishable' },
  { label: 'Peligroso', value: 'dangerous' },
  { label: 'Frágil', value: 'fragile' },
  { label: 'Líquido', value: 'liquid' },
  { label: 'Granel', value: 'bulk' }
];

const cargoStatuses: SelectOption[] = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'Cargado', value: 'loaded' },
  { label: 'En tránsito', value: 'in_transit' },
  { label: 'Entregado', value: 'delivered' },
  { label: 'Dañado', value: 'damaged' },
  { label: 'Extraviado', value: 'lost' }
];

const clientTypes: SelectOption[] = [
  { label: 'Persona natural', value: 'individual' },
  { label: 'Empresa', value: 'company' }
];

const portTypes: SelectOption[] = [
  { label: 'Marítimo', value: 'sea' },
  { label: 'Fluvial', value: 'river' },
  { label: 'Lacustre', value: 'lake' }
];

const routeStatuses: SelectOption[] = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
  { label: 'Estacional', value: 'seasonal' }
];

const shipmentStatuses: SelectOption[] = [
  { label: 'Planificado', value: 'planned' },
  { label: 'Reservado', value: 'booked' },
  { label: 'Cargando', value: 'loading' },
  { label: 'En tránsito', value: 'in_transit' },
  { label: 'En puerto', value: 'at_port' },
  { label: 'Descargando', value: 'unloading' },
  { label: 'Completado', value: 'completed' },
  { label: 'Cancelado', value: 'cancelled' },
  { label: 'Retrasado', value: 'delayed' }
];

const eventTypes: SelectOption[] = [
  { label: 'Reserva creada', value: 'booking_created' },
  { label: 'Contenedor cargado', value: 'container_loaded' },
  { label: 'Contenedor descargado', value: 'container_unloaded' },
  { label: 'Salida de buque', value: 'vessel_departure' },
  { label: 'Llegada de buque', value: 'vessel_arrival' },
  { label: 'Inspección', value: 'inspection' },
  { label: 'Daño reportado', value: 'damage_reported' },
  { label: 'Liberación aduanera', value: 'customs_clearance' },
  { label: 'Retraso reportado', value: 'delay_reported' },
  { label: 'Cambio de estado', value: 'status_change' }
];

const locationTypes: SelectOption[] = [
  { label: 'Puerto', value: 'port' },
  { label: 'Almacén', value: 'warehouse' },
  { label: 'Depósito', value: 'depot' },
  { label: 'Patio', value: 'yard' },
  { label: 'Oficina', value: 'office' }
];

const personnelRoles: SelectOption[] = [
  { label: 'Administrador global', value: 'global_admin' },
  { label: 'Responsable de sede', value: 'location_manager' },
  { label: 'Operador logístico', value: 'logistics_operator' },
  { label: 'Personal de puerto', value: 'port_personnel' },
  { label: 'Administrativo', value: 'administrative' },
  { label: 'Auditor', value: 'auditor' }
];

const contractStatuses: SelectOption[] = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Activo', value: 'active' },
  { label: 'Completado', value: 'completed' },
  { label: 'Terminado', value: 'terminated' },
  { label: 'Suspendido', value: 'suspended' }
];

function humanizeStatus(value: any): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export const ENTITY_CONFIGS: Record<EntityKey, EntityConfig> = {
  vessels: {
    key: 'vessels',
    title: 'Gestión de flota',
    description: 'Crea, consulta y actualiza los buques de la flota activa.',
    endpoint: 'vessels',
    icon: 'directions_boat',
    searchHint: 'Busca por nombre del buque, IMO o bandera...',
    listLabel: (item) => `${item['name'] ?? 'Unnamed vessel'} · ${item['imo_number'] ?? '-'}`,
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'imo_number', label: 'IMO' },
      { key: 'flag_country', label: 'Bandera' },
      { key: 'vessel_type', label: 'Tipo' },
      { key: 'status', label: 'Estado', kind: 'badge' }
    ],
    filters: [
      { key: 'status', label: 'Estado', type: 'select', options: vesselStatuses },
      { key: 'vessel_type', label: 'Tipo', type: 'text' },
      { key: 'flag_country', label: 'País de bandera', type: 'text' }
    ],
    formFields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'imo_number', label: 'Número IMO', type: 'text', required: true, helper: '7 dígitos' },
      { key: 'flag_country', label: 'País de bandera', type: 'text', required: true },
      { key: 'vessel_type', label: 'Tipo de buque', type: 'text', required: true },
      { key: 'deadweight_tonnage', label: 'Peso muerto', type: 'number', required: true, min: 1 },
      { key: 'gross_tonnage', label: 'Arqueo bruto', type: 'number', required: true, min: 1 },
      { key: 'length_overall', label: 'Eslora total', type: 'number', min: 0, step: 0.1 },
      { key: 'beam', label: 'Manga', type: 'number', min: 0, step: 0.1 },
      { key: 'draft', label: 'Calado', type: 'number', min: 0, step: 0.1 },
      { key: 'max_containers', label: 'Contenedores máximos', type: 'number', min: 0 },
      { key: 'max_cargo_weight', label: 'Peso máximo de carga', type: 'number', min: 0, step: 0.1 },
      { key: 'status', label: 'Estado', type: 'select', options: vesselStatuses, required: true }
    ]
  },
  containers: {
    key: 'containers',
    title: 'Inventario de contenedores',
    description: 'Controla capacidad, peso, ubicación y estado operativo.',
    endpoint: 'containers',
    icon: 'inventory_2',
    searchHint: 'Busca por número de contenedor o estado...',
    listLabel: (item) => `${item['container_number'] ?? 'Container'} · ${humanizeStatus(item['status'])}`,
    columns: [
      { key: 'container_number', label: 'Contenedor #' },
      { key: 'container_type', label: 'Tipo', kind: 'badge' },
      { key: 'status', label: 'Estado', kind: 'badge' },
      { key: 'current_weight', label: 'Peso' },
      { key: 'current_location_id', label: 'Ubicación', relation: 'locations' }
    ],
    filters: [
      { key: 'status', label: 'Estado', type: 'select', options: containerStatuses },
      { key: 'container_type', label: 'Tipo', type: 'select', options: containerTypes }
    ],
    formFields: [
      { key: 'container_number', label: 'Número de contenedor', type: 'text', required: true, helper: '11 caracteres' },
      { key: 'container_type', label: 'Tipo de contenedor', type: 'select', options: containerTypes, required: true },
      { key: 'max_weight', label: 'Peso máximo', type: 'number', required: true, min: 0, step: 0.1 },
      { key: 'max_volume', label: 'Volumen máximo', type: 'number', required: true, min: 0, step: 0.1 },
      { key: 'current_weight', label: 'Peso actual', type: 'number', min: 0, step: 0.1 },
      { key: 'current_volume', label: 'Volumen actual', type: 'number', min: 0, step: 0.1 },
      { key: 'status', label: 'Estado', type: 'select', options: containerStatuses, required: true },
      { key: 'current_location_id', label: 'Ubicación actual', type: 'select', relation: 'locations' }
    ]
  },
  cargo: {
    key: 'cargo',
    title: 'Registro de carga',
    description: 'Registra la carga y enlázala con clientes, contenedores y embarques.',
    endpoint: 'cargo',
    icon: 'inventory',
    searchHint: 'Busca por número de seguimiento o tipo de carga...',
    listLabel: (item) => `${item['tracking_number'] ?? 'Cargo'} · ${humanizeStatus(item['status'])}`,
    columns: [
      { key: 'tracking_number', label: 'Seguimiento #' },
      { key: 'cargo_type', label: 'Tipo', kind: 'badge' },
      { key: 'client_id', label: 'Cliente', relation: 'clients' },
      { key: 'container_id', label: 'Contenedor', relation: 'containers' },
      { key: 'shipment_id', label: 'Embarque', relation: 'shipments' },
      { key: 'status', label: 'Estado', kind: 'badge' }
    ],
    filters: [
      { key: 'status', label: 'Estado', type: 'select', options: cargoStatuses },
      { key: 'cargo_type', label: 'Tipo', type: 'select', options: cargoTypes }
    ],
    formFields: [
      { key: 'tracking_number', label: 'Número de seguimiento', type: 'text', required: true },
      { key: 'description', label: 'Descripción', type: 'textarea', rows: 4, required: true },
      { key: 'cargo_type', label: 'Tipo de carga', type: 'select', options: cargoTypes, required: true },
      { key: 'weight', label: 'Peso', type: 'number', required: true, min: 0.01, step: 0.01 },
      { key: 'volume', label: 'Volumen', type: 'number', required: true, min: 0.01, step: 0.01 },
      { key: 'is_fragile', label: 'Frágil', type: 'checkbox' },
      { key: 'is_dangerous', label: 'Peligrosa', type: 'checkbox' },
      { key: 'temperature_required', label: 'Temperatura requerida', type: 'number', step: 0.1 },
      { key: 'packaging_type', label: 'Tipo de embalaje', type: 'text' },
      { key: 'value', label: 'Valor', type: 'number', min: 0, step: 0.01 },
      { key: 'status', label: 'Estado', type: 'select', options: cargoStatuses, required: true },
      { key: 'client_id', label: 'Cliente', type: 'select', relation: 'clients', required: true },
      { key: 'container_id', label: 'Contenedor', type: 'select', relation: 'containers' },
      { key: 'shipment_id', label: 'Embarque', type: 'select', relation: 'shipments' }
    ]
  },
  clients: {
    key: 'clients',
    title: 'Directorio de clientes',
    description: 'Gestiona remitentes, importadores y clientes corporativos.',
    endpoint: 'clients',
    icon: 'groups',
    searchHint: 'Busca por nombre, correo o documento fiscal...',
    listLabel: (item) => `${item['name'] ?? 'Client'} · ${item['country'] ?? '-'}`,
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'client_type', label: 'Tipo', kind: 'badge' },
      { key: 'tax_id', label: 'Documento fiscal' },
      { key: 'email', label: 'Correo' },
      { key: 'country', label: 'País' },
      { key: 'is_active', label: 'Activo', kind: 'boolean' }
    ],
    filters: [
      { key: 'client_type', label: 'Tipo', type: 'select', options: clientTypes },
      { key: 'country', label: 'País', type: 'text' }
    ],
    formFields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'client_type', label: 'Tipo', type: 'select', options: clientTypes, required: true },
      { key: 'tax_id', label: 'Documento fiscal', type: 'text', required: true },
      { key: 'email', label: 'Correo', type: 'text', required: true },
      { key: 'phone', label: 'Teléfono', type: 'text' },
      { key: 'address', label: 'Dirección', type: 'textarea', rows: 3 },
      { key: 'country', label: 'País', type: 'text', required: true },
      { key: 'contact_person', label: 'Persona de contacto', type: 'text' },
      { key: 'is_active', label: 'Activo', type: 'text', helper: 'verdadero o falso' }
    ]
  },
  ports: {
    key: 'ports',
    title: 'Catálogo de puertos',
    description: 'Gestiona puertos marítimos y datos geográficos.',
    endpoint: 'ports',
    icon: 'anchor',
    searchHint: 'Busca por nombre, código, ciudad o país...',
    listLabel: (item) => `${item['name'] ?? 'Port'} · ${item['code'] ?? '-'}`,
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'code', label: 'Código' },
      { key: 'country', label: 'País' },
      { key: 'city', label: 'Ciudad' },
      { key: 'port_type', label: 'Tipo', kind: 'badge' },
      { key: 'is_active', label: 'Activo', kind: 'boolean' }
    ],
    filters: [
      { key: 'country', label: 'País', type: 'text' },
      { key: 'port_type', label: 'Tipo', type: 'select', options: portTypes }
    ],
    formFields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'code', label: 'Código', type: 'text', required: true, helper: 'UN/LOCODE, 5 caracteres' },
      { key: 'country', label: 'País', type: 'text', required: true },
      { key: 'city', label: 'Ciudad', type: 'text', required: true },
      { key: 'latitude', label: 'Latitud', type: 'number', required: true, step: 0.000001, min: -90, max: 90 },
      { key: 'longitude', label: 'Longitud', type: 'number', required: true, step: 0.000001, min: -180, max: 180 },
      { key: 'port_type', label: 'Tipo de puerto', type: 'select', options: portTypes, required: true },
      { key: 'max_vessel_draft', label: 'Calado máximo de buque', type: 'number', min: 0, step: 0.1 },
      { key: 'container_terminals', label: 'Terminales de contenedores', type: 'number', min: 1, step: 1 },
      { key: 'is_active', label: 'Activo', type: 'checkbox' }
    ]
  },
  routes: {
    key: 'routes',
    title: 'Planificación de rutas',
    description: 'Define rutas marítimas entre puertos de origen y destino.',
    endpoint: 'routes',
    icon: 'route',
    searchHint: 'Busca por código, nombre o puerto...',
    listLabel: (item) => `${item['route_code'] ?? 'Route'} · ${item['name'] ?? '-'}`,
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'route_code', label: 'Código' },
      { key: 'departure_port_id', label: 'Salida', relation: 'ports' },
      { key: 'arrival_port_id', label: 'Llegada', relation: 'ports' },
      { key: 'distance', label: 'Distancia' },
      { key: 'status', label: 'Estado', kind: 'badge' }
    ],
    filters: [
      { key: 'status', label: 'Estado', type: 'select', options: routeStatuses }
    ],
    formFields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'route_code', label: 'Código de ruta', type: 'text', required: true },
      { key: 'departure_port_id', label: 'Puerto de salida', type: 'select', relation: 'ports', required: true },
      { key: 'arrival_port_id', label: 'Puerto de llegada', type: 'select', relation: 'ports', required: true },
      { key: 'distance', label: 'Distancia (mn)', type: 'number', required: true, min: 0.01, step: 0.01 },
      { key: 'estimated_duration', label: 'Duración estimada (horas)', type: 'number', required: true, min: 1, step: 1 },
      { key: 'status', label: 'Estado', type: 'select', options: routeStatuses, required: true }
    ]
  },
  shipments: {
    key: 'shipments',
    title: 'Seguimiento de embarques',
    description: 'Da seguimiento a viajes, cronogramas y estado de entrega.',
    endpoint: 'shipments',
    icon: 'local_shipping',
    searchHint: 'Busca por número de embarque o B/L...',
    listLabel: (item) => `${item['shipment_number'] ?? 'Shipment'} · ${humanizeStatus(item['status'])}`,
    columns: [
      { key: 'shipment_number', label: 'Embarque #' },
      { key: 'bill_of_lading', label: 'Conocimiento de embarque' },
      { key: 'vessel_id', label: 'Buque', relation: 'vessels' },
      { key: 'route_id', label: 'Ruta', relation: 'routes' },
      { key: 'status', label: 'Estado', kind: 'badge' },
      { key: 'total_containers', label: 'Contenedores' }
    ],
    filters: [
      { key: 'status', label: 'Estado', type: 'select', options: shipmentStatuses }
    ],
    formFields: [
      { key: 'shipment_number', label: 'Número de embarque', type: 'text', required: true },
      { key: 'bill_of_lading', label: 'Conocimiento de embarque', type: 'text' },
      { key: 'vessel_id', label: 'Buque', type: 'select', relation: 'vessels', required: true },
      { key: 'route_id', label: 'Ruta', type: 'select', relation: 'routes', required: true },
      { key: 'contract_id', label: 'Contrato', type: 'select', relation: 'contracts' },
      { key: 'departure_date', label: 'Fecha de salida', type: 'datetime', required: true },
      { key: 'estimated_arrival', label: 'Llegada estimada', type: 'datetime', required: true },
      { key: 'actual_arrival', label: 'Llegada real', type: 'datetime' },
      { key: 'status', label: 'Estado', type: 'select', options: shipmentStatuses, required: true },
      { key: 'total_containers', label: 'Contenedores totales', type: 'number', min: 0, step: 1 },
      { key: 'total_weight', label: 'Peso total', type: 'number', min: 0, step: 0.01 },
      { key: 'special_instructions', label: 'Instrucciones especiales', type: 'textarea', rows: 4 }
    ]
  },
  events: {
    key: 'events',
    title: 'Eventos de trazabilidad',
    description: 'Registra eventos de trazabilidad y asignaciones de responsabilidad.',
    endpoint: 'events',
    icon: 'timeline',
    searchHint: 'Busca por tipo de evento o embarque...',
    listLabel: (item) => `${humanizeStatus(item['event_type'])} · ${item['location'] ?? 'No location'}`,
    columns: [
      { key: 'event_type', label: 'Tipo', kind: 'badge' },
      { key: 'shipment_id', label: 'Embarque', relation: 'shipments' },
      { key: 'container_id', label: 'Contenedor', relation: 'containers' },
      { key: 'personnel_id', label: 'Responsable', relation: 'personnel' },
      { key: 'event_date', label: 'Fecha', kind: 'date' }
    ],
    filters: [
      { key: 'event_type', label: 'Tipo de evento', type: 'select', options: eventTypes }
    ],
    formFields: [
      { key: 'event_type', label: 'Tipo de evento', type: 'select', options: eventTypes, required: true },
      { key: 'shipment_id', label: 'Embarque', type: 'select', relation: 'shipments', required: true },
      { key: 'container_id', label: 'Contenedor', type: 'select', relation: 'containers' },
      { key: 'personnel_id', label: 'Personal', type: 'select', relation: 'personnel' },
      { key: 'event_date', label: 'Fecha del evento', type: 'datetime', required: true },
      { key: 'location', label: 'Ubicación', type: 'text' },
      { key: 'description', label: 'Descripción', type: 'textarea', rows: 4, required: true },
      { key: 'observations', label: 'Observaciones', type: 'textarea', rows: 4 }
    ]
  },
  locations: {
    key: 'locations',
    title: 'Catálogo de ubicaciones',
    description: 'Mantén sedes, depósitos, patios, oficinas y ubicaciones vinculadas a puertos.',
    endpoint: 'locations',
    icon: 'location_on',
    searchHint: 'Busca por nombre o código de ubicación...',
    listLabel: (item) => `${item['name'] ?? 'Location'} · ${item['location_code'] ?? '-'}`,
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'location_code', label: 'Código' },
      { key: 'location_type', label: 'Tipo', kind: 'badge' },
      { key: 'city', label: 'Ciudad' },
      { key: 'country', label: 'País' },
      { key: 'is_active', label: 'Activo', kind: 'boolean' }
    ],
    filters: [
      { key: 'location_type', label: 'Tipo', type: 'select', options: locationTypes },
      { key: 'country', label: 'País', type: 'text' },
      { key: 'city', label: 'Ciudad', type: 'text' }
    ],
    formFields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'location_code', label: 'Código de ubicación', type: 'text', required: true },
      { key: 'location_type', label: 'Tipo de ubicación', type: 'select', options: locationTypes, required: true },
      { key: 'address', label: 'Dirección', type: 'textarea', rows: 3 },
      { key: 'city', label: 'Ciudad', type: 'text', required: true },
      { key: 'country', label: 'País', type: 'text', required: true },
      { key: 'latitude', label: 'Latitud', type: 'number', min: -90, max: 90, step: 0.000001 },
      { key: 'longitude', label: 'Longitud', type: 'number', min: -180, max: 180, step: 0.000001 },
      { key: 'contact_phone', label: 'Teléfono de contacto', type: 'text' },
      { key: 'contact_email', label: 'Correo de contacto', type: 'text' },
      { key: 'is_active', label: 'Activo', type: 'checkbox' }
    ]
  },
  personnel: {
    key: 'personnel',
    title: 'Directorio de personal',
    description: 'Gestiona el personal operativo y su asignación de sede.',
    endpoint: 'personnel',
    icon: 'badge',
    searchHint: 'Busca por nombre, correo o ID de empleado...',
    listLabel: (item) => `${item['first_name'] ?? ''} ${item['last_name'] ?? ''}`.trim() || 'Personnel',
    columns: [
      { key: 'first_name', label: 'Nombre' },
      { key: 'last_name', label: 'Apellido' },
      { key: 'email', label: 'Correo' },
      { key: 'role', label: 'Rol', kind: 'badge' },
      { key: 'location_id', label: 'Ubicación', relation: 'locations' },
      { key: 'is_active', label: 'Activo', kind: 'boolean' }
    ],
    filters: [
      { key: 'role', label: 'Rol', type: 'select', options: personnelRoles },
      { key: 'department', label: 'Departamento', type: 'text' },
      { key: 'location_id', label: 'Ubicación', type: 'select', relation: 'locations' }
    ],
    formFields: [
      { key: 'first_name', label: 'Nombre', type: 'text', required: true },
      { key: 'last_name', label: 'Apellido', type: 'text', required: true },
      { key: 'email', label: 'Correo', type: 'text', required: true },
      { key: 'phone', label: 'Teléfono', type: 'text' },
      { key: 'role', label: 'Rol', type: 'select', options: personnelRoles, required: true },
      { key: 'employee_id', label: 'ID de empleado', type: 'text', required: true },
      { key: 'department', label: 'Departamento', type: 'text' },
      { key: 'location_id', label: 'Ubicación', type: 'select', relation: 'locations' },
      { key: 'responsibilities', label: 'Responsabilidades', type: 'textarea', rows: 3 },
      { key: 'is_active', label: 'Activo', type: 'checkbox' }
    ]
  },
  contracts: {
    key: 'contracts',
    title: 'Gestión de contratos',
    description: 'Registra acuerdos contractuales vinculados con clientes.',
    endpoint: 'contracts',
    icon: 'description',
    searchHint: 'Busca por número de contrato o título...',
    listLabel: (item) => `${item['contract_number'] ?? 'Contract'} · ${item['title'] ?? '-'}`,
    columns: [
      { key: 'contract_number', label: 'Contrato #' },
      { key: 'title', label: 'Título' },
      { key: 'client_id', label: 'Cliente', relation: 'clients' },
      { key: 'total_value', label: 'Valor' },
      { key: 'currency', label: 'Moneda' },
      { key: 'status', label: 'Estado', kind: 'badge' }
    ],
    filters: [
      { key: 'client_id', label: 'Cliente', type: 'select', relation: 'clients' },
      { key: 'status', label: 'Estado', type: 'select', options: contractStatuses }
    ],
    formFields: [
      { key: 'contract_number', label: 'Número de contrato', type: 'text', required: true },
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'client_id', label: 'Cliente', type: 'select', relation: 'clients', required: true },
      { key: 'contract_type', label: 'Tipo de contrato', type: 'text', required: true },
      { key: 'total_value', label: 'Valor total', type: 'number', required: true, min: 0.01, step: 0.01 },
      { key: 'currency', label: 'Moneda', type: 'text', required: true, helper: 'ISO 4217' },
      { key: 'start_date', label: 'Fecha de inicio', type: 'datetime', required: true },
      { key: 'end_date', label: 'Fecha de cierre', type: 'datetime', required: true },
      { key: 'terms_and_conditions', label: 'Términos y condiciones', type: 'textarea', rows: 5 },
      { key: 'status', label: 'Estado', type: 'select', options: contractStatuses, required: true }
    ]
  }
};

export const ENTITY_KEYS: EntityKey[] = Object.keys(ENTITY_CONFIGS) as EntityKey[];

export function getEntityConfig(entityKey: EntityKey): EntityConfig {
  return ENTITY_CONFIGS[entityKey];
}

export function getHumanizedValue(value: any): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
