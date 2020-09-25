#include "json.h"

uint32_t json_write(json_t* json, const uint8_t* data, ...) {
  va_list args;
  va_start(args, data);
  json->offset += vsnprintf(json->buffer + json->offset, json->size, data, args);
  va_end(args);
  return json->offset;
}

void json_indent_update(json_t* json) {
  uint32_t level;
  for (level = 0; level < json->level; level++) {
    json->indent[level] = ' ';
  }
  json->indent[level] = '\0';
}

uint32_t json_level_up(json_t* json) {
  json->level++;
  json_indent_update(json);
  return json->level;
}

uint32_t json_level_down(json_t* json) {
  json->level--;
  json_indent_update(json);
  return json->level;
}

uint32_t json_object_open(json_t* json) {
  json_write(json, "%s{", json->indent);
  json_level_up(json);
  return json_eol(json);
}

uint32_t json_object_close(json_t* json, const uint8_t comma) {
  json_level_down(json);
  json_write(json, "%s}", json->indent);
  return json_eop(json, comma);
}

uint32_t json_prop_object_open(json_t* json, const uint8_t* name) {
  json_write(json, "%s\"%s\": {", json->indent, name);
  json_level_up(json);
  return json_eol(json);
}

uint32_t json_prop_object_close(json_t* json, const uint8_t comma) {
  json_level_down(json);
  json_write(json, "%s}", json->indent);
  return json_eop(json, comma);
}

uint32_t json_prop_array_open(json_t* json, const uint8_t* name) {
  json_write(json, "%s\"%s\": [", json->indent, name);
  json_level_up(json);
  return json_eol(json);
}

uint32_t json_prop_array_close(json_t* json, const uint8_t comma) {
  json_level_down(json);
  json_write(json, "%s]", json->indent, comma);
  return json_eop(json, comma);
}

uint32_t json_prop_string_hex(json_t* json, const uint8_t* name, const uint8_t* value, const uint8_t comma) {
  json_write(json, "%s\"%s\": \"", json->indent, name);
  while (*value) {
    json_write(json, "%02x", (uint32_t) *value++);
  }
  json_write(json, "\"");
  return json_eop(json, comma);
}

uint32_t json_prop_string(json_t* json, const uint8_t* name, const uint8_t* value, const uint8_t comma) {
  json_write(json, "%s\"%s\": \"%s\"", json->indent, name, value);
  return json_eop(json, comma);
}

uint32_t json_prop_int(json_t* json, const uint8_t* name, const int32_t value, const uint8_t comma) {
  json_write(json, "%s\"%s\": %d", json->indent, name, value, comma);
  return json_eop(json, comma);
}

uint32_t json_prop_float(json_t* json, const uint8_t* name, const float value, const uint8_t comma) {
  json_write(json, "%s\"%s\": %f", json->indent, name, value, comma);
  return json_eop(json, comma);
}

uint32_t json_prop_bool(json_t* json, const uint8_t* name, const uint32_t value, const uint8_t comma) {
  if (value) {
    json_write(json, "%s\"%s\": true", json->indent, name);
  } else {
    json_write(json, "%s\"%s\": false", json->indent, name);
  }
  return json_eop(json, comma);
}

uint32_t json_comma_eol(json_t* json) {
  return json_write(json, ",\n");
}

uint32_t json_comma(json_t* json) {
  return json_write(json, ",");
}

uint32_t json_eol(json_t* json) {
  return json_write(json, "\n");
}

uint32_t json_eop(json_t* json, const uint8_t comma) {
  if (comma) {
    return json_comma_eol(json);
  }
  return json_eol(json);
}

