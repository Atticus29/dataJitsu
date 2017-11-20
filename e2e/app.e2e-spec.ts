import { DataJitsuPage } from './app.po';

describe('data-jitsu App', () => {
  let page: DataJitsuPage;

  beforeEach(() => {
    page = new DataJitsuPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
