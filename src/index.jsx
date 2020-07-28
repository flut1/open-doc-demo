import React from "react";
import Main from "./main.mdx";
import { renderToStaticMarkup } from "react-dom/server";

export function render() {
  return renderToStaticMarkup(<Main />);
}
