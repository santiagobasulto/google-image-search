$.widget( "salesboard.imageCarouselWidget", {
  options: {
    visibleImages: 3,
    defaultImageIterator: null,

    fetchOnCreation: true,

    defaultWidth: null,
    defaultHeight: null,

    defaultResultsContainerClass: 'js-image-carousel-widget-results-container',

    defaultNavClass: "js-image-carousel-widget-gif-nav",
    defaultPrevNavClass: "js-image-carousel-widget-gif-nav-prev",
    defaultNextNavClass: "js-image-carousel-widget-gif-nav-next",

    defaultResultElementClass: 'result',

    defaultEventNameImageClicked: 'image-clicked'
  },
  _create: function(){
    if(this.options.fetchOnCreation && !this.options.defaultImageIterator){
      throw "This widget needs an image iterator to get the images";
    }
    this.iterator = this.options.defaultImageIterator;
    this._images = [];
    this._firstImageIdx = 0;

    this._createElements();

    if(this.options.fetchOnCreation){
      this._initImages();
    }
  },

  resetIterator: function(iterator){
    this.iterator = iterator;
    this._images = [];
    this._initImages();
  },

  _initImages: function(){
    var self = this;
    for (var i = 0; i < this.options.visibleImages; i++) {
      var image = this.iterator.next();
      this._images.push(image);
    }
    this._renderImages();
    this.show();
  },

  _createElements: function() {
    var self = this;

    this._$results = $("<div />").addClass(
      this.options.defaultResultsContainerClass
    ).appendTo(this.element);

    this._$nav = $("<div />").addClass(
      this.options.defaultNavClass
    ).appendTo(this.element).hide();

    this._$prev = $("<div />").addClass(
      this.options.defaultPrevNavClass
    ).on('click', function(evt) {
        self.prev();
    }).appendTo(this._$nav).hide();

    this._$next = $("<div />").addClass(
      this.options.defaultNextNavClass
    ).on('click', function(evt) {
        self.next();
    }).appendTo(this._$nav).hide();
  },

  next: function(){
    this._firstImageIdx++;
    if(this._images.length <= (this._firstImageIdx + this.options.visibleImages)){
      this._images.push(this.iterator.next());
    }
    this._renderImages();
  },

  prev: function(){
    if(this._firstImageIdx > 0)
      this._firstImageIdx--;
    this._renderImages();
  },

  _setVisibility: function(visibility){
    $.each([this._$results, this._$nav, this._$prev, this._$next], function(i, e){
      e[visibility]();
    });
  },

  show: function(){
    this._setVisibility('show');
  },

  hide: function(){
    this._setVisibility('hide');
  },

  _createImageElement: function (imgObj) {
    var self = this;
    var itemResult = $("<div></div>").addClass(
      this.options.defaultResultElementClass
    );

    var imgElement = $('<img />').attr(
      "src", imgObj.url
    ).on('click', function(evt){
      self._trigger(
        self.options.defaultEventNameImageClicked,
        evt, {image: imgObj}
      );
    }).appendTo(itemResult);

    var width = imgObj.width || this.options.defaultWidth;
    var height = imgObj.height || this.options.defaultHeight;
    if(width){
        imgElement.attr('width', width);
    }
    if(height){
        imgElement.attr('height', height);
    }

    return itemResult;
  },

  _renderImages: function(){
    this._$results.empty();

    var maxIdx = this._firstImageIdx + this.options.visibleImages;
    for (var i = this._firstImageIdx; i < maxIdx; i++) {
      var imgObj = this._images[i];
      var imageElement = this._createImageElement(imgObj);
      imageElement.appendTo(this._$results);
    }
  }

});