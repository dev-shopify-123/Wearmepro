$(document).ready(function(){
    $('.image_content').slick({
        adaptiveHeight: true
    });
    $('.template-abner .product-section__variant-thumbnail').each(function(){
        var filter_alt = $(this).data('filter');
        if($(this).hasClass('is-active')) {
            $('.product-section__media-single.'+filter_alt).show();
        }
    })
    $('.template-abner .product-section__variant-thumbnail').on('click', function(){
        // var filter_alt = $(this).data('filter');
        // $('.product-section__variant-thumbnail').removeClass('is-active');
        // $(this).addClass('is-active');
        // $('.product-section__media-single').hide();
        // $('.product-section__media-single.'+filter_alt).show();
        var variant = 'variant='+$(this).data('variant-id');
        var location = window.location.href;
        if(location.indexOf('?') > 0) {
            window.location.href = location.split('?')[0]+"?"+variant;
        }else {
            window.location.href = window.location.href+"?"+variant;
        }
        
    })
})