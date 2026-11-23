import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Game } from '@app/models';
import { BracketTree } from './bracket-tree.component';

describe('BracketTree layout', () => {
  let fixture: ComponentFixture<BracketTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BracketTree],
    }).compileComponents();

    fixture = TestBed.createComponent(BracketTree);
    fixture.componentRef.setInput('games', [
      {
        id: 'final',
        round: 'R2',
        winner: 0,
        gamePlayerMemberships: [],
      } as unknown as Game,
    ]);
    fixture.detectChanges();
  });

  it('keeps the wide bracket inside a bounded scroll viewport', () => {
    const viewport = fixture.nativeElement.querySelector('section > div') as HTMLElement;
    const canvas = viewport.firstElementChild as HTMLElement;

    expect(viewport.classList.contains('w-full')).toBe(true);
    expect(viewport.classList.contains('min-w-0')).toBe(true);
    expect(viewport.classList.contains('overflow-auto')).toBe(true);
    expect(canvas.classList.contains('inline-flex')).toBe(true);
  });

  it.each([1, 2])('keeps neutral boundaries and winner emphasis when team %i completes a match', (winner) => {
    const game = {
      ...fixture.componentInstance.games()[0],
      winner,
      set1Team1: 21,
      set1Team2: 18,
      set2Team1: 19,
      set2Team2: 21,
      set3Team1: 22,
      set3Team2: 20,
    };
    fixture.componentRef.setInput('games', [game]);
    fixture.detectChanges();

    const match = fixture.nativeElement.querySelector('.border-2') as HTMLElement;
    expect([...match.classList].filter((name) => /^border-(primary|surface)(-|$)/.test(name))).toEqual(['border-surface']);
    expect(match.querySelectorAll('.bg-highlight')).toHaveLength(1);
    const scores = Array.from(match.querySelectorAll<HTMLElement>('.font-mono'));
    expect(scores.map((score) => score.textContent?.trim())).toEqual(['21 19 22', '18 21 20']);
    expect(scores[winner - 1].classList.contains('text-color-emphasis')).toBe(true);
    expect(scores[2 - winner].classList.contains('text-color')).toBe(true);
    expect(match.querySelector('.text-primary')).toBeNull();

    fixture.componentRef.setInput('games', [{ ...game, winner: 0 }]);
    fixture.detectChanges();

    const pendingMatch = fixture.nativeElement.querySelector('.border-2') as HTMLElement;
    expect([...pendingMatch.classList].filter((name) => /^border-(primary|surface)(-|$)/.test(name))).toEqual(['border-surface']);
    expect(pendingMatch.querySelectorAll('.bg-highlight')).toHaveLength(0);
    expect(pendingMatch.querySelectorAll('.font-mono.text-color-emphasis')).toHaveLength(0);
    expect(pendingMatch.querySelectorAll('.font-mono.text-color')).toHaveLength(2);
  });

  it('uses semantic currentColor fills for every progression segment without changing its size', () => {
    const game = fixture.componentInstance.games()[0];
    fixture.componentRef.setInput('games', [{ ...game, id: 'semi-1', round: 'R4' }, { ...game, id: 'semi-2', round: 'R4' }, game]);
    fixture.detectChanges();

    const segments = Array.from(fixture.nativeElement.querySelectorAll('.absolute')) as HTMLElement[];
    expect(segments).toHaveLength(4);
    for (const segment of segments) {
      expect(segment.classList.contains('bg-current')).toBe(true);
      expect(segment.classList.contains('text-muted-color')).toBe(true);
      expect(segment.classList.contains('bg-emphasis')).toBe(false);
      expect(segment.style.width === '2px' || segment.style.height === '2px').toBe(true);
    }
  });

  it('keeps pending score placeholders and omits scores for a Bye', () => {
    const game = fixture.componentInstance.games()[0];
    fixture.componentRef.setInput('games', [{ ...game, playedAt: new Date('9999-01-01') }]);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(Array.from(root.querySelectorAll('.font-mono')).map((score) => score.textContent?.trim())).toEqual(['—', '—']);
    expect(root.querySelectorAll('.font-mono.text-color')).toHaveLength(2);
    expect(root.textContent).toContain('TBD');

    fixture.componentRef.setInput('games', [game]);
    fixture.detectChanges();

    expect(root.querySelectorAll('.font-mono')).toHaveLength(0);
    expect(root.textContent).toContain('Bye');
  });
});
