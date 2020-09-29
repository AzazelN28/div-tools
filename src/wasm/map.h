#ifndef __MAP_H__
#define __MAP_H__

#include "shared.h"

#define MAP_SIGNATURE "map\x1A\x0D\x0A\x00\x00"

typedef struct
{
  uint8_t signature[8];
  uint16_t width;
  uint16_t height;
  uint32_t code;
  uint8_t description[32];
} map_header_t;

typedef struct
{
  map_header_t header;
  palette_t palette;
  uint16_t num_points;
  point_t *points;
  uint8_t *pixels;
} map_t;

#endif
