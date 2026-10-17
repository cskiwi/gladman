import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Tag } from 'primeng/tag';
import { FormSequenceComponent } from './form-sequence.component';

describe('FormSequenceComponent', () => {
  let fixture: ComponentFixture<FormSequenceComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSequenceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSequenceComponent);
    fixture.componentRef.setInput('results', ['W', 'L', 'W', 'W']);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('preserves result order and repeated values using native severities', () => {
    const tags = fixture.debugElement.queryAll(By.directive(Tag));
    expect(tags.map((tag) => tag.componentInstance.value()))
      .toEqual(['W', 'L', 'W', 'W']);
    expect(tags.map((tag) => tag.componentInstance.severity())).toEqual([
      'success',
      'danger',
      'success',
      'success',
    ]);
    expect(
      Array.from(element.querySelectorAll('p-tag'),
        (tag) => tag.textContent?.trim()),
    ).toEqual(['W', 'L', 'W', 'W']);
  });

  it('renders an empty sequence without placeholder tags', () => {
    fixture.componentRef.setInput('results', []);
    fixture.detectChanges();

    expect(element.querySelectorAll('p-tag')).toHaveLength(0);
    expect(element.textContent?.trim()).toBe('');
  });

  it('updates labels and severities when results change', () => {
    fixture.componentRef.setInput('results', ['L', 'W']);
    fixture.detectChanges();

    const tags = fixture.debugElement.queryAll(By.directive(Tag));
    expect(tags.map((tag) => tag.componentInstance.value())).toEqual(['L', 'W']);
    expect(tags.map((tag) => tag.componentInstance.severity())).toEqual([
      'danger', 'success',
    ]);
  });

  it('keeps results as noninteractive text in a wrapping row', () => {
    expect(element.firstElementChild?.classList.contains('flex-wrap')).toBe(true);
    expect(element.querySelector('button, a, [tabindex], [role="button"]'))
      .toBeNull();
  });
});