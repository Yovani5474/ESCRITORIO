# Funcionalidades Adicionales Sugeridas

Este documento enumera funcionalidades opcionales que podrían agregarse al sistema de alquiler de canchas y juegos de mesa, organizadas por prioridad.

---

## 🔴 ALTA PRIORIDAD (Recomendadas)

### 1. Sistema de Pagos
Muy importante para un sistema de alquiler comercial.

**Tablas sugeridas:**
- `metodos_pago`: Efectivo, tarjeta, transferencia, billetera digital
- `pagos`: Historial de pagos de reservas
- `facturas`: Generación de facturas/receipts

**Endpoints:**
- `POST /api/pagos/procesar` - Procesar pago de reserva
- `GET /api/pagos/{id_reserva}` - Ver estado de pago
- `GET /api/facturas/{id_factura}` - Descargar factura
- `POST /api/pagos/reembolso` - Procesar reembolso

**Campos en `reservas`:**
- `estado_pago`: `pendiente`, `pagado`, `reembolsado`, `fallido`
- `monto_pagado`: DECIMAL
- `fecha_pago`: TIMESTAMP

---

### 2. Sistema de Calificaciones y Reseñas
Permite evaluar canchas, árbitros, espacios de juegos.

**Tablas sugeridas:**
- `calificaciones`: Calificaciones de canchas, árbitros, espacios
- `resenas`: Comentarios detallados

**Endpoints:**
- `POST /api/canchas/{id_cancha}/calificar` - Calificar cancha
- `POST /api/arbitros/{id_arbitro}/calificar` - Calificar árbitro
- `POST /api/espacios-juegos-mesa/{id_espacio}/calificar` - Calificar espacio
- `GET /api/calificaciones/{entidad}/{id}` - Ver calificaciones

**Campos adicionales en `canchas` y `espacios_juegos_mesa`:**
- `calificacion_promedio`: DECIMAL
- `numero_calificaciones`: INT

---

### 3. Sistema de Multas y Sanciones
Para penalizar cancelaciones tardías o no presentarse.

**Tablas sugeridas:**
- `sanciones`: Registro de sanciones a usuarios
- `reglas_sanciones`: Configuración de penalizaciones

**Endpoints:**
- `POST /api/sanciones/aplicar` - Aplicar sanción (automático o manual)
- `GET /api/usuarios/{id_usuario}/sanciones` - Ver sanciones de usuario
- `PUT /api/sanciones/{id_sancion}/levantar` - Levantar sanción

**Reglas típicas:**
- Cancelación < 24h antes: 50% del valor
- No presentarse: 100% del valor + bloqueo temporal
- 3 no-presentaciones: Bloqueo de 30 días

---

### 4. Sistema de Descuentos y Promociones
Para incentivar el uso frecuente.

**Tablas sugeridas:**
- `descuentos`: Códigos de descuento, promociones
- `descuentos_usuarios`: Relación usuario-descuento usado

**Endpoints:**
- `POST /api/descuentos/validar` - Validar código de descuento
- `POST /api/descuentos/aplicar` - Aplicar descuento a reserva
- `GET /api/descuentos/activos` - Listar descuentos disponibles

**Tipos de descuentos:**
- Porcentaje (ej: 20% off)
- Monto fijo (ej: $10 off)
- Descuento estudiantil (automático por carrera)
- Descuento por frecuencia (X reservas = 1 gratis)

---

## 🟡 PRIORIDAD MEDIA (Útiles pero no críticas)

### 5. Sistema de Torneos Deportivos
Extensión del sistema de torneos para deportes (fútbol, vóley, etc.).

**Tablas sugeridas:**
- `torneos_deportivos`: Similar a torneos_juegos_mesa pero para deportes
- `partidos_torneo`: Partidos de torneos deportivos
- `tabla_posiciones`: Ranking de equipos en torneo

**Endpoints:**
- Similar a módulo L pero adaptado para deportes
- Generación automática de fixture
- Actualización de tabla de posiciones

---

### 6. Reservas Recurrentes
Permite reservar automáticamente (ej: todos los viernes a las 18h).

**Tablas sugeridas:**
- `reservas_recurrentes`: Configuración de reservas recurrentes
- `instancias_reserva`: Cada reserva individual generada

**Endpoints:**
- `POST /api/reservas/recurrentes` - Crear reserva recurrente
- `GET /api/reservas/recurrentes/{id}` - Ver configuración
- `PUT /api/reservas/recurrentes/{id}/pausar` - Pausar temporalmente
- `DELETE /api/reservas/recurrentes/{id}` - Cancelar reservas futuras

---

### 7. Sistema de Estadísticas Detalladas
Analytics para usuarios, equipos, administradores.

**Endpoints:**
- `GET /api/estadisticas/usuario/{id_usuario}` - Estadísticas personales
- `GET /api/estadisticas/equipo/{id_equipo}` - Estadísticas de equipo
- `GET /api/estadisticas/admin/uso-canchas` - Uso de canchas (admin)
- `GET /api/estadisticas/admin/ingresos` - Reporte de ingresos (admin)

**Métricas:**
- Partidos jugados, ganados, perdidos
- Tiempo total jugado
- Canchas más utilizadas
- Horarios pico
- Ingresos por período

---

### 8. Gestión de Horarios Especiales
Feriados, horarios de verano, mantenimiento programado.

**Tablas sugeridas:**
- `horarios_especiales`: Días/horarios especiales
- `bloqueos_calendario`: Períodos donde no se permiten reservas

**Endpoints:**
- `POST /api/admin/horarios-especiales` - Crear horario especial
- `GET /api/horarios-especiales` - Listar horarios especiales activos
- `DELETE /api/admin/horarios-especiales/{id}` - Eliminar

**Tipos:**
- Feriado (cierre total)
- Horario de verano (horarios modificados)
- Mantenimiento programado (cancha específica)

---

### 9. Sistema de Noticias/Eventos
Comunicaciones del instituto a usuarios.

**Tablas sugeridas:**
- `noticias_publicas`: Anuncios, eventos, noticias
- `noticias_leidas`: Registro de usuarios que leyeron cada noticia

**Endpoints:**
- `GET /api/noticias` - Listar noticias activas
- `POST /api/admin/noticias` - Crear noticia (admin)
- `PUT /api/noticias/{id}/marcar-leida` - Marcar como leída

**Tipos de contenido:**
- Anuncios del instituto
- Eventos especiales
- Cambios en horarios
- Nuevos torneos

---

## 🟢 BAJA PRIORIDAD (Opcionales/Nice-to-have)

### 10. Gestión de Inventario
Control de materiales deportivos, equipos, tableros de ajedrez.

**Tablas sugeridas:**
- `inventario`: Catálogo de items
- `prestamos_inventario`: Registro de préstamos

**Endpoints:**
- `GET /api/inventario` - Listar items disponibles
- `POST /api/inventario/prestar` - Registrar préstamo
- `PUT /api/inventario/devolver` - Registrar devolución

---

### 11. Sistema de Suscripciones/Membresías
Planes mensuales para uso frecuente.

**Tablas sugeridas:**
- `planes_suscripcion`: Tipos de planes
- `suscripciones_usuario`: Suscripciones activas

**Endpoints:**
- `GET /api/planes-suscripcion` - Listar planes disponibles
- `POST /api/suscripciones/activar` - Activar suscripción
- `GET /api/suscripciones/usuario/{id}` - Ver suscripción

**Beneficios:**
- X reservas gratis al mes
- Descuento en reservas adicionales
- Prioridad en asignación de horarios

---

### 12. Integración con Calendarios Externos
Sincronización con Google Calendar, Outlook, etc.

**Endpoints:**
- `GET /api/reservas/{id}/ical` - Generar archivo iCal
- `POST /api/calendarios/conectar` - Conectar Google Calendar
- `DELETE /api/calendarios/desconectar` - Desconectar

---

### 13. Sistema de Chat/Mensajería
Comunicación entre equipos, jugadores, administradores.

**Tablas sugeridas:**
- `conversaciones`: Grupos de chat
- `mensajes`: Mensajes individuales

**Endpoints:**
- `GET /api/conversaciones` - Listar conversaciones
- `POST /api/conversaciones/{id}/mensajes` - Enviar mensaje
- `GET /api/conversaciones/{id}/mensajes` - Ver mensajes

---

### 14. Transmisión/Streaming
Para partidos importantes o torneos.

**Tablas sugeridas:**
- `transmisiones`: Configuración de streams
- `transmisiones_reservas`: Relación transmisión-reserva

**Endpoints:**
- `POST /api/transmisiones/iniciar` - Iniciar transmisión
- `GET /api/transmisiones/{id}` - Ver URL de transmisión
- `POST /api/transmisiones/detener` - Detener transmisión

---

### 15. Sistema de Referidos
Programa de referidos para ganar descuentos.

**Tablas sugeridas:**
- `codigos_referido`: Códigos únicos por usuario
- `referidos`: Registro de referidos exitosos

**Endpoints:**
- `GET /api/referidos/mi-codigo` - Obtener código de referido
- `POST /api/referidos/aplicar` - Aplicar código de referido al registrarse
- `GET /api/referidos/historial` - Ver referidos realizados

---

### 16. API para Apps Móviles
Endpoints optimizados para apps móviles (version simplificada).

**Endpoints:**
- `GET /api/mobile/deportes` - Lista ligera de deportes
- `GET /api/mobile/mis-reservas` - Reservas del usuario actual
- `POST /api/mobile/reservas-rapidas` - Reserva rápida con datos mínimos

---

### 17. Sistema de Auditoría
Logs de cambios para seguridad y trazabilidad.

**Tablas sugeridas:**
- `auditoria`: Registro de todas las acciones importantes

**Campos:**
- `id_usuario`: Quién realizó la acción
- `accion`: Tipo de acción (crear, modificar, eliminar)
- `entidad`: Tabla afectada
- `id_entidad`: ID del registro afectado
- `valor_anterior`: JSON con valor antes del cambio
- `valor_nuevo`: JSON con valor después del cambio
- `fecha_accion`: TIMESTAMP
- `ip_address`: IP desde donde se realizó la acción

---

### 18. Sistema de Notificaciones Push
Para apps móviles (más allá de notificaciones web).

**Endpoints:**
- `POST /api/notificaciones/push/registrar-device` - Registrar dispositivo móvil
- `POST /api/notificaciones/push/enviar` - Enviar notificación push
- `DELETE /api/notificaciones/push/desregistrar` - Eliminar dispositivo

---

### 19. Gestión de Roles Avanzada
Roles más granulares con permisos específicos.

**Tablas sugeridas:**
- `roles`: Definición de roles
- `permisos`: Catálogo de permisos
- `roles_permisos`: Relación rol-permiso
- `usuarios_roles`: Roles asignados a usuarios

**Endpoints:**
- `GET /api/roles` - Listar roles disponibles
- `POST /api/admin/roles` - Crear nuevo rol
- `POST /api/admin/roles/{id}/permisos` - Asignar permisos a rol
- `POST /api/admin/usuarios/{id}/roles` - Asignar rol a usuario

---

### 20. Sistema de Backup/Restore
Para protección de datos importantes.

**Endpoints:**
- `POST /api/admin/backup/crear` - Crear backup (admin)
- `GET /api/admin/backup/listar` - Listar backups disponibles (admin)
- `POST /api/admin/backup/restaurar` - Restaurar desde backup (admin)

---

## 📊 Resumen de Prioridades

### Implementar primero (Fase 1):
1. Sistema de Pagos
2. Sistema de Calificaciones y Reseñas
3. Sistema de Multas y Sanciones
4. Sistema de Descuentos y Promociones

### Implementar después (Fase 2):
5. Sistema de Torneos Deportivos
6. Reservas Recurrentes
7. Sistema de Estadísticas Detalladas
8. Gestión de Horarios Especiales
9. Sistema de Noticias/Eventos

### Implementar si hay tiempo/demanda (Fase 3):
10-20: Funcionalidades opcionales según necesidades específicas

---

## 🎯 Recomendación

Para un MVP (Producto Mínimo Viable) enfocado en un instituto educativo, recomiendo implementar:

**Obligatorio:**
- ✅ Documentación actual (deportes, juegos de mesa, carreras, torneos)

**Muy recomendado:**
- 💰 Sistema de Pagos
- ⭐ Sistema de Calificaciones y Reseñas
- 📢 Sistema de Noticias/Eventos (para comunicaciones del instituto)

**Recomendado si hay tiempo:**
- 📊 Sistema de Estadísticas Detalladas
- 🎁 Sistema de Descuentos (especialmente descuento estudiantil automático)

**Opcional:**
- Sistema de Torneos Deportivos (si hay demanda de torneos de fútbol/vóley)
- Reservas Recurrentes (si hay equipos que entrenan regularmente)
