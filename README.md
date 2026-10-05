# ARQ — A/B Testing (Variación B)

Variación B de la landing de **ARQ** (Colombia) para un A/B test. Aplica la jerarquía y la claridad de la
web de **Nu Colombia** al contenido y a la identidad visual de ARQ, en dos vistas dentro de una sola página:

- **Empresas** (ARQ business)
- **Personal**

El selector **Empresas | Personal** del navbar cambia de vista sin recargar ni navegar a otro archivo.

## Hipótesis

Si presentamos ARQ con la claridad de Nu (beneficio de control en el hero → "Al elegir ARQ, eliges" →
prueba social → productos → confianza/regulación → testimonios → FAQ), aumentará el CTR del CTA principal
y la tasa de registro frente a la versión A (la web actual).

## Estructura del proyecto

| Archivo / carpeta | Qué contiene |
|---|---|
| `index.html` | La página completa (vistas Empresas y Personal, banner y modal del cambio de marca) y la configuración de GTM |
| `styles.css` | Estilos base y vista Empresas (tokens de marca de ARQ, botones, secciones, carruseles, FAQ) |
| `personal.css` | Estilos de la vista Personal, el banner animado y el modal "De DolarApp a ARQ" |
| `script.js` | Interacciones: cambio de vista, logo, carruseles, conversor, video del hero, modal y eventos de medición |
| `assets/` | Imágenes, logos y badges alojados localmente (38 archivos) |
| `assets/video/` | Videos del hero de la vista Personal (escritorio y móvil) |
| `arq-variacion-B-completo.html` | La misma página con CSS y JS incluidos en un solo archivo (necesita la carpeta `assets/` al lado) |

Para verla, abre `index.html` en el navegador con todos los archivos y la carpeta `assets/` en el mismo lugar,
o sírvela desde cualquier hosting estático (GitHub Pages, Netlify, Vercel…): no necesita servidor ni build.

## Qué incluye

- Hero de Empresas con barra compacta; hero de Personal con video a pantalla completa.
- Carrusel infinito de logos (Empresas) y de prensa (Personal), sin pausa al pasar el mouse.
- Carruseles de testimonios con flechas, puntos y avance automático.
- Conversor interactivo COP ⇄ USDc con banderas (Personal).
- Banner animado "~~DolarApp~~ ahora es [logo ARQ]" en ciclo continuo, que abre un modal corto con la línea de
  tiempo del cambio de marca.
- Animaciones básicas (aparición al hacer scroll, hover de botones y tarjetas); respeta `prefers-reduced-motion`.
- Navbar: el logo sube al inicio; Funcionalidades, Clientes/Opiniones, Ayuda y el botón del navbar no navegan.

## Medición: Google Tag Manager y Google Analytics

### En la página
Carga el contenedor de GTM `GTM-MVTGJ2GV` (cargador en el `<head>` y respaldo `noscript`) y escribe sus eventos en
`window.dataLayer`. La configuración está en `index.html`:

```js
window.ARQ_AB = { gtmId: 'GTM-MVTGJ2GV', variant: 'B' };
```

Eventos que envía (todos con `variant` y `view`: `empresas` o `personal`):

| Evento | Cuándo | Parámetros extra |
|---|---|---|
| `cta_click` | Clic en un botón del cuerpo con `data-cta` (hero, productos, conversor, modal…) | `cta`, `cta_text` |
| `view_change` | Al cargar y al cambiar entre Empresas y Personal | `view`, `from_user` |
| `scroll_depth` | Una vez por vista al llegar al 50 % y al 75 % | `percent` |
| `calculator_use` | La primera vez que se usa el conversor | `action` (`input` o `swap`) |

### En Google Tag Manager (contenedor `GTM-MVTGJ2GV`)

| Elemento | Nombre | Qué hace |
|---|---|---|
| Variable integrada | `Event` | Nombre del evento que llegó al `dataLayer` |
| Variable de capa de datos | `dlv - cta` | Lee `cta` |
| Variable de capa de datos | `dlv - view` | Lee `view` |
| Variable de capa de datos | `dlv - variant` | Lee `variant` |
| Activador | `Eventos ARQ B` | Evento personalizado con expresión regular: `cta_click\|view_change\|scroll_depth\|calculator_use` |
| Etiqueta | `GA4 - Base` | Etiqueta de Google con el ID `G-6H76HZLWR0`; se dispara en *Initialization - All Pages* |
| Etiqueta | `GA4 - Eventos ARQ B` | Evento de GA4 con el ID `G-6H76HZLWR0`; nombre del evento `{{Event}}`; parámetros `cta`, `view` y `variant`; se dispara con `Eventos ARQ B` |

### En Google Analytics 4 (ID de medición `G-6H76HZLWR0`)
- Flujo de datos web que recibe los datos de la página a través de GTM (la página no incluye el código de `gtag` directamente, para no duplicar eventos).
- Recibe la vista de página automática de la etiqueta base y los cuatro eventos anteriores con los parámetros `cta`, `view` y `variant`.

### Alcance actual
- Los parámetros `percent`, `action`, `cta_text` y `from_user` llegan al `dataLayer` pero **no se reenvían a GA4** (no hay variables para ellos en GTM).
- En GA4 no hay dimensiones personalizadas ni eventos clave configurados, así que los parámetros no aparecen en los informes estándar.
- Un clic en un botón no es una conversión: el registro completado debe medirse en el flujo de alta de ARQ, que esta página de prueba no incluye.
- La versión A debería enviar `variant: 'A'` con los mismos eventos para poder compararla con la B.

## Aviso

**Esto es una actividad académica de experimentación A/B, no un proyecto real ni un sitio oficial.** Es un prototipo
sin relación con ARQ, DolarApp ni Nu, y **no cuenta con autorización de ARQ** para usar su marca.

Marca, logos, imágenes, videos y textos de ARQ y de DolarApp pertenecen a sus titulares; aquí se usan únicamente con
fines educativos y sin ánimo comercial. No se recolectan datos de personas reales más allá de la analítica básica
de la página de prueba. La página incluye `noindex` para que los buscadores no la indexen, y un aviso discreto en el
pie de página. Si el titular de los derechos lo solicita, el contenido se retira.
