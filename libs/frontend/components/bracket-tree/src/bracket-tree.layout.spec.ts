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
    };
    fixture.componentRef.setInput('games', [game]);
    fixture.detectChanges();

    const match = fixture.nativeElement.querySelector('.border-2') as HTMLElement;
    expect([...match.classList].filter((name) => /^border-(primary|surface)(-|$)/.test(name))).toEqual(['border-surface']);
    expect(match.querySelectorAll('.bg-highlight')).toHaveLength(1);

    fixture.componentRef.setInput('games', [{ ...game, winner: 0 }]);
    fixture.detectChanges();

    const pendingMatch = fixture.nativeElement.querySelector('.border-2') as HTMLElement;
    expect([...pendingMatch.classList].filter((name) => /^border-(primary|surface)(-|$)/.test(name))).toEqual(['border-surface']);
    expect(pendingMatch.querySelectorAll('.bg-highlight')).toHaveLength(0);
  });
});
