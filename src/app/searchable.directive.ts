import { Directive, Input, Optional, ElementRef } from '@angular/core';
import { SearchableContainerComponent } from './searchable-container/searchable-container.component';

@Directive({
  selector: '[searchable]'
})
export class SearchableDirective {

  token = '';

  @Input() set searchable(value: string) {
    this.token = value;
  }

  constructor(
    @Optional() private container: SearchableContainerComponent,
    private host: ElementRef
  ) {
    if (!container) {
      throw new Error(`Missing <searchable-container> wrapper component`);
    }
  }

  ngOnInit() {
    this.container.register(this);
  }

  hide() {
    this.host.nativeElement.classList.add('hide');
  }

  show() {
    this.host.nativeElement.classList.remove('hide');
  }

  ngOnDestroy() {
    this.container.unregister(this);
  }
}
