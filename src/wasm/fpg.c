#include "fpg.h"

/**
 * Leemos un mapa de un FPG.
 */
fpg_map_t *fpg_map_read(fpg_t *fpg, FILE *file)
{
  fpg_map_t *fpg_map = calloc(1, sizeof(fpg_map_t));

  fread(&fpg_map->header, sizeof(fpg_map_header_t), 1, file);
  fread(&fpg_map->num_points, 4, 1, file);

  fpg_map->points = calloc(fpg_map->num_points, sizeof(point_t));
  fread(fpg_map->points, sizeof(point_t), fpg_map->num_points, file);

  fpg_map->pixels = calloc(1, fpg_map->header.width * fpg_map->header.height);
  fread(fpg_map->pixels, fpg_map->header.width * fpg_map->header.height, 1, file);

  if (fpg->num_maps == 0)
  {
    fpg->start = fpg_map;
    fpg->end = fpg_map;
    fpg->num_maps++;
  }
  else
  {
    fpg_map->prev = fpg->end;
    fpg->end->next = fpg_map;
  }
  return fpg_map;
}

/**
 * Leemos un FPG de DIV.
 */
int32_t fpg_load(fpg_t *fpg, const char *filename)
{
  FILE *file = fopen(filename, "r");
  if (file == NULL)
  {
    return 1;
  }

  fread(&fpg->header, sizeof(fpg_header_t), 1, file);
  if (strcmp(fpg->header.signature, FPG_SIGNATURE) != 0)
  {
    fclose(file);
    return 2;
  }

  fread(&fpg->palette, sizeof(palette_t), 1, file);
  while (!feof(file))
  {
    fpg_map_read(fpg, file);
  }
  fclose(file);
  return 0;
}
