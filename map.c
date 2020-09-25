#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

#include "json.h"

#define PAL_SIGNATURE "pal\x1A\x0D\x0A\x00\x00"
#define MAP_SIGNATURE "map\x1A\x0D\x0A\x00\x00"
#define FPG_SIGNATURE "fpg\x1A\x0D\x0A\x00\x00"
#define WLD_SIGNATURE "wld\x1A\x0D\x0A\x01\x00"
#define VPE_SIGNATURE "DAT\x00"

typedef struct {
  int16_t x;
  int16_t y;
} point_t;

typedef struct {
  uint8_t num_colors;
  uint8_t type;
  uint8_t range_type;
  uint8_t fixed;
  uint8_t black;
  uint8_t colors[32];
} rule_t;

typedef struct {
  uint8_t r;
  uint8_t g;
  uint8_t b;
} color_t;

typedef struct {
  color_t colors[256];
  rule_t rules[16];
} palette_t;

typedef struct {
  uint8_t signature[8];
  uint16_t width;
  uint16_t height;
  uint32_t code;
  uint8_t description[32];
} map_header_t;

typedef struct {
  uint8_t signature[8];
} fpg_header_t;

typedef struct {
  uint8_t signature[8];
} pal_header_t;

typedef struct {
  pal_header_t header;
  palette_t palette;
} pal_t;

typedef struct {
  map_header_t header;
  palette_t palette;
  uint16_t num_points;
  point_t *points;
  uint8_t *pixels;
} map_t;

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

typedef struct {
  uint32_t type;
  int32_t x;
  int32_t y;
  int16_t path;
  int16_t link;
} vpe_vertex_t;

typedef struct {
  uint32_t type;
  int16_t height_floor;
  int16_t height_ceiling;
  int16_t region_below;
  int16_t region_above;
  int32_t texture_floor;
  int32_t texture_ceiling;
  uint8_t effect[10];
  int16_t fade;
  int16_t tag;
} vpe_region_t;

typedef struct {
  uint32_t type;
  int16_t vertex_start;
  int16_t vertex_end;
  int16_t region_front;
  int16_t region_back;
  int32_t texture_top;
  int32_t texture_middle;
  int32_t texture_bottom;
  uint8_t effect[10];
  int16_t fade;
  int16_t texture_x;
  int16_t texture_y;
  int16_t mass;
  int16_t tag;
} vpe_wall_t;

typedef struct {
  int32_t x;
  int32_t y;
  int32_t number;
} vpe_flag_t;

typedef struct {
  int16_t x;
  int16_t y;
  int16_t z;
  int16_t t;
} vpe_force_t;

typedef struct {
  uint8_t signature[4];
} vpe_header_t;

typedef struct {
  uint8_t title[24];
  uint8_t palette[12];
  int32_t texture_screen;
  int32_t texture_back;
  uint8_t effect[10];
  int16_t angle;
  int16_t view;
  vpe_force_t force;
} vpe_footer_t;

typedef struct {
  vpe_header_t header;
  int16_t num_vertices;
  int16_t num_regions;
  int16_t num_walls;
  int16_t num_flags;
  vpe_vertex_t *vertices;
  vpe_region_t* regions;
  vpe_wall_t* walls;
  vpe_flag_t* flags;
  vpe_footer_t footer;
} vpe_t;

typedef struct {
  uint32_t active;
  int32_t x;
  int32_t y;
  uint32_t links;
} wld_vertex_t;

typedef struct {
  uint32_t active;
  int32_t type;
  int32_t vertex_start;
  int32_t vertex_end;
  int32_t region_front;
  int32_t region_back;
  int32_t texture_middle;
  int32_t texture_top;
  int32_t texture_bottom;
  uint32_t fade;
} wld_wall_t;

typedef struct {
  uint32_t active;
  int32_t type;
  int32_t height_floor;
  int32_t height_ceiling;
  int32_t texture_floor;
  int32_t texture_ceiling;
  uint32_t fade;
} wld_region_t;

typedef struct {
  uint32_t active;
  int32_t x;
  int32_t y;
  int32_t number;
} wld_flag_t;

typedef struct {
  uint8_t signature[8];
  uint32_t offset; // Donde se encuentran los datos de VPE
  uint8_t wld_path[256]; // ruta?
  uint8_t wld_name[16];
  int32_t number;
  uint8_t fpg_path[256];
  uint8_t fpg_name[16];
} wld_header_t;

typedef struct {
  wld_header_t header;
  int32_t num_vertices;
  wld_vertex_t *vertices;
  int32_t num_walls;
  wld_wall_t *walls;
  int32_t num_regions;
  wld_region_t *regions;
  int32_t num_flags;
  wld_flag_t *flags;
  int32_t background;

  vpe_t vpe;
} wld_t;

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
 * Leemos un mapa de DIV.
 */
int32_t map_load(map_t *map, const char *filename) {
  FILE* file = fopen(filename, "r");
  if (file == NULL) {
    return 1;
  }

  fread(&map->header,sizeof(map_header_t), 1, file);
  if (strcmp(map->header.signature, MAP_SIGNATURE) != 0) {
    fclose(file);
    return 2;
  }
  fread(&map->palette,sizeof(palette_t), 1, file);
  fread(&map->num_points, 2, 1, file);

  map->points = calloc(map->num_points, sizeof(point_t));
  fread(map->points, sizeof(point_t), map->num_points, file);

  map->pixels = calloc(1, map->header.width * map->header.height);
  fread(map->pixels, map->header.width * map->header.height, 1, file);

  fclose(file);
  return 0;
}

/**
 * Leemos un mapa de un FPG.
 */
fpg_map_t *fpg_map_read(fpg_t* fpg, FILE* file) {
  fpg_map_t *fpg_map = calloc(1, sizeof(fpg_map_t));  

  fread(&fpg_map->header, sizeof(fpg_map_header_t), 1, file);
  fread(&fpg_map->num_points, 4, 1, file);

  fpg_map->points = calloc(fpg_map->num_points, sizeof(point_t));
  fread(fpg_map->points, sizeof(point_t), fpg_map->num_points, file);

  fpg_map->pixels = calloc(1, fpg_map->header.width * fpg_map->header.height);
  fread(fpg_map->pixels, fpg_map->header.width * fpg_map->header.height, 1, file);

  if (fpg->num_maps == 0) {
    fpg->start = fpg_map;
    fpg->end = fpg_map;
    fpg->num_maps++;
  } else {
    fpg_map->prev = fpg->end;
    fpg->end->next = fpg_map;
  }
  return fpg_map;
}

/**
 * Leemos un FPG de DIV.
 */
int32_t fpg_load(fpg_t* fpg, const char* filename) {
  FILE* file = fopen(filename, "r");
  if (file == NULL) {
    return 1;
  }

  fread(&fpg->header, sizeof(fpg_header_t), 1, file);
  if (strcmp(fpg->header.signature, FPG_SIGNATURE) != 0) {
    fclose(file);
    return 2;
  }

  fread(&fpg->palette, sizeof(palette_t), 1, file);
  while (!feof(file)) {
    fpg_map_read(fpg, file);
  }
  fclose(file);
  return 0;
}

/**
 * Leemos un WLD de DIV.
 */
int32_t wld_load(wld_t* wld, const char* filename) {
  FILE* file = fopen(filename, "r");
  if (file == NULL) {
    return 1;
  }

  fread(&wld->header, sizeof(wld_header_t), 1, file);
  if (strcmp(wld->header.signature, WLD_SIGNATURE) != 0) {
    fclose(file);
    return 2;
  }
  fread(&wld->num_vertices, 4, 1, file);
  
  wld->vertices = calloc(wld->num_vertices, sizeof(wld_vertex_t));
  fread(wld->vertices, sizeof(wld_vertex_t), wld->num_vertices, file);

  fread(&wld->num_walls, 4, 1, file);
  wld->walls = calloc(wld->num_walls, sizeof(wld_wall_t));
  fread(wld->walls, sizeof(wld_wall_t), wld->num_walls, file);

  fread(&wld->num_regions, 4, 1, file);
  wld->regions = calloc(wld->num_regions, sizeof(wld_region_t));
  fread(wld->regions, sizeof(wld_region_t), wld->num_regions, file);

  fread(&wld->num_flags, 4, 1, file);
  wld->flags = calloc(wld->num_flags, sizeof(wld_flag_t));
  fread(wld->flags, sizeof(wld_flag_t), wld->num_flags, file);
  fread(&wld->background, 4, 1, file);
  
  // vamos al offset donde se encuentran los datos
  // de VPE.
  fseek(file, wld->header.offset + 12, SEEK_SET);
  fread(&wld->vpe.header, sizeof(vpe_header_t), 1, file);
  if (strcmp(wld->vpe.header.signature, VPE_SIGNATURE) != 0) {
    fclose(file);
    return 3;
  }

  fread(&wld->vpe.num_vertices, 2, 1, file);
  fread(&wld->vpe.num_regions, 2, 1, file);
  fread(&wld->vpe.num_walls, 2, 1, file);
  fread(&wld->vpe.num_flags, 2, 1, file);

  wld->vpe.vertices = calloc(wld->num_vertices, sizeof(vpe_vertex_t));
  wld->vpe.regions = calloc(wld->num_regions, sizeof(vpe_region_t));
  wld->vpe.walls = calloc(wld->num_walls, sizeof(vpe_wall_t));
  wld->vpe.flags = calloc(wld->num_flags, sizeof(vpe_flag_t));

  fread(wld->vpe.vertices, sizeof(vpe_vertex_t), wld->vpe.num_vertices, file);
  fread(wld->vpe.regions, sizeof(vpe_region_t), wld->vpe.num_regions, file);
  fread(wld->vpe.walls, sizeof(vpe_wall_t), wld->vpe.num_walls, file);
  fread(wld->vpe.flags, sizeof(vpe_flag_t), wld->vpe.num_flags, file);

  fread(&wld->vpe.footer, sizeof(vpe_footer_t), 1, file);

  return 0;
}

/**
 * Retorna un JSON a partir de un WLD
 */
int32_t wld_stringify(wld_t* wld) {
  uint32_t index;
  json_t json = { NULL, 0, 16 * 1024 * 1024, 0, "" };
  json.buffer = calloc(1, json.size);

  json_object_open(&json);

  json_prop_object_open(&json, "header");
  json_prop_int(&json, "offset", wld->header.offset, ',');
  json_prop_string(&json, "wldPath", wld->header.wld_path, ',');
  json_prop_string(&json, "wldName", wld->header.wld_name, ',');
  json_prop_string(&json, "fpgPath", wld->header.fpg_path, ',');
  json_prop_string(&json, "fpgName", wld->header.fpg_name, ',');
  json_prop_int(&json, "number", wld->header.number, 0);
  json_prop_object_close(&json, ',');

  json_prop_object_open(&json, "geometry");
  json_prop_array_open(&json, "vertices");
  for (index = 0; index < wld->num_vertices; index++) {
    json_object_open(&json);
    json_prop_bool(&json, "active", wld->vertices[index].active, ',');
    json_prop_int(&json, "x", wld->vertices[index].x, ','); 
    json_prop_int(&json, "y", wld->vertices[index].y, ','); 
    json_prop_int(&json, "links", wld->vertices[index].links, 0);
    json_object_close(&json, index < wld->num_vertices - 1);
  }
  json_prop_array_close(&json, ','); // vertex list

  json_prop_array_open(&json, "walls");
  for (index = 0; index < wld->num_walls; index++) {
    json_object_open(&json);
    json_prop_bool(&json, "active", wld->walls[index].active, ',');
    json_prop_int(&json, "type", wld->walls[index].type, ',');
    json_prop_int(&json, "vertexStart", wld->walls[index].vertex_start, ','); 
    json_prop_int(&json, "vertexEnd", wld->walls[index].vertex_end, ','); 
    json_prop_int(&json, "regionFront", wld->walls[index].region_front, ','); 
    json_prop_int(&json, "regionBack", wld->walls[index].region_back, ','); 
    json_prop_int(&json, "textureMiddle", wld->walls[index].texture_middle, ','); 
    json_prop_int(&json, "textureTop", wld->walls[index].texture_top, ','); 
    json_prop_int(&json, "textureBottom", wld->walls[index].texture_bottom, ','); 
    json_prop_int(&json, "fade", wld->walls[index].fade, 0); 
    json_object_close(&json, index < wld->num_walls - 1);
  }
  json_prop_array_close(&json, ','); // wall list
  
  json_prop_array_open(&json, "regions");
  for (index = 0; index < wld->num_regions; index++) {
    json_object_open(&json);
    json_prop_bool(&json, "active", wld->regions[index].active, ',');
    json_prop_int(&json, "type", wld->regions[index].type, ',');
    json_prop_int(&json, "heightFloor", wld->regions[index].height_floor, ','); 
    json_prop_int(&json, "heightCeiling", wld->regions[index].height_ceiling, ','); 
    json_prop_int(&json, "textureFloor", wld->regions[index].texture_floor, ','); 
    json_prop_int(&json, "textureCeiling", wld->regions[index].texture_ceiling, ','); 
    json_prop_int(&json, "fade", wld->regions[index].fade, 0); 
    json_object_close(&json, index < wld->num_regions - 1);
  }
  json_prop_array_close(&json, ','); // region list
  
  json_prop_array_open(&json, "flags");
  for (index = 0; index < wld->num_flags; index++) {
    json_object_open(&json);
    json_prop_bool(&json, "active", wld->flags[index].active, ',');
    json_prop_int(&json, "x", wld->flags[index].x, ','); 
    json_prop_int(&json, "y", wld->flags[index].y, ','); 
    json_prop_int(&json, "number", wld->flags[index].number, 0); 
    json_object_close(&json, index < wld->num_flags - 1);
  }
  json_prop_array_close(&json, 0); // flag list

  json_prop_object_close(&json, ','); // geometry

  json_prop_object_open(&json, "vpe");
  
  json_prop_array_open(&json, "vertices");
  for (index = 0; index < wld->vpe.num_vertices; index++) {
    json_object_open(&json);
    json_prop_int(&json, "type", wld->vpe.vertices[index].type, ',');
    json_prop_int(&json, "x", wld->vpe.vertices[index].x, ','); 
    json_prop_int(&json, "y", wld->vpe.vertices[index].y, ','); 
    json_prop_int(&json, "path", wld->vpe.vertices[index].path, ','); 
    json_prop_int(&json, "link", wld->vpe.vertices[index].link, 0); 
    json_object_close(&json, index < wld->vpe.num_vertices - 1);
  }
  json_prop_array_close(&json, ',');
  
  json_prop_array_open(&json, "walls");
  for (index = 0; index < wld->vpe.num_walls; index++) {
    json_object_open(&json);
    json_prop_int(&json, "type", wld->vpe.walls[index].type, ',');
    json_prop_int(&json, "vertexStart", wld->vpe.walls[index].vertex_start, ','); 
    json_prop_int(&json, "vertexEnd", wld->vpe.walls[index].vertex_end, ','); 
    json_prop_int(&json, "regionFront", wld->vpe.walls[index].region_front, ','); 
    json_prop_int(&json, "regionBack", wld->vpe.walls[index].region_back, ','); 
    json_prop_int(&json, "textureTop", wld->vpe.walls[index].texture_top, ','); 
    json_prop_int(&json, "textureMiddle", wld->vpe.walls[index].texture_middle, ','); 
    json_prop_int(&json, "textureBottom", wld->vpe.walls[index].texture_bottom, ','); 
    json_prop_string(&json, "effect", wld->vpe.walls[index].effect, ','); 
    json_prop_int(&json, "fade", wld->vpe.walls[index].fade, ','); 
    json_prop_int(&json, "textureX", wld->vpe.walls[index].texture_x, ','); 
    json_prop_int(&json, "textureY", wld->vpe.walls[index].texture_y, ','); 
    json_prop_int(&json, "mass", wld->vpe.walls[index].mass, ','); 
    json_prop_int(&json, "tag", wld->vpe.walls[index].tag, 0); 
    json_object_close(&json, index < wld->vpe.num_walls - 1);
  }
  json_prop_array_close(&json, ',');

  json_prop_array_open(&json, "regions");
  for (index = 0; index < wld->vpe.num_regions; index++) {
    json_object_open(&json);
    json_prop_int(&json, "type", wld->vpe.regions[index].type, ',');
    json_prop_int(&json, "heightFloor", wld->vpe.regions[index].height_floor, ','); 
    json_prop_int(&json, "heightCeiling", wld->vpe.regions[index].height_ceiling, ','); 
    json_prop_int(&json, "regionBelow", wld->vpe.regions[index].region_below, ','); 
    json_prop_int(&json, "regionAbove", wld->vpe.regions[index].region_above, ','); 
    json_prop_int(&json, "textureFloor", wld->vpe.regions[index].texture_floor, ','); 
    json_prop_int(&json, "textureCeiling", wld->vpe.regions[index].texture_ceiling, ','); 
    json_prop_string(&json, "effect", wld->vpe.regions[index].effect, ','); 
    json_prop_int(&json, "fade", wld->vpe.regions[index].fade, ','); 
    json_prop_int(&json, "tag", wld->vpe.regions[index].tag, 0); 
    json_object_close(&json, index < wld->vpe.num_regions - 1);
  }
  json_prop_array_close(&json, ',');

  json_prop_array_open(&json, "flags");
  for (index = 0; index < wld->vpe.num_flags; index++) {
    json_object_open(&json);
    json_prop_int(&json, "x", wld->vpe.flags[index].x, ','); 
    json_prop_int(&json, "y", wld->vpe.flags[index].y, ','); 
    json_prop_int(&json, "number", wld->vpe.flags[index].number, 0); 
    json_object_close(&json, index < wld->vpe.num_flags - 1);
  }
  json_prop_array_close(&json, ',');

  json_prop_string(&json, "title", wld->vpe.footer.title, ',');
  json_prop_string(&json, "palette", wld->vpe.footer.palette, ',');
  json_prop_int(&json, "textureScreen", wld->vpe.footer.texture_screen, ',');
  json_prop_int(&json, "textureBack", wld->vpe.footer.texture_back, ',');
  json_prop_string(&json, "effect", wld->vpe.footer.effect, ',');
  json_prop_int(&json, "angle", wld->vpe.footer.angle, ',');
  json_prop_int(&json, "view", wld->vpe.footer.view, ',');
  
  json_prop_object_open(&json, "force");
  json_prop_int(&json, "x", wld->vpe.footer.force.x, ','); 
  json_prop_int(&json, "y", wld->vpe.footer.force.y, ','); 
  json_prop_int(&json, "z", wld->vpe.footer.force.z, ','); 
  json_prop_int(&json, "t", wld->vpe.footer.force.t, 0); 
  json_prop_object_close(&json, 0);

  json_prop_object_close(&json, 0);

  json_object_close(&json, 0);

  printf("%s", json.buffer);
  free(json.buffer);
}

/**
 * 
 *
 *
 */
int main(int argc, char *argv[]) {
  wld_t *wld = calloc(1, sizeof(wld_t));
  int32_t result = wld_load(wld, argv[1]);
  if (result != 0) {
    return result;
  }
  wld_stringify(wld);
  return result;
}
