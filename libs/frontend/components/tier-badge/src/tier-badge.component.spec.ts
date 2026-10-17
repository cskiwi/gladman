import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TierBadgeComponent } from './tier-badge.component';

describe('TierBadgeComponent', () => {
  let fixture: ComponentFixture<TierBadgeComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TierBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TierBadgeComponent);
    fixture.componentRef.setInput('level', 8);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders a numeric level with the default primary styling', () => {
    const tag = element.querySelector('p-tag');
    expect(tag?.textContent?.trim()).toBe('8');
    expect(tag?.getAttribute('severity')).toBeNull();
  });

  it('preserves an optional label and string level', () => {
    fixture.componentRef.setInput('label', 'Men');
    fixture.componentRef.setInput('level', 'A');
    fixture.detectChanges();

    expect(element.querySelector('p-tag')?.textContent?.trim()).toBe('Men A');
  });

  it('uses the compact class only for the small size', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    const tag = element.querySelector('p-tag');
    expect(fixture.componentInstance.designTokens()).toEqual({
      primary: { color: '{text.color}' },
      borderRadius: '4px',
      fontSize: '0.8125rem',
      fontWeight: '700',
      padding: '0.2rem 8px',
    });
    expect(tag?.classList.contains('min-w-8')).toBe(true);

    fixture.componentRef.setInput('size', 'default');
    fixture.detectChanges();
    expect(tag?.classList.contains('min-w-8')).toBe(false);
    expect(tag?.classList.contains('min-w-10')).toBe(true);
    expect(fixture.componentInstance.designTokens()).toEqual({
      primary: { color: '{text.color}' },
      borderRadius: '4px',
      fontWeight: '700',
      padding: '0.375rem 11px',
    });
  });
});