describe('A spec for the Image Container', function () {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'spec/fixtures';
    loadFixtures("image-container.html");

    this.expectedImageTagContainer = 'li';
    this.getRandomImageName = function(){
      return "test-"+(Math.floor((Math.random() * 100) + 1)) + ".jpg";
    };
  });

  it('should initialize the proper widget', function () {
    var ui_spy = spyOn($.fn, 'imageContainer');
    var el = $('#container').imageContainer();

    expect($.fn.imageContainer).toHaveBeenCalled();
  });

  it('should have an empty list of images when initialized', function () {
    var el = $('#container').imageContainer();
    expect(el.imageContainer('currentImages')).toEqual([]);
  });

  it('should return false when initialized with a div', function() {
    var el = $('<div></div>').imageContainer();
    expect(el.imageContainer('primeElementIsList')).toBe(false);
  });

  it('should return true when initialized with a ul', function() {
    var el = $('<ul></ul>').imageContainer();
    expect(el.imageContainer('primeElementIsList')).toBe(true);
  });

  it('should add the proper image to the image list', function(){
    var el = $('#container').imageContainer();

    el.imageContainer('addImage', {
        url: "test.jpg"
    });

    expect(el.imageContainer('currentImages').length).toEqual(1);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test.jpg');
  });

  it('should trigger an event when an image is added', function(){
    var imageAdded = false;
    var eventData = null;
    var el = $('#container').imageContainer({
      'image-added': function(evt, data){
        imageAdded = true;
        eventData = data;
      }
    });

    el.imageContainer('addImage', {
        url: "test1.jpg"
    });
    expect(imageAdded).toBe(true);
    expect(eventData).toEqual({
      images: [{url: "test1.jpg"}],
      currentImageAdded: {url: "test1.jpg"}
    });
  });

  it('should trigger an event when an image is removed', function(){
    var imageRemoved = false;
    var eventData = null;
    var el = $('#container').imageContainer({
      'image-removed': function(evt, data){
        imageRemoved = true;
        eventData = data;
      }
    });

    el.imageContainer('addImage', {
        url: "test1.jpg"
    });
    el.imageContainer('addImage', {
        url: "test2.jpg"
    });

    el.imageContainer('removeImage', {
        url: "test2.jpg"
    });

    expect(imageRemoved).toBe(true);
    expect(eventData).toEqual({
      images: [{url: "test1.jpg"}],
      currentImageRemoved: {url: "test2.jpg"}
    });
  });

  it('should respect the limit for the image list', function(){
    var limitReached = false;
    var el = $('#container').imageContainer({
      limit: 1,
      'limit-reached': function(){
        limitReached = true;
      }
    });

    el.imageContainer('addImage', {
        url: "test1.jpg"
    });

    expect(el.imageContainer('currentImages').length).toEqual(1);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test1.jpg');

    el.imageContainer('addImage', {
        url: "test2.jpg"
    });

    expect(el.imageContainer('currentImages').length).toEqual(1);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test1.jpg');

    expect(limitReached).toBe(true);
  });

  it('should remove the proper image from the image list', function(){
    var el = $('#container').imageContainer();

    el.imageContainer('addImage', {
        url: "test1.jpg"
    });

    el.imageContainer('addImage', {
        url: "test2.jpg"
    });

    el.imageContainer('addImage', {
        url: "test3.jpg"
    });

    // Preconditions
    expect(el.imageContainer('currentImages').length).toEqual(3);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test1.jpg');
    expect(el.imageContainer('currentImages')[1].url).toEqual('test2.jpg');
    expect(el.imageContainer('currentImages')[2].url).toEqual('test3.jpg');

    el.imageContainer('removeImage', {
        url: "test2.jpg"
    });

    expect(el.imageContainer('currentImages').length).toEqual(2);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test1.jpg');
    expect(el.imageContainer('currentImages')[1].url).toEqual('test3.jpg');

    el.imageContainer('removeImage', {
        url: "test3.jpg"
    });

    expect(el.imageContainer('currentImages').length).toEqual(1);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test1.jpg');

    // Try to remove an image that doesn't exist
    el.imageContainer('removeImage', {
        url: "test3.jpg"
    });

    expect(el.imageContainer('currentImages').length).toEqual(1);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test1.jpg');

    // Remove the last image
    el.imageContainer('removeImage', {
        url: "test1.jpg"
    });

    expect(el.imageContainer('currentImages').length).toEqual(0);
  });

  it('should create an empty <ul> tag if none is provided', function () {
    // Precondition
    expect($('#container').find("ul").length).toBe(0);

    var el = $('#container').imageContainer();

    expect(el.find("ul").length).toBe(1);
  });

  it('the ul tag should have the corresponding attributes', function () {
    // Precondition
    expect($('#container').find("ul").length).toBe(0);

    var el = $('#container').imageContainer();

    var listContainer = el.find("ul");
    expect(listContainer.hasClass("js-googleImage-ImageContainer-ul")).toBe(true);
  });

  it('should add the proper tags to the DOM to represent the image with default attrs', function(){
    var el = $('#container').imageContainer();

    // Preconditions
    expect(el.find('div').length).toBe(0);

    var imgName = this.getRandomImageName();
    el.imageContainer('addImage', {
        url: imgName
    });

    var imgContainer = el.find('ul').find(this.expectedImageTagContainer);
    expect(imgContainer.length).toBe(1);
    expect(imgContainer.hasClass("js-googleImage-ImageContainer-li")).toBe(true);

    var imgTag = imgContainer.find('img');

    expect(imgTag.length).toBe(1);
    expect(imgTag.attr('src')).toBe(imgName);
    expect(imgTag.hasClass("js-googleImage-ImageContainer-img")).toBe(true);
  });

  it('should not have width or height if not specified', function(){
    var el = $('#container').imageContainer();

    // Preconditions
    expect(el.find('div').length).toBe(0);

    var imgName = this.getRandomImageName();
    el.imageContainer('addImage', {
        url: imgName
    });

    var imgContainer = el.find('ul').find(this.expectedImageTagContainer);
    var imgTag = imgContainer.find('img');
    expect(imgTag.length).toBe(1);

    expect(imgTag.attr('width')).toBeFalsy();
    expect(imgTag.attr('heigth')).toBeFalsy();
  });

  it('should respect the default width and height if specified', function(){
    var el = $('#container').imageContainer({
      defaultWidth: "310",
      defaultHeight: "150"
    });

    // Preconditions
    expect(el.find('div').length).toBe(0);

    var imgName = this.getRandomImageName();
    el.imageContainer('addImage', {
        url: imgName
    });

    var imgContainer = el.find('ul').find(this.expectedImageTagContainer);
    var imgTag = imgContainer.find('img');

    expect(imgTag.length).toBe(1);
    expect(imgTag.attr('width')).toBe("310");
    expect(imgTag.attr('height')).toBe("150");
  });

  it('should overwrite the width and height if specified in the img object', function(){
    var el = $('#container').imageContainer({
      defaultWidth: "310",
      defaultHeight: "150"
    });

    // Preconditions
    expect(el.find('div').length).toBe(0);

    var imgName = this.getRandomImageName();
    el.imageContainer('addImage', {
        url: imgName,
        width: '500',
        height: '200'
    });

    var imgContainer = el.find('ul').find(this.expectedImageTagContainer);
    var imgTag = imgContainer.find('img');

    expect(imgTag.length).toBe(1);
    expect(imgTag.attr('width')).toBe("500");
    expect(imgTag.attr('height')).toBe("200");
  });

  it("should remove the image when a click in the close button is triggered", function(){
    var el = $('#container').imageContainer();

    el.imageContainer('addImage', {
        url: "test1.jpg"
    });

    el.imageContainer('addImage', {
        url: "test2.jpg"
    });

    el.imageContainer('addImage', {
        url: "test3.jpg"
    });

    // General Data Preconditions
    expect(el.imageContainer('currentImages').length).toEqual(3);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test1.jpg');
    expect(el.imageContainer('currentImages')[1].url).toEqual('test2.jpg');
    expect(el.imageContainer('currentImages')[2].url).toEqual('test3.jpg');

    ///////////    BEGIN FIRST CASE     /////////////
    /////////// Click on the 2nd image /////////////
    // Preconditions on the DOM
    var imageContainer = $("#container").find("ul li");
    expect(imageContainer.length).toBe(3);
    expect(imageContainer.eq(0).find("img").attr('src')).toBe("test1.jpg");
    expect(imageContainer.eq(1).find("img").attr('src')).toBe("test2.jpg");
    expect(imageContainer.eq(2).find("img").attr('src')).toBe("test3.jpg");

    // Click on the second close button
    imageContainer.eq(1).find("a").trigger('click');

    // Postconditions on the data
    expect(el.imageContainer('currentImages').length).toEqual(2);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test1.jpg');
    expect(el.imageContainer('currentImages')[1].url).toEqual('test3.jpg');

    // Re read DOM
    imageContainer = $("#container").find("ul li");

    // Postconditions on the DOM
    expect(imageContainer.length).toBe(2);
    expect(imageContainer.eq(0).find("img").attr('src')).toBe("test1.jpg");
    expect(imageContainer.eq(1).find("img").attr('src')).toBe("test3.jpg");
    ///////////     END FIRST CASE      /////////////

    ///////////   BEGIN SECOND CASE     /////////////
    /////////// Click on the 3rd image /////////////
    // Click on the second close button
    imageContainer.eq(1).find("a").trigger('click');

    // Postconditions in the data
    expect(el.imageContainer('currentImages').length).toEqual(1);
    expect(el.imageContainer('currentImages')[0].url).toEqual('test1.jpg');

    // Postconditions in the DOM
    imageContainer = $("#container").find("ul li");
    expect(imageContainer.length).toBe(1);
    expect(imageContainer.eq(0).find("img").attr('src')).toBe("test1.jpg");
    ///////////     END SECOND CASE      /////////////

    ///////////    BEGIN THIRD CASE     /////////////
    /////////// Click on the 1st image /////////////
    imageContainer.eq(0).find("a").trigger('click');

    expect(el.imageContainer('currentImages').length).toEqual(0);
    imageContainer = $("#container").find("ul li");
    expect(imageContainer.length).toBe(0);
    ///////////     END THIRD CASE      /////////////
  });
});
