/*!
 * jQuery UI Widget - Image Container. Holds images in a DOM element.
 * Author: @santiagobasulto
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {
    $.widget("googleImages.imageContainer" , {

        //Options to be used as defaults
        options: {
            defaultWidth: null,
            defaultHeight: null,

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
            defaultEventNameForImageRemoved: 'image-removed'
        },

        _create: function () {
            this._images = [];
            this._initElements();
        },
        primeElementIsList: function(){
            return (
                this.element.prop('tagName') ===
                $(this.options.defaultListContainer).prop('tagName')
            );
        },
        _initElements: function(){
            if(!this.primeElementIsList()){
                var listContainerElement = $(this.options.defaultListContainer);
                listContainerElement.addClass(this.options.defaultListContainerClass);

                this.element.append(listContainerElement);
                this.listContainer = this.element.find(
                    this.options.defaultListContainerSelector);
            }else{
                this.listContainer = this.element;
            }
        },
        closeButtonClickedClosure: function(self){
            // this is the a element
            // $this is the a element wrapped in a jquery obj
            // self is the widget object
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
              'click', this.closeButtonClickedClosure(this)
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
            this._images.push(image);
            this._trigger(
              this.options.defaultEventNameForImageAdded,
              null, this.currentImages()
            );
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
                this._trigger(
                  this.options.defaultEventNameForImageRemoved,
                  null, this.currentImages()
                );
                this._renderImages();
            }
        },

        // Destroy an instantiated plugin and clean up
        // modifications the widget has made to the DOM
        destroy: function () {

            // this.element.removeStuff();
            // For UI 1.8, destroy must be invoked from the
            // base widget
            $.Widget.prototype.destroy.call(this);
            // For UI 1.9, define _destroy instead and don't
            // worry about
            // calling the base widget
        }

        // // Respond to any changes the user makes to the
        // // option method
        // _setOption: function ( key, value ) {
        //     switch (key) {
        //     case "someValue":
        //         //this.options.someValue = doSomethingWith( value );
        //         break;
        //     default:
        //         //this.options[ key ] = value;
        //         break;
        //     }
        //
        //     // For UI 1.8, _setOption must be manually invoked
        //     // from the base widget
        //     $.Widget.prototype._setOption.apply( this, arguments );
        //     // For UI 1.9 the _super method can be used instead
        //     // this._super( "_setOption", key, value );
        // }
    });
})( jQuery, window, document );
