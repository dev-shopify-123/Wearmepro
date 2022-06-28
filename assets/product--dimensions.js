theme.Dimensions = (function () {
  /**
   *
   * @param {Function} $ jQuery
   * @param {jQuery} $container The dimensions’ container
   * @param {jQuery} $descriptionContainer The description’s container
   */
  function Dimensions($, $container, $descriptionContainer) {
    this.$ = $;
    this.$container = $container;
    this.$descriptionContainer = $descriptionContainer;

    this._initDimensions();
  };

  Dimensions.prototype = _.assignIn({}, Dimensions.prototype, {
    _initDimensions: function () {
      var $ = this.$;

      var descriptionEls;

      var dimensionsTitleEl;

      var frameWidthEl, lensWidthEl, lensHeightEl, templeSizeEl, bridgeEl;

      var frameWidth, lensWidth, lensHeight, templeSize;

      var bridgeWidth;

      var dimensionsEl;

      var dimensionsReady = false;

      $.expr[":"].contains = $.expr.createPseudo(function (arg) {
        return function (elem) {
          return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
      });

      function isUseableDimension (dimension) {
        if ((dimension !== '') && (dimension.toString() !== 'NaN')) {
          return true;
        }

        return false;
      }

      function findLastChild (query) {
        var result;

        result = descriptionEls.find(query).last();

        if (result.text() === '') {
          result = descriptionEls.parent().find(query).last();
        }

        return result;
      }

      descriptionEls = this.$descriptionContainer.children();

      var textBasedDimensionEls = [];

      dimensionsTitleEl = descriptionEls.filter(':contains("Dimensions")');
      frameWidthEl = findLastChild(':contains("width"):contains("frame")');
      lensWidthEl = findLastChild(':contains("width"):contains("lens")');
      lensHeightEl = findLastChild(':contains("height"):contains("lens")');
      templeSizeEl = findLastChild(':contains("temple"):contains("size")');
      bridgeEl = findLastChild(':contains("bridge")');

      
      
     
      
      frameWidthInch = frameWidthEl.next().text();
      lensWidthInch = lensWidthEl.next().text();
      lensHeightInch = lensHeightEl.next().text();
      templeSizeInch = templeSizeEl.next().text();  
      bridgeWidthInch = bridgeEl.next().text();



      textBasedDimensionEls.push(dimensionsTitleEl, frameWidthEl, lensWidthEl, lensHeightEl, templeSizeEl, bridgeEl);

      let re = /\((.*?)\)/i;

      frameWidth = parseInt(frameWidthEl.text().replace(/[^\d]/g, ''));
      lensWidth = parseInt(lensWidthEl.text().replace(/[^\d]/g, ''));
      lensHeight = parseInt(lensHeightEl.text().replace(/[^\d]/g, ''));
      templeSize = parseInt(templeSizeEl.text().replace(/[^\d]/g, ''));
      bridgeWidth = parseInt(bridgeEl.text().replace(/[^\d]/g, ''));

     
   
   

     

      
      

   

     
      

      if (isUseableDimension(frameWidth) &&
        isUseableDimension(lensWidth) &&
        isUseableDimension(lensHeight)) {
        dimensionsReady = true;
      }

      if (dimensionsReady === true) {

        dimensionsEl = this.$container;

        if (isNaN(bridgeWidth)) {
          $('g#bridge').hide();
        } else {
          $('text#bridge-text>tspan:first-child').text(bridgeWidth.toString() + ' mm');
        }
        console.log(bridgeWidth);
        $('text#lens>tspan:first-child').text(lensWidth.toString() + ' mm');
        
        $('text#width>tspan:first-child').text(frameWidth.toString() + ' mm');

        $('text#height>tspan:first-child').text(lensHeight.toString() + ' mm');

        if (isNaN(templeSize)) {
          $('.wmp-dimensions-side').hide();
          $('text#front-height-text>tspan').text(lensHeight.toString() + ' mm');
        } else {
          $('g#front-height').hide();
          $('text#temple>tspan:first-child').text(templeSize.toString() + ' mm');
        
        }

       

        dimensionsEl.addClass('wmp-dimensions--shown');
      }
     
      if($('div').hasClass('product-dimensions-one-img')){

       
        $('text#bridge-text>tspan:last-child').text(bridgeWidthInch.toString());        
        $('text#lens>tspan:last-child').text(lensWidthInch.toString());        
        $('text#width>tspan:last-child').text(frameWidthInch.toString());
        $('text#height>tspan:last-child').text(lensHeightInch.toString());
        $('text#temple>tspan:last-child').text( templeSizeInch.toString());
      }
    }
  });

  return Dimensions;
})();