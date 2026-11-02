import { DeferBlockState, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
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
        tournament: {
          title: 'Tournaments',
          create: {
            title: 'Create tournament',
            noClub: 'Select a club',
            submit: 'Create tournament',
            name: 'Tournament name',
            nameRequired: 'Tournament name is required',
            tournamentDays: 'Tournament days',
            tournamentDaysHelp: 'Select the first and last day',
            openDate: 'Registration opens',
            closeDate: 'Registration closes',
            official: 'Official tournament',
          },
        },
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

  it('associates touched name validation and native required/length semantics with the input', async () => {
    const { harness, element, component } = await mount();
    const input = element.querySelector<HTMLInputElement>('#name');
    if (!input) throw new Error('Name input missing');
    expect(input.required).toBe(true);
    expect(input.maxLength).toBe(255);
    expect(element.querySelector('#name-error')).toBeNull();
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    input.dispatchEvent(new Event('blur'));
    harness.detectChanges();
    expect(component.form.controls.name.touched).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('name-error');
    expect(element.querySelector('#name-error.p-message-error[role="alert"]')?.textContent).toContain('Tournament name is required');
    component.form.controls.name.setValue('Safe tournament');
    harness.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    expect(element.querySelector('#name-error')).toBeNull();
    component.form.controls.name.setValue('x'.repeat(256));
    expect(component.form.controls.name.hasError('maxlength')).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('names the deferred date inputs and associates range help without changing their form values', async () => {
    const { harness, element, component } = await mount();
    const blocks = await harness.fixture.getDeferBlocks();
    for (const block of blocks) await block.render(DeferBlockState.Complete);
    harness.detectChanges();
    for (const id of ['tournamentDays', 'openDate', 'closeDate']) {
      const input = element.querySelector<HTMLInputElement>(`input#${id}`);
      const label = element.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
      expect(input).not.toBeNull();
      expect(label?.control).toBe(input);
      expect(input?.getAttribute('role')).toBe('combobox');
    }
    expect(element.querySelector('#tournamentDays')?.getAttribute('aria-labelledby')).toBe('tournamentDays-label tournamentDays-help');
    expect(element.querySelector('#tournamentDays-help')?.textContent).toContain('Select the first and last day');
    const range = [new Date(2026, 10, 7), new Date(2026, 10, 8)];
    component.form.controls.tournamentDays.setValue(range);
    harness.detectChanges();
    expect(component.form.controls.tournamentDays.value).toEqual(range);
    expect(element.querySelector<HTMLInputElement>('#tournamentDays')?.value).toBe('07/11/2026 - 08/11/2026');
    expect(component.form.controls.openDate.value).toBeNull();
    expect(component.form.controls.closeDate.value).toBeNull();
    const checkbox = element.querySelector<HTMLInputElement>('#official');
    checkbox?.click();
    harness.detectChanges();
    expect(component.form.controls.official.value).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves pending state, mutation payload and successful navigation using mocked data only', async () => {
    const { harness, element, component } = await mount();
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const response = new Subject<{ data: { createTournamentEvent: { id: string; slug: string } } }>();
    mutate.mockReturnValue(response);
    const first = new Date(2026, 10, 7);
    const openDate = new Date(2026, 9, 1);
    const closeDate = new Date(2026, 10, 1);
    component.form.setValue({
      name: 'Safe mocked tournament',
      tournamentDays: [first, new Date(2026, 10, 8)],
      openDate,
      closeDate,
      official: true,
    });
    const submission = component.onSubmit();
    harness.detectChanges();
    expect(component.creating()).toBe(true);
    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
    expect(mutate.mock.calls[0][0].variables.data).toEqual({
      name: 'Safe mocked tournament',
      clubId: 'club',
      firstDay: first.toISOString(),
      openDate: openDate.toISOString(),
      closeDate: closeDate.toISOString(),
      official: true,
    });
    response.next({ data: { createTournamentEvent: { id: 'created', slug: 'safe-mocked-tournament' } } });
    response.complete();
    await submission;
    expect(component.creating()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/tournament', 'safe-mocked-tournament']);
  });

  it('renders native mutation-error feedback, retains entered data and clears it on a mocked retry', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const { harness, element, component } = await mount();
      const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      component.form.controls.name.setValue('Safe retry tournament');
      mutate.mockReturnValueOnce(throwError(() => ({ statusText: 'Creation rejected' })));
      await component.onSubmit();
      harness.detectChanges();
      expect(element.querySelector('form p-message.p-message-error[role="alert"]')?.textContent).toContain('Creation rejected');
      expect(component.form.controls.name.value).toBe('Safe retry tournament');
      expect(component.creating()).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
      expect(log).toHaveBeenCalled();
      const response = new Subject<{ data: { createTournamentEvent: { id: string } } }>();
      mutate.mockReturnValueOnce(response);
      const retry = component.onSubmit();
      harness.detectChanges();
      expect(element.querySelector('form p-message')).toBeNull();
      expect(component.creating()).toBe(true);
      response.next({ data: { createTournamentEvent: { id: 'created' } } });
      response.complete();
      await retry;
      expect(navigate).toHaveBeenCalledWith(['/tournament', 'created']);
      expect(mutate).toHaveBeenCalledTimes(2);
      expect(mutate.mock.calls[1][0].variables.data).toEqual({
        name: 'Safe retry tournament',
        clubId: 'club',
        firstDay: undefined,
        openDate: undefined,
        closeDate: undefined,
        official: false,
      });
    } finally {
      log.mockRestore();
    }
  });

  it('does not send an invalid form to the mutation service', async () => {
    const { component } = await mount();
    await component.onSubmit();
    expect(mutate).not.toHaveBeenCalled();
  });
});
