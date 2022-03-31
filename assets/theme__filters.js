var $ = j341;

function updateFiltersUI(filtersContainer) {
  $('.advanced-filters', filtersContainer).each(function(){

    $('.js-filter-category-toggle-container', filtersContainer).removeClass('filtering');

    if ($('.active-filter', $(this)).length > 0) {
      var category = $(this).data('group-handle');

      $('.js-filter-category-toggle[data-filter-category=' + category + ']').closest('.js-filter-category-toggle-container').addClass('filtering');
    }
  });
}

function getFilterResults(url, sourceEl) {
  $('[data-show-more-button]').attr('aria-disabled', 'true');

  // #TODO
  // combine filters
  // remove filters
  // refresh filters
  // clear filters
  // update URL
  // hook into existing infinite scroll

  var productListingGrid = $('.product-listing');

  productListingGrid.empty();

  $.get(url, function(data) {
    var filterResults = $(data);

    var products = $(data).find('.product-listing > div:not(.not-a-match)');

    productListingGrid.append(products);
    sourceEl.parent().find('.active-filter').removeClass('active-filter')
    sourceEl.addClass('active-filter');
    updateFiltersUI($('.w-filters_c'));
  });
}

$(function() {
  var filterLayerToggle = $('.js-w-filters-toggle');
  var filterLayer = $('.w-filters_c');

  filterLayerToggle.on('click', function(e){
    e.preventDefault();
    filterLayer.toggleClass('shown');
  })
});

$(function() {
  var filterCategoryToggles = $('.js-filter-category-toggle'),
  filtersLists = $('.w-filters__filters__list'),
  filtersParent = $('.w-filters__filters'),
  el, filterCategory;

  filterCategoryToggles.on('click', function(e){
    e.preventDefault();
    el = $(this);
    filterCategory = el.data('filter-category'),

    filtersLists.filter('.shown').removeClass('shown');

    if (el.hasClass('active')) {
      el.removeClass('active');
      filtersParent.css('height', 0);
    } else {
      var activeFilterList = filtersLists.filter('.js-filter-category-' + filterCategory);
      activeFilterList.addClass('shown');
      filtersParent.css('height', activeFilterList.outerHeight());
      filterCategoryToggles.filter('.active').removeClass('active');
      el.addClass('active');
    }
  });
});
$(function() {
  var currentTags = '{{ current_tags }}',
  filters = $('.advanced-filter'),
    activeTag,
    activeHandle;

  filters.each(function() {
    var el = $(this),
        group = el.data('group'),
        isActive = el.hasClass('active-filter');
  });

  filters.on('click', function(e) {
    var el = $(this),
        group = el.data('group'),
        url = el.find('a').attr('href');

    // Continue as normal if we're clicking on the active link
    if ( el.hasClass('active-filter') ) {
      return;
      // clear it
      // write it to the url or keep track of it somehow
    }

    // Get active group link (unidentified if there isn't one)
    activeTag = $('.active-filter[data-group="'+ group +'"]');

    // If a tag from this group is already selected, remove it from the new tag's URL and continue
    if ( activeTag && activeTag.data('group') === group ) {
      e.preventDefault();
      activeHandle = activeTag.data('handle') + '+';

      // Create new URL without the currently active handle
      url = url.replace(activeHandle, '');

      window.location = url;
      // getFilterResults(url, el);
    } else {
      e.preventDefault();

      window.location = url;
      // getFilterResults(url, el);
    }

  });
});