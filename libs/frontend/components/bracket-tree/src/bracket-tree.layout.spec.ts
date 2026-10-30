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
    const viewport = fixture.nativeElement.querySelector(
      'section > div',
    ) as HTMLElement;
    const canvas = viewport.firstElementChild as HTMLElement;

    expect(viewport.classList.contains('w-full')).toBe(true);
    expect(viewport.classList.contains('min-w-0')).toBe(true);
    expect(viewport.classList.contains('overflow-auto')).toBe(true);
    expect(canvas.classList.contains('inline-flex')).toBe(true);
  });
});
