var mldfirstListMade = false;
var notFoundSwatches = [];
jQuery(document).ready(function($) {


  function swatchNotFound(item) {
    if ($.inArray(item, notFoundSwatches) == -1) {
      notFoundSwatches.push(item);
    }
  }

  function makeList() {
    $('.js-swatch-not-found').each(function() {
      var item = [$(this).data('variant-title'),
                  $(this).data('product-name'),
                  $(this).data('variant-url')];
      console.log(item, $(this));

     swatchNotFound(item);
    });
  }
});