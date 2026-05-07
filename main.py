# External imports
import pygame

pygame.init()

# Window settings
WIDTH, HEIGHT = 600, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Super tic tac toe")

# Load statics

# Background
bg = pygame.image.load("assets/bg.png")
bg = pygame.transform.scale(bg, (WIDTH, HEIGHT))

# Circle and cross
circle = pygame.image.load("assets/circle.png")
circle = pygame.transform.scale(circle, (145, 145))
cross = pygame.image.load("assets/cross.png")
cross = pygame.transform.scale(cross, (135, 135))

coordinates = [
    [(70, 80), (235, 80), (400, 80)],
    [(70, 235), (235, 235), (400, 235)],
    [(70, 390), (235, 390), (400, 390)],
]

board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
]

turn = "X"
game_over = False
clock = pygame.time.Clock()

def draw_board():
    screen.blit(bg, (0, 0))
    for x in range(len(board)):
        for y in range(len(board[x])):
            if board[x][y] == "X":
                screen.blit(cross, coordinates[x][y])
            elif board[x][y] == "O":
                screen.blit(circle, coordinates[x][y])

def check_winner():
    # Check rows
    for row in board:
        if row[0] == row[1] == row[2] != "":
            return row[0]

    # Check columns
    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col] != "":
            return board[0][col]

    # Check diagonals
    if board[0][0] == board[1][1] == board[2][2] != "":
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != "":
        return board[0][2]

    return None

while not game_over:
    clock.tick(30)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            game_over = True
        elif event.type == pygame.MOUSEBUTTONDOWN:
            pos_x, pos_y = pygame.mouse.get_pos()
            if (pos_x >= 70 and pos_x < 545) and (pos_y >= 80 and pos_y < 535):
                col = (pos_x - 70) // 160
                row = (pos_y - 80) // 150
                if board[row][col] == "":
                    board[row][col] = turn
                    winner = check_winner()
                    if winner:
                        print(f"{winner} wins!")
                        game_over = True
                    turn = "O" if turn == "X" else "X"

    draw_board()
    pygame.display.update()

pygame.quit()
