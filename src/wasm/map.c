#include "map.h"

/**
 * Leemos un mapa de DIV.
 */
int32_t map_load(map_t *map, const char *filename)
{
  FILE *file = fopen(filename, "r");
  if (file == NULL)
  {
    return 1;
  }

  fread(&map->header, sizeof(map_header_t), 1, file);
  if (strcmp(map->header.signature, MAP_SIGNATURE) != 0)
  {
    fclose(file);
    return 2;
  }
  fread(&map->palette, sizeof(palette_t), 1, file);
  fread(&map->num_points, 2, 1, file);

  map->points = calloc(map->num_points, sizeof(point_t));
  fread(map->points, sizeof(point_t), map->num_points, file);

  map->pixels = calloc(1, map->header.width * map->header.height);
  fread(map->pixels, map->header.width * map->header.height, 1, file);

  fclose(file);
  return 0;
}
