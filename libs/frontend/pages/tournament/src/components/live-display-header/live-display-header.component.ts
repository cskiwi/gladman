import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

export type LiveConnectionState = 'connected' | 'connecting' | 'offline';

/** Presentational title row for the public live displays: heading plus connection status. */
@Component({
  selector: 'app-live-display-header',
  standalone: true,
  imports: [TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="m-0 text-3xl font-bold md:text-4xl">{{ title() }}</h1>
      @switch (state()) {
        @case ('connected') {
          <p-tag severity="success" value="Live" icon="pi pi-wifi" />
        }
        @case ('connecting') {
          <p-tag severity="warn" value="Connecting..." icon="pi pi-spin pi-spinner" />
        }
        @default {
          <p-tag severity="danger" value="Offline" icon="pi pi-times" />
        }
      }
    </header>
  `,
})
export class LiveDisplayHeaderComponent {
  readonly title = input.required<string>();
  readonly state = input.required<LiveConnectionState>();
}
