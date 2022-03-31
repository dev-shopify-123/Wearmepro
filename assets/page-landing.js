jQuery('.product-section__variant-thumbnail').click(function (e){
    jQuery('.buy-it-now-button').attr('href', '/cart/'+ jQuery(this).data('variant-id')+':1')
});
// var el = document.querySelectorAll(".product-section__variant-thumbnail");
// for(var i =0; i < el.length; i++) {
//     (function(i) {
//         el[i].onclick = function() {
//             var id = this.getAttribute('data-variant-id');
//             var links = document.querySelectorAll('.buy-it-now-button')
//             for(var iterator =0; iterator < links.length; iterator++) {
//                 (function(iterator) {
//                     this.setAttribute('href', '/cart/'+ id +':1')
//                 })(iterator, id);
//             }
//             console.log(this.getAttribute('data-variant-id')) };
//     })(i);
// }

document.onscroll = function(){
    var what = document.querySelector("#scrollId").getBoundingClientRect().top + window.innerHeight;
    document.querySelector("#myBtn").classList.toggle("active", what  <= window.innerHeight);
}