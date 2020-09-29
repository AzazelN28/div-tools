#ifndef __SHARED_H__
#define __SHARED_H__

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define COLORS_PER_PALETTE 256
#define COLORS_PER_RANGE 32
#define RANGES_PER_PALETTE 16

typedef struct {
  int16_t x;
  int16_t y;
} point_t;

typedef struct {
  uint8_t num_colors;
  uint8_t type;
  uint8_t fixed;
  uint8_t black;
  uint8_t colors[COLORS_PER_RANGE];
} range_t;

typedef struct {
  uint8_t r;
  uint8_t g;
  uint8_t b;
} color_t;

typedef struct {
  color_t colors[COLORS_PER_PALETTE];
  range_t ranges[RANGES_PER_PALETTE];
} palette_t;

#endif
