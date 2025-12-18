#!/usr/bin/env python3
"""
Generate pixel art sprite frames for the scroll-aging character.
Creates 8 frames (age_00 = youngest, age_07 = oldest).
"""
from PIL import Image, ImageDraw
import os

# Create output directory
output_dir = "src/assets/pixel"
os.makedirs(output_dir, exist_ok=True)

# Frame dimensions (pixel art size)
WIDTH, HEIGHT = 64, 96

# Color palette
COLORS = {
    "skin_young": (255, 220, 177),
    "skin_mid": (255, 200, 150),
    "skin_old": (240, 180, 130),
    "hair_young": (139, 90, 43),  # Brown
    "hair_mid": (100, 70, 40),    # Darker brown
    "hair_old": (180, 180, 180),  # Gray
    "shirt": (70, 130, 180),      # Steel blue
    "pants": (50, 50, 50),        # Dark gray
    "shoes": (30, 30, 30),        # Black
    "outline": (20, 20, 20),      # Black outline
}

def draw_pixel_character(draw, age_progress, width, height):
    """Draw a pixel character that ages based on age_progress (0.0 = youngest, 1.0 = oldest)."""
    # Interpolate properties based on age
    skin_color = tuple(
        int(COLORS["skin_young"][i] * (1 - age_progress) + COLORS["skin_old"][i] * age_progress)
        for i in range(3)
    )
    hair_color = (
        COLORS["hair_young"] if age_progress < 0.4
        else COLORS["hair_mid"] if age_progress < 0.7
        else COLORS["hair_old"]
    )
    
    # Character size (slightly taller when older)
    base_height = height - 20
    char_height = int(base_height * (0.9 + age_progress * 0.1))
    char_y = height - char_height - 10
    
    # Head size (slightly larger when older)
    head_size = 16 + int(age_progress * 4)
    head_y = char_y + 8
    
    # Body proportions
    body_width = 20 + int(age_progress * 4)
    body_y = head_y + head_size + 2
    
    # Draw head (circle)
    head_x = (width - head_size) // 2
    for y in range(head_size):
        for x in range(head_size):
            dx = x - head_size // 2
            dy = y - head_size // 2
            if dx * dx + dy * dy <= (head_size // 2) ** 2:
                draw.rectangle(
                    [head_x + x, head_y + y, head_x + x + 1, head_y + y + 1],
                    fill=skin_color,
                    outline=COLORS["outline"]
                )
    
    # Draw hair (varies with age)
    hair_start_y = head_y - 2
    hair_width = head_size + 4
    hair_x = (width - hair_width) // 2
    for y in range(6 + int(age_progress * 2)):
        for x in range(hair_width):
            if y < 4 or (x < 2 or x >= hair_width - 2):
                draw.rectangle(
                    [hair_x + x, hair_start_y + y, hair_x + x + 1, hair_start_y + y + 1],
                    fill=hair_color,
                    outline=COLORS["outline"]
                )
    
    # Draw body (shirt)
    body_x = (width - body_width) // 2
    body_height = int(char_height * 0.4)
    draw.rectangle(
        [body_x, body_y, body_x + body_width, body_y + body_height],
        fill=COLORS["shirt"],
        outline=COLORS["outline"]
    )
    
    # Draw arms (position changes slightly with age - more relaxed when older)
    arm_y_offset = int(age_progress * 2)
    arm_width = 6
    arm_height = int(char_height * 0.25)
    # Left arm
    draw.rectangle(
        [body_x - arm_width, body_y + arm_y_offset, body_x, body_y + arm_y_offset + arm_height],
        fill=skin_color,
        outline=COLORS["outline"]
    )
    # Right arm
    draw.rectangle(
        [body_x + body_width, body_y + arm_y_offset, body_x + body_width + arm_width, body_y + arm_y_offset + arm_height],
        fill=skin_color,
        outline=COLORS["outline"]
    )
    
    # Draw legs (pants)
    leg_y = body_y + body_height
    leg_width = 8
    leg_height = int(char_height * 0.35)
    leg_gap = 4
    # Left leg
    draw.rectangle(
        [body_x + leg_gap, leg_y, body_x + leg_gap + leg_width, leg_y + leg_height],
        fill=COLORS["pants"],
        outline=COLORS["outline"]
    )
    # Right leg
    draw.rectangle(
        [body_x + body_width - leg_gap - leg_width, leg_y, body_x + body_width - leg_gap, leg_y + leg_height],
        fill=COLORS["pants"],
        outline=COLORS["outline"]
    )
    
    # Draw shoes
    shoe_y = leg_y + leg_height
    shoe_width = 10
    # Left shoe
    draw.rectangle(
        [body_x + leg_gap - 1, shoe_y, body_x + leg_gap + leg_width + 1, shoe_y + 4],
        fill=COLORS["shoes"],
        outline=COLORS["outline"]
    )
    # Right shoe
    draw.rectangle(
        [body_x + body_width - leg_gap - leg_width - 1, shoe_y, body_x + body_width - leg_gap + 1, shoe_y + 4],
        fill=COLORS["shoes"],
        outline=COLORS["outline"]
    )

# Generate 8 frames
num_frames = 8
for i in range(num_frames):
    age_progress = i / (num_frames - 1)  # 0.0 to 1.0
    
    # Create image
    img = Image.new("RGB", (WIDTH, HEIGHT), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw character
    draw_pixel_character(draw, age_progress, WIDTH, HEIGHT)
    
    # Save frame
    filename = f"{output_dir}/age_{i:02d}.png"
    img.save(filename)
    print(f"Generated {filename} (age progress: {age_progress:.2f})")

print(f"\nGenerated {num_frames} pixel sprite frames in {output_dir}/")

