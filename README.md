# To-do App con TypeScript y React

¡Hola! 👋 Soy un desarrollador apasionado por crear aplicaciones web modernas y eficientes. Este proyecto es una implementación completa de una aplicación de lista de tareas (To-do MVC) construida con tecnologías de vanguardia.

[![Estado de desarrollo](https://img.shields.io/badge/development-%20Active-green.svg)](https://)
[![Estado del deploy](https://img.shields.io/badge/deploy-en%20proceso-yellow.svg)](https://)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![Captura de pantalla de la aplicación To-do](https://via.placeholder.com/800x450.png?text=Próximamente+captura+de+pantalla+o+GIF)
_(Reemplazar con una captura de pantalla o GIF del proyecto)_

## ✨ ¿Por qué este proyecto es interesante?

Este no es solo otro "To-do". Es una demostración de mi capacidad para:

- **Arquitectura de Componentes y Estado**: La aplicación está estructurada con componentes funcionales y reutilizables. El estado global se gestiona de forma predecible y escalable utilizando el hook `useReducer`, encapsulado en un custom hook (`useTodos`) para separar la lógica de la interfaz de usuario.
- **Experiencia de Usuario (UX) Avanzada**: He implementado características que demuestran una atención meticulosa a la experiencia del usuario, como:
  - **Edición intuitiva**: Clic derecho para editar una tarea, con enfoque automático en el campo de texto.
  - **Búsqueda optimizada**: Un `debounce` de 300ms en la barra de búsqueda para evitar renderizados innecesarios y mejorar el rendimiento.
  - **Animaciones fluidas**: Uso de `Framer Motion` para animar la entrada, salida y reordenamiento de las tareas, creando una interfaz dinámica y agradable.
- **Calidad y Robustez del Código**: El uso de **TypeScript** en todo el proyecto garantiza un código fuertemente tipado, más seguro y auto-documentado. Además, la configuración de ESLint asegura un estilo de código consistente y libre de errores comunes.
- **Buenas Prácticas de React**: El proyecto sigue principios como la elevación del estado, el paso de props y la composición de componentes, demostrando un sólido entendimiento del ecosistema de React.

## 🚀 Características Principales

- **CRUD completo de tareas**: Crear, leer, actualizar y eliminar tareas.
- **Marcar como completado**: Cambia el estado de una tarea entre pendiente y completada.
- **Edición de tareas**: Haz clic derecho sobre una tarea para activar el modo de edición.
- **Filtrado de tareas**: Filtra la lista para ver todas las tareas, solo las activas o solo las completadas.
- **Búsqueda con Debounce**: Busca tareas por título de forma eficiente.
- **Deshacer eliminación (Ctrl + Z)**: Recupera hasta las últimas tres tareas eliminadas.
- **Contadores dinámicos**: Muestra el número de tareas pendientes.
- **Eliminar completadas**: Limpia todas las tareas que ya han sido finalizadas.
- **Marcar/Desmarcar todas**: Un checkbox maestro para gestionar todas las tareas a la vez.
- **Animaciones**: Transiciones suaves al agregar, eliminar y filtrar tareas.

## 🛠️ Tecnologías Utilizadas

- **Framework**: React 19
- **Lenguaje**: TypeScript
- **Bundler**: Vite
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Linting**: ESLint

## 👨‍💻 Para Desarrolladores: Instalación y Puesta en Marcha

Si quieres clonar y ejecutar este proyecto en tu máquina local, sigue estos sencillos pasos:

1.  **Clona el repositorio**

    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2.  **Instala las dependencias**
    El proyecto usa `pnpm`.

    ```bash
    pnpm install
    ```

3.  **Ejecuta el servidor de desarrollo**
    Esto iniciará la aplicación en modo de desarrollo en `http://localhost:5173`.

    ```bash
    pnpm run dev
    ```

4.  **¡Listo para codificar!**
    Abre el proyecto en tu editor de código favorito y empieza a explorar.

## 🔮 Próximos Pasos

- [x] Inicializar proyecto con Vite
- [x] Añadir linter para TypeScript + React
- [x] Añadir estilos basicos
- [x] Listar todos los TODOs usando un mock
- [x] Poder borrar un TODO usando mock
- [x] Al presionar Ctrl + Z permita recuperar los ultimos todos borrados.
- [x] Al presionar Ctrl + Z permita recuperar los ultimos movimientos realizados.
- [x] Agregar una busqueda para buscar todos usando onChange
- [x] Agregar un debounce de 300 ms para evitar busquedas innecesarias
- [x] Marcar TODO como completado
- [x] Añadir forma de filtrar TODOs (Footer)
- [x] Mostrar número de TODOs pendientes (Footer)
- [x] Añadir forma de borrar todos los TODOs completados
- [x] Crear Header con input (Header)
- [x] Crear un TODO (Header)
- [x] Poder editar el texto de un TODO (click derecho)
- [x] Añadir animaciones
- [x] Pasar a Reducer
- [ ] Sincronizar con el backend, dejar de usar un mock
- [ ] Persistir el estado en `localStorage` para mantener las tareas entre sesiones.
- [ ] Añadir pruebas unitarias y de integración con Vitest y React Testing Library.
- [ ] Desplegar la aplicación en una plataforma como Vercel o Netlify.
