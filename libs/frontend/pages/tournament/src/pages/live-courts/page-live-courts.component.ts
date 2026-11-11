import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { injectParams } from 'ngxtension/inject-params';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TournamentLiveService, GameUpdate } from '../../services';
import { LiveConnectionState, LiveDisplayHeaderComponent } from '../../components/live-display-header/live-display-header.component';

@Component({
  selector: 'app-page-live-courts',
  standalone: true,
  imports: [DatePipe, TranslateModule, CardModule, TagModule, LiveDisplayHeaderComponent],
  templateUrl: './page-live-courts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLiveCourtsComponent implements OnDestroy {
  protected readonly liveService = inject(TournamentLiveService);
  private readonly tournamentId = injectParams('tournamentId');

  // Local state combining court statuses with game data
  readonly courts = computed(() => this.liveService.courtStatuses());
  readonly gamesMap = computed(() => {
    const games = this.liveService.gamesInProgress();
    const map = new Map<string, GameUpdate>();
    games.forEach((g) => map.set(g.gameId, g));
    return map;
  });
  readonly stats = computed(() => this.liveService.tournamentStats());
  readonly connectionState = computed<LiveConnectionState>(() =>
    this.liveService.isConnected() ? 'connected' : this.liveService.isConnecting() ? 'connecting' : 'offline',
  );

  constructor() {
    // Connect when tournament ID is available
    effect(() => {
      const id = this.tournamentId();
      if (id) {
        this.liveService.connectToTournament(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.liveService.disconnect();
  }
}
