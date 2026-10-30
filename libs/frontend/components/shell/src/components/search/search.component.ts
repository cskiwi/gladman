import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { SearchHit, SearchService } from './search.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  imports: [FormsModule, AutoCompleteModule, TranslateModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly searchService = inject(SearchService);
  private readonly router = inject(Router);

  results = this.searchService.results;
  loading = this.searchService.loading;

  searchValue = '';

  onSearch(event: { query: string }): void {
    const query = event.query || '';
    this.searchValue = query;
    this.searchService.updateQuery(query);
  }

  onSelect(event: AutoCompleteSelectEvent): void {
    const model = event.value as SearchHit;
    this.select(model);
  }

  select(model: SearchHit): void {
    switch (model?.linkType) {
      case 'player':
        this.router.navigate(['/players', model.slug]);
        break;
      case 'team':
        this.router.navigate(['/team', model.linkId]);
        break;
      case 'club':
        this.router.navigate(['/clubs', model.slug]);
        break;
      case 'competition':
        this.router.navigate(['/competition', model.linkId]);
        break;
      case 'tournament':
        this.router.navigate(['/tournament', model.linkId]);
        break;
      default:
        break;
    }
  }

  getIconClass(linkType: string): string {
    switch (linkType) {
      case 'player':
        return 'pi pi-user';
      case 'team':
        return 'pi pi-users';
      case 'club':
        return 'pi pi-building';
      case 'competition':
      case 'tournament':
      case 'event':
        return 'pi pi-trophy';
      default:
        return 'pi pi-search';
    }
  }

  getTypeLabel(linkType: string): string {
    switch (linkType) {
      case 'player':
        return 'all.search.types.player';
      case 'team':
        return 'all.search.types.team';
      case 'club':
        return 'all.search.types.club';
      case 'competition':
        return 'all.search.types.competition';
      case 'tournament':
        return 'all.search.types.tournament';
      case 'event':
        return 'all.search.types.event';
      default:
        return 'all.search.types.result';
    }
  }
}
