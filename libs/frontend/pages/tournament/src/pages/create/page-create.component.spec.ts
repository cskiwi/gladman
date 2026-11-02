import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of, Subject, throwError } from 'rxjs';
import { PageCreateComponent } from './page-create.component';

describe('Tournament creation chrome', () => {
  let query: jest.Mock;
  let mutate: jest.Mock;

  beforeEach(async () => {
    query = jest.fn(() => of({ data: { club: { id: 'club', name: 'Short club', fullName: 'Full club name' } } }));
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [PageCreateComponent, TranslateModule.forRoot()],
      providers: [provideRouter([{ path: 'tournament/create', component: PageCreateComponent }]), { provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', {
      all: {
        common: { cancel: 'Cancel' },
        tournament: { title: 'Tournaments', create: { title: 'Create tournament', noClub: 'Select a club', submit: 'Create tournament' } },
      },
    });
    translations.use('en');
  });

  async function mount(url = '/tournament/create?clubId=club', settle = true) {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(url, PageCreateComponent);
    if (settle) await harness.fixture.whenStable();
    harness.detectChanges();
    const element = harness.routeNativeElement;
    if (!element) throw new Error('Creation route did not mount');
    return { harness, component, element };
  }

  it('renders one localized heading and real club context without decorative fallback', async () => {
    const { element, component } = await mount();
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('h1')?.textContent).toContain('Create tournament');
    expect(element.querySelector('header p')?.textContent).toContain('Full club name');
    expect(element.querySelector('.t-eyebrow')).toBeNull();
    expect(element.textContent).not.toContain('New tournament');
    expect(Object.keys(component.form.controls)).toEqual(['name', 'tournamentDays', 'openDate', 'closeDate', 'official']);
    expect(element.querySelector('form')).not.toBeNull();
    expect(element.querySelector('p-card form')).not.toBeNull();
    expect(element.querySelector('p-card .p-card-body')).not.toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('falls back to the club name when its full name is absent', async () => {
    query.mockReturnValue(of({ data: { club: { id: 'club', name: 'Short club' } } }));
    const { element } = await mount();
    expect(element.querySelector('header p')?.textContent).toContain('Short club');
  });

  it('uses native PrimeNG buttons with preserved cancel and form-submit contracts', async () => {
    const { harness, element, component } = await mount();
    const cancel = element.querySelector<HTMLButtonElement>('button[type="button"][pButton]');
    const submit = element.querySelector<HTMLButtonElement>('button[type="submit"][pButton]');
    if (!cancel || !submit) throw new Error('Native creation actions missing');
    expect(element.querySelector('p-button')).toBeNull();
    expect(cancel.querySelector('[pButtonLabel]')?.textContent).toContain('Cancel');
    expect(submit.querySelector('[pButtonLabel]')?.textContent).toContain('Create tournament');
    expect(submit.disabled).toBe(true);
    const cancelAction = jest.spyOn(component, 'cancel').mockImplementation(() => undefined);
    const submitAction = jest.spyOn(component, 'onSubmit').mockResolvedValue();
    cancel.click();
    expect(cancelAction).toHaveBeenCalledTimes(1);
    expect(submitAction).not.toHaveBeenCalled();
    component.form.controls.name.setValue('Safe test tournament');
    harness.detectChanges();
    expect(submit.disabled).toBe(false);
    submit.click();
    expect(submitAction).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('keeps the submit name while showing a decorative spinner and blocking duplicate submits', async () => {
    const { harness, element, component } = await mount();
    component.form.controls.name.setValue('Safe test tournament');
    component.creating = signal(true);
    harness.detectChanges();
    const submit = element.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!submit) throw new Error('Submit action missing');
    expect(submit.disabled).toBe(true);
    expect(submit.getAttribute('aria-busy')).toBe('true');
    expect(submit.querySelector('[pButtonLabel]')?.textContent).toContain('Create tournament');
    expect(submit.querySelector('[pButtonIcon]')?.getAttribute('aria-hidden')).toBe('true');
    submit.click();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('uses native information feedback without querying when no club is selected', async () => {
    const { element } = await mount('/tournament/create');
    expect(element.querySelector('p-message[role="alert"]')?.textContent).toContain('Select a club');
    expect(element.querySelector('.p-message-info')).not.toBeNull();
    expect(element.querySelector('form')).toBeNull();
    expect(element.querySelector('header p')).toBeNull();
    expect(query).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('keeps the loading skeletons in a native Card until the club query resolves', async () => {
    const response = new Subject<{ data: { club: { id: string; name: string } } }>();
    query.mockReturnValue(response);
    const { harness, element } = await mount('/tournament/create?clubId=club', false);
    expect(element.querySelectorAll('p-card p-skeleton')).toHaveLength(2);
    expect(element.querySelector('form')).toBeNull();
    response.next({ data: { club: { id: 'club', name: 'Loaded club' } } });
    response.complete();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('p-card p-skeleton')).toBeNull();
    expect(element.querySelector('p-card form')).not.toBeNull();
    expect(element.querySelector('form')).not.toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('renders mapped read errors instead of throwing while reading the club resource', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      query.mockReturnValue(throwError(() => ({ status: 404, url: '/graphql' })));
      const { element, component } = await mount();
      expect(component.club()).toBeUndefined();
      expect(element.querySelector('p-message[role="alert"]')?.textContent).toContain('Failed to load club');
      expect(element.querySelector('.p-message-error')).not.toBeNull();
      expect(element.querySelector('form')).toBeNull();
      expect(log).toHaveBeenCalled();
      expect(mutate).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
