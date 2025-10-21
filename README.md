# 📚 Ellie Library

¡Bienvenido a Ellie Library! Un sistema moderno para la gestión de bibliotecas, pensado para ser fácil de usar, visualmente atractivo y totalmente personalizable.

---

## 🚀 Características principales

- **Gestión de libros**: Alta, edición y devolución de ejemplares.
- **Gestión de socios**: Registro, control de préstamos y multas.
- **Préstamos y devoluciones**: Flujos claros y notificaciones visuales.
- **Interfaz intuitiva**: Navegación rápida, diseño responsivo y notificaciones globales.
- **Validaciones inteligentes**: Evita duplicados, controla multas y préstamos activos.
- **Panel de administración**: Dashboard con acceso rápido a todas las funciones.
- **Estilo moderno**: Botones redondeados, colores neutros y componentes visuales.

---

## 🖼️ Vista rápida

![Logo Ellie](./apps/web/public/assets/logo.png)

---

## ⚡ Instalación rápida

1. Clona el repositorio:
   ```bash
   git clone https://github.com/acevedo-daniel/ellie-library.git
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura tu base de datos en `.env` (ejemplo para Postgres):
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/ellie"
   ```
4. Aplica migraciones:
   ```bash
   npx prisma migrate deploy
   ```
5. Inicia el proyecto:
   ```bash
   npm run dev
   ```

---

## 🛠️ Estructura del proyecto

```
ellie-library/
├─ apps/
│  ├─ api/        # Backend Express + Prisma
│  └─ web/        # Frontend React + Vite + Tailwind
├─ packages/
│  └─ contracts/  # Tipos y validaciones compartidas
├─ .env           # Variables de entorno
├─ .gitignore     # Ignora node_modules y archivos sensibles
└─ README.md      # Este archivo
```

---

## 💡 Contacto y soporte

- Email: info@ellielibrary.com
- Teléfono: +54 11 1234-5678
- [Privacidad](#) | [Términos](#)

---

## ✨ Frase inspiradora

> “Un libro es un sueño que tienes en tus manos.”

---

## 🖥️ Demo visual

![Demo Ellie Library](./apps/web/public/assets/logo.png)

---

## 🏷️ Licencia

MIT

---

¡Gracias por usar Ellie Library! Si tienes dudas, sugerencias o quieres contribuir, no dudes en contactarnos o abrir un issue en GitHub.
