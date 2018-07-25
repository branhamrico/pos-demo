import { PosDemoPage } from './app.po';

describe('pos-demo App', () => {
  let page: PosDemoPage;

  beforeEach(() => {
    page = new PosDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
