/*
Copyright (c) Daybrush
name: vue3-moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/vue3-moveable
version: 0.17.0
*/
'use strict';

var VanillaMoveable = require('moveable');
var vue = require('vue');
var utils = require('@daybrush/utils');

function _mergeNamespaces(n, m) {
    m.forEach(function (e) {
        e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
            if (k !== 'default' && !(k in n)) {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    });
    return n;
}

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
VanillaMoveable.METHODS.forEach(function (name) {
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
VanillaMoveable.PROPERTIES.forEach(function (name) {
  watch[name] = function (value) {
    this.$_moveable[name] = value;
  };
});
var script = vue.defineComponent({
  name: "moveable",
  methods: methods,
  props: VanillaMoveable.PROPERTIES,
  watch: watch,
  mounted: function () {
    var _this = this;

    var options = {};
    var props = this.$props;
    VanillaMoveable.PROPERTIES.forEach(function (name) {
      var value = props[name];

      if (!utils.isUndefined(value)) {
        options[name] = props[name];
      }
    });
    var refs = this.$refs;
    var moveableElement = refs.moveableElement;
    var moveable = new VanillaMoveable(moveableElement, __assign(__assign({}, options), {
      portalContainer: moveableElement
    }));
    VanillaMoveable.EVENTS.forEach(function (name) {
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
  return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, null, 512
  /* NEED_PATCH */
  );
}

script.render = render;
script.__file = "src/Moveable.vue";

var modules = /*#__PURE__*/_mergeNamespaces({
    __proto__: null,
    VueMoveable: script,
    'default': script
}, [VanillaMoveable]);

for (var name in modules) {
  script[name] = modules[name];
}

module.exports = script;
//# sourceMappingURL=moveable.cjs.js.map
