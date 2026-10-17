import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SparklineComponent } from './sparkline.component';

describe('SparklineComponent', () => {
  let fixture: ComponentFixture<SparklineComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparklineComponent, TranslateModule.forRoot()],
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      all: { ranking: { breakdown: { 'add-game': {
        won: 'Won', lost: 'Lost',
      } } } },
    });
    translate.use('en');
    fixture = TestBed.createComponent(SparklineComponent);
    fixture.componentRef.setInput('bars', [
      { height: 100, status: 'win' },
      { height: 50, status: 'loss' },
      { height: 0 },
      { height: 50, status: 'win' },
    ]);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('preserves ordered percentage heights and fixed bar spacing', () => {
    const bars = Array.from(element.querySelectorAll('rect'));
    expect(bars.map((bar) => bar.getAttribute('height')))
      .toEqual(['24', '12', '0', '12']);
    expect(bars.map((bar) => bar.getAttribute('y')))
      .toEqual(['0', '12', '24', '12']);
    expect(bars.map((bar) => bar.getAttribute('x')))
      .toEqual(['0', '5', '10', '15']);
    expect(bars.every((bar) => bar.getAttribute('width') === '3'))
      .toBe(true);
    expect(element.querySelector('svg')?.getAttribute('viewBox'))
      .toBe('0 0 18 24');
  });

  it('uses native semantic result tokens and a neutral fallback', () => {
    const fills = Array.from(element.querySelectorAll('rect'),
      (bar) => bar.getAttribute('fill'));
    expect(fills).toEqual([
      'var(--p-tag-success-color, var(--p-primary-color))',
      'var(--p-tag-danger-color, var(--p-text-color))',
      'var(--p-text-muted-color)',
      'var(--p-tag-success-color, var(--p-primary-color))',
    ]);
    expect(element.querySelector('[style], .g-spark-bar')).toBeNull();
  });

  it('renders empty input without an unnamed graphic', () => {
    fixture.componentRef.setInput('bars', []);
    fixture.detectChanges();

    expect(element.querySelector('svg')).toBeNull();
    expect(element.textContent?.trim()).toBe('');
  });

  it('constrains long sequences without changing percentage heights', () => {
    fixture.componentRef.setInput('bars',
      Array.from({ length: 100 }, () => ({ height: 62.5 })));
    fixture.detectChanges();

    expect(element.querySelectorAll('rect')).toHaveLength(100);
    expect(element.querySelector('svg')?.getAttribute('width')).toBe('498');
    expect(element.querySelector('svg')?.getAttribute('preserveAspectRatio'))
      .toBe('none');
    expect(element.querySelector('rect')?.getAttribute('height')).toBe('15');
    expect(element.querySelector('rect')?.getAttribute('y')).toBe('9');
    expect(element.querySelector('rect:last-child')?.getAttribute('x'))
      .toBe('495');
  });

  it('updates geometry, color, and description when input changes', () => {
    fixture.componentRef.setInput('bars', [{ height: 25, status: 'loss' }]);
    fixture.detectChanges();

    expect(element.querySelectorAll('rect')).toHaveLength(1);
    expect(element.querySelector('rect')?.getAttribute('height')).toBe('6');
    expect(element.querySelector('rect')?.getAttribute('y')).toBe('18');
    expect(element.querySelector('svg')?.getAttribute('width')).toBe('3');
    expect(element.querySelector('title')?.textContent)
      .toMatch(/25%\s+Lost/);
  });

  it('provides a noninteractive graphic with translated result descriptions', () => {
    expect(element.querySelector('svg')?.getAttribute('role')).toBe('img');
    expect(element.querySelector('title')?.textContent?.replace(/\s+/g, ' ')
      .trim()).toBe('100% Won; 50% Lost; 0%; 50% Won');
    expect(element.querySelector('button, a, [tabindex]')).toBeNull();
    expect(element.querySelector('svg')?.classList.contains('max-w-full'))
      .toBe(true);

    translate.setTranslation('nl', {
      all: { ranking: { breakdown: { 'add-game': {
        won: 'Gewonnen', lost: 'Verloren',
      } } } },
    });
    translate.use('nl');
    fixture.detectChanges();

    expect(element.querySelector('title')?.textContent).toContain('Gewonnen');
    expect(element.querySelector('title')?.textContent).toContain('Verloren');
  });
});