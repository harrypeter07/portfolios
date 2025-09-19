# Templates App (portume templates)

Stateless Next.js App Router service that server-renders portfolio templates and returns HTML/CSS to the Main App (portume.vercel.app). MongoDB/auth/analytics live in the Main App. This service is secured via service-to-service JWT and uses ETag + Cache-Control for caching.

## Domains
- Main App: `portume.vercel.app`
- Templates App: `templates.portume.com` (deploy this on Vercel)

## Endpoints
- POST `/api/render` (protected)
  - Body: `{ templateId, data, options? }`
  - Auth: `Authorization: Bearer <jwt>` (HS256; `scope: "render"`)
  - Validates payload with Zod, SSRs template to HTML, returns `{ html, css, meta }`
  - Caching: `ETag` + `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` and 304 support
- GET `/api/templates/manifest`
  - Returns array of available template manifests
  - Cache: `s-maxage=86400`
- GET `/preview/[username]` (optional preview/pull)
  - Query: `?token=<signed>` (HS256)
  - Verifies token, pulls portfolio from `${MAIN_API_BASE}`, renders full HTML page for previews/rewrites

## Environment variables
- `SHARED_JWT_SECRET` (required): HS256 for service auth
- `ALLOWED_ORIGINS` (optional): CSV, e.g. `https://portume.vercel.app`
- `MAIN_API_BASE` (optional, preview): e.g. `https://portume.vercel.app`
- `PREVIEW_JWT_SECRET` (optional): HS256 for preview links (can reuse `SHARED_JWT_SECRET`)

## Data schema (shared)
Zod schema located at `packages/shared/portfolioSchema.ts`. Import via `shared/portfolioSchema`.
- Normalized shape uses `portfolioData` from Main App but also accepts `content` fallback.

## Templates
- Folder per template: `templates/<templateId>`
  - `index.tsx`: default export React component `(props: { data: any })`, SSR-only; optional `export const css = string`
  - `manifest.json`: `{ id, name, version, description, previewImage }`
  - `assets/`, `styles/` optional
- Register in `src/templates/registry.ts`:
  - Maps id → `{ Component, manifest, css }`
- Example templates:
  - `modern-resume`: full resume layout
  - `minimal-card`: lightweight profile card

## Important files
- `app/api/render/route.ts`: JWT verify, validate, SSR, ETag/Cache-Control, 304
- `app/api/templates/manifest/route.ts`: returns manifests
- `app/api/render/export/route.ts`: stub for PDF/PNG (501)
- `app/preview/[username]/page.tsx`: signed preview pull and full HTML page
- `src/lib/auth.ts`: HS256 verification (service/preview)
- `src/lib/cache.ts`: ETag builder and cache headers
- `src/lib/renderer.ts`: validation, normalization, SSR helper, returns html+css+version
- `src/templates/registry.ts`: template registry
- `packages/shared/*`: shared Zod schema and exports

## TypeScript / Config
- `tsconfig.json`: App Router friendly config with path aliases:
  - `@/*` → project root
  - `shared/*` → `packages/shared/*`

## How to add a new portfolio template
1. Create `templates/<your-id>/index.tsx` exporting default component and optional `css`.
2. Replace mock/hardcoded data with reads from `props.data` per shared schema.
3. Add `templates/<your-id>/manifest.json`.
4. Register in `src/templates/registry.ts`.
5. Test via `POST /api/render` using `templateId` and valid JWT.

## Change log (what was added/modified)
- Added TypeScript config with aliases: `tsconfig.json`
- Created shared schema package: `packages/shared/{package.json, tsconfig.json, index.ts, portfolioSchema.ts}`
- Implemented auth utilities: `src/lib/auth.ts`
- Implemented cache utilities: `src/lib/cache.ts`
- Implemented renderer helper: `src/lib/renderer.ts`
- Created template registry and templates:
  - `src/templates/registry.ts`
  - `templates/modern-resume/{index.tsx, manifest.json, styles.css}`
  - `templates/minimal-card/{index.tsx, manifest.json}`
  - `templates/README.md` (migration guide)
- Implemented APIs:
  - `app/api/render/route.ts` (returns `{ html, css, meta }`, ETag, 304)
  - `app/api/templates/manifest/route.ts`
  - `app/api/render/export/route.ts` (stub)
- Implemented optional preview page: `app/preview/[username]/page.tsx`

## How the Apps Connect (Data Flow)

### 1. JWT Secret Connection
- **YES, `SHARED_JWT_SECRET` is your main app's JWT secret**
- Both apps must use the SAME secret for HS256 JWT verification
- Main app creates JWTs with `scope: "render"` and sends them to Templates app
- Templates app verifies these JWTs using the same secret

### 2. Data Flow Options

**Option A: Server-side Proxy (Recommended)**
```
User → Main App (portume.vercel.app) → Templates App (templates.portume.com)
```
1. User visits `portume.vercel.app/username`
2. Main app fetches portfolio data from MongoDB
3. Main app calls `POST templates.portume.com/api/render` with:
   - `Authorization: Bearer <jwt>` (created with your main app's JWT secret)
   - Body: `{ templateId: "modern-resume", data: portfolioData }`
4. Templates app returns `{ html, css, meta }`
5. Main app serves the HTML to user

**Option B: Preview/Edge Rewrite**
```
User → Templates App (templates.portume.com/preview/username?token=<signed>)
```
1. Main app creates signed preview URL with JWT token
2. User visits Templates app directly
3. Templates app fetches portfolio from `MAIN_API_BASE/api/portfolio/username?token=<signed>`
4. Templates app renders and serves full HTML page

### 3. Deployment Steps

**Deploy Templates App:**
1. Push this code to GitHub
2. Deploy on Vercel as `templates.portume.com`
3. Set environment variables:
   - `SHARED_JWT_SECRET` = your main app's JWT secret
   - `MAIN_API_BASE` = `https://portume.vercel.app`
   - `ALLOWED_ORIGINS` = `https://portume.vercel.app`

**Update Main App:**
1. Add server-side API route to call Templates app:
```javascript
// In your main app: app/api/render-portfolio/route.js
export async function POST(request) {
  const portfolioData = await getPortfolioFromDB();
  const jwt = await createJWT({ scope: "render" }); // Use your existing JWT secret
  
  const response = await fetch('https://templates.portume.com/api/render', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      templateId: portfolioData.templateId,
      data: portfolioData
    })
  });
  
  return response.json(); // { html, css, meta }
}
```

### 4. Current Schema Coverage
The current schema includes ALL major portfolio sections:
- ✅ **Personal**: firstName, lastName, title, subtitle, tagline, email, phone, location, social
- ✅ **About**: summary
- ✅ **Projects**: items with title, description, links, technologies
- ✅ **Skills**: technical, soft, languages
- ✅ **Experience**: jobs with position, company, dates, description, technologies
- ✅ **Education**: degrees with institution, field, dates, grades
- ✅ **Achievements**: awards, certifications, publications
- ✅ **Theme**: color, font
- ✅ **Layout**: custom layout options

### 5. What's Left to Do
1. **Deploy Templates App** to Vercel
2. **Update Main App** to call Templates app (server-side proxy)
3. **Add more templates** by copying your Next.js/Vite portfolios to `templates/<id>/`
4. **Test the connection** with a real portfolio

## Notes
- No database in this service. All data is provided by the Main App.
- Co-locate in the same region as Main App; CDN cache enabled via headers.