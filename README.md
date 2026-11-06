# Granja El Olivo - Control de Producción Lechera

Aplicación web progresiva para administrar vacas y registrar producción diaria de leche.

## Funciones
- Crear, editar y eliminar vacas.
- Código/arete, nombre, raza, estado, fecha de ingreso y notas.
- Estados: En producción, Gestante, Seca, En tratamiento y Vendida.
- Registrar fecha, vaca, litros, precio por litro y observaciones.
- Calcular automáticamente el valor de cada registro.
- Resumen diario, reportes mensuales y producción por vaca.
- Exportar el historial a CSV para abrirlo con Excel.
- Diseño adaptable a iPhone y escritorio.
- Funciona sin conexión después de la primera carga.

## Publicar en GitHub Pages
1. Crea un repositorio público llamado `granja-el-olivo`.
2. Sube todos los archivos de esta carpeta directamente a la raíz del repositorio.
3. En GitHub abre Settings → Pages.
4. En Build and deployment selecciona Deploy from a branch.
5. Selecciona `main` y `/ (root)`, luego Save.
6. Espera la publicación y abre el enlace HTTPS en Safari.

## Instalar en iPhone
Safari → Compartir → Añadir a pantalla de inicio.

## Datos y respaldo
Los datos se guardan en el almacenamiento local del navegador/dispositivo. No se sincronizan automáticamente entre dispositivos ni se guardan en GitHub. Exporta CSV periódicamente. Para compartir datos entre varios teléfonos se requiere conectar una base de datos en la nube.
