# Cambios recientes en TalentFlow AI

## 1. Ajustes en el scoring de recomendaciones

Se actualizó el flujo final de compatibilidad para usar los siguientes porcentajes:

- Skills: 40%
- Salario: 24%
- Locación: 18%
- Experiencia: 17%

El cálculo quedó normalizado para mantener una escala final de 0 a 100.

## 2. Carga y procesamiento de CV

Se mejoró el flujo de carga de hojas de vida para que:

- El archivo se guarde correctamente en la carpeta de uploads.
- El CV se procese aunque Neo4j no esté disponible.
- Las skills extraídas se sigan mostrando en el perfil.

## 3. Persistencia de skills en el perfil

Las skills detectadas en la hoja de vida ahora se almacenan también en PostgreSQL en la tabla `user_skills`.

Esto permite que las habilidades queden registradas en el perfil incluso si Neo4j no está activo.

## 4. Visualización en el frontend

Se agregó un encabezado visible para la sección de skills del perfil:

- Habilidades identificadas en cv

Debajo de ese título se muestran todas las skills detectadas.

## 5. Mejoras en la extracción básica

Se afinó la detección de skills para reducir falsos positivos en coincidencias de texto corto, como `Go`.
