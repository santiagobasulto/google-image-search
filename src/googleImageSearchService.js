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
