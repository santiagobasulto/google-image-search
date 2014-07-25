describe('A spec for the googleImageSearch widget', function () {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'spec/fixtures';
    this.API_KEY = "TEST-API-KEY";
    this.CX = "TEST-CX";
    this.simpleRequestHandler = function(url){
      return {
        responseJSON: {
          items: [{link: '1.jpg'}, {link: '2.jpg'}]
         }
      };
    };

    var requestCount = 1;
    this.paginatedRequestHandler = function(url){
      if(requestCount == 1){
        requestCount++;
        return {
          responseJSON: {
            items: [{link: '1.jpg'}, {link: '2.jpg'}]
           }
        };
      }else{
        return {
          responseJSON: {
            items: [{link: '3.jpg'}, {link: '4.jpg'}]
           }
        };
      }
    };
  });

  it('should use the Iterator ok', function() {
    var factory = getGoogleFactory();
    var service = factory.getGoogleSearchService({
      apiKey: this.API_KEY,
      cx: this.CX,
      requestHandler: this.simpleRequestHandler
    });
    var it = service.search("Samsung S3");
    var firstElem = it.next(),
        secondElem = it.next();
    expect(firstElem).toEqual({link: '1.jpg'});
    expect(secondElem).toEqual({link: '2.jpg'});
  });

  it('should paginate ok', function() {

    var factory = getGoogleFactory();
    var service = factory.getGoogleSearchService({
      apiKey: this.API_KEY,
      cx: this.CX,
      requestHandler: this.paginatedRequestHandler
    });

    var it = service.search("Samsung S3");

    var firstElem = it.next(),
        secondElem = it.next(),
        thirdElem = it.next(),
        fourthElem = it.next();

    expect(firstElem).toEqual({link: '1.jpg'});
    expect(secondElem).toEqual({link: '2.jpg'});
    expect(thirdElem).toEqual({link: '3.jpg'});
    expect(fourthElem).toEqual({link: '4.jpg'});
  });

  it('should rewind the iterator', function() {
    var factory = getGoogleFactory();
    var service = factory.getGoogleSearchService({
      apiKey: this.API_KEY,
      cx: this.CX,
      requestHandler: this.paginatedRequestHandler
    });

    var it = service.search("Samsung S3");

    var firstElem = it.next(),
        secondElem = it.next(),
        thirdElem = it.next(),
        fourthElem = it.next();

    expect(firstElem).toEqual({link: '1.jpg'});
    expect(secondElem).toEqual({link: '2.jpg'});
    expect(thirdElem).toEqual({link: '3.jpg'});
    expect(fourthElem).toEqual({link: '4.jpg'});

    it.rewind();

    firstElem = it.next();
    secondElem = it.next();
    thirdElem = it.next();
    fourthElem = it.next();

    expect(firstElem).toEqual({link: '1.jpg'});
    expect(secondElem).toEqual({link: '2.jpg'});
    expect(thirdElem).toEqual({link: '3.jpg'});
    expect(fourthElem).toEqual({link: '4.jpg'});
  });

});
