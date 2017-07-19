import { NgxAmrsPage } from './app.po';

describe('ngx-amrs App', () => {
  let page: NgxAmrsPage;

  beforeEach(() => {
    page = new NgxAmrsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
