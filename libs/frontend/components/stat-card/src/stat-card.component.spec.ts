import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { StatCardComponent } from './stat-card.component';

@Component({
  template: '',
})
class ProjectionHostComponent {}

describe('StatCardComponent', () => {
  let fixture: ComponentFixture<StatCardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent, ProjectionHostComponent],
    }).overrideComponent(ProjectionHostComponent, {
      add: { imports: [StatCardComponent] },
    }).overrideTemplate(ProjectionHostComponent, `
      <app-stat-card label="Wins" [value]="12">
        <p data-detail>Last season: 10</p>
      </app-stat-card>
    `).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
    fixture.componentRef.setInput('label', 'Season wins');
    fixture.componentRef.setInput('value', 0);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders the label and numeric zero in a native card', () => {
    expect(fixture.debugElement.query(By.directive(Card))).toBeTruthy();
    expect(element.querySelector('.p-card-subtitle')?.textContent?.trim())
      .toBe('Season wins');
    expect(element.querySelector('.p-card-content')?.textContent?.trim())
      .toBe('0');
    expect(element.querySelector('p-tag')).toBeNull();
  });

  it.each([
    ['up', 'success', 'pi pi-arrow-up'],
    ['down', 'danger', 'pi pi-arrow-down'],
    ['neutral', 'secondary', undefined],
    [undefined, 'secondary', undefined],
  ])('maps %s to native severity and direction icon',
    (direction, severity, icon) => {
      fixture.componentRef.setInput('delta', '+12%');
      fixture.componentRef.setInput('deltaDirection', direction);
      fixture.detectChanges();

      const tag = fixture.debugElement.query(By.directive(Tag));
      expect(tag.componentInstance.value()).toBe('+12%');
      expect(tag.componentInstance.severity()).toBe(severity);
      expect(tag.componentInstance.icon()).toBe(icon);
      expect(element.textContent).toContain('+12%');
    });

  it('updates labels, string values, and deltas without changing inputs', () => {
    fixture.componentRef.setInput('label', 'Win rate');
    fixture.componentRef.setInput('value', '72.5%');
    fixture.componentRef.setInput('delta', '-3%');
    fixture.componentRef.setInput('deltaDirection', 'down');
    fixture.detectChanges();

    expect(element.textContent).toContain('Win rate');
    expect(element.textContent).toContain('72.5%');
    expect(element.textContent).toContain('-3%');

    fixture.componentRef.setInput('delta', '');
    fixture.detectChanges();
    expect(element.querySelector('p-tag')).toBeNull();
  });

  it('preserves projected content inside the card', () => {
    const host = TestBed.createComponent(ProjectionHostComponent);
    host.detectChanges();

    expect(host.nativeElement.querySelector('.p-card-content [data-detail]')
      ?.textContent).toBe('Last season: 10');
  });

  it('keeps long content wrappable without adding keyboard stops', () => {
    fixture.componentRef.setInput('label', 'Long label '.repeat(20));
    fixture.componentRef.setInput('value', '1234567890'.repeat(20));
    fixture.componentRef.setInput('delta', 'Long delta '.repeat(20));
    fixture.detectChanges();

    expect(element.querySelector('.flex-wrap')).toBeTruthy();
    expect(element.querySelectorAll('.wrap-anywhere')).toHaveLength(3);
    expect(element.querySelector('button, a, [tabindex], [role="button"]'))
      .toBeNull();
  });
});