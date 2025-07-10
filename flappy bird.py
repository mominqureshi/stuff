import pygame
import sys
import random

pygame.init()
WIDTH, HEIGHT = 400, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 48)

# Bird setup
bird = pygame.Rect(100, 300, 30, 30)
gravity = 0.25
bird_movement = 0

# Pipe setup
pipe_width = 60
pipe_gap = 150
pipes = []
SPAWNPIPE = pygame.USEREVENT
pygame.time.set_timer(SPAWNPIPE, 1500)

# Score
score = 0
passed_pipes = []

def reset_game():
    global bird, bird_movement, pipes, score, passed_pipes
    bird.y = 300
    bird_movement = 0
    pipes.clear()
    passed_pipes.clear()
    score = 0

def create_pipe():
    height = random.randint(150, 450)
    bottom = pygame.Rect(WIDTH, height, pipe_width, HEIGHT - height)
    top = pygame.Rect(WIDTH, height - pipe_gap - HEIGHT, pipe_width, HEIGHT)
    return top, bottom

def move_pipes():
    for pipe in pipes:
        pipe.x -= 4
    return [pipe for pipe in pipes if pipe.right > 0]

def check_collision():
    for pipe in pipes:
        if bird.colliderect(pipe):
            return True
    if bird.top <= 0 or bird.bottom >= HEIGHT:
        return True
    return False

def draw_pipes():
    for pipe in pipes:
        pygame.draw.rect(screen, (0, 255, 0), pipe)

def draw_score():
    score_text = font.render(str(int(score)), True, (255, 255, 255))
    screen.blit(score_text, (WIDTH // 2 - 10, 20))

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
            bird_movement = -6
        if event.type == SPAWNPIPE:
            pipes.extend(create_pipe())

    bird_movement += gravity
    bird.y += int(bird_movement)

    pipes = move_pipes()

    for pipe in pipes:
        if pipe.centerx < bird.centerx and pipe not in passed_pipes:
            passed_pipes.append(pipe)
            score += 0.5  # 0.5 per pipe, total 1 per set

    if check_collision():
        reset_game()

    screen.fill((135, 206, 250))
    pygame.draw.rect(screen, (255, 255, 0), bird)
    draw_pipes()
    draw_score()
    pygame.display.update()
    clock.tick(60)