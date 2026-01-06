# Guía de Contribución

## Cómo Contribuir

Gracias por tu interés en contribuir. Estas son las pautas principales.

## Proceso de Contribución

1. **Fork el repositorio**
2. **Crea una rama** para tu feature: `git checkout -b feature/amazing-feature`
3. **Commit tus cambios**: `git commit -m 'Add amazing feature'`
4. **Push a la rama**: `git push origin feature/amazing-feature`
5. **Abre un Pull Request**

## Estándares de Código

### TypeScript

- Usa TypeScript strict mode
- Documenta funciones públicas con JSDoc
- Evita `any` cuando sea posible
- Prefiere interfaces sobre types para objetos

### React/React Native

- Usa functional components con hooks
- Mantén componentes pequeños y enfocados
- Separa lógica de presentación usando hooks personalizados
- Usa Context API para estado global

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useTransactions.ts`)
- **Utils/Services**: camelCase (`database.ts`)
- **Constants**: UPPER_SNAKE_CASE
- **Variables**: camelCase

### Estructura de Archivos

```
feature/
  ├── components/      # UI components
  ├── hooks/          # Custom hooks
  ├── services/       # Business logic
  ├── types/          # TypeScript interfaces
  └── utils/          # Utility functions
```

## Testing

- Asegúrate de que el código compila sin errores: `npm run build`
- Verifica en iOS, Android y Web cuando sea posible
- Prueba casos edge y manejo de errores

## Commits

### Formato de Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

### Tipos de Commits

- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Cambios en documentación
- `style`: Formato, estilo (no afecta código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de performance
- `test`: Tests
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
feat(transactions): add bulk delete functionality
fix(export): resolve CSV encoding issue on Android
docs(readme): update installation instructions
refactor(hooks): extract common logic to useData hook
```

## Code Review

Los PRs serán revisados considerando:

- Funcionalidad correcta
- Código limpio y mantenible
- Tests apropiados
- Documentación actualizada
- Sin errores de TypeScript
- Performance adecuado

## Reportar Bugs

Usa el template de issue para bugs:

1. **Descripción**: Qué pasó
2. **Pasos para reproducir**: Cómo reproducir el bug
3. **Comportamiento esperado**: Qué debería pasar
4. **Screenshots**: Si aplica
5. **Entorno**: OS, versión de app, dispositivo

## Sugerir Features

Para nuevas features:

1. Abre un issue primero
2. Describe el problema que resuelve
3. Propone la solución
4. Discute antes de implementar

## Recursos

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ARCHITECTURE.md](./ARCHITECTURE.md)

## Preguntas

Si tienes preguntas, abre un issue con la etiqueta `question`.

## Licencia

Al contribuir, aceptas que tus contribuciones sean licenciadas bajo la misma licencia del proyecto.
