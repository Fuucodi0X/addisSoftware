Status: ready-for-agent

# PRD: Song Library MERN Application

## Problem Statement

The user needs to complete the Addis Software MERN-stack test project with a polished, understandable, full-stack Song Library application. The assignment requires a backend REST API for creating, listing, updating, deleting, and summarizing Songs, plus a React frontend that uses TypeScript, Redux Toolkit, Redux Saga, Emotion, and Styled System.

The user already created a visual prototype that communicates the desired frontend direction, but the prototype is not the final architecture. The final product must preserve the strong visual presentation while staying faithful to the Song Library domain: a catalogue for Song records and catalogue statistics, not a streaming app.

## Solution

Build a pnpm workspace monorepo containing a backend service and a frontend service. The backend will expose a resource-oriented Song API backed by MongoDB and Mongoose, package cleanly in Docker for Render deployment, and support local development through Docker Compose with MongoDB. The frontend will be a Vite React TypeScript app deployable to Vercel, with Redux Toolkit and Redux Saga handling server state and API effects.

The application will manage Songs with title, artist, album, genre, optional artwork URL, and timestamps. The Song list will support backend-driven pagination, genre filtering, and search. The statistics dashboard will show global Song Library statistics independent of the current page, search query, or genre filter. The UI may include decorative preview/playback chrome and motion to demonstrate frontend skill, but no real audio playback, audio storage, or playback persistence will exist.

## User Stories

1. As a reviewer, I want to run the backend locally, so that I can verify the REST API behavior.
2. As a reviewer, I want to run the frontend locally, so that I can inspect the Song Library user experience.
3. As a reviewer, I want clear root documentation, so that I can understand the project shape quickly.
4. As a reviewer, I want backend-specific documentation, so that I can run API, Docker, seed, and test commands without guessing.
5. As a reviewer, I want frontend-specific documentation, so that I can run and build the UI without guessing.
6. As a reviewer, I want the backend to connect to MongoDB, so that Song records persist outside process memory.
7. As a reviewer, I want the backend to expose conventional REST endpoints, so that the API is easy to inspect and test.
8. As a reviewer, I want Songs to expose `id` instead of Mongo `_id`, so that frontend code is decoupled from Mongo internals.
9. As a reviewer, I want `_id` and `__v` hidden from API responses, so that the public API contract is clean.
10. As a reviewer, I want to create a Song, so that new catalogue entries can be added.
11. As a reviewer, I want to update a Song, so that catalogue metadata can be corrected.
12. As a reviewer, I want to delete a Song, so that incorrect entries can be removed.
13. As a reviewer, I want to list Songs with pagination, so that the API and UI remain bounded as data grows.
14. As a reviewer, I want to filter Songs by genre, so that I can view a subset of the catalogue.
15. As a reviewer, I want to search Songs by title, artist, album, and genre, so that I can find records quickly.
16. As a reviewer, I want search and genre filter changes to reset to page one, so that I do not land on an empty out-of-range page.
17. As a reviewer, I want pagination changes to preserve the active search and filter, so that I can move through the current result set.
18. As a reviewer, I want validation errors to be readable, so that bad requests are easy to fix.
19. As a reviewer, I want unknown body fields rejected, so that the API boundary is explicit.
20. As a reviewer, I want malformed or missing Song IDs to return not found behavior, so that missing resources are handled consistently.
21. As a reviewer, I want duplicate Songs allowed, so that the app does not invent requirements beyond the assignment.
22. As a reviewer, I want a statistics endpoint, so that aggregate Song Library data is available from the backend.
23. As a reviewer, I want total counts for Songs, Artists, Albums, and Genres, so that the catalogue size is clear.
24. As a reviewer, I want Songs by Genre, so that genre distribution is visible.
25. As a reviewer, I want Songs and Albums by Artist, so that artist-level catalogue contribution is visible.
26. As a reviewer, I want Songs by Album, so that album-level catalogue contribution is visible.
27. As a reviewer, I want statistics to be global, so that dashboard values are not confused with the current page of results.
28. As a reviewer, I want seed data, so that the app demonstrates meaningful statistics immediately.
29. As a reviewer, I want Ethiopian-focused seed Songs, so that the demo catalogue has character and local relevance.
30. As a reviewer, I want verified artwork URLs when available, so that seed data looks polished without using incorrect images.
31. As a reviewer, I want missing seed artwork represented as null, so that the absence of verified artwork is explicit.
32. As a reviewer, I want deterministic artwork placeholders, so that Songs without artwork still look intentional.
33. As a reviewer, I want the backend seed script to be explicit, so that data is not unexpectedly reset on server start.
34. As a reviewer, I want the seed script to avoid production resets, so that deployed data is protected.
35. As a reviewer, I want Docker Compose for local backend and MongoDB, so that local setup is repeatable.
36. As a reviewer, I want the backend Dockerfile to be production-ready, so that it can deploy to Render.
37. As a reviewer, I want the backend to listen on the configured port, so that Render can route traffic correctly.
38. As a reviewer, I want a health endpoint, so that deployment checks and debugging are simple.
39. As a reviewer, I want CORS configured by environment, so that local and deployed frontends can call the API intentionally.
40. As a reviewer, I want the frontend deployable to Vercel, so that the bonus deployment path is practical.
41. As a user, I want to see a Song table, so that catalogue records are easy to scan.
42. As a user, I want table rows to show Song title, Artist, Album, Genre, and actions, so that each record is understandable.
43. As a user, I want row actions for edit and delete, so that destructive and editing actions are explicit.
44. As a user, I want an add/edit modal, so that Song metadata can be entered without leaving the catalogue screen.
45. As a user, I want a delete confirmation modal, so that I do not delete a Song accidentally.
46. As a user, I want loading, empty, and error states, so that the UI explains what is happening.
47. As a user, I want the latest changes shown without reloading the page, so that create, update, and delete feel integrated.
48. As a user, I want the statistics dashboard visible in the app, so that I can inspect catalogue aggregates.
49. As a user, I want a polished visual layout inspired by the prototype, so that the submission demonstrates frontend skill.
50. As a user, I want decorative preview chrome, so that selected Songs have a richer visual presentation.
51. As a developer, I want decorative preview state kept separate from persisted Song data, so that the app remains a catalogue.
52. As a developer, I want Redux Toolkit to own server state, so that data flow is predictable.
53. As a developer, I want Redux Saga to own API effects, so that components do not call fetch directly.
54. As a developer, I want UI-only state kept local or in a hook, so that Redux is not overloaded with presentation details.
55. As a developer, I want low-level UI primitives, so that feature components are built from reusable pieces.
56. As a developer, I want Song-specific components separated from generic UI primitives, so that domain logic stays out of generic components.
57. As a developer, I want Emotion and Styled System used for styling, so that the frontend satisfies the assignment requirement.
58. As a developer, I want a small theme, so that colors, spacing, radii, and typography are consistent.
59. As a developer, I want tests around backend behavior, so that the critical API contract is protected.
60. As a developer, I want lightweight frontend tests around interaction and rendering, so that core UI flows remain stable.

## Implementation Decisions

- The product is a Song Library catalogue, not a streaming app, playlist app, or music playback app.
- A Song is a single catalogue entry with title, artist, album, genre, optional artwork URL, and timestamps.
- Artist, Album, Genre, and Artwork are not separate collections or independently managed catalogue entities.
- Artwork URL is optional persisted Song metadata. It is presentation metadata only and does not imply an audio asset or Album entity.
- The backend API is resource-oriented around Songs.
- Song collection reads support page, limit, genre, and search query parameters.
- Song collection reads return a pagination envelope containing items, page, limit, totalItems, and totalPages.
- Single create, read, and update operations return one public Song.
- Deletes return no content on success.
- The public API exposes `id`, never Mongo `_id`.
- The public API does not expose Mongo version metadata.
- Create returns created behavior, validation failures return bad request behavior, and missing Songs return not found behavior.
- Invalid Mongo ID strings are handled as not found from the client perspective.
- Update uses partial update semantics.
- Statistics live under the Song resource and are retrieved from the Song statistics endpoint.
- Statistics are global to the Song Library and are not scoped to the current page, search query, or genre filter.
- Statistics include total Songs, Artists, Albums, and Genres; Songs by Genre; Songs and Albums by Artist; and Songs by Album.
- Search matches title, artist, album, and genre.
- Genre filtering is backend-driven.
- Pagination is backend-driven.
- When search or genre filter changes, the frontend resets to page one before fetching.
- When only the page changes, active search and genre filter remain unchanged.
- After create, update, or delete, the frontend refetches the current Song page and global statistics.
- If deleting the last Song on a page would leave the page out of range, the frontend should move back to a valid page before refetching.
- Optimistic mutation is intentionally not used.
- Backend validation trims title, artist, album, and genre.
- Required Song text fields are non-empty strings.
- Recommended maximum lengths are 120 characters for title, artist, and album; 60 characters for genre; and 1000 characters for artwork URL.
- Unknown request body fields are rejected.
- Artwork URL may be omitted or null. If provided as a string, it must be an HTTP or HTTPS URL.
- The backend has a deep Song service module that owns catalogue operations and statistics calculation.
- The backend has a mapper module that converts persistence-shaped Song data into public API-shaped Song data.
- The backend has validation as a separate boundary before service logic.
- The backend has controller code that only translates HTTP input/output and delegates behavior.
- The backend has a Mongoose model focused on schema definition.
- The backend has centralized error handling and not found handling.
- The backend has environment configuration for port, MongoDB URI, CORS origin, and runtime mode.
- The backend includes a health endpoint for deployment and diagnostics.
- The backend includes a seed script for curated Ethiopian-focused Song records.
- The seed script is explicit and does not run automatically on server start.
- The seed script is protected from accidental production resets.
- Seed records use verified artwork URLs when available. If no correct release-specific artwork URL is found, artwork URL is null.
- Backend seed documentation lives in the backend README.
- The repository is a pnpm workspace monorepo.
- The backend and frontend remain independently deployable service packages.
- Root workspace scripts only orchestrate common commands.
- Docker Compose is local development infrastructure only.
- The backend Dockerfile is the production deployment artifact for Render.
- Production MongoDB is expected to be a managed connection such as MongoDB Atlas, not a Docker Compose sibling service.
- The frontend deploys to Vercel as a Vite app.
- The frontend uses Vite, React, TypeScript, Redux Toolkit, Redux Saga, Emotion, Styled System, and lucide-react.
- The frontend uses a feature-first structure with shared UI primitives.
- Low-level UI primitives include controls such as buttons, icon buttons, modals, text fields, selects, table primitives, badges, pagination, tabs, and statistic cards.
- Song feature components include catalogue controls, Song table, Song table row, add/edit Song modal, delete Song modal, statistics dashboard, and decorative preview chrome.
- A generic table row is a UI primitive; a Song table row remains a Song feature component because it knows about Song data and actions.
- Page-level code orchestrates the Song catalogue experience.
- Redux Toolkit owns server state, filters, pagination, statistics, loading status, mutation status, selected Song ID if needed for cross-component coordination, and error state.
- Redux Saga owns all API effects.
- Components dispatch actions and do not call fetch directly.
- Decorative preview/playback state starts as local page state or a dedicated hook.
- Decorative preview chrome may animate selection, progress, volume UI, and preview state, but stores no backend data and plays no audio.
- The final UI keeps the table as the main Song list surface.
- The UI uses Song Library terminology: Song, Song Library, Song Catalog, catalogue statistics, Artist, Album, Genre, Artwork, and Preview.
- The UI avoids Track, Audio, Master Recording, Asset, Streaming, Playlist, and Music Platform in CRUD and data contexts.
- Visual chrome may use Preview language, but should avoid implying real playback.
- Buttons use clear labels such as Add Song, Edit Song, Delete Song, Save Song, Update Song, and Delete Song confirmation.
- The prototype informs visual direction but not final architecture.
- The final styling should preserve the prototype's slim sidebar, rich table surface, statistics dashboard, modal polish, decorative preview chrome, and subtle motion.
- The final styling should remove Tailwind, emoji, inconsistent labels, arbitrary color sprawl, and hardcoded unverified artwork URLs.
- Motion should use CSS transitions and state-driven animation unless a motion library adds clear value.

## Testing Decisions

- Tests should verify external behavior and public contracts, not implementation details.
- Backend tests are the priority because the assignment's correctness depends heavily on API behavior.
- Backend API tests should cover Song creation, validation failures, unknown field rejection, pagination, genre filtering, search, update, delete, not found behavior, statistics, and response mapping.
- Backend tests should assert that public responses expose `id` and do not expose Mongo `_id` or `__v`.
- Backend statistics tests should use data that proves unique Artist, Album, and Genre counting works correctly.
- Backend validation tests should cover trimming, empty strings, excessive lengths, invalid artwork URL, null artwork URL, and duplicate Song acceptance.
- Backend delete tests should assert no-content success behavior.
- Backend not found tests should cover both well-formed missing IDs and malformed IDs.
- Backend tests may use Vitest, Supertest, and an isolated Mongo test database. An in-memory Mongo test server is preferred if setup is reliable.
- Frontend tests should be lighter and focused on user-observable behavior.
- Frontend tests should cover rendering Songs in the table, opening add/edit/delete modals, dispatching search/filter/page actions, and showing loading, empty, and error states.
- Frontend tests should avoid heavy assertions around decorative preview animation because it is presentation-only and not assignment-critical.
- Manual verification should include seed, backend startup, frontend startup, create, update, delete, filter, search, pagination, statistics refresh, and no page reload after mutations.

## Out of Scope

- Authentication, authorization, roles, sessions, and user accounts are out of scope.
- Audio upload, audio URL, streaming, waveform rendering, and real playback are out of scope.
- Separate Artist, Album, Genre, or Artwork collections are out of scope.
- Persisted playlists, favorites, likes, playback state, volume, shuffle, and repeat are out of scope.
- Duplicate prevention is out of scope.
- Optimistic create, update, or delete behavior is out of scope.
- Bulk import UI, bulk delete, audit logs, permissions, and advanced admin workflows are out of scope.
- Production dependency on Docker Compose is out of scope.
- Statistics scoped to the active search, page, or genre filter are out of scope.
- Lyrics and copyrighted audio content are out of scope.

## Further Notes

The accepted domain language lives in the Song Library glossary. The accepted API and monorepo decisions live in ADRs. Future implementation issues should respect those documents before changing scope.

The strongest deep modules to protect are the backend Song service, backend statistics calculation, backend validation boundary, backend public mapper, frontend Song API client, frontend Redux/Saga flow, and shared UI primitives. These modules should expose small stable interfaces and carry most of the complexity internally.

The prototype in the existing prototype folder is reference material for visual direction only. It should not be copied wholesale because it currently mixes catalogue concerns with playback language and prototype-only implementation shortcuts.
