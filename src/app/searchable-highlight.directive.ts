import { Directive, ElementRef, Optional, SecurityContext } from '@angular/core';
import { SearchableContainerComponent } from './searchable-container/searchable-container.component';
import { SearchableDirective } from './searchable.directive';
import { DomSanitizer } from '@angular/platform-browser';

const pattern = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

@Directive({
  selector: '[searchableHighlight]'
})
export class SearchableHighlightDirective {
  constructor(@Optional() private container: SearchableContainerComponent,
              @Optional() private searchable: SearchableDirective,
              private sanitizer: DomSanitizer,
              private host: ElementRef) {}

  ngOnInit() { this.container.register(this, { highlight: true }); }
  ngOnDestroy() { this.container.unregister(this, { highlight: true }); }

  get token() { return this.searchable.token; }

  highlight(token: string, searchTerm: string) {
    this.host.nativeElement.innerHTML = this.sanitizer
      .sanitize(SecurityContext.HTML, this.resolve(token, searchTerm));
  }

  resolve(token: string, searchTerm: string) {
    let cleanSearch = searchTerm.replace(pattern, '\\$&');

    cleanSearch = cleanSearch.split(' ').filter(t => t.length).join('|');
    const regex = new RegExp(cleanSearch, 'gi');

    return cleanSearch ?
      token.replace(regex, match => `<span class="highlight">${match}</span>`) : token;
  }
}
