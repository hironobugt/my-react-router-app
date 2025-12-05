var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/components/molecules/FormField.tsx
var FormField_exports = {};
__export(FormField_exports, {
  FormField: () => FormField
});
module.exports = __toCommonJS(FormField_exports);
var import_react3 = __toESM(require("react"), 1);

// src/components/atoms/Label.tsx
var import_react = __toESM(require("react"), 1);
var Label = ({
  children,
  htmlFor,
  required = false,
  className = ""
}) => {
  return /* @__PURE__ */ import_react.default.createElement(
    "label",
    {
      htmlFor,
      className: `block text-sm font-medium text-gray-700 mb-1 ${className}`
    },
    children,
    required && /* @__PURE__ */ import_react.default.createElement("span", { className: "text-red-500 ml-1" }, "*")
  );
};

// src/components/atoms/Input.tsx
var import_react2 = __toESM(require("react"), 1);
var Input = ({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  className = "",
  id,
  name,
  defaultValue
}) => {
  const baseStyles = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorStyles = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  if (value !== void 0 && onChange) {
    return /* @__PURE__ */ import_react2.default.createElement(
      "input",
      {
        type,
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        disabled,
        className: `${baseStyles} ${errorStyles} ${className}`,
        id,
        name
      }
    );
  }
  return /* @__PURE__ */ import_react2.default.createElement(
    "input",
    {
      type,
      defaultValue,
      placeholder,
      disabled,
      className: `${baseStyles} ${errorStyles} ${className}`,
      id,
      name
    }
  );
};

// src/components/molecules/FormField.tsx
var FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  defaultValue
}) => {
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "mb-4" }, /* @__PURE__ */ import_react3.default.createElement(Label, { htmlFor: name, required }, label), /* @__PURE__ */ import_react3.default.createElement(
    Input,
    {
      id: name,
      name,
      type,
      value,
      onChange,
      placeholder,
      disabled,
      error,
      defaultValue
    }
  ), error && /* @__PURE__ */ import_react3.default.createElement("p", { className: "mt-1 text-sm text-red-600" }, error));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FormField
});
