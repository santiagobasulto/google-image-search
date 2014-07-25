/*!
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
