---
title: '@app/frontend-components/games/upcoming'
description: 'Upcoming game components and player card layout.'
---

Secondary entry point of `@app/frontend-components`. It can be used by importing from `@app/frontend-components/games/upcoming`.

## Player game cards

Player cards match the [recent game cards](../recent/README.md) using PrimeNG cards, tags and
theme-color utilities with Tailwind layouts. Both use a 72px date rail on larger screens and a
visible date header on mobile, with matching metadata spacing and divided trailing content.
Upcoming games retain start times, home/away labels, lineup links and expand/collapse controls.
The lineup action moves below the matchup on mobile.
