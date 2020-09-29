#ifndef __WLD_H__
#define __WLD_H__

#include "json.h"
#include "shared.h"

#define WLD_SIGNATURE "wld\x1A\x0D\x0A\x01\x00"
#define VPE_SIGNATURE "DAT\x00"

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
  int16_t padding;
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
  uint8_t path[256]; // ruta?
  uint8_t name[16];
} wld_file_desc_t;

typedef struct {
  uint8_t signature[8];
  uint32_t offset; // Donde se encuentran los datos de VPE
  wld_file_desc_t wld;
  int32_t number;
  wld_file_desc_t fpg;
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

#endif
