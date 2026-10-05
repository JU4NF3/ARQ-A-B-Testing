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

## Medición: cómo sabemos qué hace la gente en la página

**En pocas palabras.** Para comparar la versión A con la B hay que saber qué hacen los visitantes: si pulsan un botón,
si cambian de Empresas a Personal, si bajan hasta el final. Para eso, la página "avisa" cada vez que pasa algo de eso,
y dos herramientas gratuitas de Google reciben los avisos:

- **Google Tag Manager (GTM):** funciona como una recepción. Recibe los avisos de la página y decide a dónde enviarlos.
  Se configura desde su propio sitio web, sin tocar el código de la página.
- **Google Analytics 4 (GA4):** es donde se guardan los datos y se consultan (cuántos clics hubo, en qué botón, en qué
  versión).

```
La persona hace algo en la página  →  la página envía un aviso  →  GTM lo recibe y lo reenvía  →  GA4 lo guarda y lo muestra
```

**Vocabulario rápido**

| Palabra | Qué significa |
|---|---|
| Evento | Un "aviso" que envía la página cuando pasa algo (por ejemplo, un clic) |
| Parámetro | Un dato extra que acompaña al aviso (por ejemplo, cuál botón fue) |
| CTA | Botón de llamada a la acción, como "Registrarse" o "Cambia ahora" |
| Variante | Cuál versión de la página es: aquí siempre **B** (la versión A es la web actual) |

### 1. Qué avisos envía la página

| Qué hace la persona | Nombre del aviso (evento) | Datos que lo acompañan |
|---|---|---|
| Hace clic en un botón del cuerpo de la página | `cta_click` | `cta`: cuál botón (por ejemplo `hero`), `cta_text`: lo que dice el botón |
| Entra a la página o cambia entre Empresas y Personal | `view_change` | `view`: a cuál vista, `from_user`: si fue ella quien cambió o fue la carga inicial |
| Baja por la página hasta la mitad o hasta el 75 % | `scroll_depth` | `percent`: 50 o 75 |
| Usa el conversor de monedas por primera vez (vista Personal) | `calculator_use` | `action`: si escribió un monto (`input`) o invirtió las monedas (`swap`) |

Además, **todos** los avisos incluyen `variant` (la versión: `B`) y `view` (en qué vista estaba: `empresas` o `personal`).

*Para quien desarrolla:* los avisos se guardan en `window.dataLayer`, y el ID de GTM y la variante se definen en
`index.html`: `window.ARQ_AB = { gtmId: 'GTM-MVTGJ2GV', variant: 'B' };`

### 2. Qué está configurado en Google Tag Manager
El "contenedor" es la cuenta de GTM de este proyecto: **`GTM-MVTGJ2GV`**. Tiene estas piezas:

| Pieza | Nombre | Para qué sirve, en simple |
|---|---|---|
| Variable integrada | `Event` | Guarda el nombre del aviso que acaba de llegar (por ejemplo `cta_click`) |
| Variable | `dlv - cta` | Lee del aviso cuál botón se pulsó |
| Variable | `dlv - view` | Lee del aviso en qué vista estaba la persona |
| Variable | `dlv - variant` | Lee del aviso de qué versión viene (B) |
| Activador | `Eventos ARQ B` | La regla: "cuando llegue uno de estos cuatro avisos (`cta_click`, `view_change`, `scroll_depth`, `calculator_use`), actúa" |
| Etiqueta | `GA4 - Base` | Conecta la página con Google Analytics (ID `G-6H76HZLWR0`) y registra la visita. Se activa en cuanto carga la página |
| Etiqueta | `GA4 - Eventos ARQ B` | Cuando se cumple la regla, envía el aviso a Google Analytics junto con tres datos: `cta`, `view` y `variant` |

### 3. Qué recibe Google Analytics 4
Un "flujo de datos web", identificado con el **ID `G-6H76HZLWR0`**, que recibe a través de GTM:

- Cada visita a la página (la registra la etiqueta `GA4 - Base`).
- Los cuatro avisos anteriores, cada uno con su nombre y con tres datos: `cta`, `view` y `variant`.

La página no lleva pegado el código directo de Google Analytics a propósito: si lo tuviera además de GTM, cada
evento se contaría dos veces.

### 4. Lo que todavía no está incluido
- GTM aún no pasa a GA4 los datos `percent`, `action`, `cta_text` y `from_user`. Consecuencia: en GA4 se verá que alguien
  bajó por la página o usó el conversor, pero **no se podrá distinguir 50 % de 75 %** ni qué hizo exactamente con el conversor.
- GA4 no está configurado para mostrar `cta`, `view` y `variant` en sus informes estándar (para eso hay que registrarlos
  como "dimensiones personalizadas"), ni tiene marcados eventos como conversión.
- Un clic en un botón mide interés, no un registro. El registro completado debe medirse en el proceso de alta de ARQ,
  que esta página de prueba no incluye.
- Para poder comparar, la versión A tendría que enviar los mismos avisos con `variant: 'A'`.

## Aviso

**Esto es una actividad académica de experimentación A/B, no un proyecto real ni un sitio oficial.** Es un prototipo
sin relación con ARQ, DolarApp ni Nu, y **no cuenta con autorización de ARQ** para usar su marca.

Marca, logos, imágenes, videos y textos de ARQ y de DolarApp pertenecen a sus titulares; aquí se usan únicamente con
fines educativos y sin ánimo comercial. No se recolectan datos de personas reales más allá de la analítica básica
de la página de prueba. La página incluye `noindex` para que los buscadores no la indexen, y un aviso discreto en el
pie de página. Si el titular de los derechos lo solicita, el contenido se retira.
