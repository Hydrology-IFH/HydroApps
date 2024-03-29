/*
Copyright (c) Daybrush
name: vue3-moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/vue3-moveable
version: 0.17.0
*/
import VanillaMoveable__default, { METHODS, PROPERTIES, EVENTS } from 'moveable';
export * from 'moveable';
import { defineComponent, openBlock, createElementBlock } from 'vue';
import { isUndefined } from '@daybrush/utils';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var methods = {};
METHODS.forEach(function (name) {
  methods[name] = function () {
    var _a;

    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    return (_a = this.$_moveable)[name].apply(_a, args);
  };
});
var watch = {};
PROPERTIES.forEach(function (name) {
  watch[name] = function (value) {
    this.$_moveable[name] = value;
  };
});
var script = defineComponent({
  name: "moveable",
  methods: methods,
  props: PROPERTIES,
  watch: watch,
  mounted: function () {
    var _this = this;

    var options = {};
    var props = this.$props;
    PROPERTIES.forEach(function (name) {
      var value = props[name];

      if (!isUndefined(value)) {
        options[name] = props[name];
      }
    });
    var refs = this.$refs;
    var moveableElement = refs.moveableElement;
    var moveable = new VanillaMoveable__default(moveableElement, __assign(__assign({}, options), {
      portalContainer: moveableElement
    }));
    EVENTS.forEach(function (name) {
      moveable.on(name, function (e) {
        _this.$emit(name, __assign({}, e));
      });
    });
    this.$_moveable = moveable;
  },
  beforeUnmount: function () {
    this.$_moveable.destroy();
  }
});

const _hoisted_1 = {
  ref: "moveableElement"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, null, 512
  /* NEED_PATCH */
  );
}

script.render = render;
script.__file = "src/Moveable.vue";

export { script as VueMoveable, script as default };
//# sourceMappingURL=moveable.esm.js.map
