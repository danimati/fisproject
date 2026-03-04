# Historias de usuario

---

## 1) Seguridad, acceso, usuarios y permisos (RNF-01)

### HU-01 Iniciar sesión

**Como** usuario del sistema (Administrador/Gerente/Operador/Auditor), **quiero** iniciar sesión, **para** acceder a mis funcionalidades según mi rol.

**CA**

- Dado que tengo credenciales válidas, cuando inicio sesión, entonces accedo al sistema.
- Dado que mis credenciales son inválidas, cuando inicio sesión, entonces el sistema rechaza el acceso y muestra un mensaje claro.
    
    **Trazabilidad:** RNF-01 / CU-35
    

### HU-02 Cerrar sesión

**Como** usuario autenticado, **quiero** cerrar sesión, **para** terminar mi sesión de forma segura.

**CA**

- Dado que estoy autenticado, cuando cierro sesión, entonces mi sesión queda invalidada.
    
    **Trazabilidad:** RNF-01 / CU-36
    

### HU-03 Gestionar usuarios

**Como** Administrador, **quiero** crear/editar/desactivar usuarios, **para** controlar quién accede al sistema.

**CA**

- Dado que soy Admin, cuando registro un usuario, entonces el usuario queda habilitado con datos mínimos requeridos.
- Cuando desactivo un usuario, entonces no puede autenticarse.
    
    **Trazabilidad:** RNF-01 / CU-37
    

### HU-04 Asignar roles y permisos

**Como** Administrador, **quiero** asignar roles y permisos, **para** garantizar control de acceso por responsabilidades.

**CA**

- Dado un usuario, cuando asigno rol y permisos, entonces su acceso queda limitado a lo definido.
- Si intento asignar permisos inconsistentes, entonces el sistema lo impide.
    
    **Trazabilidad:** RNF-01 / CU-38
    

### HU-05 Restringir visibilidad por sede según rol

**Como** Gerente/Operador/Auditor, **quiero** ver solo la información de mi sede (según permisos), **para** operar con datos correctos y evitar fuga de información.

**CA**

- Dado que soy Gerente de una sede, cuando consulto embarcaciones/contenedores/cargas/eventos, entonces veo solo lo asociado a mi sede.
- Dado que soy Admin global, cuando consulto, entonces veo todo.
    
    **Trazabilidad:** RF-07 / RNF-01 / CU-28
    

### HU-06 Gestionar roles y permisos por sede

**Como** Administrador o Gerente, **quiero** administrar el alcance por sede para cada rol, **para** operar multi-sede con control granular.

**CA**

- Cuando asigno permisos a un rol en una sede, entonces aplica solo para esa sede.
- Si un usuario no tiene acceso a una sede, entonces no puede ver ni operar registros de esa sede.
    
    **Trazabilidad:** RF-07 / RNF-01 / CU-29
    

---

## 2) Gestión multi-sede (RF-07 / RNF-03)

### HU-07 Registrar sedes

**Como** Administrador, **quiero** registrar una sede, **para** operar internacionalmente con información separada por ubicación.

**CA**

- Cuando registro una sede con datos mínimos, entonces queda disponible para asociar registros.
    
    **Trazabilidad:** RF-07 / RNF-03 / CU-25
    

### HU-08 Actualizar datos de sede

**Como** Administrador o Gerente, **quiero** actualizar datos de una sede, **para** mantener la información vigente.

**CA**

- Cuando actualizo datos válidos, entonces se guardan y quedan auditados.
    
    **Trazabilidad:** RF-07 / CU-26 / RNF-07
    

### HU-09 Asociar registros operativos a sede

**Como** Administrador o Gerente, **quiero** asociar contenedores/rutas/eventos/cargas a una sede, **para** organizar la operación por ubicación.

**CA**

- Cuando registro/actualizo un elemento operativo, entonces debe quedar asociado a una sede.
    
    **Trazabilidad:** RF-07 / RNF-03 / CU-27
    

---

## 3) Embarcaciones (RF-01)

### HU-10 Registrar embarcación

**Como** Administrador o Gerente, **quiero** registrar una embarcación con identificación, capacidad, país y estado operativo, **para** programar y controlar operaciones marítimas.

**CA**

- Cuando registro una embarcación con campos obligatorios, entonces queda disponible para consulta.
- Si la identificación ya existe, entonces el sistema no permite duplicados.
    
    **Trazabilidad:** RF-01 / CU-01
    

### HU-11 Consultar embarcación

**Como** Administrador o Gerente, **quiero** consultar embarcaciones, **para** verificar su estado y disponibilidad.

**CA**

- Cuando consulto por filtros (identificación/estado/país), entonces obtengo resultados.
    
    **Trazabilidad:** RF-01 / CU-02
    

### HU-12 Actualizar embarcación

**Como** Administrador o Gerente, **quiero** actualizar datos de una embarcación, **para** mantener información operativa correcta.

**CA**

- Cuando actualizo capacidad/estado/país, entonces los cambios quedan persistidos y auditados.
    
    **Trazabilidad:** RF-01 / CU-03 / RNF-07
    

### HU-13 Desagendar embarcación

**Como** Administrador o Gerente, **quiero** desagendar/retirar una embarcación de programación, **para** marcarla como no disponible sin perder su historial.

**CA**

- Cuando desagendo una embarcación, entonces su estado queda “no disponible” o equivalente.
- La embarcación debe seguir siendo consultable.
    
    **Trazabilidad:** RF-01 / CU-04
    

---

## 4) Contenedores (RF-02)

### HU-14 Registrar contenedor

**Como** Operador o Administrador, **quiero** registrar un contenedor con código, tipo, capacidad, estado y ubicación actual, **para** controlar inventario y operación.

**CA**

- Cuando registro un contenedor con código único, entonces queda disponible.
- Si el código ya existe, entonces se rechaza el registro.
    
    **Trazabilidad:** RF-02 / CU-05
    

### HU-15 Consultar contenedor

**Como** Operador/Gerente, **quiero** consultar contenedores, **para** verificar su disponibilidad, estado y ubicación.

**CA**

- Cuando consulto por código o filtros (estado/tipo/sede), entonces obtengo información.
    
    **Trazabilidad:** RF-02 / CU-06 / RF-07
    

### HU-16 Actualizar datos/estado/ubicación de contenedor

**Como** Operador o Administrador, **quiero** actualizar estado, capacidad o ubicación actual del contenedor, **para** reflejar cambios operativos.

**CA**

- Cuando actualizo estado/ubicación, entonces se actualiza inmediatamente en el sistema.
- Los cambios quedan auditados.
    
    **Trazabilidad:** RF-02 / CU-07 / RNF-09 / RNF-07
    

### HU-17 Consultar historial del contenedor

**Como** Operador/Gerente/Auditor, **quiero** consultar el historial de movimientos/estados de un contenedor, **para** tener trazabilidad completa y verificable.

**CA**

- Dado un contenedor, cuando consulto historial, entonces veo eventos en orden temporal con responsable y fecha.
    
    **Trazabilidad:** RF-02 / CU-08 / RNF-07
    

---

## 5) Carga y asociación a contenedores (RF-03)

### HU-18 Registrar carga

**Como** Operador, **quiero** registrar una carga con tipo, peso, volumen, embalaje y cliente, **para** gestionar envíos con información completa.

**CA**

- Cuando registro carga con datos mínimos, entonces se crea el registro.
- Se debe poder indicar si es frágil (si aplica al modelo).
    
    **Trazabilidad:** RF-03 / CU-09
    

### HU-19 Asociar carga a contenedor

**Como** Operador, **quiero** asociar carga a un contenedor, **para** consolidar envíos y controlar el contenido del contenedor.

**CA**

- Dada una carga y un contenedor válidos, cuando asocio, entonces la carga queda vinculada.
- Si el contenedor está “no disponible” o en estado inválido, entonces el sistema bloquea la asociación.
    
    **Trazabilidad:** RF-03 / CU-10 / RF-02
    

### HU-20 Consultar carga

**Como** Operador/Gerente/Admin, **quiero** consultar cargas y su contenedor asociado, **para** rastrear y verificar información logística.

**CA**

- Cuando consulto por ID/filtros (cliente/contenedor/sede), entonces veo detalles completos.
    
    **Trazabilidad:** RF-03 / CU-11 / RF-07
    

### HU-21 Actualizar carga

**Como** Operador o Administrador, **quiero** actualizar peso/volumen/embalaje/cliente asociado, **para** corregir o ajustar datos antes del envío.

**CA**

- Cuando actualizo datos, entonces queda auditado.
- Si la carga ya está en una etapa “bloqueada” por trazabilidad (según reglas), entonces el sistema debe impedir o exigir corrección controlada.
    
    **Trazabilidad:** RF-03 / CU-12 / RNF-02 / RNF-07 / CU-41
    

---

## 6) Puertos y rutas marítimas (RF-04)

### HU-22 Registrar puerto

**Como** Administrador, **quiero** registrar un puerto, **para** mantener un catálogo cuando no exista uno previo.

**CA**

- Cuando registro puerto con ubicación, país y tipo, entonces queda disponible para rutas.
    
    **Trazabilidad:** RF-04 / CU-13
    

### HU-23 Consultar puertos

**Como** Operador/Gerente, **quiero** consultar puertos, **para** seleccionar puertos válidos en rutas y operaciones.

**CA**

- Cuando consulto puertos con filtros, entonces obtengo resultados.
    
    **Trazabilidad:** RF-04 / CU-14
    

### HU-24 Registrar ruta marítima

**Como** Operador o Administrador, **quiero** registrar una ruta con puerto de salida y llegada, tiempos estimados y ubicación geográfica, **para** planear y ejecutar envíos.

**CA**

- Cuando registro ruta con puertos válidos, entonces se guarda.
- No se permite crear ruta con puertos inexistentes.
    
    **Trazabilidad:** RF-04 / CU-15 / CU-14
    

### HU-25 Consultar ruta marítima

**Como** Operador o Gerente, **quiero** consultar rutas, **para** planificar y validar trayectos.

**CA**

- Cuando consulto rutas por puertos o sede, entonces veo tiempos estimados.
    
    **Trazabilidad:** RF-04 / CU-16 / RF-07
    

### HU-26 Actualizar ruta marítima

**Como** Operador o Administrador, **quiero** actualizar puertos, tiempos estimados y ubicación geográfica de una ruta, **para** mantener planeación realista.

**CA**

- Cuando actualizo ruta, entonces queda auditado.
    
    **Trazabilidad:** RF-04 / CU-17 / RNF-07
    

---

## 7) Trazabilidad del envío y estado actual (RF-05 + RNF-05/RNF-09)

### HU-27 Registrar evento de trazabilidad

**Como** Operador, **quiero** registrar un evento (fecha, tipo, responsable, observaciones), **para** construir la trazabilidad completa del envío.

**CA**

- Cuando registro un evento con campos obligatorios, entonces se agrega a la línea de tiempo.
- El evento debe quedar asociado a contenedor/envío (según modelo).
    
    **Trazabilidad:** RF-05 / CU-18
    

### HU-28 Consultar eventos por contenedor/envío

**Como** Operador/Gerente/Auditor, **quiero** consultar eventos de trazabilidad de un contenedor/envío, **para** auditar el proceso y tomar decisiones.

**CA**

- Cuando consulto por contenedor, entonces veo eventos ordenados por fecha.
    
    **Trazabilidad:** RF-05 / CU-19
    

### HU-29 Visualizar línea de tiempo del envío

**Como** Operador/Gerente/Auditor, **quiero** visualizar la línea de tiempo completa del envío, **para** entender el recorrido y estado del proceso.

**CA**

- Dado un contenedor/envío, cuando abro la línea de tiempo, entonces veo eventos con fecha, tipo, responsable y observaciones.
    
    **Trazabilidad:** RF-05 / CU-20 (incluye CU-19)
    

### HU-30 Consultar estado actual del contenedor

**Como** Operador/Gerente/Admin, **quiero** consultar el estado actual del contenedor derivado del último evento, **para** tener seguimiento operativo inmediato.

**CA**

- Dado un contenedor con eventos, cuando consulto estado actual, entonces retorna el último estado vigente.
- Si no hay eventos, entonces muestra estado inicial o “sin trazabilidad”.
    
    **Trazabilidad:** RF-05 / CU-21 / RNF-05
    

### HU-31 Actualización inmediata de estado y ubicación tras registrar evento

**Como** Operador/Admin, **quiero** que al registrar un evento se actualice inmediatamente el estado y ubicación, **para** asegurar consistencia en tiempo real.

**CA**

- Cuando registro un evento que implique cambio de estado/ubicación, entonces se refleja al instante en el contenedor.
    
    **Trazabilidad:** RNF-09 / RNF-05 / CU-42 / CU-18
    

### HU-32 Panel de consulta rápida en tiempo real

**Como** Operador/Gerente/Admin, **quiero** un panel/consulta rápida del estado actual, **para** monitorear operación en vivo.

**CA**

- Cuando busco por código de contenedor, entonces veo estado y ubicación actual sin demoras perceptibles.
    
    **Trazabilidad:** RNF-05 / RNF-09 / CU-43 (incluye CU-42)
    

---

## 8) Asignación de responsables por evento (RF-06)

### HU-33 Asignar responsable a un evento

**Como** Operador/Gerente/Admin, **quiero** asignar un responsable a un evento, **para** garantizar trazabilidad de quién ejecutó cada etapa.

**CA**

- Dado un evento existente, cuando asigno responsable, entonces queda vinculado y auditado.
    
    **Trazabilidad:** RF-06 / CU-22 / RNF-07
    

### HU-34 Cambiar responsable de un evento (condicionado)

**Como** Gerente/Admin, **quiero** cambiar el responsable de un evento, **para** corregir asignaciones cuando el proceso lo permita.

**CA**

- Si las reglas permiten cambio, cuando cambio responsable, entonces queda el nuevo responsable.
- Debe guardarse el historial del cambio.
    
    **Trazabilidad:** RF-06 / CU-23 / RNF-07
    

### HU-35 Consultar responsables por evento/proceso

**Como** Operador/Gerente/Admin/Auditor, **quiero** consultar responsables por evento o por proceso, **para** auditar y gestionar accountability.

**CA**

- Cuando consulto responsables por contenedor, entonces veo responsable por cada evento.
    
    **Trazabilidad:** RF-06 / CU-24
    

---

## 9) Clientes (RF-08)

### HU-36 Registrar cliente (persona/empresa)

**Como** Operador o Admin, **quiero** registrar clientes como persona natural o empresa, **para** asociarlos a cargas y contratos.

**CA**

- Cuando registro cliente tipo persona/empresa con datos obligatorios, entonces queda guardado.
    
    **Trazabilidad:** RF-08 / CU-30
    

### HU-37 Consultar cliente

**Como** Operador/Gerente/Admin, **quiero** consultar clientes, **para** seleccionar el cliente en cargas y contratos.

**CA**

- Cuando busco por identificación/nombre, entonces obtengo el cliente.
    
    **Trazabilidad:** RF-08 / CU-31
    

### HU-38 Actualizar cliente

**Como** Gerente o Admin, **quiero** actualizar datos del cliente, **para** mantener información correcta.

**CA**

- Cuando actualizo, entonces queda auditado.
    
    **Trazabilidad:** RF-08 / CU-32 / RNF-07
    

### HU-39 Asociar cliente a carga

**Como** Operador/Gerente/Admin, **quiero** asociar un cliente a una carga, **para** mantener trazabilidad comercial del envío.

**CA**

- Dada una carga existente, cuando asigno cliente existente, entonces queda asociado.
    
    **Trazabilidad:** RF-08 / CU-33 (incluye CU-31) / RF-03
    

### HU-40 Asociar cliente a contrato

**Como** Gerente/Admin, **quiero** asociar un cliente a un contrato, **para** soportar gestión contractual y trazabilidad legal.

**CA**

- Dado un contrato, cuando asocio un cliente, entonces queda vinculado.
    
    **Trazabilidad:** RF-08 / CU-34 (incluye CU-31)
    

---

## 10) ERP básico: contratos, presupuestos y empleados (derivado de narrativa)

### HU-41 Registrar contrato

**Como** Área administrativa/financiera o Gerente, **quiero** registrar un contrato asociado a un cliente, **para** formalizar la operación y soportar auditoría.

**CA**

- Cuando registro contrato con cliente asociado, entonces queda disponible para consulta.
    
    **Trazabilidad:** Narrativa(alcance ERP) / RF-08 (asociación a contrato) / CU-34
    

### HU-42 Consultar contratos

**Como** Área administrativa/financiera o Auditor, **quiero** consultar contratos, **para** validar soporte documental y operación.

**CA**

- Cuando consulto contratos por cliente/sede, entonces veo detalles.
    
    **Trazabilidad:** Narrativa(ERP) / RNF-01 (roles)
    

### HU-43 Registrar presupuesto asociado a operación

**Como** Área administrativa/financiera o Gerente, **quiero** registrar presupuestos por sede y/o por operación, **para** controlar costos asociados al envío.

**CA**

- Cuando registro presupuesto, entonces queda asociado a sede y queda auditado.
    
    **Trazabilidad:** Narrativa(ERP) / RF-07 / RNF-07
    

### HU-44 Consultar ejecución de presupuesto

**Como** Gerente/Financiero, **quiero** consultar presupuestos y su estado, **para** tomar decisiones administrativas.

**CA**

- Cuando consulto por sede y periodo, entonces obtengo datos.
    
    **Trazabilidad:** Narrativa(ERP) / RF-07
    

### HU-45 Registrar personal (empleados)

**Como** Administrador o Gerente, **quiero** registrar personal con rol, sede y responsabilidades, **para** asignarlo en eventos y procesos.

**CA**

- Cuando registro personal, entonces queda disponible para asignación a eventos.
    
    **Trazabilidad:** Narrativa(elementos) / RF-06
    

### HU-46 Consultar personal por sede/rol

**Como** Gerente u Operador, **quiero** consultar personal por sede y rol, **para** asignar responsables correctamente.

**CA**

- Cuando filtro por sede/rol, entonces veo lista elegible.
    
    **Trazabilidad:** Narrativa(personal) / RF-06 / RF-07
    

### HU-47 Exportar información financiera a sistemas contables

**Como** Área administrativa/financiera, **quiero** exportar información financiera relevante, **para** interoperar con sistemas contables existentes y obligaciones tributarias.

**CA**

- Cuando selecciono rango/criterio, entonces el sistema genera una exportación (formato acordado).
    
    **Trazabilidad:** Narrativa(interoperabilidad contable)
    

---

## 11) Integridad, auditoría y correcciones controladas (RNF-02 / RNF-07)

### HU-48 Registrar auditoría de cambios

**Como** Administrador, **quiero** que el sistema registre auditoría de cambios relevantes, **para** soportar revisiones internas/externas.

**CA**

- Cuando se crea/actualiza/elimina lógicamente un registro relevante, entonces se guarda quién/cuándo/qué cambió.
    
    **Trazabilidad:** RNF-02 / RNF-07 / CU-39
    

### HU-49 Consultar auditoría / historial de cambios

**Como** Operador/Auditor/Admin, **quiero** consultar auditoría de cambios, **para** validar integridad y responsabilidades.

**CA**

- Cuando consulto auditoría por entidad y fecha, entonces veo el historial.
    
    **Trazabilidad:** RNF-07 / CU-40
    

### HU-50 Bloquear modificación directa de trazabilidad

**Como** sistema/administración, **quiero** impedir edición directa de eventos históricos de trazabilidad, **para** mantener integridad y confianza del seguimiento.

**CA**

- Cuando intento editar un evento histórico, entonces el sistema lo bloquea.
    
    **Trazabilidad:** RNF-02 / CU-41
    

### HU-51 Solicitar corrección con evidencia

**Como** Operador o Admin, **quiero** solicitar una corrección de trazabilidad con justificación y evidencia, **para** corregir errores sin perder auditabilidad.

**CA**

- Cuando creo una solicitud con evidencia adjunta, entonces se registra auditoría y se vincula al evento afectado.
- Debe quedar rastro de aprobación/ejecución (si aplica).
    
    **Trazabilidad:** RNF-02 / RNF-07 / SC (incluye CU-39 y extiende CU-41)
    

---

## 12) Respaldo y recuperación (RNF-10)

### HU-52 Respaldo periódico automático

**Como** Administrador y como sistema de respaldo, **quiero** ejecutar respaldos automáticos por política, **para** evitar pérdida de información operativa y financiera.

**CA**

- Dado un horario/política, cuando llega el momento, entonces se genera respaldo automáticamente.
- Se registra bitácora del respaldo.
    
    **Trazabilidad:** RNF-10 / CU-44
    

### HU-53 Restaurar desde respaldo

**Como** Administrador u Operador autorizado, **quiero** restaurar información desde un respaldo, **para** recuperar el sistema ante fallos.

**CA**

- Dado un punto de respaldo, cuando solicito restauración, entonces se valida y se restaura.
- Se registra auditoría de la restauración.
    
    **Trazabilidad:** RNF-10 / CU-45 (incluye CU-44) / RNF-07
    

---