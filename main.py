"""Juego de tic tac toe con interfaz gráfica en Pygame."""

import random

import pygame

pygame.init()

WIDTH, HEIGHT = 600, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Super tic tac toe")

bg = pygame.image.load("assets/bg.png")
bg = pygame.transform.scale(bg, (WIDTH, HEIGHT))

circle = pygame.image.load("assets/circle.png")
circle = pygame.transform.scale(circle, (145, 145))
cross = pygame.image.load("assets/cross.png")
cross = pygame.transform.scale(cross, (135, 135))

coordinates = [
    [(70, 80), (235, 80), (400, 80)],
    [(70, 235), (235, 235), (400, 235)],
    [(70, 390), (235, 390), (400, 390)],
]

board: list[list[str]] = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
]

turn = random.choice(["X", "O"])
winner: str | None = None
game_over = False
clock = pygame.time.Clock()

font_title = pygame.font.SysFont("Arial", 52, bold=True)
font_button = pygame.font.SysFont("Arial", 28)
font_turn = pygame.font.SysFont("Arial", 30)

OVERLAY_RECT = pygame.Rect(100, 185, 400, 230)
BTN_NEW_GAME = pygame.Rect(125, 315, 160, 52)
BTN_EXIT = pygame.Rect(315, 315, 160, 52)


def draw_turn_indicator(current_turn: str) -> None:
    """Muestra en la parte superior de la ventana qué jugador tiene el turno.

    Args:
        current_turn: Jugador activo, "X" u "O".
    """
    text = font_turn.render(f"Turno: {current_turn}", True, (255, 255, 255))
    screen.blit(text, text.get_rect(center=(WIDTH // 2, 40)))


def draw_board() -> None:
    """Renderiza el fondo y las piezas del tablero."""
    screen.blit(bg, (0, 0))
    for x in range(len(board)):
        for y in range(len(board[x])):
            if board[x][y] == "X":
                screen.blit(cross, coordinates[x][y])
            elif board[x][y] == "O":
                screen.blit(circle, coordinates[x][y])


def draw_result_overlay(player: str) -> None:
    """Dibuja el overlay semitransparente con el ganador y los botones de acción.

    Args:
        player: Jugador ganador, "X" u "O".
    """
    overlay = pygame.Surface((OVERLAY_RECT.width, OVERLAY_RECT.height), pygame.SRCALPHA)
    overlay.fill((15, 15, 15, 210))
    screen.blit(overlay, OVERLAY_RECT.topleft)

    title = font_title.render(f"¡{player} ganó!", True, (255, 255, 255))
    screen.blit(title, title.get_rect(center=(300, 248)))

    pygame.draw.rect(screen, (45, 140, 60), BTN_NEW_GAME, border_radius=8)
    new_game_text = font_button.render("Nuevo juego", True, (255, 255, 255))
    screen.blit(new_game_text, new_game_text.get_rect(center=BTN_NEW_GAME.center))

    pygame.draw.rect(screen, (160, 45, 45), BTN_EXIT, border_radius=8)
    exit_text = font_button.render("Salir", True, (255, 255, 255))
    screen.blit(exit_text, exit_text.get_rect(center=BTN_EXIT.center))


def check_winner() -> str | None:
    """Determina si hay un ganador en el estado actual del tablero.

    Returns:
        "X" u "O" si hay ganador, None si el juego continúa.
    """
    for row in board:
        if row[0] == row[1] == row[2] != "":
            return row[0]

    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col] != "":
            return board[0][col]

    if board[0][0] == board[1][1] == board[2][2] != "":
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != "":
        return board[0][2]

    return None


def reset_game() -> None:
    """Reinicia el tablero y el estado del juego para una nueva partida."""
    global board, turn, winner
    board = [["", "", ""], ["", "", ""], ["", "", ""]]
    turn = random.choice(["X", "O"])
    winner = None


while not game_over:
    clock.tick(30)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            game_over = True
        elif event.type == pygame.MOUSEBUTTONDOWN:
            pos_x, pos_y = pygame.mouse.get_pos()
            if winner:
                if BTN_NEW_GAME.collidepoint(pos_x, pos_y):
                    reset_game()
                elif BTN_EXIT.collidepoint(pos_x, pos_y):
                    game_over = True
            elif (70 <= pos_x < 545) and (80 <= pos_y < 535):
                col = (pos_x - 70) // 160
                row = (pos_y - 80) // 150
                if board[row][col] == "":
                    board[row][col] = turn
                    winner = check_winner()
                    if not winner:
                        turn = "O" if turn == "X" else "X"

    draw_board()
    if winner:
        draw_result_overlay(winner)
    else:
        draw_turn_indicator(turn)
    pygame.display.update()

pygame.quit()
