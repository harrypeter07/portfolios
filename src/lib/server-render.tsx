import React from "react";

export async function renderComponentToString(Component: React.ComponentType<any>, props: any): Promise<string> {
	const { renderToString } = await import("react-dom/server");
	return renderToString(React.createElement(Component, props));
}
