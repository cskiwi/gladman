---
title: '@app/frontend-components/games/recent'
description: 'Recent game components and player card layout.'
---

Secondary entry point of `@app/frontend-components`. It can be used by importing from `@app/frontend-components/games/recent`.

## Player game cards

Player cards match the [upcoming game cards](../upcoming/README.md) using PrimeNG cards, tags and
theme-color utilities with Tailwind layouts. Both use a 72px date rail on larger screens and a
visible date header on mobile, with matching metadata spacing and divided trailing content.
Recent games retain discipline filters, player pairs, ranking points, set scores and pagination.
Only winning set scores use success tags; other set scores are plain text, without result icons.
On mobile, ranking points sit beside the date, competition details use the full card width,
and each side's set scores sit horizontally beside its players. Desktop keeps the side-by-side layout.
Event names sit beside their draw tags, and mobile player rows omit the redundant versus label.
