#include "pal.h"

/**
 * Leemos una paleta de DIV.
 */
int32_t pal_load(pal_t *pal, const char *filename) {
  FILE* file = fopen(filename, "r");
  if (file == NULL) {
    return 1;
  }
  fread(&pal->header,sizeof(pal_header_t), 1, file);
  if (strcmp(pal->header.signature, PAL_SIGNATURE) != 0) {
    fclose(file);
    return 2;
  }
  fread(&pal->palette,sizeof(palette_t), 1, file);
  fclose(file);
  return 0;
}

/**
 * Parseamos una paleta
 */
int32_t pal_parse(pal_t *pal) {
  int32_t i;
  for (i = 0; i < 256; i++) {
    pal_parsed_color(
      i,
      pal->palette.colors[i].r,
      pal->palette.colors[i].g,
      pal->palette.colors[i].b
    );
  }

  for (i = 0; i < 16; i++) {
    pal_parsed_rule(
      i,
      pal->palette.ranges[i].type,
      pal->palette.ranges[i].fixed,
      pal->palette.ranges[i].black,
      pal->palette.ranges[i].num_colors,
      pal->palette.ranges[i].colors
    );
  }
}
