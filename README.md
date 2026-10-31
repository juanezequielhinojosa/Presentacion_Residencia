# Presentación Residencia — Universo 3D

Sitio estático del taller **"Emprendimiento Digital: Creación y Despliegue de Tienda Virtual para Productos 3D"** de la **E.E.T. N.° 2 "Dr. Horacio Guzmán"** (San Pedro de Jujuy).

El proyecto reúne el portal de bienvenida y las tres clases del taller, junto con los trabajos prácticos en PDF.

## Contenido

```
index.html                          Portal principal con las 3 clases
public/clase1.html                  Clase 1: Arquitectura & Backend Cloud (Supabase)
public/clase2.html                  Clase 2: Frontend con IA & WhatsApp
public/clase3.html                  Clase 3: Despliegue Cloud & Marketing
public/styles.css                   Estilos del portal
public/img/logo.svg                 Logo de Universo 3D
public/img/qr.png                   Código QR de la tienda en vivo
public/img/universo3d_flyer_qr_funcional.png  Flyer publicitario descargable
public/assets/aistudio/*.pdf        Trabajos prácticos N.° 1, 2 y 3
```

## Requisitos

- Node.js 20.19+ (requerido por Vite 8)
- npm

## Comandos

```bash
npm install     # instala dependencias
npm run dev     # servidor de desarrollo en http://localhost:3000
npm run build   # genera el sitio en dist/
npm run preview # previsualiza el build de producción
```

## Despliegue

El sitio se despliega en Vercel sin configuración adicional:

- Build command: `npm run build`
- Output directory: `dist`
- Variables de entorno: ninguna

## Enlaces

- Tienda en vivo: <https://universo3-owp7mu18p-juan-ad7a.vercel.app/>
- Repositorio: <https://github.com/juanezequielhinojosa/Presentacion_Residencia>

## Nota

Este repositorio contiene únicamente el material de presentación de las clases. La tienda en vivo es el resultado del proyecto construido durante el taller.
