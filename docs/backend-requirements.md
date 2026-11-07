# Backend requirements for UI Revamp 2.0

The UI revamp is built entirely on existing endpoints. Nothing below blocks it. These are the
changes that unlock the remaining mockup details and make the product more robust.
Priority: **P1** visible in the mockups, **P2** quality and scale.

## P1: needed to match the mockups

### 1. Notebook counts on the workspace list
- **Where:** `GET /workspaces` (and `GET /workspaces/:id`).
- **Add:** `sourceCount` and `artifactCount` (study guides) per workspace.
- **Why:** Notebook cards show "8 sources · 6 study guides". The list payload has no counts, and fetching sources per workspace from the dashboard would be an N+1 request storm.

### 2. Richer citations
- **Where:** the `citations` JSON stored with each assistant message (and streamed with it).
- **Add:** `chapter` or `section` (string), `chunkTotal` (number, alongside the existing `chunkIndex`), and `pageEnd` for ranges.
- **Why:** The citation side panel shows "Chapter 2 · pp. 28-31" and "Chunk 12 of 48". Today it only has `page`, `path` and `excerpt`.

### 3. Per-item citations inside generated artifacts
- **Where:** artifact `content` for FLASHCARDS, QUIZ, SUMMARY and REPORT generation output.
- **Add:** a `citations` array per card, question and section: `{ sourceId, label, page? }`.
- **Why:** The flashcard back, quiz explanation and summary "Source notes" show which source each statement came from ("[1] Make It Stick · p. 28"). Artifacts already store `sourceIds`, but not which item used which source.

### 4. Generate an artifact from a conversation
- **Where:** `POST /workspaces/:id/artifacts`.
- **Add:** optional `conversationId` (and optionally `messageIds`) as an alternative to "all ready sources".
- **Why:** The chat "Make it stick" card promises "turn this conversation into a flashcard deck". The UI currently links to Learn instead.

### 5. Learn activity signal
- **Where:** a lightweight `GET /workspaces/:id/summary`.
- **Return:** `{ sourceCount, readySourceCount, processingArtifactCount, unseenArtifactCount }` (track a `viewedAt` per artifact).
- **Why:** The sidebar shows a dot beside Learn when something finished generating, and the source count badge. Both currently require loading full lists.

### 6. Normalised source metadata
- **Where:** `source.metadata`.
- **Standardise keys:** `author` (or channel), `pageCount`, `wordCount`, `durationSeconds` (video), `fileCount` and `repo` (GitHub).
- **Why:** Source rows show "Brown, Roediger & McDaniel · 24 pages", "Barbara Oakley · 18:42", "46 files". Today the row can only show the host or "Added X ago".

### 7a. Multi-file and larger PDF upload
- **Where:** the PDF upload endpoint (multer `fileSize` limit and single-file handling).
- **Change:** accept several PDFs per request (the design says up to 10 files) and raise the limit if 25 MB per file is intended; the UI currently allows one file up to 10 MB, matching the API.
- **Why:** The add-source mockup reads "Up to 10 files · 25 MB per file".

## P2: quality and scale

### 7. Workspace `icon` contract
- **Where:** workspace create/update validation.
- **Change:** accept short string keys up to 8 characters (the UI now stores `sprout`, `library`, `book`, `notes`, `cap`, `idea`, `lab`, `brain`, `spark`, `rocket`, `compass`, `scope`). Do not restrict to emoji. Existing emoji values keep working; the UI maps them to the closest icon.
- **Why:** The UI replaced emoji with vector icons.

### 8. Pagination for sources and artifacts
- **Where:** `GET /workspaces/:id/sources` and `/artifacts`.
- **Add:** `limit` and `cursor` (or `page`), plus `total`.
- **Why:** The library currently loads every source into one table. Fine for tens, not hundreds.

### 9. Bulk endpoint behaviour (verify only)
- **Where:** the existing bulk delete and reprocess endpoints used by the library's bulk bar.
- **Confirm:** they are atomic or return per-id results, and that `reprocess` with a list of ids only touches those ids.
- **Why:** The bulk bar now offers Reprocess and Delete selected on arbitrary selections.

### 10. Server-side search and sort on notebooks
- **Where:** `GET /workspaces?q=&sort=updatedAt`.
- **Why:** The dashboard filters in the browser today; the mockup also shows a "Last updated" sort.

## Not backend

- The login hero image is a crop of the mockup; replace `public/images/login-hero.jpg` with the original asset.
