# Super Tic Tac Toe

Juego de Tic Tac Toe para dos jugadores con una regla adicional que cambia la dinámica: cada jugador puede tener como máximo **3 piezas en el tablero al mismo tiempo**. Al colocar una cuarta pieza, la más antigua desaparece automáticamente — lo que obliga a pensar varios turnos por adelantado.

## Reglas

- Dos jugadores se turnan colocando piezas (**X** y **O**) en un tablero 3×3.
- El jugador inicial se elige aleatoriamente en cada partida.
- **Regla de 3 piezas:** cuando un jugador ya tiene 3 piezas en el tablero y coloca una nueva, su pieza más antigua se elimina. La pieza en riesgo de eliminación se muestra semitransparente antes de que el jugador haga su jugada.
- Gana quien logre alinear 3 piezas en fila, columna o diagonal.

## Tecnología

- HTML5, CSS3 y JavaScript vanilla (ES modules)
- Sin dependencias externas ni herramientas de build
- Compatible con cualquier navegador moderno

## Estructura del proyecto

```
super-tic-tac-toe/
├── index.html      # Markup de la interfaz (dos pantallas: inicio y juego)
├── style.css       # Estilos y layout del tablero
├── game.js         # Lógica del juego y manipulación del DOM
└── assets/
    ├── bg.png      # Imagen de fondo del tablero
    ├── circle.png  # Pieza O
    └── cross.png   # Pieza X
```

## Ejecutar localmente

No requiere instalación ni servidor. Abre `index.html` directamente en el navegador:

```bash
# Desde el explorador de archivos: doble clic en index.html
# O desde la terminal:
start index.html       # Windows
open index.html        # macOS
xdg-open index.html    # Linux
```

Si necesitas probar desde un servidor local (por ejemplo, para evitar restricciones de `file://` en algunos navegadores):

```bash
python -m http.server 8000
# Luego abre http://localhost:8000
```

## Publicar en GitHub Pages

1. Haz push del repositorio a GitHub.
2. Ve a **Settings → Pages** del repositorio.
3. En *Source*, selecciona la rama `main` y la carpeta `/ (root)`.
4. GitHub Pages publicará el juego en `https://<usuario>.github.io/<repositorio>/`.
