---
title: '@app/frontend-components/country-state'
description: 'Reusable native country/state form selectors.'
---

## Usage

Secondary entry point of `@app/frontend-components`. It can be used by importing from `@app/frontend-components/country-state`.

Both selectors implement ControlValueAccessor and support reactive `formControlName`.
Their inner Select uses standalone ngModel; parent forms register only the outer value accessor.
Use `inputId` and `ariaLabelledBy` to associate a visible field label with the native combobox:

```html
<label id="country-label" for="country">Country</label>
<app-country-select inputId="country" ariaLabelledBy="country-label" formControlName="country" />
```

The state selector accepts the same label inputs plus a `country` code for filtering.
Both use native fluid sizing and preserve filter, clear and disabled behavior.
