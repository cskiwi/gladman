import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbComponent } from '../../../breadcrumb/src/breadcrumb.component';
import { PageHeaderComponent } from '../../../page-header/src/page-header.component';
import { SectionHeaderComponent } from '../../../section-header/src/section-header.component';
import { HeroAvatarComponent, HeroAvatarVariant } from '../hero-avatar/hero-avatar.component';
import { HeroTitleComponent } from '../hero-title/hero-title.component';
import { HeroComponent } from './hero.component';

@Component({
  imports: [HeroComponent, HeroAvatarComponent, HeroTitleComponent, PageHeaderComponent, SectionHeaderComponent, BreadcrumbComponent, ButtonModule],
  templateUrl: './hero.test-host.html',
})
class HeaderTestHost {
  readonly mode = signal('hero');
  readonly title = signal('A long badminton identity');
  readonly extras = signal(true);
  readonly variant = signal<HeroAvatarVariant>('primary');
  readonly activate = jest.fn();
}

describe('Shared headings', () => {
  let fixture: ComponentFixture<HeaderTestHost>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderTestHost],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderTestHost);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('projects each hero slot once inside a native card', () => {
    expect(element.querySelectorAll('.p-card')).toHaveLength(1);
    expect(element.querySelector('h1')?.textContent).toContain(fixture.componentInstance.title());
    expect(element.querySelector('p-avatar')?.textContent).toContain('AB');
    ['metadata', 'stats', 'default-content'].forEach((slot) => {
      expect(element.querySelectorAll(`[data-testid="${slot}"]`)).toHaveLength(1);
    });
    element.querySelector('button')?.click();
    expect(fixture.componentInstance.activate).toHaveBeenCalledTimes(1);
  });

  it('updates conditional slots and retains the default content', () => {
    fixture.componentInstance.extras.set(false);
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="stats"]')).toBeNull();
    expect(element.querySelector('button')).toBeNull();
    expect(element.querySelector('[data-testid="default-content"]')).not.toBeNull();
  });

  it('preserves both avatar variants with semantic classes', () => {
    const avatar = element.querySelector('p-avatar');
    expect(avatar?.classList.contains('bg-highlight')).toBe(true);
    fixture.componentInstance.variant.set('rank');
    fixture.detectChanges();
    expect(avatar?.classList.contains('bg-emphasis')).toBe(true);
    expect(avatar?.classList.contains('bg-highlight')).toBe(false);
  });

  it('preserves the complete title when it changes', () => {
    const longTitle = 'Badminton'.repeat(30);
    fixture.componentInstance.title.set(longTitle);
    fixture.detectChanges();
    expect(element.querySelector('h1')?.textContent?.trim()).toBe(longTitle);
  });

  it('preserves page title, subtitle, avatar and action projection', () => {
    fixture.componentInstance.mode.set('page');
    fixture.detectChanges();
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('[avatar]')).not.toBeNull();
    expect(element.querySelector('[data-testid="metadata"]')?.textContent).toContain('Player context');
    element.querySelector('button')?.click();
    expect(fixture.componentInstance.activate).toHaveBeenCalledTimes(1);
    fixture.componentInstance.extras.set(false);
    fixture.detectChanges();
    expect(element.querySelector('[avatar]')).toBeNull();
    expect(element.querySelector('button')).toBeNull();
    expect(element.querySelector('h1')).not.toBeNull();
  });

  it('renders a semantic section heading with badge and working action', () => {
    fixture.componentInstance.mode.set('section');
    fixture.detectChanges();
    expect(element.querySelector('h2')?.textContent).toBe(fixture.componentInstance.title());
    expect(element.querySelector('[badge]')?.textContent).toBe('3');
    element.querySelector('button')?.click();
    expect(fixture.componentInstance.activate).toHaveBeenCalledTimes(1);
  });

  it('retains native breadcrumb navigation and current-page text', () => {
    fixture.componentInstance.mode.set('breadcrumb');
    fixture.detectChanges();
    expect(element.querySelector('nav')).not.toBeNull();
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/');
    expect(element.textContent).toContain(fixture.componentInstance.title());
  });
});
