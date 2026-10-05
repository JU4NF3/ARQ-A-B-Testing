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

## Medición con Google Tag Manager

La página escribe sus eventos en `window.dataLayer`, que es lo que lee GTM.

**Configuración** (en `index.html`, bloque de `<head>`):

```js
window.ARQ_AB = { gtmId: '', variant: 'B' };
```

- `gtmId`: pega el ID de tu contenedor (`GTM-XXXXXXX`). **Mientras esté vacío no se carga GTM**, pero los eventos
  igual se registran en `window.dataLayer` (puedes verlos escribiendo `dataLayer` en la consola del navegador).
- `variant`: identifica esta versión en los eventos. La versión A debe enviar `'A'` para poder comparar.
- Opcional: descomenta el bloque `<noscript>` al inicio del `<body>` y pon tu ID (respaldo sin JavaScript).

**Eventos que envía** (todos incluyen `variant` y `view`: `empresas` o `personal`):

| Evento | Cuándo | Parámetros extra |
|---|---|---|
| `cta_click` | Clic en cualquier botón del cuerpo con `data-cta` (hero, productos, conversor, modal…) | `cta` (nombre), `cta_text` |
| `view_change` | Al cargar y al cambiar entre Empresas y Personal | `view`, `from_user` |
| `scroll_depth` | Una vez por vista al llegar al 50 % y al 75 % | `percent` |
| `calculator_use` | La primera vez que se usa el conversor | `action` (`input` o `swap`) |

**En GTM:** crea un disparador de tipo *Evento personalizado* para cada nombre de evento, variables de capa de datos
para `variant`, `view`, `cta` y `percent`, y envíalos a GA4. Un clic en un botón no es una conversión: la conversión
real (registro completado) debe medirse en el flujo de alta de ARQ.

## Aviso

**Esto es una actividad académica de experimentación A/B, no un proyecto real ni un sitio oficial.** Es un prototipo
sin relación con ARQ, DolarApp ni Nu, y **no cuenta con autorización de ARQ** para usar su marca.

Marca, logos, imágenes, videos y textos de ARQ y de DolarApp pertenecen a sus titulares; aquí se usan únicamente con
fines educativos y sin ánimo comercial. No se recolectan datos de personas reales más allá de la analítica básica
de la página de prueba. La página incluye `noindex` para que los buscadores no la indexen, y un aviso discreto en el
pie de página. Si el titular de los derechos lo solicita, el contenido se retira.
