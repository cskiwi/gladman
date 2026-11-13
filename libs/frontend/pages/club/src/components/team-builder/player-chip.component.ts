import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { FocusTrapModule } from 'primeng/focustrap';
import { TeamBuilderPlayer } from '../../pages/detail/tabs/team-builder/types/team-builder.types';

interface PlayerIndicator {
  visible: boolean;
  icon: string;
  severity: 'warn' | 'danger' | 'info' | 'secondary';
  key: string;
  text?: string;
  params?: { percent: number };
}

@Component({
  selector: 'app-player-chip',
  standalone: true,
  imports: [TranslateModule, TagModule, TooltipModule, ButtonModule, PopoverModule, FocusTrapModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './player-chip.component.html',
})
export class PlayerChipComponent {
  private readonly detailsPopover = viewChild.required(Popover);
  private readonly detailsEditButton = viewChild<ElementRef<HTMLButtonElement>>('detailsEditButton');
  private hoverCloseTimer?: ReturnType<typeof setTimeout>;

  player = input.required<TeamBuilderPlayer>();
  showMembershipToggle = input(false);
  showMixedRanking = input(true);
  detailsInteractive = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cancelHoverClose());
  }

  ranking = computed(() => {
    const p = this.player();
    const r = p.rankingLastPlaces?.[0];
    return {
      single: r?.single ?? 12,
      double: r?.double ?? 12,
      mix: r?.mix ?? 12,
    };
  });

  indicators = computed(() => {
    const p = this.player();
    const prefix = 'all.club.teamBuilder.player.';
    const indicators: PlayerIndicator[] = [
      { visible: p.isStopping, icon: 'pi pi-times-circle', severity: 'danger', key: prefix + 'stopping' },
      {
        visible: p.lowPerformance,
        icon: 'pi pi-exclamation-triangle',
        severity: 'warn',
        key: prefix + 'lowPerformance',
        params: { percent: p.performancePercent },
      },
      {
        visible: p.lowPresence,
        icon: 'pi pi-clock',
        severity: 'warn',
        key: prefix + 'lowPresence',
        params: { percent: p.presencePercent },
      },
      { visible: p.isNewPlayer, icon: 'pi pi-star', severity: 'info', key: 'all.player.newPlayer' },
      { visible: !!p.levelWarning, icon: 'pi pi-ban', severity: 'warn', key: 'all.team.level-tooltip', text: p.levelWarning },
      { visible: !!p.teamCountWarning, icon: 'pi pi-users', severity: 'warn', key: 'all.team.players', text: p.teamCountWarning },
      { visible: !!p.survey?.comments, icon: 'pi pi-comment', severity: 'secondary', key: 'all.common.remarks' },
    ];
    return indicators.filter((indicator) => indicator.visible);
  });

  indicatorSummary = computed(() => {
    const indicators = this.indicators();
    return (
      indicators.find((indicator) => indicator.severity === 'danger') ??
      indicators.find((indicator) => indicator.severity === 'warn') ??
      indicators[0]
    );
  });

  membershipToggled = output<'REGULAR' | 'BACKUP'>();
  playerClicked = output<TeamBuilderPlayer>();

  /** Shows the shared details without moving focus while a player is hovered. */
  showHoverDetails(event: MouseEvent, target: HTMLElement): void {
    this.cancelHoverClose();
    if (this.detailsPopover().overlayVisible()) return;
    this.detailsInteractive.set(false);
    this.detailsPopover().show(event, target);
  }

  /** Pins the same overlay for keyboard/touch use without changing its position. */
  toggleInteractiveDetails(event: Event, target: HTMLElement): void {
    this.cancelHoverClose();
    const popover = this.detailsPopover();
    if (popover.overlayVisible() && this.detailsInteractive()) {
      popover.hide();
      return;
    }
    this.detailsInteractive.set(true);
    if (popover.overlayVisible()) {
      this.detailsEditButton()?.nativeElement.focus();
      return;
    }
    popover.show(event, target);
  }

  /** Allows the pointer to cross the native overlay gutter before hiding hover details. */
  scheduleHoverClose(): void {
    if (this.detailsInteractive()) return;
    this.cancelHoverClose();
    this.hoverCloseTimer = setTimeout(() => this.detailsPopover().hide(), 150);
  }

  cancelHoverClose(): void {
    clearTimeout(this.hoverCloseTimer);
    this.hoverCloseTimer = undefined;
  }

  /** Returns true when the 75% availability answer is negative (i.e., player cannot meet 75%) */
  isNegative75(value: string | undefined): boolean {
    if (!value) return false;
    const v = value.trim().toLowerCase();
    return v === 'nee' || v === 'no' || v === 'false' || v === 'non';
  }

  toggleMembership() {
    const current = this.player().membershipType;
    this.membershipToggled.emit(current === 'REGULAR' ? 'BACKUP' : 'REGULAR');
  }
}
