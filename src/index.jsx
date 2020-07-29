import React from "react";
import Main from "./main";
import { renderToStaticMarkup } from "react-dom/server";

export function render(props) {
  return renderToStaticMarkup(<Main {...props} />);
}
