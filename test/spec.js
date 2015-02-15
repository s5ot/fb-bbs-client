describe('fb-bbs',  function() {
  it('should have a title',  function() {
    browser.get('https://s5ot.github.io/fb-bbs-client/');

    expect(browser.getTitle()).toEqual('Home | fb-bbs');
  });
});
