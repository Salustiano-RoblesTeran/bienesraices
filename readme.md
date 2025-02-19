# Real Estate Property Management System

Este software proporciona una plataforma integral para la gestión de propiedades de bienes raíces, permitiendo a los usuarios publicar y buscar propiedades en diversas categorías. La aplicación está diseñada para facilitar la compra, venta y alquiler de inmuebles, ofreciendo una experiencia interactiva y fácil de usar.


---

## 🌟 Características

### 💪 Funcionalidades para Usuarios

#### 📊 Operaciones CRUD:
- Panel de control con resumen de publicaciones, solicitudes de contacto y actualizaciones de propiedades.

#### 🛠️ Gestión de Publicaciones:
- Crear, actualizar y eliminar propiedades en distintas categorías: Casas, Departamentos, Comercios, Terrenos y Cabañas.

#### 🏙️ Visualización en Mapa:
- Tiene un mapa donde se pueden ver las propiedades de la zona. Tambien tiene filtros como categorias y rangos de precios.

---

### 👤 Funcionalidades para Usuarios No Logueados

#### 🔍 Exploración de Propiedades:
- Los usuarios pueden buscar propiedades filtrando por categoría y ubicación. También cuenta con un mapa donde pueden ver las propiedades.

![Home](/public/assets/img/home.png)

#### 🌏 Ver Propiedades:
- Los usuarios que no estén logueados pueden acceder a las propiedades para ver más información sobre las mismas.

![Propiedad](/public/assets/img/propiedadSinLog.png)

#### 📩 Contacto Directo (requiere inicio de sesión):
- Los usuarios pueden contactar al vendedor mediante un formulario integrado en cada publicación.

![Usuario Logueado](/public/assets/img/propiedadConLog.png)

### 📝 Publicación de Propiedades (requiere inicio de sesión):
- Los usuarios pueden publicar propiedades.

![Publicar Propiedad](/public/assets/img/publicar.png)

### 📈 Panel de Control (requiere inicio de sesión):
- Los usuarios logueados pueden administrar sus propiedades (publicarlas, editarlas, eliminarlas).

![Dashboard](/public/assets/img/dashboard.png)

---

## 💻 Stack Tecnológico

- **Frontend:** Pug, Tailwind CSS, Dropzone
- **Backend:** Express.js, Node.js
- **Base de Datos:** MySQL, Sequelize
- **Autenticación y Seguridad:** Bcrypt, JSON Web Tokens (JWT), CSURF, Cookie-parser
- **Email y Archivos:** Nodemailer, Multer
- **Herramientas de Desarrollo:** Webpack, PostCSS, Nodemon, Concurrently

---

## 🔄 Instalación

### 🚀 Ejecución

```bash
npm run dev
```
Inicia la aplicación en modo desarrollo. Los cambios en el código fuente serán reflejados automáticamente.

```bash
npm run server
```
Inicia el servidor con **Nodemon**, lo que permite reinicios automáticos al modificar el código del backend.

```bash
npm run css
```
Compila el CSS de **Tailwind** usando **PostCSS** y observa cambios en tiempo real.

```bash
npm run js
```
Ejecuta Webpack en modo observación para compilar archivos JavaScript.

```bash
npm run db:importar
```
Importa datos iniciales a la base de datos.

```bash
npm run db:eliminar
```
Elimina datos de la base de datos.

---

## 🛠️ Contribuciones
Si deseas contribuir al proyecto, no dudes en enviar un **pull request** o reportar problemas en el repositorio.

---

🌟 **Facilitando la compra, venta y alquiler de propiedades.** 🌟

---

## 📞 Contacto

**Desarrollador:** Salustiano Robles Terán  
📧 [saluroblesteran@gmail.com](mailto:saluroblesteran@gmail.com)  
🌐 [saluroblesteran.com](https://saluroblesteran.com)