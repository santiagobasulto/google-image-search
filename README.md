A set of widgets and modules to construct a Google image search wiget in your site.

Highly composable. It consist of several modules:

* `imageContainerWidget`: A container with a clean API to add and remove images. It also has a `remove` button for each image.
* `imageCarouselWidget`: A carousel with `next` and `prev` buttons (and methods) to display images from an iterator.
* `imageSearchService`: A google search service that returns an iterator for the results. This is intended to be used along with the `imageCarouselWidget`.

### Demos

There are demos for each widget/module. If you're interested in seeing the plain google search working point your browser to `imageCarouselOnDemandDemo.html`.

```bash
$ npm install
$ npm run-script serve  # point your browser to `localhost:8000`
```