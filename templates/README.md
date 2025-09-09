# Templates

Add each portfolio as a template folder under `templates/<templateId>` with:

- `index.tsx`: default export React component `(props: { data: any }) => JSX.Element` and optional `export const css = string`.
- `manifest.json`: `{ id, name, version, description, previewImage }`.
- `assets/` and `styles/` as needed (assets should be referenced via absolute `/` or imported and inlined by component).

Data: Use `data` prop normalized to `portfolioData` per `packages/shared/portfolioSchema.ts`. Remove hardcoded mock data; map fields from `data` instead. Avoid client-only code.

CSS: Prefer exporting a small critical `css` string. Large CSS can be hosted in Main App CDN later.

Test locally with `POST /api/render` using `templateId` and `data` body, authorized with service JWT.
