# Quiniela Mundial 2026 - SPERMANS

Aplicacion web de quiniela para el Mundial 2026.

Esta version esta preparada para grupo de amigos (sin equipos de trabajo), con envio de apuestas a Google Forms y ranking desde Google Sheets (CSV publicado).

## Que hace la app

- Prediccion de orden en fase de grupos (12 grupos)
- Ranking de mejores terceros
- Quiniela 1X2 de 3 partidos
- Bracket eliminatorio completo
- Premios individuales
- Ranking automatico comparando cada apuesta con [results.js](results.js)

## Requisitos

- Cuenta de Google (Forms + Sheets)
- Cuenta de GitHub
- Repositorio publico (recomendado) para publicar en GitHub Pages

## Configuracion rapida

La configuracion se hace en [index.html](index.html) dentro de `window.WC2026_CONFIG`:

```html
<script>
  window.WC2026_CONFIG = {
    leaderboardCsvUrl: '',
    formId: '',
    entryId: '',
    submissionDeadlineIso: ''
  };
</script>
```

Significado:

- `leaderboardCsvUrl`: URL CSV publica de tu Google Sheet de respuestas
- `formId`: ID de tu Google Form
- `entryId`: identificador del campo del formulario donde guardas el JSON (ej: `entry.123456789`)
- `submissionDeadlineIso` (opcional): fecha/hora limite para bloquear envios (ej: `2026-06-10T20:00:00+02:00`)

## 1) Como crear el Google Form

1. Ve a https://forms.google.com y crea un formulario en blanco.
2. Ponle nombre, por ejemplo: `Quiniela Mundial 2026 - SPERMANS`.
3. Crea una unica pregunta obligatoria:
- Tipo: `Respuesta corta` (tambien puede ser parrafo)
- Titulo recomendado: `payload`
- Obligatoria: `Si`
4. No hace falta crear pregunta de nombre:
- El nombre ya va dentro del JSON (`payload.name`) y lo gestiona la app.

## 2) Como sacar `formId`

Abre el formulario en modo edicion. La URL sera similar a:

`https://docs.google.com/forms/d/e/1FAIpQLSe...../edit`

Tu `formId` es el bloque entre `/d/e/` y `/edit`:

`1FAIpQLSe.....`

## 3) Como sacar `entryId`

Opcion A (recomendada, sin inspeccionar codigo):

1. En el formulario, pulsa `Enviar`.
2. Elige icono de enlace.
3. Pulsa `Obtener enlace pre-rellenado`.
4. Escribe cualquier texto de prueba en el campo `payload` y genera el enlace.
5. En el enlace veras algo como:

`...entry.123456789=texto...`

Ese `entry.123456789` es tu `entryId`.

Opcion B (inspeccionando HTML del form):

- Buscar el atributo `name="entry.xxxxx"` del input de la pregunta `payload`.

## 4) Como conectar Google Sheets

1. En el Form, ve a pestaña `Respuestas`.
2. Pulsa `Vincular con Hojas de calculo`.
3. Crea una hoja nueva (recomendado) o usa una existente.
4. Se creara una hoja de respuestas con una fila por envio.

## 5) Como publicar el CSV del ranking

1. Abre la hoja creada por Forms.
2. En Google Sheets: `Archivo > Compartir > Publicar en la web`.
3. Selecciona la pestana de respuestas.
4. Formato: `Valores separados por comas (.csv)`.
5. Pulsa `Publicar` y copia la URL.
6. Esa URL va en `leaderboardCsvUrl`.

Nota:

- Si no publicas el CSV, la pestaña Ranking no podra leer los datos.

## 6) Probar localmente antes de publicar

1. Rellena `window.WC2026_CONFIG` con tus 3 valores.
2. Abre [index.html](index.html) en navegador.
3. Haz una apuesta y enviala.
4. Comprueba en Google Form/Sheet que aparece una fila nueva.
5. Ve a Ranking y verifica que sale el usuario.

## 7) Publicar en GitHub Pages

1. Sube el repo a GitHub.
2. En GitHub: `Settings > Pages`.
3. En `Build and deployment`:
- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`
4. Guarda y espera 1-2 minutos.
5. Tu URL sera algo como:
- `https://TU-USUARIO.github.io/mundial-spermans/`

## 8) Flujo durante el Mundial

- Tus amigos solo usan la URL de GitHub Pages.
- Las apuestas van al Form (y a la Sheet vinculada).
- El ranking se calcula automaticamente con [results.js](results.js).
- Tu trabajo como admin es actualizar [results.js](results.js) cuando haya resultados oficiales.

## Troubleshooting

### Error al enviar apuesta

Revisa:

- `formId` correcto
- `entryId` correcto
- que el campo de Google Form exista y siga siendo el mismo

### Ranking vacio

Revisa:

- `leaderboardCsvUrl` correcto
- CSV publicado en la web
- que la hoja publicada sea la de respuestas

### El ranking no detecta envios

- La app busca automaticamente la columna que contiene JSON (no depende de una columna fija).
- Aun asi, confirma que el campo del form recibe JSON valido (empieza por `{` y termina por `}`).

## Seguridad y privacidad

- `formId`, `entryId` y `leaderboardCsvUrl` no son secretos.
- No pongas datos sensibles en el payload.
- Si quieres privacidad real, habria que migrar a backend propio con autenticacion.

## Siguiente mejora recomendada

- Cierre automatico por fecha/hora para bloquear nuevas apuestas.
- Congelar ediciones tras primer envio por usuario (requiere backend o identificador robusto).
