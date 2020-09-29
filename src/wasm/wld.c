#include "wld.h"

/**
 * Leemos un WLD de DIV.
 */
int32_t wld_load(wld_t *wld, const char *filename)
{
  FILE *file = fopen(filename, "r");
  if (file == NULL)
  {
    return 1;
  }

  fread(&wld->header, sizeof(wld_header_t), 1, file);
  if (strcmp(wld->header.signature, WLD_SIGNATURE) != 0)
  {
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
  if (strcmp(wld->vpe.header.signature, VPE_SIGNATURE) != 0)
  {
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
int32_t wld_stringify(wld_t *wld)
{
  uint32_t index;
  json_t json = {NULL, 0, 16 * 1024 * 1024, 0, ""};
  json.buffer = calloc(1, json.size);

  json_object_open(&json);

  json_prop_object_open(&json, "header");
  json_prop_int(&json, "offset", wld->header.offset, ',');
  json_prop_string(&json, "wldPath", wld->header.wld.path, ',');
  json_prop_string(&json, "wldName", wld->header.wld.name, ',');
  json_prop_string(&json, "fpgPath", wld->header.fpg.path, ',');
  json_prop_string(&json, "fpgName", wld->header.fpg.name, ',');
  json_prop_int(&json, "number", wld->header.number, 0);
  json_prop_object_close(&json, ',');

  json_prop_object_open(&json, "geometry");
  json_prop_array_open(&json, "vertices");
  for (index = 0; index < wld->num_vertices; index++)
  {
    json_object_open(&json);
    json_prop_bool(&json, "active", wld->vertices[index].active, ',');
    json_prop_int(&json, "x", wld->vertices[index].x, ',');
    json_prop_int(&json, "y", wld->vertices[index].y, ',');
    json_prop_int(&json, "links", wld->vertices[index].links, 0);
    json_object_close(&json, index < wld->num_vertices - 1);
  }
  json_prop_array_close(&json, ','); // vertex list

  json_prop_array_open(&json, "walls");
  for (index = 0; index < wld->num_walls; index++)
  {
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
  for (index = 0; index < wld->num_regions; index++)
  {
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
  for (index = 0; index < wld->num_flags; index++)
  {
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
  for (index = 0; index < wld->vpe.num_vertices; index++)
  {
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
  for (index = 0; index < wld->vpe.num_walls; index++)
  {
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
  for (index = 0; index < wld->vpe.num_regions; index++)
  {
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
  for (index = 0; index < wld->vpe.num_flags; index++)
  {
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
