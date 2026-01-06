# 📝 Notas para Versiones Futuras

Este archivo está en .gitignore y es solo para tus notas personales de desarrollo.

---

## 🚀 v1.1.0 (Próxima versión minor)

### Features planeadas
- [ ] Tests unitarios para servicios críticos
- [ ] Sentry para crash reporting
- [ ] Paginación en lista de transacciones
- [ ] Modo offline básico
- [ ] Tutorial/onboarding inicial

### Mejoras técnicas
- [ ] Lazy loading de componentes pesados
- [ ] Memoización en Dashboard
- [ ] Optimización de assets
- [ ] Reducir tamaño del APK a <50MB

### Seguridad
- [ ] HTTPS para OCR service
- [ ] Encriptación habilitada por defecto
- [ ] Validación de inputs en formularios
- [ ] Sanitización de datos de usuario

---

## 🐛 v1.0.x (Patches)

### Bugs conocidos
- [ ] 

### Quick fixes
- [ ] 

---

## 💡 Ideas futuras

- Sincronización en la nube (opcional)
- Exportar a PDF
- Gráficos de gastos por categoría
- Notificaciones de recordatorio
- Widget para Android
- Soporte para múltiples monedas
- Categorías personalizables
- Importar desde banco (CSV)

---

## 📊 Métricas a considerar

- Tamaño actual APK: ~69MB (preview) / ~40-50MB (production esperado)
- Tiempo de build: ~10-15 minutos
- Builds usadas este mes: X/30

---

## 🔧 Deuda técnica

1. **Testing**: 0% coverage actualmente
2. **Observabilidad**: Sin logs estructurados
3. **Performance**: Sin optimizaciones de re-renders
4. **Seguridad**: AsyncStorage sin encriptar por defecto
5. **Build**: console.log en producción (✅ FIXED)
6. **Error Handling**: Error boundaries básicos (✅ ADDED)

---

## 📝 Notas de desarrollo

### Última sesión: 2026-01-06
- ✅ Configurado CI/CD con GitHub Actions
- ✅ Auto-incremento de versión
- ✅ Error boundaries añadidos
- ✅ console.log removido en production
- ✅ Build profile cambiado a production
- ✅ Permisos HTTP para OCR configurados

### Próximos pasos inmediatos
1. Verificar que production build funcione correctamente
2. Probar APK en dispositivo real
3. Verificar tamaño del APK optimizado
4. Documentar diferencias entre preview y production

---

**Usa este archivo para planificar features y trackear progreso personal.**
