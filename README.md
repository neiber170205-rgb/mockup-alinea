# Mockup navegable de Alinea

Mockup de la plataforma **Alinea** (por d2b software) con el club de ejemplo **Black Panthers**. Son las mismas pantallas de los lienzos de diseño, convertidas en un sitio que se puede navegar. Todos los datos son de prueba.

## Cómo verlo

- **En línea:** https://neiber170205-rgb.github.io/mockup-alinea/ (con GitHub Pages activo).
- **En tu computador:** en esta carpeta corre `python3 -m http.server 8000` y abre http://localhost:8000.
- En cualquier pantalla, el botón **Pantallas** (abajo a la izquierda) muestra todo el mapa y deja cambiar de rol.

## Entrar por rol

| Rol | Persona de prueba | Primera pantalla |
| --- | --- | --- |
| Administrador | Laura Ríos | Panel del club: `club/Admin-Inicio.html` |
| Entrenador | Andrés Peña | Inicio del entrenador en el celular |
| Acudiente | Martha Rojas | Inicio de la familia: 2 hijas en Black Panthers y 1 hijo en Tigres FC |
| Jugador | Laura Contreras | Inicio de la jugadora (Mayores) |

La consola d2b (súper admin) y el registro de clubes están en `mapa.html`.

## Qué hay

- `index.html`: ingreso por rol.
- `mapa.html`: las 50 pantallas, agrupadas por rol.
- `club/`: panel del administrador (11 pantallas, más 3 en celular), entrenador, acudiente, jugadora, página pública del club, carné, correos y comprobante de pago.
- `alinea/`: consola d2b, registro de clubes, marca y suscripción, inicio de la familia y las propuestas del logo.
- `assets/`: fotos del club, estilos y scripts del mockup.

## Datos de prueba

- Club: Black Panthers, voleibol, Cúcuta. 92 jugadoras en tres categorías.
- Mensualidades: Infantil $48.000, Juvenil $54.000 y Mayores $60.000. Fecha límite: el día 30 de cada mes.
- Pagos: Wompi, transferencia a Bancolombia o llave Bre-B, y efectivo. Las cuentas y los números son inventados.
- Otro club para el caso de familias: Tigres FC (fútbol).

## Cómo está hecho

- Cada pantalla es el tablero del lienzo tal cual, con su plantilla y su lógica de ejemplo.
- `assets/js/dc-lite.js` pinta las plantillas y las vuelve a pintar al tocar botones, filtros o buscadores.
- `assets/js/mockup.js` pone el botón Pantallas y muestra las vistas de celular dentro de un marco cuando se abren en computador.
- Nada se guarda ni se envía: Wompi, WhatsApp y el correo están simulados.
