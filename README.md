# Sistema de Gestión de Almuerzos Corporativos con QR

## Descripción

Aplicación web completa para la gestión de almuerzos corporativos que permite registrar empleados, generar códigos QR personalizados, escanear QR en el punto de entrega para marcar recepción de almuerzo, generar tickets de comprobante y consultar reportes detallados.

## Stack Técnico

- **Frontend**: React 18 + Vite + Tailwind CSS v3
- **Backend**: Node.js + Express.js (API REST)
- **Base de datos**: MySQL 8
- **ORM**: Sequelize
- **Autenticación**: JWT (roles: admin, operador)
- **QR**: librería `qrcode` (Node) para generación, `html5-qrcode` (React) para escaneo
- **Excel export**: librería `xlsx` (SheetJS) en el backend
- **Estructura**: Monorepo `/client` y `/server`

## Características Principales

1. **Gestión de Empleados**: CRUD completo con generación automática de códigos QR
2. **Escaneo QR**: Punto de entrega con escaneo en tiempo real usando cámara o entrada manual
3. **Tickets**: Generación de comprobantes únicos con formato ALM-YYYYMMDD-XXXX
4. **Reportes**: 
   - Tabla semanal de asistencia
   - Historial por empleado
   - Boleta diaria para el restaurante
   - Exportación a Excel
5. **Gestión de Usuarios**: Administración de roles y permisos (solo admin)
6. **Seguridad**: Autenticación JWT, validación de datos, manejo de errores

## Reglas de Negocio

- 1 almuerzo por día por empleado (evita duplicados)
- QR autogenerado con datos del empleado firmados
- Scanner siempre activo con feedback visual
- Soporte para lectores físicos de código de barras
- Códigos de ticket únicos e irrepetibles
- Soft delete para preservar historial
- Zona horaria: America/Bogota (UTC-5)

## Instalación

### Requisitos Previos

- Node.js (v16 o superior)
- MySQL (v8 o superior)
- Git

### Pasos de Instalación

1. Clonar el repositorio:
   ```
   git clone <repository-url>
   cd almuerzo-app
   ```

2. Instalar dependencias del backend:
   ```
   cd server
   npm install
   ```

3. Instalar dependencias del frontend:
   ```
   cd ../client
   npm install
   ```

4. Configurar variables de entorno:
   ```
   cd ../server
   cp .env.example .env
   # Editar .env con sus credenciales de MySQL y otras configuraciones
   ```

5. Inicializar la base de datos:
   ```
   npm run migrate
   npm run seed
   ```

6. Iniciar los servicios:
   - Backend: `npm run dev` (puerto 3001)
   - Frontend: `npm run dev` (puerto 3000)

## Usuarios de Prueba

El sistema incluye usuarios de prueba basados en datos reales de otro sistema:

### Administradores (credenciales: cualquiera de estos correos con contraseña 'he5com22')
- coordinador.administrativo@duvyclass.co (Neidy Bustos)
- asistentesistemas@duvyclass.co (Jhon Reyes)
- cesar.orozco@duvyclass.co (Cesar Orozco)
- admin@duvyclass.co (Bryan Muñoz)

### Operadores (credenciales: cualquiera de estos correos con contraseña 'Duvy.2025')
- yohana.gil@duvyclass.co (Yohana Gil - Archivo)
- analista.calidad@duvyclass.co (Área de Calidad)
- jefe.bodegapt@duvyclass.co (Blanca Marcelo - Cadena de Abastecimiento)
- analista.compras@duvyclass.co (Laura Ruge - Compras)
- analista.contable@duvyclass.co (Jimena Ponguta - Contabilidad)
- analista.facturacion1@duvyclass.co (Sharoll Peñafiel - Facturación)
- comercioexterior@duvyclass.co (Gabriela Juyo - Gerencia)
- planeacion1@duvyclass.co (Heylen Naranjo - Logística)
- analista.mercadeo@duvyclass.co (Eliana Granados - Mercadeo)
- alvaro.chimbi@duvyclass.co (Alvaro Chimbi - Producción)
- analista.talentohumano@duvyclass.co (Kelly Villareal - RRHH)
- callcenter1@duvyclass.co (Cristian Enciso - SAC)
- servicioalcliente3@duvyclass.co (Nelson Vargas - Servicio al Cliente)
- gestionambiental@duvyclass.co (Ambiental - SST/Ambiental)
- tesoreria@duvyclass.co (Pilar Chaurra - Tesorería)
- direccion.ventas@duvyclass.co (Alexandro Cabrera - Ventas)

**Nota**: Algunos campos del sistema original (como username, ID interno, teléfonos corporativos) no se utilizan en este sistema y se dejaron vacío según las indicaciones.

## Acceso al Sistema

1. Acceder a http://localhost:3000
2. Iniciar sesión con cualquiera de las credenciales de prueba acima
3. Navegar por las diferentes secciones según su rol:
   - Administradores: Acceso completo (CRUD de empleados, usuarios, eliminación de registros)
   - Operadores: Acceso limitado (solo escáner y reportes)

## Documentación de la API

Consulte los archivos de rutas en `/server/src/routes/` para ver todos los endpoints disponibles.

## Licencia

MIT