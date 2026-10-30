import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Display-style heading used inside the `[identity]` slot of `<app-hero>`.
 * Renders a responsive, wrapping `<h1>` using the shared page typography.
 */
@Component({
  selector: 'app-hero-title',
  templateUrl: './hero-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroTitleComponent {}
