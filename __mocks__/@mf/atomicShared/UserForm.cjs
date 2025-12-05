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

// src/components/organisms/UserForm.tsx
var UserForm_exports = {};
__export(UserForm_exports, {
  UserForm: () => UserForm
});
module.exports = __toCommonJS(UserForm_exports);
var import_react5 = __toESM(require("react"), 1);

// src/components/molecules/FormField.tsx
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

// src/components/atoms/Button.tsx
var import_react4 = __toESM(require("react"), 1);
var Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = ""
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  return /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type,
      onClick,
      disabled,
      className: `${baseStyles} ${variantStyles[variant]} ${className}`
    },
    children
  );
};

// src/components/organisms/UserForm.tsx
var UserForm = ({
  initialValues,
  onSubmit,
  submitLabel,
  errors = {},
  showPassword = true
}) => {
  const [username, setUsername] = (0, import_react5.useState)((initialValues == null ? void 0 : initialValues.username) || "");
  const [email, setEmail] = (0, import_react5.useState)((initialValues == null ? void 0 : initialValues.email) || "");
  const [password, setPassword] = (0, import_react5.useState)("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      username,
      email
    };
    if (showPassword) {
      values.password = password;
    }
    onSubmit(values);
  };
  return /* @__PURE__ */ import_react5.default.createElement("form", { onSubmit: handleSubmit, method: "post", className: "space-y-4" }, /* @__PURE__ */ import_react5.default.createElement(
    FormField,
    {
      label: "\u30E6\u30FC\u30B6\u30FC\u540D",
      name: "username",
      type: "text",
      value: username,
      onChange: setUsername,
      error: errors.username,
      required: true,
      placeholder: "\u30E6\u30FC\u30B6\u30FC\u540D\u3092\u5165\u529B"
    }
  ), /* @__PURE__ */ import_react5.default.createElement(
    FormField,
    {
      label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
      name: "email",
      type: "email",
      value: email,
      onChange: setEmail,
      error: errors.email,
      required: true,
      placeholder: "email@example.com"
    }
  ), showPassword && /* @__PURE__ */ import_react5.default.createElement(
    FormField,
    {
      label: "\u30D1\u30B9\u30EF\u30FC\u30C9",
      name: "password",
      type: "password",
      value: password,
      onChange: setPassword,
      error: errors.password,
      required: true,
      placeholder: "8\u6587\u5B57\u4EE5\u4E0A"
    }
  ), /* @__PURE__ */ import_react5.default.createElement(Button, { type: "submit", variant: "primary", className: "w-full" }, submitLabel));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserForm
});
