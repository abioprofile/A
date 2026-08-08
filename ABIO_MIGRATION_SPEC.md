# Abio frontend — migration spec (Cursor instructions)

Use this document as the source of truth when rebuilding Abio in a new codebase.

**Target stack:** React 19 + TypeScript + Vite + TanStack Query (+ TanStack Router if needed) + Tailwind CSS.

**Recommended additions:** TanStack Form or React Hook Form + Zod, Axios, Sonner toasts, Lucide icons.

---

## Product summary

**Abio** is a link-in-bio / profile product. Users sign up, complete onboarding (username, profile, links, goals, template), customize **appearance** (corners, font, theme, wallpaper), manage links, and get a public page at `/{username}`. Dashboard shows a **phone preview** that mirrors saved settings. Some usernames have **hardcoded special behavior** on the public page (do not remove without product sign-off).

---

## What the old app is (current mess)

- **Framework:** Next.js 15 App Router (`src/app/...`), mixed `"use client"` everywhere.
- **State:** Redux Toolkit (`auth` slice) + React Query + some Zustand — duplicated user/profile sources.
- **API:** Axios `apiClient` in `src/lib/api/config.ts` — Bearer from `localStorage.auth_token`, FormData strips `Content-Type` for multipart.
- **UI:** Tailwind 4, Radix primitives, Framer Motion, scattered modals/sheets.

**Known pain points to fix in the rewrite:**

- Duplicate data fetching (dashboard vs appearance vs `usePhoneDisplayProps`).
- Appearance save split across **4+ endpoints** with partial success risk (mitigated client-side, not true server transaction).
- `useUpdateProfile` onboarding hook **redirects to `/auth/platforms`** — must not run on appearance save.
- Wallpaper `useEffect` loops were fixed with refs; re-implement carefully.
- Font API: backend rejects CSS stacks and `"none"` colors — must map in helpers.
- Image wallpaper **400 "Required"** if `type` is omitted from FormData — must send `type: "image"` + `image: File`.

---

## Core domain: appearance system

### API shape (`GET /user/preferences`)

```ts
interface AppearanceResponse {
  success: boolean;
  message: string;
  data: AppearancePayload;
  statusCode: number;
}

interface AppearancePayload {
  id: string;
  userId: string;
  profileId: string;
  selected_theme: string | null;
  font_config: FontConfig;
  corner_config: CornerConfig;
  wallpaper_config: WallpaperConfig; // can be {} when empty
  createdAt: string;
  updatedAt: string;
}
```

### API endpoints (appearance)

| Action | Method | Path | Body |
|--------|--------|------|------|
| Get all preferences | GET | `/user/preferences` | — |
| Corners (link buttons) | PUT | `/user/preferences/corners` | `CornerConfig` JSON |
| Font | PUT | `/user/preferences/fonts` | `FontConfig` JSON |
| Fill/gradient wallpaper | PUT | `/user/preferences/background` | JSON `{ type, backgroundColor: [{ color, amount }] }` |
| Image wallpaper | PUT | `/user/preferences/background` | **FormData:** `type` = `"image"`, `image` = `File` |

**Important:** Image upload is **not** JSON-only. FormData must include **both** `type` and `image`. Fill uses `amount` (number); UI design often omits amount — default e.g. `0.5` for fill, `100` when restoring from backend if missing.

### UI ↔ API mapping (keep in `lib/appearance` or similar)

- **CornerConfig** ↔ **ButtonStyle** (borderRadius, backgroundColor, borderColor, opacity, boxShadow).
  - `sharp` → `0px`, `round` → `9999px`, `curved` → `12px`.
  - `shadowSize` `hard` vs `soft` → box-shadow string.
- **FontConfig** ↔ **FontStyle** (fontFamily, fillColor, strokeColor, opacity).
  - **Save:** `name` = first font from CSS stack, letters/numbers/hyphens only (`Merriweather` not `'Merriweather', fallback'`).
  - **Save:** `strokeColor` / `fillColor` — never send `"none"`; map to valid hex (e.g. `#000000`, `#00000000`).
- **Wallpaper:**
  - Fill: `{ type: "fill", backgroundColor: [{ color, amount }] }`.
  - Gradient: two colors + amounts.
  - Image: file upload via FormData; preview uses blob URL until save.
  - **Preview theme strings:** `fill:#hex`, `gradient:start:end`, `/themes/themeN.png`, or blob URL for uploaded image.

### Save UX (decided behavior)

- **One global “Save Changes”** on appearance page — **no per-tab save buttons** in Style sub-tabs.
- **Live preview:** local state updates PhoneDisplay immediately; persistence only on Save.
- **Initial load:** `useGetSettings` (query key `["settings"]`) once; seed local state; do not overwrite user edits after first sync (use a `settingsSynced` flag or equivalent).
- **Combined save:** `useUpdateAppearanceAll` runs in **parallel** with shared `AbortController`:
  - Always: corners + font.
  - If fill/gradient selected: `updateAppearanceWallpaper`.
  - If image file pending: `updateAppearanceImage` (FormData with `type` + `image`).
  - Optional: `updateProfile` (`displayName`, `bio`, `location`) and `updateProfileAvatar` in same batch.
  - On **any** failure: abort in-flight requests, show error toast, **refetch settings** and restore local UI from server (no partial “success” UI).
  - On success: invalidate `["settings"]` and `["user"]` if profile/avatar updated; update auth user cache if needed.
- **Note:** True server-side atomicity needs one backend endpoint; client abort only prevents *sending* more requests after first failure, not undoing a completed 200.

---

## Phone preview — single source of truth

Implement **`usePhoneDisplayProps()`**:

- Fetches: `useGetSettings()` + `useGetAllLinks()` (+ auth user for profile fields).
- Returns: `buttonStyle`, `fontStyle`, `selectedTheme`, `profile`, `links`, `isLoading`, `refetch`.
- Used by:
  - **Dashboard** (`/dashboard`) — read-only preview of saved state.
  - **Appearance** (`/dashboard/appearance`) — same hook for initial sync; local state for editing until Save.

**PhoneDisplay** props: `buttonStyle`, `fontStyle`, `selectedTheme`, `profile`, `links`.

- Background: image URL, `fill:#color`, or `gradient:a:b`.
- Link buttons: corner styles + font styles; icons inherit **text color** (no hardcoded `text-black` on icons).
- **Platform icons:** shared **`getPlatformIcon(platform, className?)`** in `PlatformIcon.tsx` — match by `platform.toLowerCase().includes("tiktok")` etc.; default `FaLink`. Same logic on public profile page.

---

## Appearance page structure

**Tabs:** Profile | Style | Themes | Wallpaper

| Tab | Component | Behavior |
|-----|-----------|----------|
| Profile | `ProfileContent` | displayName, bio, location, avatar upload; location = **`LocationInput`** (Nominatim, debounced) |
| Style | `ButtonAndFontTabs` | sub-tabs: Corner (`ButtonCustomizer`), Font (`FontCustomizer`) — preview only, no local Save |
| Themes | `ThemeSelector` | preset theme images |
| Wallpaper | `WallpaperSelector` | fill / gradient / image; hidden file input; Upload tile triggers `fileInputRef.click()` |

Mobile: bottom sheet per tab; desktop: side panel. Undo/redo optional on mobile for appearance state.

**ProfileContent:**

- Avatar: can upload immediately via `useUpdateProfileAvatar` OR defer to global save (current: immediate upload on file pick).
- Location: reusable **`LocationInput`** — OpenStreetMap Nominatim, User-Agent required, debounce ~400ms, click-outside to close, allow custom text if no match.

---

## Public profile `/{username}`

- **Data:** `GET /user/{username}` → profile + `links` + **`display`** (same shape as appearance payload).
- Apply `display.font_config`, `corner_config`, `wallpaper_config`, `selected_theme` to UI (derive styles like appearance helpers).
- **Do not remove special cases:**
  - `username === "ootn"`: fixed background `/themes/ootn.jpeg` + dark overlay `bg-black/65`; display name override `"one of those nights"`.
  - `username === "dnabygaza"`: extra “Menu” tab + `DnaFormV1` / `MenuAccordion`.
- Background priority for non-ootn: ootn branch unchanged → else wallpaper fill color → else `selected_theme` image → fallback theme image.
- Links: same `getPlatformIcon` + font/corner inline styles on `<a>` tags.

---

## Auth & user

- Sign up, sign in, OTP verify, forgot/reset password.
- Token: `localStorage.auth_token`; attach Bearer on all API calls.
- User in store/context + `localStorage.user_data`; profile nested under `user.profile`.
- **Protected routes** for dashboard.
- Onboarding: username → profile → links → goals → template → platforms (watch redirect side effects on `useUpdateProfile`).

### Profile update

- `PATCH /user/profile` — `{ displayName?, bio?, location?, username?, goals? }`.
- `PATCH /user/profile/avatar` — FormData `avatar` file.

### Links

- `GET /links`, `POST /links`, `PATCH /links/:id`, reorder, delete, optional icon upload per link.
- Link model: `id`, `title`, `url`, `platform`, `displayOrder`, `isVisible`.

---

## Suggested new project structure (Vite)

```
src/
  api/           # axios client + auth.api.ts functions (thin)
  types/         # appearance.types.ts, auth.types.ts
  lib/
    appearance/  # mappers: buttonStyle ↔ corner, font, wallpaper, toValidColor, fontFamilyToApiName
  hooks/
    api/         # useAuth.ts — all useQuery/useMutation
    usePhoneDisplayProps.ts
  features/
    appearance/  # page, WallpaperSelector, ThemeSelector, ButtonAndFontTabs
    profile/     # ProfileContent, LocationInput
    dashboard/
    public-profile/
    auth/
  components/
    PhoneDisplay.tsx
    PlatformIcon.tsx
    ui/            # button, input, sheet, modal
  routes/        # TanStack Router: /, /dashboard, /dashboard/appearance, /:username
  store/         # optional: minimal auth slice OR rely on Query + context
```

**Prefer:** TanStack Query as source of truth for server state; avoid duplicating user in multiple stores unless needed for instant header avatar.

---

## TanStack Query keys (convention)

- `["settings"]` — appearance preferences
- `["links"]` or `["user-links"]` — all links
- `["user"]` — current user
- `["user-profile", username]` — public profile

---

## Environment

- `VITE_API_BASE_URL` (replaces `NEXT_PUBLIC_API_BASE_URL`)

---

## Libraries to carry over (optional)

- **sonner** — toasts
- **lucide-react** + **react-icons/fa6** — icons (PlatformIcon)
- **framer-motion** — public profile / marketing animations (optional trim)
- **@dnd-kit** — link reorder
- **react-hook-form + zod** — auth forms
- **axios** — HTTP

**Drop or simplify:** Next.js-specific APIs, duplicate stores, page-level giant components without feature folders.

---

## Testing checklist for parity

1. Load appearance → UI matches GET preferences (font, corners, wallpaper).
2. Edit corner + font + fill wallpaper → Save → all PUTs succeed; preview matches after refetch.
3. Upload wallpaper image → FormData has `type` + `image`; preview shows blob; Save persists.
4. Save with invalid font payload → fail UX: toast + revert local state from settings.
5. Dashboard and appearance PhoneDisplay show same saved data via shared hook.
6. Public `/{username}` reflects `display` config; ootn/dnabygaza branches intact.
7. Location search returns disambiguated places (e.g. Lagos, Nigeria vs Lagos, Portugal).
8. Link icons match platform names; icon color follows font fillColor.

---

## What not to port blindly

- Hardcoded theme paths scattered in dashboard (`/themes/theme1.png`) — centralize theme list.
- `useUpdateProfile` redirect in appearance save path.
- Per-tab Save buttons in `ButtonAndFontTabs` (removed intentionally).
- `Record<string, unknown>` for wallpaper without proper `WallpaperConfig` union + empty `{}` handling.
- Infinite `useEffect` in Wallpaper without ref-based deduping of `initialWallpaperConfig`.

---

## Cursor usage

1. Add this file to the **new** repo (or reference it from the old repo path).
2. In Cursor: **@ABIO_MIGRATION_SPEC.md** in chat, or add as a **Project Rule** / **AGENTS.md** pointer: “Follow ABIO_MIGRATION_SPEC.md for all Abio rebuild work.”
3. Implement feature-by-feature using the testing checklist before moving on.

---

*Generated from the legacy Next.js Abio codebase (`A/`) — reflects appearance save, PhoneDisplay sync, font/wallpaper API quirks, location autocomplete, platform icons, and profile bundled save.*
