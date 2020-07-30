import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Main from "./main";

export function render(props) {
  return renderToStaticMarkup(<Main {...props} />);
}
