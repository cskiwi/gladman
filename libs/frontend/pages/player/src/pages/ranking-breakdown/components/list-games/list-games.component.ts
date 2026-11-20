import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, linkedSignal, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RankingLastPlace, RankingSystem } from '@app/models';
import type { GamePlayerMembership, RankingPoint } from '@app/models';
import { GameBreakdownType, GetGameResultType } from '@app/utils/comp';
import { GameType } from '@app/models-enum';
import { TierBadgeComponent } from '@app/frontend-components/tier-badge';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { startWith } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { FocusTrapModule } from 'primeng/focustrap';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { Popover, PopoverModule } from 'primeng/popover';
import { GameBreakdown } from '../../models';
import { PlayerSearchResult, RankingBreakdownService, RankingType } from '../../page-ranking-breakdown.service';
import { DayjsFormatPipe } from '@app/frontend-utils/dayjs/fmt';

dayjs.extend(isSameOrAfter);

@Component({
  selector: 'app-list-games',
  templateUrl: './list-games.component.html',
  styleUrl: './list-games.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TableModule,
    TagModule,
    TierBadgeComponent,
    ButtonModule,
    FocusTrapModule,
    AutoCompleteModule,
    DialogModule,
    InputNumberModule,
    SelectButtonModule,
    TooltipModule,
    ToggleButtonModule,
    CheckboxModule,
    PopoverModule,
    DayjsFormatPipe,
  ],
})
export class ListGamesComponent {
  private readonly translateService = inject(TranslateService);
  readonly breakdownService = inject(RankingBreakdownService);

  system = input.required<RankingSystem>();
  private readonly player = this.breakdownService.resolvedPlayer;
  rankingPlace = input<RankingLastPlace | null>(null);
  type = input.required<RankingType>();

  games = this.breakdownService.games;
  loading = this.breakdownService.loading;
  filter = this.breakdownService.filter;
  private filterSignal = toSignal(this.filter.valueChanges.pipe(startWith(this.filter.value)));
  private activeRowPopover?: { popover: Popover; interactive: boolean };
  private rowPopoverCloseTimer?: ReturnType<typeof setTimeout>;

  showUpgrade = this.breakdownService.showUpgrade;
  showDowngrade = this.breakdownService.showDowngrade;

  enableRemoveGames = signal(false);
  enableToggleLatestX = signal(false);

  sortField = signal<string | null>(null);
  sortOrder = signal<1 | -1>(1);

  // Manual overrides
  excludedGameIds = signal<Set<string>>(new Set());
  latestXOverrides = signal<Map<string, boolean>>(new Map()); // force in/out of latest X window

  // Simulated games
  simulatedGames = signal<GameBreakdown[]>([]);
  showAddGameDialog = signal(false);
  addGameWon = signal(true);
  wonOptions: { label: string; value: boolean }[] = [];

  private readonly simulationContext = computed(() => `${this.player()?.id}:${this.system().id}:${this.type()}`);
  private readonly partner = this.simulationField('partner');
  private readonly opponent1 = this.simulationField('opponent-1');
  private readonly opponent2 = this.simulationField('opponent-2');

  isDoubles = computed(() => this.type() === 'double' || this.type() === 'mix');
  simulationFields = computed(() => (this.isDoubles() ? [this.partner, this.opponent1, this.opponent2] : [this.opponent1]));
  effectiveOpponentLevel = computed(() => {
    if (this.isDoubles()) {
      return Math.round((this.opponent1.level() + this.opponent2.level()) / 2);
    }
    return this.opponent1.level();
  });
  simulatedPoints = computed(() => {
    const sys = this.system();
    const won = this.addGameWon();
    const opponentLevel = this.effectiveOpponentLevel();

    if (!sys?.pointsWhenWinningAgainst || !won) {
      return 0;
    }

    const amountOfLevels = sys.amountOfLevels ?? 12;
    const idx = amountOfLevels - opponentLevel;
    return sys.pointsWhenWinningAgainst[idx] ?? 0;
  });

  start = computed(() => this.filterSignal()?.start as Dayjs | null);
  next = computed(() => this.filterSignal()?.next as Dayjs | null);

  currGames = computed(() => {
    const startPeriod = this.start();
    const playerData = this.player();
    const sys = this.system();
    const allGames = this.games();
    const excluded = this.excludedGameIds();
    const latestXOvr = this.latestXOverrides();
    const simulated = this.simulatedGames();

    if (!startPeriod || !playerData || !sys || (allGames.length <= 0 && simulated.length <= 0)) {
      return [];
    }

    let games: GameBreakdown[] = [];

    untracked(() => {
      games = allGames
        .filter((x) => dayjs(x.playedAt).isSameOrAfter(startPeriod) && !excluded.has(x.id))
        .map((x) => structuredClone(x) as GameBreakdown);

      // Merge simulated games
      games.push(...simulated.map((x) => structuredClone(x)));

      this._addBreakdownInfo(
        games.filter((x) => !x.simulated),
        playerData.id,
      );
      this._addBreakdownInfoSimulated(games.filter((x) => x.simulated));
      this._determineUsedForRanking(games, latestXOvr);
      this._calculateAverageUpgrade(games);
    });

    return games.sort((a, b) => {
      if (a.devideDowngrade && b.devideDowngrade) {
        return a.devideDowngrade - b.devideDowngrade;
      }

      if (a.devideUpgrade && b.devideUpgrade) {
        return a.devideUpgrade - b.devideUpgrade;
      }

      if (a.usedForUpgrade && !b.usedForUpgrade) {
        return -1;
      }

      if (!a.usedForUpgrade && b.usedForUpgrade) {
        return 1;
      }

      if (a.usedForDowngrade && !b.usedForDowngrade) {
        return -1;
      }

      if (!a.usedForDowngrade && b.usedForDowngrade) {
        return 1;
      }

      return 0;
    });
  });

  excludedCount = computed(() => this.excludedGameIds().size);
  simulatedCount = computed(() => this.simulatedGames().length);
  hasOverrides = computed(() => this.excludedGameIds().size > 0 || this.latestXOverrides().size > 0 || this.simulatedGames().length > 0);

  showRemoveColumn = computed(() => this.enableRemoveGames() || this.simulatedGames().length > 0);

  protected readonly trackGame = (_index: number, game: GameBreakdown) => game.id;

  totalColumns = computed(() => {
    let cols = 5; // status icons, date, team, opponent, points
    if (this.showRemoveColumn()) cols++;
    if (this.enableToggleLatestX()) cols++; // single shared "in latest X" column
    if (this.showUpgrade()) cols += 3; // # badge, used checkbox, average
    if (this.showDowngrade()) cols += 3; // # badge, used checkbox, average
    return cols;
  });

  filteredGames = computed(() => {
    const includedIgnored = this.filter.get('includedIgnored')?.value;
    const includedUpgrade = this.filter.get('includedUpgrade')?.value;
    const includedDowngrade = this.filter.get('includedDowngrade')?.value;
    const includeOutOfScopeDowngrade = this.filter.get('includeOutOfScopeDowngrade')?.value;
    const includeOutOfScopeUpgrade = this.filter.get('includeOutOfScopeUpgrade')?.value;
    const includeOutOfScopeWonGames = this.filter.get('includeOutOfScopeWonGames')?.value;
    const includeOutOfScopeLatestX = this.filter.get('includeOutOfScopeLatestX')?.value;
    const latestXOvr = this.latestXOverrides();

    return this.currGames().filter((x) => {
      // Simulated games should always be visible
      if (x.simulated) {
        return true;
      }

      // Games with manual overrides should always stay visible
      if (latestXOvr.has(x.id)) {
        return true;
      }

      if (includedIgnored && x.type === GameBreakdownType.LOST_IGNORED) {
        return true;
      }

      // Games in the latest X window
      if (x.inLatestX) {
        if (includedUpgrade && this.showUpgrade() && x.usedForUpgrade) {
          return true;
        }

        if (includedDowngrade && this.showDowngrade() && x.usedForDowngrade) {
          return true;
        }

        if (includeOutOfScopeWonGames && x.type === GameBreakdownType.WON) {
          return true;
        }

        if (includeOutOfScopeDowngrade && x.type === GameBreakdownType.LOST_DOWNGRADE && !x.usedForUpgrade) {
          return true;
        }

        if (includeOutOfScopeUpgrade && x.type === GameBreakdownType.LOST_UPGRADE && !x.usedForDowngrade) {
          return true;
        }
      }

      // Games outside the latest X window
      if (!x.inLatestX && includeOutOfScopeLatestX && x.type !== GameBreakdownType.LOST_IGNORED) {
        return true;
      }

      return false;
    });
  });

  displayGames = computed(() => {
    const games = [...this.filteredGames()];
    const field = this.sortField();
    const order = this.sortOrder();

    if (!field) {
      return games;
    }

    return games.sort((a, b) => {
      let valueA: unknown = a[field as keyof GameBreakdown];
      let valueB: unknown = b[field as keyof GameBreakdown];

      if (field === 'playedAt') {
        valueA = valueA ? new Date(valueA as string).getTime() : 0;
        valueB = valueB ? new Date(valueB as string).getTime() : 0;
      }

      let result = 0;
      if (valueA == null && valueB != null) {
        result = -1;
      } else if (valueA != null && valueB == null) {
        result = 1;
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        result = valueA - valueB;
      }

      return order * result;
    });
  });

  lostGamesUpgrade = computed(() => this.currGames().filter((x) => x.usedForUpgrade && x.inLatestX).length);
  lostGamesDowngrade = computed(() => this.currGames().filter((x) => x.usedForDowngrade && x.inLatestX).length);
  wonGames = computed(() => this.currGames().filter((x) => x.type === GameBreakdownType.WON).length);
  lostGamesIgnored = computed(() => this.currGames().filter((x) => x.type === GameBreakdownType.LOST_IGNORED).length);
  outOfScopeGamesUpgrade = computed(() => this.currGames().filter((x) => x.type === GameBreakdownType.LOST_UPGRADE && !x.inLatestX).length);
  outOfScopeGamesDowngrade = computed(() => this.currGames().filter((x) => x.type === GameBreakdownType.LOST_DOWNGRADE && !x.inLatestX).length);
  outOfScopeLatestXGames = computed(() => this.currGames().filter((x) => !x.inLatestX && x.type !== GameBreakdownType.LOST_IGNORED).length);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.rowPopoverCloseTimer));
    this.wonOptions = [
      { label: this.translateService.instant('all.ranking.breakdown.add-game.won'), value: true },
      { label: this.translateService.instant('all.ranking.breakdown.add-game.lost'), value: false },
    ];

    // Sync counts to service so parent can display them
    effect(() => {
      this.breakdownService.lostGamesUpgrade.set(this.lostGamesUpgrade());
      this.breakdownService.lostGamesDowngrade.set(this.lostGamesDowngrade());
      this.breakdownService.lostGamesIgnored.set(this.lostGamesIgnored());
      this.breakdownService.outOfScopeLatestXGames.set(this.outOfScopeLatestXGames());
    });
  }

  private _addBreakdownInfo(games: GameBreakdown[], playerId: string) {
    const sys = this.system();
    const nextPeriod = this.next();

    for (const game of games) {
      const myMembership = game.gamePlayerMemberships?.find((gpm) => gpm.playerId === playerId);
      const myTeam = myMembership?.team;

      if (!game.gameType) {
        console.warn(`Game ${game.id} has no gameType`);
        continue;
      }

      const rankingPoint = game.rankingPoints?.find((x) => x.playerId === playerId && x.systemId === sys.id);

      const type = GetGameResultType(game.winner === myTeam, game.gameType, {
        differenceInLevel: rankingPoint?.differenceInLevel ?? 0,
        system: sys,
      });

      game.points = rankingPoint?.points ?? 0;
      game.type = type;
      game.opponent = game.gamePlayerMemberships?.filter((x) => x.team !== myTeam) ?? [];
      game.team = game.gamePlayerMemberships?.filter((x) => x.team === myTeam) ?? [];
      game.dropsNextPeriod = nextPeriod ? dayjs(game.playedAt).isBefore(nextPeriod) : false;

      // Set usedForUpgrade/usedForDowngrade based purely on game type (level difference)
      if (type === GameBreakdownType.WON) {
        game.usedForUpgrade = true;
        game.usedForDowngrade = true;
      } else if (type === GameBreakdownType.LOST_UPGRADE) {
        game.usedForUpgrade = true;
        game.usedForDowngrade = false;
      } else if (type === GameBreakdownType.LOST_DOWNGRADE) {
        game.usedForUpgrade = true;
        game.usedForDowngrade = true;
      } else {
        game.usedForUpgrade = false;
        game.usedForDowngrade = false;
      }

      // defaults for calculated fields
      game.inLatestX = false;
      game.canUpgrade = false;
      game.canDowngrade = false;
      game.outOfScopeLatestXUpgrade = false;
      game.outOfScopeLatestXDowngrade = false;
      game.countUpgrade = undefined;
      game.countDowngrade = undefined;
      game.devideUpgrade = undefined;
      game.devideDowngrade = undefined;
      game.devideUpgradeCorrected = undefined;
      game.devideDowngradeCorrected = undefined;
      game.totalPointsUpgrade = undefined;
      game.totalPointsDowngrade = undefined;
      game.avgUpgrade = undefined;
      game.avgDowngrade = undefined;
      game.highestAvgUpgrade = undefined;
      game.highestAvgDowngrade = undefined;
    }
  }

  private _addBreakdownInfoSimulated(games: GameBreakdown[]) {
    const sys = this.system();
    const nextPeriod = this.next();

    for (const game of games) {
      game.dropsNextPeriod = nextPeriod ? dayjs(game.playedAt).isBefore(nextPeriod) : false;

      // Set usedForUpgrade/usedForDowngrade based on game type
      if (game.type === GameBreakdownType.WON) {
        game.usedForUpgrade = true;
        game.usedForDowngrade = true;
      } else if (game.type === GameBreakdownType.LOST_UPGRADE) {
        game.usedForUpgrade = true;
        game.usedForDowngrade = false;
      } else if (game.type === GameBreakdownType.LOST_DOWNGRADE) {
        game.usedForUpgrade = true;
        game.usedForDowngrade = true;
      } else {
        game.usedForUpgrade = false;
        game.usedForDowngrade = false;
      }

      // defaults for calculated fields
      game.inLatestX = false;
      game.canUpgrade = false;
      game.canDowngrade = false;
      game.outOfScopeLatestXUpgrade = false;
      game.outOfScopeLatestXDowngrade = false;
      game.countUpgrade = undefined;
      game.countDowngrade = undefined;
      game.devideUpgrade = undefined;
      game.devideDowngrade = undefined;
      game.devideUpgradeCorrected = undefined;
      game.devideDowngradeCorrected = undefined;
      game.totalPointsUpgrade = undefined;
      game.totalPointsDowngrade = undefined;
      game.avgUpgrade = undefined;
      game.avgDowngrade = undefined;
      game.highestAvgUpgrade = undefined;
      game.highestAvgDowngrade = undefined;
    }
  }

  toggleLatestX(game: GameBreakdown) {
    this.latestXOverrides.update((map) => {
      const next = new Map(map);
      next.set(game.id, !game.inLatestX);
      return next;
    });
  }

  removeGame(game: GameBreakdown) {
    this.excludedGameIds.update((set) => {
      const next = new Set(set);
      next.add(game.id);
      return next;
    });
  }

  restoreAllGames() {
    this.excludedGameIds.set(new Set());
    this.latestXOverrides.set(new Map());
    this.simulatedGames.set([]);
  }

  private simulationField(key: 'partner' | 'opponent-1' | 'opponent-2') {
    const search = linkedSignal<string, PlayerSearchResult | string | null>({ source: this.simulationContext, computation: () => null });
    const selected = computed(() => {
      const value = search();
      return typeof value === 'string' ? null : value;
    });
    return { key, search, selected, suggestions: signal<PlayerSearchResult[]>([]), level: signal(8) };
  }

  openAddGameDialog() {
    const playerLevel = this.rankingPlace()?.[this.type()] ?? 8;
    for (const field of this.simulationFields()) {
      if (!field.selected()) {
        field.search.set(null);
        field.level.set(playerLevel);
      }
      field.suggestions.set([]);
    }
    this.addGameWon.set(true);
    this.showAddGameDialog.set(true);
  }

  async searchSimulationPlayer(event: AutoCompleteCompleteEvent, field: ReturnType<ListGamesComponent['simulationField']>) {
    const systemId = this.filter.get('systemId')?.value;
    if (!systemId) return;

    const results = await this.breakdownService.searchPlayers(event.query, systemId);
    field.suggestions.set(field.key === 'partner' ? results.filter((player) => player.id !== this.player()?.id) : results);
  }

  selectSimulationPlayer(event: AutoCompleteSelectEvent, field: ReturnType<ListGamesComponent['simulationField']>) {
    const player = event.value as PlayerSearchResult;
    field.level.set(this.simulationRanking(player) ?? 12);
  }

  simulationRanking(player: PlayerSearchResult): number | undefined {
    return player.rankingLastPlaces?.[0]?.[this.type()] ?? undefined;
  }

  private simulatedMembership(gameId: string, team: number, level: number, player: { id: string; fullName: string }): GamePlayerMembership {
    const membership: Partial<GamePlayerMembership> = {
      id: `sim-member-${crypto.randomUUID()}`,
      playerId: player.id,
      gameId,
      team,
    };
    membership[this.type()] = level;
    Object.assign(membership, { gamePlayer: { id: player.id || membership.id, fullName: player.fullName } });
    return membership as GamePlayerMembership;
  }

  addSimulatedGame() {
    const player = this.player();
    if (!player) return;

    const sys = this.system();
    const rankingPlaceData = this.rankingPlace();
    const gameType = this.type();
    const playerLevel = rankingPlaceData?.[gameType] ?? 12;
    const opponentLevel = this.effectiveOpponentLevel();
    const won = this.addGameWon();
    const points = this.simulatedPoints();

    const partner = this.isDoubles() ? this.partner.selected() : null;
    const teamLevel = partner ? (playerLevel + this.partner.level()) / 2 : playerLevel;
    const differenceInLevel = opponentLevel - teamLevel;

    let enumGameType = GameType.S;
    switch (gameType) {
      case 'double':
        enumGameType = GameType.D;
        break;
      case 'mix':
        enumGameType = GameType.MX;
        break;
    }

    const type = GetGameResultType(won, enumGameType, {
      differenceInLevel,
      system: sys,
    });

    const now = new Date();
    const simGameId = `sim-${crypto.randomUUID()}`;

    const team = [this.simulatedMembership(simGameId, 1, playerLevel, player)];
    if (partner) {
      team.push(this.simulatedMembership(simGameId, 1, this.partner.level(), partner));
    }
    const opponents = this.isDoubles() ? [this.opponent1, this.opponent2] : [this.opponent1];
    const opponentMembers = opponents.map((field, index) =>
      this.simulatedMembership(simGameId, 2, field.level(), field.selected() ?? { id: '', fullName: `Opponent ${index + 1}` }),
    );

    const rankingPoint = {
      id: `sim-rp-${crypto.randomUUID()}`,
      createdAt: now,
      updatedAt: now,
      points,
      differenceInLevel,
      playerId: player.id,
      gameId: simGameId,
      systemId: sys.id,
    } as Partial<RankingPoint> as RankingPoint;

    const simGame: Partial<GameBreakdown> = {
      id: simGameId,
      createdAt: now,
      updatedAt: now,
      playedAt: now,
      linkId: 'simulated',
      linkType: 'simulated',
      winner: won ? 1 : 2,
      gameType: enumGameType,
      gamePlayerMemberships: [...team, ...opponentMembers],
      rankingPoints: [rankingPoint as RankingPoint],
      points,
      type,
      simulated: true,
      team,
      opponent: opponentMembers,
      dropsNextPeriod: false,
      inLatestX: false,
      usedForUpgrade: false,
      usedForDowngrade: false,
      canUpgrade: false,
      canDowngrade: false,
    };

    this.simulatedGames.update((games) => [...games, simGame as GameBreakdown]);
    this.showAddGameDialog.set(false);
  }

  removeSimulatedGame(game: GameBreakdown) {
    this.simulatedGames.update((games) => games.filter((g) => g.id !== game.id));
  }

  private _determineUsedForRanking(games: GameBreakdown[], latestXOverrides: Map<string, boolean>) {
    const sys = this.system();
    let validGames = 0;

    const limit = sys?.latestXGamesToUse ?? Infinity;

    // sort games by playedAt newest first
    for (const game of games.slice().sort((a, b) => {
      if (!a.playedAt || !b.playedAt) {
        return 0;
      }
      return new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime();
    })) {
      if (game.type === GameBreakdownType.LOST_IGNORED) {
        continue;
      }

      const latestXOverride = latestXOverrides.get(game.id);

      // Handle latest X overrides
      if (latestXOverride === false) {
        game.inLatestX = false;
        continue;
      }

      if (latestXOverride === true) {
        game.inLatestX = true;
        validGames++;
        continue;
      }

      // Normal behavior: respect latest X limit
      if (validGames < limit) {
        validGames++;
        game.inLatestX = true;
      } else {
        game.inLatestX = false;
        if (game.usedForUpgrade) {
          game.outOfScopeLatestXUpgrade = true;
        }
        if (game.usedForDowngrade) {
          game.outOfScopeLatestXDowngrade = true;
        }
      }
    }

    return games;
  }

  private _calculateAverageUpgrade(games: GameBreakdown[]) {
    const sys = this.system();
    const rankingPlaceData = this.rankingPlace();
    const gameType = this.type();

    // sort games: first all 0 points, then highest points first
    games = games.sort((a, b) => {
      if (a.points === 0 && b.points !== 0) {
        return -1;
      }

      if (a.points !== 0 && b.points === 0) {
        return 1;
      }

      if (a.points === b.points) {
        return 0;
      }
      return (a.points ?? 0) > (b.points ?? 0) ? -1 : 1;
    });

    // Upgrade
    let totalPointsUpgrade = 0;
    let gamesProcessedUpgrade = 0;
    let workingAvgUpgrade = 0;
    for (const game of games.filter((x) => x.usedForUpgrade && x.inLatestX)) {
      gamesProcessedUpgrade++;
      game.devideUpgrade = gamesProcessedUpgrade;
      game.countUpgrade = gamesProcessedUpgrade;

      let divider = gamesProcessedUpgrade;
      if (divider < (sys.minNumberOfGamesUsedForUpgrade ?? 1)) {
        divider = sys.minNumberOfGamesUsedForUpgrade ?? 1;
      }

      totalPointsUpgrade += game.points ?? 0;
      const avg = totalPointsUpgrade / divider;
      if (avg > workingAvgUpgrade) {
        workingAvgUpgrade = avg;
      }

      game.totalPointsUpgrade = totalPointsUpgrade;
      game.avgUpgrade = workingAvgUpgrade;
      game.devideUpgradeCorrected = divider;
    }

    // Downgrade
    let totalPointsDowngrade = 0;
    let gamesProcessedDowngrade = 0;
    let workingAvgDowngrade = 0;
    for (const game of games.filter((x) => x.usedForDowngrade && x.inLatestX)) {
      gamesProcessedDowngrade++;
      game.devideDowngrade = gamesProcessedDowngrade;
      game.countDowngrade = gamesProcessedDowngrade;

      let divider = gamesProcessedDowngrade;
      if (divider < (sys.minNumberOfGamesUsedForDowngrade ?? 1)) {
        divider = sys.minNumberOfGamesUsedForDowngrade ?? 1;
      }

      totalPointsDowngrade += game.points ?? 0;
      const avg = totalPointsDowngrade / divider;
      if (avg > workingAvgDowngrade) {
        workingAvgDowngrade = avg;
      }

      game.totalPointsDowngrade = totalPointsDowngrade;
      game.avgDowngrade = workingAvgDowngrade;
      game.devideDowngradeCorrected = divider;
    }

    const level = rankingPlaceData?.[gameType] ?? 12;

    // set highest avg for upgrade and downgrade
    for (const game of games) {
      if (game.avgUpgrade === workingAvgUpgrade) {
        game.highestAvgUpgrade = true;
        if (workingAvgUpgrade >= (sys.pointsToGoUp?.[(sys.amountOfLevels ?? 12) - level] ?? 0)) {
          game.canUpgrade = true;
        }
        break;
      }
    }
    for (const game of games) {
      if (game.avgDowngrade === workingAvgDowngrade) {
        game.highestAvgDowngrade = true;
        if (workingAvgDowngrade <= (sys.pointsToGoDown?.[(sys.amountOfLevels ?? 12) - (level + 1)] ?? 0)) {
          game.canDowngrade = true;
        }
        break;
      }
    }

    return games;
  }

  getAverageExplanation(game: GameBreakdown, isForUpgrade: boolean): string {
    const usedPoints = isForUpgrade ? game.usedForUpgrade : game.usedForDowngrade;
    const totalPoints = isForUpgrade ? game.totalPointsUpgrade : game.totalPointsDowngrade;
    const original = isForUpgrade ? game.devideUpgrade : game.devideDowngrade;
    const corrected = isForUpgrade ? game.devideUpgradeCorrected : game.devideDowngradeCorrected;
    const rankingPlaceData = this.rankingPlace();
    const sys = this.system();
    const gameType = this.type();

    let explanation = `${totalPoints ?? 0} / ${corrected}`;
    if (original != null && corrected != null && original < corrected) {
      explanation += `\n\n${this.translateService.instant('all.ranking.breakdown.corrected', { original, corrected })}`;
    }

    if (usedPoints) {
      if (isForUpgrade) {
        const level = rankingPlaceData?.[gameType] ?? 12;

        explanation += `\n\n${this.translateService.instant(
          game.canUpgrade ? 'all.ranking.breakdown.can-upgrade' : 'all.ranking.breakdown.can-not-upgrade',
          {
            level,
            newLevel: level - 1,
            points: sys.pointsToGoUp?.[(sys.amountOfLevels ?? 12) - level],
          },
        )}`;
      } else {
        const level = rankingPlaceData?.[gameType] ?? 12;

        explanation += `\n\n${this.translateService.instant(
          game.canDowngrade ? 'all.ranking.breakdown.can-downgrade' : 'all.ranking.breakdown.can-not-downgrade',
          {
            level,
            newLevel: level + 1,
            points: sys.pointsToGoDown?.[(sys.amountOfLevels ?? 12) - (level + 1)],
          },
        )}`;
      }
    }

    return explanation;
  }

  hasGameDetails(game: GameBreakdown): boolean {
    return !!(
      game.tournamentDraw?.name ||
      game.competitionEncounter?.drawCompetition?.name ||
      game.tournamentDraw?.tournamentSubEvent?.tournamentEvent?.name ||
      game.competitionEncounter?.drawCompetition?.competitionSubEvent?.competitionEvent?.name ||
      this.hasScores(game)
    );
  }

  previewRowPopover(event: PointerEvent, popover: Popover): void {
    if (event.pointerType !== 'mouse') return;
    const active = this.activeRowPopover;
    if (active?.popover.overlayVisible() && active.interactive) return;

    this.keepRowPopoverOpen(popover);
    if (popover.overlayVisible()) return;

    active?.popover.hide();
    this.activeRowPopover = { popover, interactive: false };
    popover.show(event);
  }

  activateRowPopover(event: MouseEvent, popover: Popover): void {
    const active = this.activeRowPopover;
    clearTimeout(this.rowPopoverCloseTimer);
    if (active?.popover === popover && popover.overlayVisible()) {
      if (active.interactive) {
        popover.hide();
      } else {
        active.interactive = true;
        this.focusRowPopover(popover);
      }
      return;
    }

    active?.popover.hide();
    this.activeRowPopover = { popover, interactive: true };
    popover.show(event);
  }

  focusRowPopover(popover: Popover): void {
    if (this.activeRowPopover?.popover === popover && this.activeRowPopover.interactive) {
      popover.container?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    }
  }

  keepRowPopoverOpen(popover: Popover): void {
    if (this.activeRowPopover?.popover === popover) clearTimeout(this.rowPopoverCloseTimer);
  }

  scheduleRowPopoverClose(popover: Popover): void {
    const active = this.activeRowPopover;
    if (active?.popover !== popover || active.interactive) return;
    this.keepRowPopoverOpen(popover);
    // Leave time to cross the gap between the trigger and the popover.
    this.rowPopoverCloseTimer = setTimeout(() => popover.hide(), 250);
  }

  isSetPlayed(team1Score: number | undefined, team2Score: number | undefined): boolean {
    return team1Score != null && team2Score != null && (team1Score > 0 || team2Score > 0);
  }

  hasScores(game: GameBreakdown): boolean {
    return this.isSetPlayed(game.set1Team1, game.set1Team2);
  }

  getPlayerTeam(game: GameBreakdown): number | undefined {
    return game.team?.[0]?.team;
  }

  getPlayerSetScore(game: GameBreakdown, set: number): number {
    const team = this.getPlayerTeam(game);
    const key = `set${set}Team${team}` as keyof GameBreakdown;
    return (game[key] as number) ?? 0;
  }

  getOpponentSetScore(game: GameBreakdown, set: number): number {
    const team = this.getPlayerTeam(game) === 1 ? 2 : 1;
    const key = `set${set}Team${team}` as keyof GameBreakdown;
    return (game[key] as number) ?? 0;
  }

  getTeamDisplay(game: GameBreakdown): string {
    const gameType = this.type();
    return game.team
      ?.map((p) => {
        const level = p?.[gameType] ?? '?';
        return `${p?.gamePlayer?.fullName ?? 'Unknown'} (${level})`;
      })
      .join(', ');
  }

  getOpponentDisplay(game: GameBreakdown): string {
    const gameType = this.type();
    return game.opponent
      ?.map((p) => {
        const level = p?.[gameType] ?? '?';
        return `${p?.gamePlayer?.fullName ?? 'Unknown'} (${level})`;
      })
      .join(', ');
  }

  toggleSort(field: string) {
    if (this.sortField() !== field) {
      this.sortField.set(field);
      this.sortOrder.set(1);
    } else if (this.sortOrder() === 1) {
      this.sortOrder.set(-1);
    } else {
      this.sortField.set(null);
      this.sortOrder.set(1);
    }
  }

  getSortDirection(field: string): 'ascending' | 'descending' | null {
    return this.sortField() === field ? (this.sortOrder() === 1 ? 'ascending' : 'descending') : null;
  }

  getSortIcon(field: string): string {
    if (this.sortField() !== field) {
      return 'pi-sort-alt';
    }
    return this.sortOrder() === 1 ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down';
  }
}
