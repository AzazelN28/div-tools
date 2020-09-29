#ifndef __PAL_H__
#define __PAL_H__

#include "shared.h"

#define PAL_SIGNATURE "pal\x1A\x0D\x0A\x00\x00"

typedef struct {
  uint8_t signature[8];
} pal_header_t;

typedef struct {
  pal_header_t header;
  palette_t palette;
} pal_t;

int32_t pal_load(pal_t *pal, const char *filename);
int32_t pal_parse(pal_t *pal);

/**
 * API C que necesitamos definir en JS.
 */
extern void pal_parsed_color(uint8_t index, uint8_t r, uint8_t g, uint8_t b);
extern void pal_parsed_rule(uint8_t index, uint8_t type, uint8_t fixed, uint8_t black, uint8_t num_colors, uint8_t colors[32]);

#endif
