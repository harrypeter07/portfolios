import React from "react";
import { renderToString } from "react-dom/server";

export function renderComponentToString(Component: React.ComponentType<any>, props: any): string {
	return renderToString(React.createElement(Component, props));
}
