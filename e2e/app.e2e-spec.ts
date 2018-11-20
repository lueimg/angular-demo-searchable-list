import { SearchableListPage } from './app.po';

describe('searchable-list App', function() {
  let page: SearchableListPage;

  beforeEach(() => {
    page = new SearchableListPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
