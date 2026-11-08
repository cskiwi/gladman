import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '@app/frontend-components/section-header';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

export type DrawStandingRow = {
  id?: string | number;
  position?: number | null;
  teamId?: string | null;
  player1?: { fullName?: string } | null;
  player2?: { fullName?: string } | null;
  player1Id?: string | null;
  player2Id?: string | null;
  played?: number | null;
  won?: number | null;
  lost?: number | null;
  points?: number | null;
  gamesWon?: number | null;
  gamesLost?: number | null;
  setsWon?: number | null;
  setsLost?: number | null;
  pointsWon?: number | null;
  pointsLost?: number | null;
  name?: string;
  playerName?: string;
};

@Component({
  selector: 'app-draw-standings-table',
  standalone: true,
  imports: [CommonModule, TranslateModule, CardModule, TableModule, SectionHeaderComponent],
  templateUrl: './draw-standings-table.component.html',
})
export class DrawStandingsTableComponent {
  standings = input.required<DrawStandingRow[]>();
}
