var $ = j341;

/**
 * Blog: Recent stories
 */
$(document).ready(function () {
  $('.recent-stories-items').slick({
    dots: true,
    arrows: false,
    asNavFor: '.recent-stories-items-index',
    // autoplay: true,
    // autoplaySpeed: 4000,
    focusOnSelect: true
  });

  $('.recent-stories-items-index').slick({
    vertical: true,
    slidesToShow: 4,
    focusOnSelect: true,
    asNavFor: '.recent-stories-items'
  });
});

/**
 * Blog: Posts grid
 */

$(document).ready(function() {
  function scrollToPostsGridTop() {
    window.scrollTo({
      top: $('.posts-grid').offset().top -
          ($('.tag-selector').outerHeight() + parseInt($('.tag-selector').css('marginBottom')) + $('.desktop-header__bottom-row-wrapper').outerHeight()),
      left: 0,
      behavior: 'smooth'
    });
  }

  function populateArticles(fromUrl, emptyExisting, showPagination = true) {
    if (fromUrl.indexOf('?') === -1) {
      fromUrl += '?view=data';
    } else {
      fromUrl += '&view=data';
    }

    if (emptyExisting) {
      $('.js-posts-grid-item').remove();
      $('.js-blog--show-more').removeClass('shown');
    }

    $.get(fromUrl, function(data){
      var response = $.parseJSON(data);

      for (var i = 0; i < response.articles.length; i++) {
        var articleData = response.articles[i];

        var gridItem = $('.js-posts-grid-item--template').clone();
        gridItem.removeClass('js-posts-grid-item--template');
        gridItem.addClass('js-posts-grid-item');

        gridItem.find('.js-posts-grid-item--link').attr('href', articleData.url);
        gridItem.find('.js-posts-grid-item--image--img').attr('data-srcset', articleData.srcset);
        gridItem.find('.js-posts-grid-item--image--img').addClass('lazyload');
        gridItem.find('.js-posts-grid-item--image').css('padding-top', articleData.paddingtop.toString() + '%');
        gridItem.find('.js-posts-grid-item--title').text(articleData.title);
        gridItem.find('.js-posts-grid-item--excerpt').text(articleData.excerpt);
        gridItem.addClass('loaded');
        $('.js-posts-grid').append(gridItem);
      }

      if (!history.state || history.state.url != response.currentpage) {
        history.pushState({ type: 'wmpBlogNavigation', url: response.currentpage }, '', response.currentpage);
      }

      $('.js-blog--show-more').removeClass('shown');
      $('.js-blog--pagination').removeClass('shown');

      if ($('.js-blog--show-more').length > 0 && showPagination === false) {
        if (response.nextpage !== '' ) {
          $('.js-blog--show-more a').attr('href', response.nextpage);
          $('.js-blog--show-more').addClass('shown');
          $('.js-blog--show-more a').blur();
        } else {
          $('.js-blog--show-more').removeClass('shown');
        }
      }

      if ($('.js-blog--pagination').length > 0 && showPagination === true) {
        $('.js-blog-pagination--page').remove();
        if (response.paginate_parts.length > 0) {
          $.each(response.paginate_parts, function(){
            var inner = $('.js-blog-pagination--page--template').clone();
            inner.addClass('js-blog-pagination--page');
            inner.removeClass('js-blog-pagination--page--template');
            var content;

            if (this.is_link) {
              var url = this.url.replace('?page=1', '');
              url = url.replace('&view=data', '');
              content = $('<a href="'+ url +'"></a>').text(this.title);
            } else {
              content = $('<span></span>').html(this.title)
              if (this.title === response.currentpage_index) {
                content.addClass('current');
              }
            }

            inner.append(content);
            $('.js-blog--pagination ul').append(inner);
            $('.js-blog--pagination').addClass('shown');
          });
        }
      }
    });
  }

  // On initial page load:
  if (window.location.search.indexOf('?page=') !== -1) {
    populateArticles(window.location.pathname + window.location.search, true, true);
  } else {
    populateArticles(window.location.pathname, true, false);
  }

  if (window.location.pathname.indexOf(theme.blog.blogUrl + '/tagged') !== -1) {
    var currentTagLink = $('.js-blog--tag-link a[href="' + window.location.pathname + '"]');
    $('.js-blog--tag-link a').removeClass('active');
    currentTagLink.addClass('active');
    $('.tag-selector__tags').animate({scrollLeft: $('.js-blog--tag-link .active').parent().position().left - 50}, 500);
  }

  $('.js-blog--show-more a').on('click', function(e) {
    e.preventDefault();
    populateArticles($(this).attr('href'), false, false);
  });

  $('.js-blog--tag-link a').on('click', function(e) {
    e.preventDefault();
    $('.js-blog--tag-link a').removeClass('active');
    $(this).addClass('active');
    populateArticles($(this).attr('href'), true, false);

    if ($('.js-current-tag').length > 0) {
      $('.js-current-tag').html($(this).html());
    }

    scrollToPostsGridTop();
  });

  $('.js-blog--pagination').on('click', 'a', function(e){
    e.preventDefault();
    populateArticles($(this).attr('href'), true, true);

    scrollToPostsGridTop();
  });

  window.onpopstate = function(event) {
    // if (document.location.pathname.indexOf({{ blog.url | json }} + '/tagged') !== -1) {
    $('.js-blog--tag-link a').removeClass('active');
    $('.js-blog--tag-link a[href="' + document.location.pathname + '"]').addClass('active');
    // } else {

    // }

    if (document.location.search.indexOf('page=') !== -1) {
      populateArticles(document.location.pathname + document.location.search, true, true);
    } else {
      populateArticles(document.location.pathname, true, false);
    }

    scrollToPostsGridTop();
  };


  function setTagSelectorTopOffset() {
    var $tagSelector = $('.tag-selector'),
        $mobileStickyBar = $('.mobile-header-and-nav-container'),
        $desktopStickyBar = $('.desktop-header__bottom-row-wrapper');

    if ($mobileStickyBar.is(':visible')) {
      $tagSelector.css('top', $mobileStickyBar.outerHeight());
    }

    if ($desktopStickyBar.is(':visible')) {
//       $tagSelector.css('top', $desktopStickyBar.outerHeight());
    }
  }

  setTagSelectorTopOffset();

  $(window).on('resize', _.throttle(setTagSelectorTopOffset, 500));

});
