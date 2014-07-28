
;(function ( $, window, document, undefined ) {
  var getGoogleFactory = function(){
    var factory = null;

    if(!factory){
      factory = {
        getGoogleSearchService: function(options){
          var self = this;
          var defaults = {
            searchUrl: "https://www.googleapis.com/customsearch/v1?searchType=image",
            apiKey: null,
            cx: null,
            resultCount: 10,
            startingPage: 1,
            requestHandler: function(url){
              return $.ajax({
                  url: url,
                  type: "GET",
                  async: false
              });
            }
          };
          this.options = $.extend({}, defaults, options);

          var getStart = function(currentPage){
            return 1 + ((currentPage - 1) * self.options.resultCount);
          };

          return {
            search: function(query){
              var currentPage = self.options.startingPage;
              var searchUrl = self.options.searchUrl;
              var items = [];
              var index = 0;


              var requestHandler = self.options.requestHandler;
              var requestItems = function(){
                var url = searchUrl;
                url += "&key=" + self.options.apiKey;
                url += "&cx=" + self.options.cx;
                url += "&q=" + query;
                url += "&start=" + getStart(currentPage);
                url += "&num=" + self.options.resultCount;

                var response = requestHandler(url);
                currentPage++;
                 var _items = response.responseJSON.items;
                 for (var i = 0; i < _items.length; i++) {
                   var item = _items[i];
                   items.push(item);
                 }
              };

              return {
                next: function(){
                  if(index <= items.length){
                    requestItems();
                  }
                  return items[index++];
                },
                rewind: function(){
                  index = 0;
                }
              };
            }
          };
        }
      };
    }
    return factory;
  };

  window.getGoogleFactory = getGoogleFactory;
})( jQuery, window, document );;$.widget( "salesboard.imageCarouselWidget", {
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

});;/*!
 * A jquery-ui widget that serves as a container for images. It has
 * a simple API which allows you to add, remove and query the images contained
 * in it.
 *
 * The public API has the following methods:
 *
 * addImage(image):
 *   Adds an image to the container. If a limit was set and it hasn't been
 *   reached the image is added and rendered.
 *   If the image is successfully added the `defaultEventNameForImageAdded`
 *   event is triggered.
 *   If the limit was reached the `defaultEventNameForLimitReached` event
 *   is triggered.
 *
 * removeImage(image):
 *   Remove an image from the container. If the image is present
 *   the defaultEventNameForImageRemoved event is triggered.
 *
 * currentImages():
 *   Returns the images contained by the widget.
 *
 * The image object:
 * As you've noticed, the `addImage` and `removeImage` methods both receive
 * an `image` object. The object must have an interface similar to:
 * var image = {
 *   url: The URL of the image,
 *   width: OPTIONAL. The width of the image.
 *   height: OPTIONAL. The height of the image.
 * }
 *
 * Events examples:
 *  $("#container").imageContainer({
 *    limit: 4,
 *     // options.defaultEventNameForImageAdded
 *    'limit-reached': function(evt, data){
 *      console.log(data.images) // All the images contained
 *    },
 *     // options.defaultEventNameForImageAdded
 *    'image-added': function(evt, data){
 *      console.log(data.images) // All the images contained
 *      console.log(data.currentImageAdded) // The image added
 *    },
 *     // options.defaultEventNameForImageRemoved
 *    'image-removed': function(evt, data){
 *      console.log(data.images) // All the images contained
 *      console.log(data.currentImageRemoved) // The image added
 *    }
 *  });
 *
 * Usage Example:
 *
 * $("#container").imageContainer({});
 * $("#container").imageContainer('addImage', {url: '#'});
 * $("#container").imageContainer('removeImage', {url: '#'});
 * console.log($("#container").imageContainer('currentImages'));
 *
 */

;(function ( $, window, document, undefined ) {
    $.widget("salesboard.imageContainer" , {

        //Options to be used as defaults
        options: {
            defaultWidth: null,
            defaultHeight: null,
            limit: null,

            defaultListContainer: "<ul></ul>",
            defaultListContainerSelector: "ul",
            defaultListContainerClass: "js-googleImage-ImageContainer-ul",

            defaultListElement: "<li></li>",
            defaultListElementSelector: "li",
            defaultListElementClass: "js-googleImage-ImageContainer-li",

            defaultListElementContainer: "<div></div>",
            defaultListElementContainerSelector: "div",
            defaultListElementContainerClass: "js-googleImage-ImageContainer-list-element-container",

            defaultImgElementClass: "js-googleImage-ImageContainer-img",

            defaultButtonClass: "js-googleImage-ImageContainer-button",

            defaultEventNameForImageAdded: 'image-added',
            defaultEventNameForImageRemoved: 'image-removed',
            defaultEventNameForLimitReached: 'limit-reached'
        },

        _create: function () {
            this._images = [];
            this._initElements();
        },
        _primeElementIsList: function(){
            return (
                this.element.prop('tagName') ===
                $(this.options.defaultListContainer).prop('tagName')
            );
        },
        _initElements: function(){
            if(!this._primeElementIsList()){
                var listContainerElement = $(this.options.defaultListContainer);
                listContainerElement.addClass(this.options.defaultListContainerClass);

                this.element.append(listContainerElement);
                this.listContainer = this.element.find(
                    this.options.defaultListContainerSelector);
            }else{
                this.listContainer = this.element;
            }
        },
        _closeButtonClickedClosure: function(self){
            // `this` is the `a` tag
            // `$this` is the `a` tag wrapped in a jquery obj
            // `self` is the widget object
            return function(evt){
                $this = $(this);
                var containerEl = $this.parent(self.options.defaultListElementContainerSelector);
                var imageEl = containerEl.find('img');
                self.removeImage({url: imageEl.attr('src')});
            };
        },
        _createImageTag: function(imageObj){
            var divEl = $(this.options.defaultListElementContainer).addClass(
              this.options.defaultListElementContainerClass
            );
            var buttonEl = $('<a role="button" href="#"></a>').css(
              "display", "inline-block"
            ).addClass(
              this.options.defaultButtonClass
            ).append(
              $('<span></span>')
            ).on(
              'click', this._closeButtonClickedClosure(this)
            ).appendTo(divEl);

            var imgElement = $("<img></img>").attr(
              'src', imageObj.url
            ).addClass(
              this.options.defaultImgElementClass
            );

            var width = imageObj.width || this.options.defaultWidth;
            var height = imageObj.height || this.options.defaultHeight;
            if(width){
                imgElement.attr('width', width);
            }
            if(height){
                imgElement.attr('height', height);
            }
            divEl.append(imgElement);

            return divEl;
        },
        _renderImages: function(){
            this.listContainer.html("");
            for(var i=0; i<this._images.length; i++){
                var imageObj = this._images[i];
                var imgContainer = $(this.options.defaultListElement);
                imgContainer.addClass(this.options.defaultListElementClass);

                var imgElement = this._createImageTag(imageObj);

                imgContainer.append(imgElement);
                this.listContainer.append(imgContainer);
            }
        },
        currentImages: function(){
            return this._images;
        },
        addImage: function(image){
            if(this.options.limit && this._images.length >= this.options.limit){
                // Limit reached. Shouldn't add the image.
                this._trigger(
                  this.options.defaultEventNameForLimitReached,
                  null, {images: this.currentImages()}
                );
                return null;
            }
            this._images.push(image);
            this._trigger(this.options.defaultEventNameForImageAdded, null, {
                images: this.currentImages(),
                currentImageAdded: image
            });
            this._renderImages();
        },
        _getImageIndex: function(imageUrl){
            var index = null;
            for(var idx=0; idx<this._images.length; idx++){
              var image = this._images[idx];
              if(image.url === imageUrl){
                  return idx;
              }
            }
            return null;
        },
        removeImage: function(image){
            var url = image.url;
            var index = this._getImageIndex(url);
            if(index !== null){
                this._images.splice(index, 1);
                this._trigger(this.options.defaultEventNameForImageRemoved, null, {
                  images: this.currentImages(),
                  currentImageRemoved: image
                });
                this._renderImages();
            }
        },
        _destroy: function () {
            this.element.empty();
        }
    });
})( jQuery, window, document );
