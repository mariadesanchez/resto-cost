# Descripción

<!-- Para instalar Prisma en el proyecto e inicializarlo
npm install prisma --save-dev
npx prisma init --datasource-provider PostgreSQL -->
<!-- Para la autenticación usamos Auth.js 
https://authjs.dev/getting-started/providers/oauth-tutorial


npm install next-auth@beta

para que sea la version 5 o superior
vamos a la carpeta api y creamos auth/[...nextauth]
ejecutamos en consola el siguiente comando para generar un código único:
openssl rand -base64 32
AUTH_SECRET="JXN6MEHZv3dEkdeKGwYx1/c/NivQvlAtPAldC+bk+WE=" -->

<!-- Cloudinary

npm install cloudinary
ir a Dashboard API environment variable
CLOUDINARY_URL=cloudinary://...----.... -->




1. Clonar el repositorio.
2. Crear una copia del ```.env.template``` y renombrarlo a ```.env``` y cambiar las variables de entorno.
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ``docker compose up -d````
5. Correr las migraciones de Primsa ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
7. Correr el proyecto ```npm run dev```
8. Limpiar el localStorage del navegador.


