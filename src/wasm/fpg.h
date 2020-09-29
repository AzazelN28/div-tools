#ifndef __FPG_H__
#define __FPG_H__

#include "shared.h"

#define FPG_SIGNATURE "fpg\x1A\x0D\x0A\x00\x00"

typedef struct {
  uint8_t signature[8];
} fpg_header_t;

typedef struct {
  uint32_t code;
  uint8_t description[32];
  uint8_t filename[12];
  uint32_t width;
  uint32_t height;
} fpg_map_header_t;

typedef struct fpg_map_t {
  fpg_map_header_t header;
  uint32_t num_points;
  point_t *points;
  uint8_t *pixels;

  struct fpg_map_t *next;
  struct fpg_map_t *prev;
} fpg_map_t;

typedef struct {
  fpg_header_t header;
  palette_t palette;

  uint16_t num_maps;
  fpg_map_t *start;
  fpg_map_t *end;
} fpg_t;

#endif
