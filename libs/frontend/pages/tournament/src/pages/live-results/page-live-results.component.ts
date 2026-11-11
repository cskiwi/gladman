import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { injectParams } from 'ngxtension/inject-params';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TournamentLiveService } from '../../services';
import { LiveConnectionState, LiveDisplayHeaderComponent } from '../../components/live-display-header/live-display-header.component';

@Component({
  selector: 'app-page-live-results',
  standalone: true,
  imports: [DatePipe, TranslateModule, CardModule, TagModule, LiveDisplayHeaderComponent],
  templateUrl: './page-live-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLiveResultsComponent implements OnDestroy {
  protected readonly liveService = inject(TournamentLiveService);
  private readonly tournamentId = injectParams('tournamentId');

  readonly recentGames = computed(() => this.liveService.recentCompletedGames());
  readonly connectionState = computed<LiveConnectionState>(() =>
    this.liveService.isConnected() ? 'connected' : this.liveService.isConnecting() ? 'connecting' : 'offline',
  );

  constructor() {
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
