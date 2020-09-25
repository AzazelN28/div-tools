#ifndef _JSON_H_
#define _JSON_H_

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdarg.h>

typedef struct {
  uint8_t *buffer;
  uint32_t offset;
  uint32_t size;
  uint32_t level;
  uint8_t indent[256]; 
} json_t;

extern uint32_t json_write(json_t* json, const uint8_t* data, ...);
extern void json_indent_update(json_t* json);
extern uint32_t json_level_up(json_t* json);
extern uint32_t json_level_down(json_t* json);
extern uint32_t json_object_open(json_t* json);
extern uint32_t json_object_close(json_t* json, const uint8_t comma);
extern uint32_t json_prop_object_open(json_t* json, const uint8_t* name);
extern uint32_t json_prop_object_close(json_t* json, const uint8_t comma);
extern uint32_t json_prop_array_open(json_t* json, const uint8_t* name);
extern uint32_t json_prop_array_close(json_t* json, const uint8_t comma);
extern uint32_t json_prop_string_hex(json_t* json, const uint8_t* name, const uint8_t* value, const uint8_t comma);
extern uint32_t json_prop_string(json_t* json, const uint8_t* name, const uint8_t* value, const uint8_t comma);
extern uint32_t json_prop_int(json_t* json, const uint8_t* name, const int32_t value, const uint8_t comma);
extern uint32_t json_prop_float(json_t* json, const uint8_t* name, const float value, const uint8_t comma);
extern uint32_t json_prop_bool(json_t* json, const uint8_t* name, const uint32_t value, const uint8_t comma);
extern uint32_t json_eol_comma(json_t* json);
extern uint32_t json_comma(json_t* json);
extern uint32_t json_eol(json_t* json);
extern uint32_t json_eop(json_t* json, const uint8_t comma);
#endif
