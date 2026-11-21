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

  it('renders a numeric level as readable, non-interactive content', () => {
    const tag = element.querySelector('span');
    expect(tag?.textContent?.trim()).toBe('8');
    expect(tag?.classList.contains('bg-highlight')).toBe(true);
    expect(tag?.classList.contains('text-color')).toBe(true);
    expect(element.querySelector('button, a, [tabindex]')).toBeNull();
  });

  it('preserves an optional label and string level', () => {
    fixture.componentRef.setInput('label', 'Men');
    fixture.componentRef.setInput('level', 'A');
    fixture.detectChanges();

    expect(element.querySelector('span')?.textContent?.trim()).toBe('Men A');
  });

  it('uses compact text only for the small size', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    const tag = element.querySelector('span');
    expect(tag?.classList.contains('text-sm')).toBe(true);
    expect(tag?.classList.contains('text-base')).toBe(false);

    fixture.componentRef.setInput('size', 'default');
    fixture.detectChanges();
    expect(tag?.classList.contains('text-sm')).toBe(false);
    expect(tag?.classList.contains('text-base')).toBe(true);
  });
});
