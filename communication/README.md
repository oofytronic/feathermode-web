# communication/

This folder is **the previous Feathermode website, moved here unchanged** on 25 Oct 2026 when Feathermode became
the parent site. It is a placeholder for a future repository: the communication / "everything" app platform
(working name **Aerodash**) will get its own repo, and this folder is the seed.

What it contains: a single-page pitch for a user-owned writing and self-publishing platform in a parchment
palette (Crimson Pro and DM Sans), with its own `css/style.css` and `js/main.js` that use only relative paths. It
works at `/communication/`. It still says "Feathermode" and still describes the publishing pitch.

## Rules

- **Do not edit, restyle or delete it** as part of other work. It is publicly reachable at `/communication/` and is
  no longer linked from the new site.
- It does not use the shared design system or `css/tokens.css` in the parent folder.

## Extracting it into its own repository

```sh
git subtree split --prefix=communication -b communication-only    # keeps this folder's history
# push that branch to the new repository, then remove communication/ here (and update design.md)
```

Do the extraction only once the new repository exists and the product has its final name and domain.
