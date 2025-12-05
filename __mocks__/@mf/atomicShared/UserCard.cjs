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

// src/components/organisms/UserCard.tsx
var UserCard_exports = {};
__export(UserCard_exports, {
  UserCard: () => UserCard
});
module.exports = __toCommonJS(UserCard_exports);
var import_react2 = __toESM(require("react"), 1);

// src/components/atoms/Button.tsx
var import_react = __toESM(require("react"), 1);
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
  return /* @__PURE__ */ import_react.default.createElement(
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

// src/components/organisms/UserCard.tsx
var UserCard = ({
  user,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "mb-3" }, /* @__PURE__ */ import_react2.default.createElement("h3", { className: "text-lg font-semibold text-gray-900" }, user.username), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-sm text-gray-600" }, user.email), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-xs text-gray-500 mt-1" }, "\u767B\u9332\u65E5: ", formatDate(user.createdAt))), showActions && (onEdit || onDelete) && /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex gap-2 mt-4" }, onEdit && /* @__PURE__ */ import_react2.default.createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => onEdit(user.id),
      className: "flex-1"
    },
    "\u7DE8\u96C6"
  ), onDelete && /* @__PURE__ */ import_react2.default.createElement(
    Button,
    {
      variant: "danger",
      onClick: () => onDelete(user.id),
      className: "flex-1"
    },
    "\u524A\u9664"
  )));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserCard
});
