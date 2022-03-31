var $ = j341;

$(document).ready(function () {
  $('.js-feedback').slick({
    dots: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
  });
});