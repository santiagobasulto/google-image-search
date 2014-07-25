describe('A spec for the imageCarouselWidget', function () {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'spec/fixtures';
    loadFixtures("image-carousel-widget.html");

    this.expectedImageTagContainer = 'li';
    this.getRandomImageName = function(){
      return "test-"+(Math.floor((Math.random() * 100) + 1)) + ".jpg";
    };
    this.mockedService = {
      next: function(){
        return {url: "#"};
      }
    };
  });

  it('should initialize the proper widget', function () {
    var ui_spy = spyOn($.fn, 'imageCarouselWidget');
    var el = $('#container').imageCarouselWidget();

    expect($.fn.imageCarouselWidget).toHaveBeenCalled();
  });

  it('should throw if no search service is provided', function () {
    var initWidget = function(){
      var el = $('#container').imageCarouselWidget();
    };
    expect(initWidget).toThrow();
  });

  it('should create an internal div with the passed attrs', function () {
    var el = $('#container');
    el.imageCarouselWidget({
      defaultImageIterator: this.mockedService,
      defaultResultsContainerClass: 'RESULTS-TEST-CLASS'
    });
    var div = el.find('.RESULTS-TEST-CLASS');
    expect(div.length).toBe(1);
  });

});
