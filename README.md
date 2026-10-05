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

| Archivo | Qué contiene |
|---|---|
| `index.html` | La página completa (vistas Empresas y Personal, banner y modal del cambio de marca) |
| `styles.css` | Estilos base y vista Empresas (tokens de marca de ARQ, botones, secciones, carruseles, FAQ) |
| `personal.css` | Estilos de la vista Personal, el banner animado y el modal "De DolarApp a ARQ" |
| `script.js` | Interacciones: cambio de vista, logo, carruseles, conversor, video del hero, modal y medición |
| `arq-variacion-B-completo.html` | La misma página en un solo archivo (CSS y JS incluidos), útil para compartir |

Para verla, abre `index.html` en el navegador (los cuatro archivos deben estar en la misma carpeta) o abre
directamente `arq-variacion-B-completo.html`.

## Qué incluye

- Hero de Empresas con barra compacta; hero de Personal con video a pantalla completa.
- Carrusel infinito de logos (Empresas) y de prensa (Personal), sin pausa al pasar el mouse.
- Carruseles de testimonios con flechas, puntos y avance automático.
- Conversor interactivo COP ⇄ USDc con banderas (Personal).
- Banner animado "~~DolarApp~~ ahora es [logo ARQ]" en ciclo continuo, que abre un modal corto con la línea de
  tiempo del cambio de marca.
- Animaciones básicas (aparición al hacer scroll, hover de botones y tarjetas); respeta `prefers-reduced-motion`.
- Navbar: el logo sube al inicio; Funcionalidades, Clientes/Opiniones, Ayuda y el botón del navbar no navegan.
- Cada CTA del cuerpo lleva `data-cta` y envía un evento `cta_click` (variante `B`) a `window.dataLayer`.


## Aviso

Marca, logos, imágenes y textos de ARQ y de DolarApp pertenecen a sus titulares. Este repositorio es un prototipo
de experimentación A/B y no está afiliado oficialmente a ARQ ni a Nu.
