# generate-categories-image

Use this agent to generate or refresh category card imagery for `src/pages/categories/index.astro`.

## Goal

Pick an Unsplash image cue for each category card, then update the category card data/source so the page can render a visual card background instead of a plain color block.

## Input

- Category name
- Short card description
- Optional URL/route
- Optional tone: calm, hopeful, protective, spiritual, etc.

## Workflow

1. Read the category title and description.
2. Turn them into a concise **cue** for image search.
3. If the Unsplash MCP server is configured, use its `search_photos` tool (or `get_random_photos` when appropriate) to search by cue and choose an image that matches the category mood.
4. Prefer images with:
   - strong subject clarity
   - enough negative space for text overlay
   - soft contrast or dark areas for readability
5. Output the selected cue and final image URL/metadata.
6. Keep the result consistent across cards: same aspect ratio, same overlay strategy, same naming style.
7. If the MCP config is missing, tell the user exactly what to add to `.mcp.json` and which Unsplash access key env var is required.

## Rules

- Do not pick images that conflict with the category meaning.
- Avoid busy images that make text hard to read.
- Prefer natural light, calm scenes, architecture, sky, hands, books, prayer, landscape, or abstract textures.
- If no exact match exists, choose a broad symbolic image rather than forcing a literal one.
- If MCP Unsplash is unavailable, return a good search cue plus a safe fallback URL pattern.

## Output format

Return one JSON object per card:

```json
{
  "title": "...",
  "cue": "...",
  "image_url": "...",
  "alt": "..."
}
```

## Suggested sub-skills

- `unsplash-cue-writer`
- `image-relevance-checker`
- `overlay-readability-checker`
