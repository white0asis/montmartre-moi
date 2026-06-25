# Sanity schemas — reference

These files mirror the schema deployed directly to Sanity (project `fjsrjd09`, dataset
`production`) via the Sanity MCP "deploy_schema" tool. There is **no local Sanity Studio**
in this repo — content is edited either in the hosted Sanity Studio (sanity.io/manage) or
pushed via the API (Cowork editorial plugin, see `src/sanity/client.ts`).

If you ever add a local Studio (`npx sanity@latest init`), copy these definitions into the
Studio's `schemaTypes` and deploy with `npx sanity@latest schema deploy` — do not use the
MCP `deploy_schema` tool once a local Studio exists (the two would diverge).

Types: `author`, `category`, `article`, `place`, `restaurant`, `page`.
URL structure: `/article/[slug]`, `/place/[slug]`, `/category/[slug]`, `/restaurant/[slug]`.
