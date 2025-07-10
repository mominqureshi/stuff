import pygame
import sys

pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 60)

# Game objects
ball = pygame.Rect(WIDTH // 2, HEIGHT // 2, 20, 20)
ball_speed = [5, 5]

player = pygame.Rect(WIDTH - 20, HEIGHT // 2 - 70, 10, 140)
opponent = pygame.Rect(10, HEIGHT // 2 - 70, 10, 140)

# Scores
player_score = 0
opponent_score = 0

def reset_game():
    ball.center = (WIDTH // 2, HEIGHT // 2)
    player.centery = HEIGHT // 2
    opponent.centery = HEIGHT // 2

def move_ball():
    global ball_speed, player_score, opponent_score
    ball.x += ball_speed[0]
    ball.y += ball_speed[1]

    if ball.top <= 0 or ball.bottom >= HEIGHT:
        ball_speed[1] *= -1

    if ball.colliderect(player) or ball.colliderect(opponent):
        ball_speed[0] *= -1

    if ball.left <= 0:
        player_score += 1
        reset_game()
    elif ball.right >= WIDTH:
        opponent_score += 1
        reset_game()

def move_player():
    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP] and player.top > 0:
        player.y -= 10
    if keys[pygame.K_DOWN] and player.bottom < HEIGHT:
        player.y += 10

def move_opponent():
    if opponent.centery < ball.centery:
        opponent.y += 7
    elif opponent.centery > ball.centery:
        opponent.y -= 7

def draw_scores():
    player_text = font.render(str(player_score), True, (255, 255, 255))
    opponent_text = font.render(str(opponent_score), True, (255, 255, 255))
    screen.blit(player_text, (WIDTH // 2 + 20, 20))
    screen.blit(opponent_text, (WIDTH // 2 - 60, 20))

reset_game()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    move_ball()
    move_player()
    move_opponent()

    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), player)
    pygame.draw.rect(screen, (255, 255, 255), opponent)
    pygame.draw.ellipse(screen, (255, 255, 255), ball)
    draw_scores()
    pygame.display.flip()
    clock.tick(60)