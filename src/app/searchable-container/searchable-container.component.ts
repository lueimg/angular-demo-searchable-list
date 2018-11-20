import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SearchableDirective } from '../searchable.directive';
import { SearchableHighlightDirective } from '../searchable-highlight.directive';

@Component({
  selector: 'searchable-container',
  template: `<ng-content></ng-content>`,
  exportAs: 'searchableContainer',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchableContainerComponent {

  private searchables: SearchableDirective[] = [];
  private searchablesHighlight: SearchableHighlightDirective[] = [];
  private contentInit = false;

  private _count = 0;
  get count() {
    return this._count;
  }
  set count(count: number) {
    this._count = count;
  }

  private _term = '';
  get term() {
    return this._term;
  }
  @Input('searchTerm') set term(searchTerm: string) {
    this._term = searchTerm || '';
    this.search(this._term);
  }

  ngAfterContentInit() {
    this.search(this.term);
  }

  search(searchTerm: string) {
    this.handleSearchables(searchTerm);
    this.handleHighlighters(searchTerm);
  }

  private handleSearchables(searchTerm: string) {
    let count = 0;
    for (const searchable of this.searchables) {
      const show = !searchTerm || this.match(searchable);
      if (show) {
        searchable.show();
        count++;
      } else {
        searchable.hide();
      }
    }
    this.count = count;
  }

  private handleHighlighters(searchTerm: string) {
    for (const searchableHighlight of this.searchablesHighlight) {
      searchableHighlight.highlight(searchableHighlight.token, searchTerm);
    }
  }

  private match(searchable: SearchableDirective) {
    return searchable.token.toLowerCase().indexOf(this._term.toLowerCase()) > -1;
  }

  register(searchable: SearchableDirective | SearchableHighlightDirective, {highlight} = {highlight}) {
    if (highlight) {
      this.searchablesHighlight.push(searchable as SearchableHighlightDirective);
    } else {
      this.searchables.push(searchable as SearchableDirective);
    }
  }

  unregister(searchable: SearchableDirective | SearchableHighlightDirective, {highlight} = {highlight}) {
    const filter = current => current !== searchable;
    if (highlight) {
      this.searchablesHighlight = this.searchablesHighlight.filter(filter);
    } else {
      this.searchables = this.searchables.filter(filter);
    }
  }

  ngOnDestroy() {
    this.searchables = [];
    this.searchablesHighlight = [];
  }

}
