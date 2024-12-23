# Sistema de Gestión de Productos y Órdenes

## Catálogo de Productos

Esta aplicación permite gestionar un catálogo de productos con CRUD.

## Características

- Navegación sencilla y amigable.
- Agrega, edita y elimina registros de productos.
- Crea ordenes directamente desde los Productos.

## Tecnologías Utilizadas

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet) con Clean Architecture, principios SOLID y una base de datos MySQL
- **Gestión de Estado**: React Hooks

## Instalación

Para comenzar, clona este repositorio y sigue los pasos a continuación:

```bash
# Clona el repositorio
git clone https://github.com/jmunoz-transferdirecto/ExamenNet.git
```

## Requisitos Previos
- .NET SDK 7.0
- Node.js y npm
- Docker Desktop
- MySQL 8.0

## Configuración del Proyecto

### Base de Datos
La base de datos se creará automáticamente mediante Docker

1. Para ejecutar el proyecto debera compilar e iniciar los contenedores de docker con el siguiente comando:
```bash
docker-compose up --build
```

##El Backend está en: 
http://localhost:5038/swagger/index.html

##FrontEnd:
http://localhost:3000/

##Las ordenes en:
http://localhost:3000/orders

Si se quiere correr en AWS Cloud Platform:

<img width="343" alt="image" src="https://github.com/user-attachments/assets/88219809-7e43-40ad-9944-7405cb31116c" />
