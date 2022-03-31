

        /*!
       * jQuery Steps v1.1.0 - 09/04/2014
       * Copyright (c) 2014 Rafael Staib (http://www.jquery-steps.com)
       * Licensed under MIT http://www.opensource.org/licenses/MIT
       */
        !function(a,b){function c(a,b){o(a).push(b)}function d(d,e,f){var g=d.children(e.headerTag),h=d.children(e.bodyTag);g.length>h.length?R(Z,"contents"):g.length<h.length&&R(Z,"titles");var i=e.startIndex;if(f.stepCount=g.length,e.saveState&&a.cookie){var j=a.cookie(U+q(d)),k=parseInt(j,0);!isNaN(k)&&k<f.stepCount&&(i=k)}f.currentIndex=i,g.each(function(e){var f=a(this),g=h.eq(e),i=g.data("mode"),j=null==i?$.html:r($,/^\s*$/.test(i)||isNaN(i)?i:parseInt(i,0)),k=j===$.html||g.data("url")===b?"":g.data("url"),l=j!==$.html&&"1"===g.data("loaded"),m=a.extend({},bb,{title:f.html(),content:j===$.html?g.html():"",contentUrl:k,contentMode:j,contentLoaded:l});c(d,m)})}function e(a){a.triggerHandler("canceled")}function f(a,b){return a.currentIndex-b}function g(b,c){var d=i(b);b.unbind(d).removeData("uid").removeData("options").removeData("state").removeData("steps").removeData("eventNamespace").find(".actions a").unbind(d),b.removeClass(c.clearFixCssClass+" vertical");var e=b.find(".content > *");e.removeData("loaded").removeData("mode").removeData("url"),e.removeAttr("id").removeAttr("role").removeAttr("tabindex").removeAttr("class").removeAttr("style")._removeAria("labelledby")._removeAria("hidden"),b.find(".content > [data-mode='async'],.content > [data-mode='iframe']").empty();var f=a('<{0} class="{1}"></{0}>'.format(b.get(0).tagName,b.attr("class"))),g=b._id();return null!=g&&""!==g&&f._id(g),f.html(b.find(".content").html()),b.after(f),b.remove(),f}function h(a,b){var c=a.find(".steps li").eq(b.currentIndex);a.triggerHandler("finishing",[b.currentIndex])?(c.addClass("done").removeClass("error"),a.triggerHandler("finished",[b.currentIndex])):c.addClass("error")}function i(a){var b=a.data("eventNamespace");return null==b&&(b="."+q(a),a.data("eventNamespace",b)),b}function j(a,b){var c=q(a);return a.find("#"+c+V+b)}function k(a,b){var c=q(a);return a.find("#"+c+W+b)}function l(a,b){var c=q(a);return a.find("#"+c+X+b)}function m(a){return a.data("options")}function n(a){return a.data("state")}function o(a){return a.data("steps")}function p(a,b){var c=o(a);return(0>b||b>=c.length)&&R(Y),c[b]}function q(a){var b=a.data("uid");return null==b&&(b=a._id(),null==b&&(b="steps-uid-".concat(T),a._id(b)),T++,a.data("uid",b)),b}function r(a,c){if(S("enumType",a),S("keyOrValue",c),"string"==typeof c){var d=a[c];return d===b&&R("The enum key '{0}' does not exist.",c),d}if("number"==typeof c){for(var e in a)if(a[e]===c)return c;R("Invalid enum value '{0}'.",c)}else R("Invalid key or value type.")}function s(a,b,c){return B(a,b,c,v(c,1))}function t(a,b,c){return B(a,b,c,f(c,1))}function u(a,b,c,d){if((0>d||d>=c.stepCount)&&R(Y),!(b.forceMoveForward&&d<c.currentIndex)){var e=c.currentIndex;return a.triggerHandler("stepChanging",[c.currentIndex,d])?(c.currentIndex=d,O(a,b,c),E(a,b,c,e),D(a,b,c),A(a,b,c),P(a,b,c,d,e,function(){a.triggerHandler("stepChanged",[d,e])})):a.find(".steps li").eq(e).addClass("error"),!0}}function v(a,b){return a.currentIndex+b}function w(b){var c=a.extend(!0,{},cb,b);return this.each(function(){var b=a(this),e={currentIndex:c.startIndex,currentStep:null,stepCount:0,transitionElement:null};b.data("options",c),b.data("state",e),b.data("steps",[]),d(b,c,e),J(b,c,e),G(b,c),c.autoFocus&&0===T&&j(b,c.startIndex).focus(),b.triggerHandler("init",[c.startIndex])})}function x(b,c,d,e,f){(0>e||e>d.stepCount)&&R(Y),f=a.extend({},bb,f),y(b,e,f),d.currentIndex!==d.stepCount&&d.currentIndex>=e&&(d.currentIndex++,O(b,c,d)),d.stepCount++;var g=b.find(".content"),h=a("<{0}>{1}</{0}>".format(c.headerTag,f.title)),i=a("<{0}></{0}>".format(c.bodyTag));return(null==f.contentMode||f.contentMode===$.html)&&i.html(f.content),0===e?g.prepend(i).prepend(h):k(b,e-1).after(i).after(h),K(b,d,i,e),N(b,c,d,h,e),F(b,c,d,e),e===d.currentIndex&&E(b,c,d),D(b,c,d),b}function y(a,b,c){o(a).splice(b,0,c)}function z(b){var c=a(this),d=m(c),e=n(c);if(d.suppressPaginationOnFocus&&c.find(":focus").is(":input"))return b.preventDefault(),!1;var f={left:37,right:39};b.keyCode===f.left?(b.preventDefault(),t(c,d,e)):b.keyCode===f.right&&(b.preventDefault(),s(c,d,e))}function A(b,c,d){if(d.stepCount>0){var e=d.currentIndex,f=p(b,e);if(!c.enableContentCache||!f.contentLoaded)switch(r($,f.contentMode)){case $.iframe:b.find(".content > .body").eq(d.currentIndex).empty().html('<iframe src="'+f.contentUrl+'" frameborder="0" scrolling="no" />').data("loaded","1");break;case $.async:var g=k(b,e)._aria("busy","true").empty().append(M(c.loadingTemplate,{text:c.labels.loading}));a.ajax({url:f.contentUrl,cache:!1}).done(function(a){g.empty().html(a)._aria("busy","false").data("loaded","1"),b.triggerHandler("contentLoaded",[e])})}}}function B(a,b,c,d){var e=c.currentIndex;if(d>=0&&d<c.stepCount&&!(b.forceMoveForward&&d<c.currentIndex)){var f=j(a,d),g=f.parent(),h=g.hasClass("disabled");return g._enableAria(),f.click(),e===c.currentIndex&&h?(g._enableAria(!1),!1):!0}return!1}function C(b){b.preventDefault();var c=a(this),d=c.parent().parent().parent().parent(),f=m(d),g=n(d),i=c.attr("href");switch(i.substring(i.lastIndexOf("#")+1)){case"cancel":e(d);break;case"finish":h(d,g);break;case"next":s(d,f,g);break;case"previous":t(d,f,g)}}function D(a,b,c){if(b.enablePagination){var d=a.find(".actions a[href$='#finish']").parent(),e=a.find(".actions a[href$='#next']").parent();if(!b.forceMoveForward){var f=a.find(".actions a[href$='#previous']").parent();f._enableAria(c.currentIndex>0)}b.enableFinishButton&&b.showFinishButtonAlways?(d._enableAria(c.stepCount>0),e._enableAria(c.stepCount>1&&c.stepCount>c.currentIndex+1)):(d._showAria(b.enableFinishButton&&c.stepCount===c.currentIndex+1),e._showAria(0===c.stepCount||c.stepCount>c.currentIndex+1)._enableAria(c.stepCount>c.currentIndex+1||!b.enableFinishButton))}}function E(b,c,d,e){var f=j(b,d.currentIndex),g=a('<span class="current-info audible">'+c.labels.current+" </span>"),h=b.find(".content > .title");if(null!=e){var i=j(b,e);i.parent().addClass("done").removeClass("error")._selectAria(!1),h.eq(e).removeClass("current").next(".body").removeClass("current"),g=i.find(".current-info"),f.focus()}f.prepend(g).parent()._selectAria().removeClass("done")._enableAria(),h.eq(d.currentIndex).addClass("current").next(".body").addClass("current")}function F(a,b,c,d){for(var e=q(a),f=d;f<c.stepCount;f++){var g=e+V+f,h=e+W+f,i=e+X+f,j=a.find(".title").eq(f)._id(i);a.find(".steps a").eq(f)._id(g)._aria("controls",h).attr("href","#"+i).html(M(b.titleTemplate,{index:f+1,title:j.html()})),a.find(".body").eq(f)._id(h)._aria("labelledby",i)}}function G(a,b){var c=i(a);a.bind("canceled"+c,b.onCanceled),a.bind("contentLoaded"+c,b.onContentLoaded),a.bind("finishing"+c,b.onFinishing),a.bind("finished"+c,b.onFinished),a.bind("init"+c,b.onInit),a.bind("stepChanging"+c,b.onStepChanging),a.bind("stepChanged"+c,b.onStepChanged),b.enableKeyNavigation&&a.bind("keyup"+c,z),a.find(".actions a").bind("click"+c,C)}function H(a,b,c,d){return 0>d||d>=c.stepCount||c.currentIndex===d?!1:(I(a,d),c.currentIndex>d&&(c.currentIndex--,O(a,b,c)),c.stepCount--,l(a,d).remove(),k(a,d).remove(),j(a,d).parent().remove(),0===d&&a.find(".steps li").first().addClass("first"),d===c.stepCount&&a.find(".steps li").eq(d).addClass("last"),F(a,b,c,d),D(a,b,c),!0)}function I(a,b){o(a).splice(b,1)}function J(b,c,d){var e='<{0} class="{1}">{2}</{0}>',f=r(_,c.stepsOrientation),g=f===_.vertical?" vertical":"",h=a(e.format(c.contentContainerTag,"content "+c.clearFixCssClass,b.html())),i=a(e.format(c.stepsContainerTag,"steps "+c.clearFixCssClass,'<ul role="tablist"></ul>')),j=h.children(c.headerTag),k=h.children(c.bodyTag);b.attr("role","application").empty().append(i).append(h).addClass(c.cssClass+" "+c.clearFixCssClass+g),k.each(function(c){K(b,d,a(this),c)}),j.each(function(e){N(b,c,d,a(this),e)}),E(b,c,d),L(b,c,d)}function K(a,b,c,d){var e=q(a),f=e+W+d,g=e+X+d;c._id(f).attr("role","tabpanel")._aria("labelledby",g).addClass("body")._showAria(b.currentIndex===d)}function L(a,b,c){if(b.enablePagination){var d='<{0} class="actions {1}"><ul role="menu" aria-label="{2}">{3}</ul></{0}>',e='<li><a href="#{0}" role="menuitem">{1}</a></li>',f="";b.forceMoveForward||(f+=e.format("previous",b.labels.previous)),f+=e.format("next",b.labels.next),b.enableFinishButton&&(f+=e.format("finish",b.labels.finish)),b.enableCancelButton&&(f+=e.format("cancel",b.labels.cancel)),a.append(d.format(b.actionContainerTag,b.clearFixCssClass,b.labels.pagination,f)),D(a,b,c),A(a,b,c)}}function M(a,c){for(var d=a.match(/#([a-z]*)#/gi),e=0;e<d.length;e++){var f=d[e],g=f.substring(1,f.length-1);c[g]===b&&R("The key '{0}' does not exist in the substitute collection!",g),a=a.replace(f,c[g])}return a}function N(b,c,d,e,f){var g=q(b),h=g+V+f,j=g+W+f,k=g+X+f,l=b.find(".steps > ul"),m=M(c.titleTemplate,{index:f+1,title:e.html()}),n=a('<li role="tab"><a id="'+h+'" href="#'+k+'" aria-controls="'+j+'">'+m+"</a></li>");n._enableAria(c.enableAllSteps||d.currentIndex>f),d.currentIndex>f&&n.addClass("done"),e._id(k).attr("tabindex","-1").addClass("title"),0===f?l.prepend(n):l.find("li").eq(f-1).after(n),0===f&&l.find("li").removeClass("first").eq(f).addClass("first"),f===d.stepCount-1&&l.find("li").removeClass("last").eq(f).addClass("last"),n.children("a").bind("click"+i(b),Q)}function O(b,c,d){c.saveState&&a.cookie&&a.cookie(U+q(b),d.currentIndex)}function P(b,c,d,e,f,g){var h=b.find(".content > .body"),i=r(ab,c.transitionEffect),j=c.transitionEffectSpeed,k=h.eq(e),l=h.eq(f);switch(i){case ab.fade:case ab.slide:var m=i===ab.fade?"fadeOut":"slideUp",o=i===ab.fade?"fadeIn":"slideDown";d.transitionElement=k,l[m](j,function(){var b=a(this)._showAria(!1).parent().parent(),c=n(b);c.transitionElement&&(c.transitionElement[o](j,function(){a(this)._showAria()}).promise().done(g),c.transitionElement=null)});break;case ab.slideLeft:var p=l.outerWidth(!0),q=e>f?-p:p,s=e>f?p:-p;a.when(l.animate({left:q},j,function(){a(this)._showAria(!1)}),k.css("left",s+"px")._showAria().animate({left:0},j)).done(g);break;default:a.when(l._showAria(!1),k._showAria()).done(g)}}function Q(b){b.preventDefault();var c=a(this),d=c.parent().parent().parent().parent(),e=m(d),f=n(d),g=f.currentIndex;if(c.parent().is(":not(.disabled):not(.current)")){var h=c.attr("href"),i=parseInt(h.substring(h.lastIndexOf("-")+1),0);u(d,e,f,i)}return g===f.currentIndex?(j(d,g).focus(),!1):void 0}function R(a){throw arguments.length>1&&(a=a.format(Array.prototype.slice.call(arguments,1))),new Error(a)}function S(a,b){null==b&&R("The argument '{0}' is null or undefined.",a)}a.fn.extend({_aria:function(a,b){return this.attr("aria-"+a,b)},_removeAria:function(a){return this.removeAttr("aria-"+a)},_enableAria:function(a){return null==a||a?this.removeClass("disabled")._aria("disabled","false"):this.addClass("disabled")._aria("disabled","true")},_showAria:function(a){return null==a||a?this.show()._aria("hidden","false"):this.hide()._aria("hidden","true")},_selectAria:function(a){return null==a||a?this.addClass("current")._aria("selected","true"):this.removeClass("current")._aria("selected","false")},_id:function(a){return a?this.attr("id",a):this.attr("id")}}),String.prototype.format||(String.prototype.format=function(){for(var b=1===arguments.length&&a.isArray(arguments[0])?arguments[0]:arguments,c=this,d=0;d<b.length;d++){var e=new RegExp("\\{"+d+"\\}","gm");c=c.replace(e,b[d])}return c});var T=0,U="jQu3ry_5teps_St@te_",V="-t-",W="-p-",X="-h-",Y="Index out of range.",Z="One or more corresponding step {0} are missing.";a.fn.steps=function(b){return a.fn.steps[b]?a.fn.steps[b].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof b&&b?void a.error("Method "+b+" does not exist on jQuery.steps"):w.apply(this,arguments)},a.fn.steps.add=function(a){var b=n(this);return x(this,m(this),b,b.stepCount,a)},a.fn.steps.destroy=function(){return g(this,m(this))},a.fn.steps.finish=function(){h(this,n(this))},a.fn.steps.getCurrentIndex=function(){return n(this).currentIndex},a.fn.steps.getCurrentStep=function(){return p(this,n(this).currentIndex)},a.fn.steps.getStep=function(a){return p(this,a)},a.fn.steps.insert=function(a,b){return x(this,m(this),n(this),a,b)},a.fn.steps.next=function(){return s(this,m(this),n(this))},a.fn.steps.previous=function(){return t(this,m(this),n(this))},a.fn.steps.remove=function(a){return H(this,m(this),n(this),a)},a.fn.steps.setStep=function(){throw new Error("Not yet implemented!")},a.fn.steps.skip=function(){throw new Error("Not yet implemented!")};var $=a.fn.steps.contentMode={html:0,iframe:1,async:2},_=a.fn.steps.stepsOrientation={horizontal:0,vertical:1},ab=a.fn.steps.transitionEffect={none:0,fade:1,slide:2,slideLeft:3},bb=a.fn.steps.stepModel={title:"",content:"",contentUrl:"",contentMode:$.html,contentLoaded:!1},cb=a.fn.steps.defaults={headerTag:"h1",bodyTag:"div",contentContainerTag:"div",actionContainerTag:"div",stepsContainerTag:"div",cssClass:"wizard",clearFixCssClass:"clearfix",stepsOrientation:_.horizontal,titleTemplate:'<span class="number">#index#.</span> #title#',loadingTemplate:'<span class="spinner"></span> #text#',autoFocus:!1,enableAllSteps:!1,enableKeyNavigation:!0,enablePagination:!0,suppressPaginationOnFocus:!0,enableContentCache:!0,enableCancelButton:!1,enableFinishButton:!0,preloadContent:!1,showFinishButtonAlways:!1,forceMoveForward:!1,saveState:!1,startIndex:0,transitionEffect:ab.none,transitionEffectSpeed:200,onStepChanging:function(){return!0},onStepChanged:function(){},onCanceled:function(){},onFinishing:function(){return!0},onFinished:function(){},onContentLoaded:function(){},onInit:function(){},labels:{cancel:"Cancel",current:"current step:",pagination:"Pagination",finish:"Finish",next:"Next",previous:"Previous",loading:"Loading ..."}}}(jQuery);
  
          const prescriptionSelectState = {
            confirmSelection: false,
            finished: false
          }
          
          let imgFrame = jQuery('.product-section__variant-thumbnail.is-active').find('img').data('srcset');
          jQuery('.img-frame').attr('srcset', imgFrame);
          
          let priceVariant = jQuery('.product-section__variant-thumbnail.is-active').data('variant-price')*1;
          let priceVariantData = jQuery('.product-section__variant-thumbnail.is-active').data('variant-price');
          
          jQuery('.final-price span').html(priceVariant.toFixed(2));
          jQuery('.final-price').attr('data-price', priceVariantData.toFixed(2));
          jQuery('.title-price strong span').html(priceVariant.toFixed(2));
           let finalPrise = jQuery('.final-price span').html()*1;
          
          
          jQuery('.product-section__variant-thumbnail ').click(function () {           
            let imgFrame = jQuery(this).find('img').data('srcset');
            let priceVariant = jQuery(this).data('variant-price')*1;
            let priceVariantData = jQuery(this).data('variant-price');
            
            jQuery('.title-price strong span').html(priceVariant.toFixed(2));
           
            jQuery('.final-price span').html(priceVariant.toFixed(2));
            jQuery('.final-price').attr('data-price', priceVariantData.toFixed(2));
            jQuery('.img-frame').attr('srcset', imgFrame);
            
            setSubtotal();
            
          });

            jQuery(".holder-display").steps({
                headerTag: "h3",
                bodyTag: ".display",
                transitionEffect: "slideLeft",
                transitionEffectSpeed: 600,
                titleTemplate: '<span class="number">#index#</span> #title#',
                cssClass: 'tezs',
                onFinishing: function(event, currentIndex) {
                    return jQuery('#confirm').prop('checked') === true ? true : false;
                  
                  
                },
                // autoFocus: true,
              
              
            
              	onStepChanged: function (event, currentIndex, newIndex) {
                  
                  if (currentIndex === 0){
                      displayClick();
                    
                    }
                  
                },
                onStepChanging: function (event, currentIndex, newIndex) {
                    if (currentIndex > newIndex){
                        return true;
                    };



                    if (currentIndex === 4 || currentIndex === 5 ){
                        return true;
                    }
                  
     
                  
                 
                  
                  
                  if (currentIndex === 0){                      
                    
                       return true;
                    
                     

                    }


                    if (currentIndex === 1 ){
                      
                      selectStep();
                      if(jQuery( '#steps-uid-0-p-1' ).hasClass("next")){
                         return true;
                      }
                      
                       

                    }

                  if (currentIndex === 2 && jQuery( '#steps-uid-0-p-2 ' ).hasClass( "next" )){
                        return true;
                    }

                  if (currentIndex === 3 && jQuery( '#steps-uid-0-p-3 ' ).hasClass( "next" )){
                        return true;
                    }

                }

            });

            if( window.location.href.indexOf('#step-1')> -1) {
              jQuery('.product-section').hide();
              jQuery('.holder-product').css('display', 'flex');
                    let stepsH = jQuery('#steps-uid-0-p-0').height();
                          console.log(stepsH);
              jQuery('.holder-display .content').height(stepsH);
            } 
            
                      jQuery( ".show-steps" ).click(function () {
            jQuery('.product-section').hide();
            jQuery('.holder-product').css('display', 'flex');
                  let stepsH = jQuery('#steps-uid-0-p-0').height();
                        console.log(stepsH);
            jQuery('.holder-display .content').height(stepsH);
            
          });
            
            jQuery('.select-add').one( "change", function() {
              let selectAdd = jQuery(this).val();
              jQuery('.select-add').val(selectAdd);   
              jQuery('.select-add').removeClass('select-add');
                
              });
          
            document.querySelectorAll('img[data-template]').forEach(btn => {
              tippy(btn, {
                theme: 'light',
                  content(reference) {
                      const id = reference.getAttribute('data-template');
                      const template = document.getElementById(id);
                      return template.innerHTML;
                  },
                  allowHTML: true
              })
          })



          function hideSteps() {  
             		 jQuery('.holder-product').hide();
            jQuery('.product-section').css('display', 'flex');
//            jQuery(' .product-section__desktop-slideshow, .product-section__desktop-thumbnails').slick('slickUnfilter');

//           jQuery(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails').slick('slickGoTo', 0);
          jQuery(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails').slick('refresh');
                   
          }
        function displayClick() {  
          
          jQuery('.holder-display .actions ul li:first-child').addClass('hide');
          
        }
          
         displayClick();
            
             jQuery( ".title-products" ).click(function () {
               let title = jQuery(this).find('h2').data("title");
;
               
               jQuery('.variant-lens').text(title);
               
             });
         
           
         jQuery("body").on("click", '.hide-steps', function(e){
           jQuery('.show-steps').html('re-select lenses');
            hideSteps();
           e.preventDefault();

          });
          
           jQuery("body").on('click', '.holder-display .actions ul li', function(){
             jQuery('.holder-display .actions ul li:first-child').removeClass('hide');
          });


            function displayH() {
                let displayCurrentH =  jQuery(".display.current").innerHeight();
                jQuery('.holder-display .content ').height(displayCurrentH);
            }
            displayH();



            jQuery('#sow-input').change(function(){
              selectStep();
                if(jQuery(this).is(':checked')){
                    jQuery(".select-hide").show();
                    jQuery('.select-show').hide();
                }
                else{
                    jQuery(".select-hide").hide();
                    jQuery('.select-show').show();
                }
            });
           
            jQuery('#sow-input2').change(function(){
              selectStep();
                // TODO: transfer some functionality from this callback to setSubtotal function.
                if(jQuery(this).is(':checked')){
                    jQuery(".row-hide").show();
                    displayH();


                }else{
                    jQuery(".row-hide").hide();
                    jQuery('#add-lenses').html('');
                    displayH();
                }
            });





            function selectVals() {
                let selectName = jQuery(this).attr('name');
                let selectValues = jQuery(this).val();
                jQuery( "table td" ).each(function() {
                    if(jQuery(this).attr('id') == selectName){
                        jQuery(this).html(selectValues);
                    }
                });

            }
            
            
          
            

          jQuery( "select" ).change(function() {
            let selectValue1 = jQuery('select[name=od_sph]').val()*1;
            let selectValue2 = jQuery('select[name=od_cyl]').val()*1;
            let selectValue3 = jQuery('select[name=os_sph]').val()*1;
            let selectValue4 = jQuery('select[name=os_cyl]').val()*1;

            jQuery('.hiden-row').removeClass('no-disabled');
            jQuery('.hiden-row').removeClass('click-row');
            jQuery('.hiden-row input').prop("disabled", true);
            
            selectStep();


          });
          

			jQuery( "select[name=od_cyl]" ).change(function() {    
                
              if( jQuery(this).val()*1 !== 0){
                jQuery('select[name=od_axis]').prop("disabled", false);
              }
              if( jQuery(this).val()*1 == 0){
                jQuery('select[name=od_axis]').prop("disabled", true);
                jQuery('select[name=od_axis] option:contains("–")').prop('selected', true);
                selectStep();
              }
			});
          	jQuery( "select[name=os_cyl]" ).change(function() {
				if( jQuery(this).val()*1 !== 0){
                jQuery('select[name=os_axis]').prop("disabled", false);
              }
              if( jQuery(this).val()*1 == 0){
                jQuery('select[name=os_axis]').prop("disabled", true);
                jQuery('select[name=os_axis] option:contains("–")').prop('selected', true);
                selectStep();
              }
				
			});
            
            jQuery( "select[name=od_v_prism]" ).change(function() {              
              if( jQuery(this).val()*1 !== 0){
                jQuery('select[name=od_v_direction]').prop("disabled", false);
              }
              if( jQuery(this).val()*1 == 0){
                jQuery('select[name=od_v_direction]').prop("disabled", true);
                jQuery('select[name=od_v_direction] option:contains("n/a")').prop('selected', true);
              }
			});
            
            jQuery( "select[name=os_v_prism]" ).change(function() {              
              if( jQuery(this).val()*1 !== 0){
                jQuery('select[name=os_v_direction]').prop("disabled", false);
              }
              if( jQuery(this).val()*1 == 0){
                jQuery('select[name=os_v_direction]').prop("disabled", true);
                jQuery('select[name=os_v_direction] option:contains("n/a")').prop('selected', true);
              }
			});
            
            jQuery( "select[name=od_h_prism]" ).change(function() {              
              if( jQuery(this).val()*1 !== 0){
                jQuery('select[name=od_h_direction]').prop("disabled", false);
              }
              if( jQuery(this).val()*1 == 0){
                jQuery('select[name=od_h_direction]').prop("disabled", true);
                jQuery('select[name=od_h_direction] option:contains("n/a")').prop('selected', true);
              }
			});
            
            jQuery( "select[name=os_h_prism]" ).change(function() {              
              if( jQuery(this).val()*1 !== 0){
                jQuery('select[name=os_h_direction]').prop("disabled", false);
              }
              if( jQuery(this).val()*1 == 0){
                jQuery('select[name=os_h_direction]').prop("disabled", true);
                jQuery('select[name=os_h_direction] option:contains("n/a")').prop('selected', true);
              }
			});

          
          	function selectStep() {  
              let selectAddOd;
              let selectAddOs;
              let selectAdd;
              let selectCylOd;
              let selectCylOs;
              let selectCyl;
              let selectPD;
              let selectPrism;

              

              
              
              //a) check

              
              if(jQuery('select[name=od_cyl]').val()*1 !== 0  ){
                if(jQuery('select[name=od_axis]').val() > 0  ){
                  selectCylOd = 1;
                  jQuery('select[name=od_axis]').removeClass('error');
                }else {
                  selectCylOd = 0;
                  jQuery('select[name=od_axis]').addClass('error');
                }
               
              }else{
                jQuery('select[name=od_axis]').removeClass('error');
               selectCylOd = 0;       
              }
              
               if(jQuery('select[name=os_cyl]').val()*1 !== 0  ){
                if(jQuery('select[name=os_axis]').val() > 0  ){
                  selectCylOs = 1;
                  jQuery('select[name=os_axis]').removeClass('error');
                }else {
                  selectCylOs = 0;
                  jQuery('select[name=os_axis]').addClass('error');
                }
               }else {
                 jQuery('select[name=os_axis]').removeClass('error');
                  selectCylOs = 0;
               }
              
              if(selectCylOd > 0 || selectCylOs > 0 ){
                selectCyl = 1;
              }else {
                selectCyl = 0;
              }
              
              //b) check 
              
              
              
              
              if(jQuery('select[name=od_add]').val() > 0 ){
                selectAddOd = true;
              }else {
                selectAddOd = false;
              }
               if(jQuery('select[name=os_add]').val() > 0){
                selectAddOs = true;
              }else {
                selectAddOs = false;
              }
              
              if(selectAddOd == true && selectAddOs == true || selectAddOd == false && selectAddOs == false){
                selectAdd = 1;
              }else {
                selectAdd = 0;
              }
              
              if(selectAddOd == true && selectAddOs == false ){
                jQuery('select[name=os_add]').addClass('error');
              }else {
                jQuery('select[name=os_add]').removeClass('error');
              }
              if(selectAddOd == false && selectAddOs == true ){
                jQuery('select[name=od_add]').addClass('error');
              }else {
                jQuery('select[name=od_add]').removeClass('error');
              }
              
              //c) check 
                 if (jQuery('#sow-input:checked').length == 0) {
                   if(jQuery('select[name=pd]').val() > 0 ){
                     jQuery('select[name=pd]').removeClass('error');
                   }else {
                     jQuery('select[name=pd]').addClass('error');
                   }
                 }else{
                   jQuery('select[name=pd]').removeClass('error');
                   if(jQuery('select[name=od_pd]').val() > 0 && jQuery('select[name=os_pd]').val() > 0 ){
                     selectPD = 1;
                   }else {
                    selectPD = 0; 
                   }
                   if(jQuery('select[name=od_pd]').val() > 0  ){                  
                    jQuery('select[name=od_pd]').removeClass('error');
                  }else {                  
                    jQuery('select[name=od_pd]').addClass('error');
                  }
                  if(jQuery('select[name=os_pd]').val() > 0  ){                  
                    jQuery('select[name=os_pd]').removeClass('error');
                  }else {                  
                    jQuery('select[name=os_pd]').addClass('error');
                  }
                 }
              
             	
             
             
              

             	
              
         if (jQuery('#sow-input2:checked').length == 0) {
            jQuery('select[name=od_v_prism]').removeClass('error');
                  jQuery('select[name=os_v_prism]').removeClass('error');
                  jQuery('select[name=od_h_prism]').removeClass('error');
                  jQuery('select[name=os_h_prism]').removeClass('error');
           
         }else {
           
           	if(jQuery('select[name=od_v_prism]').val() == 0 && jQuery('select[name=os_v_prism]').val() == 0 && jQuery('select[name=od_h_prism]').val() == 0 && jQuery('select[name=os_h_prism]').val() == 0 ){
                  
                  jQuery('select[name=od_v_prism]').addClass('error');
                  jQuery('select[name=os_v_prism]').addClass('error');
                  jQuery('select[name=od_h_prism]').addClass('error');
                  jQuery('select[name=os_h_prism]').addClass('error');
                }else {
                  
                  jQuery('select[name=od_v_prism]').removeClass('error');
                  jQuery('select[name=os_v_prism]').removeClass('error');
                  jQuery('select[name=od_h_prism]').removeClass('error');
                  jQuery('select[name=os_h_prism]').removeClass('error');
                  
                }
           
              if(jQuery('select[name=od_v_prism]').val()*1 !== 0  ){
                if(jQuery('select[name=od_v_direction]').val() > 0  ){
                 
                  jQuery('select[name=od_v_direction]').removeClass('error');
                }else {
                  
                  jQuery('select[name=od_v_direction]').addClass('error');
                }
               
              }else {
                jQuery('select[name=od_v_direction]').removeClass('error');
              }
           
           if(jQuery('select[name=os_v_prism]').val()*1 !== 0  ){
                if(jQuery('select[name=os_v_direction]').val() > 0  ){
                 
                  jQuery('select[name=os_v_direction]').removeClass('error');
                }else {
                  
                  jQuery('select[name=os_v_direction]').addClass('error');
                }
               
           }else {
             jQuery('select[name=os_v_direction]').removeClass('error');
           }
           
           if(jQuery('select[name=od_h_prism]').val()*1 !== 0  ){
                if(jQuery('select[name=od_h_direction]').val() > 0  ){
                 
                  jQuery('select[name=od_h_direction]').removeClass('error');
                }else {
                  
                  jQuery('select[name=od_h_direction]').addClass('error');
                }
               
           }else {
             jQuery('select[name=od_h_direction]').removeClass('error');
           }
           
           if(jQuery('select[name=os_h_prism]').val()*1 !== 0  ){
                if(jQuery('select[name=os_h_direction]').val() > 0  ){
                 
                  jQuery('select[name=os_h_direction]').removeClass('error');
                }else {
                  
                  jQuery('select[name=os_h_direction]').addClass('error');
                }
               
           }else {
             jQuery('select[name=os_h_direction]').removeClass('error');
           }
         }
              
              
//               if( (selectCyl + selectAdd + selectPD + selectPrism) == 4){
//                 jQuery( '.current ' ).addClass('next');
//               }else{
//                 jQuery( '.current ' ).removeClass('next');
//               }

              if(jQuery('select[name=od_add]').val() > 0 && jQuery('select[name=os_add]').val() > 0 ){ 
                              
                            
                if(jQuery( ".usage .btn" ).hasClass( "active" )){
                  jQuery('.usage ').removeClass('error');
                }else {
                  jQuery('.usage ').addClass('error');
                }
                
                jQuery('.usage').show();
                displayH(); 
              }else {
                jQuery('.usage ').removeClass('error');
                jQuery('.usage').hide();
                displayH(); 
              }
              
              
          		
              if(jQuery( 'select' ).hasClass( "error" ) || jQuery( '.row' ).hasClass( "error" )) {
                    jQuery('.error-text').show();
                jQuery( '.current ' ).removeClass('next');
              }else {
                 jQuery('.error-text').hide();
                jQuery( '.current ' ).addClass('next');
              }
              
             }
          

          


			jQuery("body").on("click", ".click-row",function(){

              jQuery(this).parents('.body').find('.click-row').removeClass('active');
              jQuery(this).addClass('active');
              jQuery( '.current ' ).addClass('next');
              if(jQuery(this).hasClass("hiden-row")){
                let namePackage = jQuery(this).find('.name-lens-package').html();
                let pricePackage = jQuery(this).find('.price-lens-package').html();

                jQuery('.name-lens-package-text').html(namePackage);
                jQuery('.price-lens-package-text').html(pricePackage);
              }




            });

            jQuery('select').change(selectVals);
            jQuery('input[name=od_axis]').on('keyup',function(){
                jQuery('#od_axis').html(jQuery(this).val());
            });
            jQuery( ".color-lenses li" ).click(function () {
                let imgSrc = jQuery(this).data("src");
                jQuery('figure img').attr('src',imgSrc)
            });

// populate first table with data
            function populateFirstTable(data) {
                jQuery('.right-sph').text(jQuery('select[name=od_sph]').find(":selected").text());
                jQuery('.left-sph').text(jQuery('select[name=os_sph]').find(":selected").text());
                jQuery('.right-cyl').text(jQuery('select[name=od_cyl]').find(":selected").text());
                jQuery('.left-cyl').text(jQuery('select[name=os_cyl]').find(":selected").text());
                jQuery('.right-axis').text(jQuery('select[name=od_axis]').find(":selected").text());
                jQuery('.left-axis').text(jQuery('select[name=os_axis]').find(":selected").text());
                jQuery('.right-add').text(jQuery('select[name=od_add]').find(":selected").text());
                jQuery('.left-add').text(jQuery('select[name=os_add]').find(":selected").text());

                if (jQuery('#sow-input:checked').length == 0) {
                    jQuery('.right-pd').css({display: 'none'});
                    jQuery('.left-pd').css({display: 'none'});
                    jQuery('.right-pd').html('');
                    jQuery('.left-pd').html('');

                    jQuery('.single-pd').css({display: 'table-cell'});
                    jQuery('.single-pd').html(jQuery('select[name=pd]').find(":selected").text());
                } else {
                    jQuery('.single-pd').css({display: 'none'});
                    jQuery('.single-pd').html('');

                    jQuery('.right-pd').css({display: 'table-cell'});
                    jQuery('.left-pd').css({display: 'table-cell'});

                    jQuery('.right-pd').html(jQuery('select[name=od_pd]').find(":selected").text());
                    jQuery('.left-pd').html(jQuery('select[name=os_pd]').find(":selected").text());
                };
            };

// populate prism table with data
            function populatePrismTable(data) {
                if (jQuery('#sow-input2:checked').length !== 0) {
                    jQuery('.prism-activated').css({display: 'table'});

                    jQuery('.right-v-prism').html(jQuery('select[name=od_v_prism]').find(":selected").text());
                    jQuery('.left-v-prism').html(jQuery('select[name=os_v_prism]').find(":selected").text());
                    jQuery('.right-v-direction').html(jQuery('select[name=od_v_direction]').find(":selected").text());
                    jQuery('.left-v-direction').html(jQuery('select[name=os_v_direction]').find(":selected").text());
                    jQuery('.right-h-prism').html(jQuery('select[name=od_h_prism]').find(":selected").text());
                    jQuery('.left-h-prism').html(jQuery('select[name=os_h_prism]').find(":selected").text());
                    jQuery('.right-h-direction').html(jQuery('select[name=od_h_direction]').find(":selected").text());
                    jQuery('.left-h-direction').html(jQuery('select[name=os_h_direction]').find(":selected").text());
                } else {
                    jQuery('.prism-activated').css({display: 'none'});

                    jQuery('.right-v-prism').html('');
                    jQuery('.left-v-prism').html('');
                    jQuery('.right-v-direction').html('');
                    jQuery('.left-v-direction').html('');
                    jQuery('.right-h-prism').html('');
                    jQuery('.left-h-prism').html('');
                    jQuery('.right-h-direction').html('');
                    jQuery('.left-h-direction').html('');
                };
            };

//calc
            jQuery( ".holder-display .actions a, .holder-display .steps a" ).click(function () {
                displayH();
                let eye = parseInt(jQuery('.eye').val());
                let dbl = parseInt(jQuery('.dbl').val());
                let b = parseInt(jQuery('.b').val());
                let ed = parseInt(jQuery('.ed').val());


                let calcOD = (eye + dbl) / 2 -  jQuery('select[name=od_pd]').val();
                let calcOS = (eye + dbl) / 2 -  jQuery('select[name=os_pd]').val();
                let odSHP = jQuery('select[name=od_sph]').val();
                let osSHP = jQuery('select[name=os_sph]').val();
                let odSYL = jQuery('select[name=od_cyl]').val();
                let osSYL = jQuery('select[name=os_cyl]').val();
                let odVprism = jQuery('select[name=od_v_prism]').val();
                let osVprism = jQuery('select[name=os_v_prism]').val();
              
              	let odHprism = jQuery('select[od_h_prism]').val();
                let osHprism = jQuery('select[os_h_prism]').val();



                // for table
                let odAxis = parseInt(jQuery('select[name=od_axis]').val());
                let osAxis = parseInt(jQuery('select[name=os_axis]').val());
                let odAdd = parseInt(jQuery('select[name=od_add]').val());
                let osAdd = parseInt(jQuery('select[name=os_add]').val());
                let pd = parseInt(jQuery('select[name=pd]').val());
                let odPd = parseInt(jQuery('select[name=od_pd]').val());
                let osPd = parseInt(jQuery('select[name=os_pd]').val());
                let odVdirection = parseInt(jQuery('select[name=od_v_direction]').val());
                let osVdirection = parseInt(jQuery('select[name=os_v_direction]').val());
                let odHdirection = parseInt(jQuery('select[name=od_h_direction]').val());
                let osHdirection = parseInt(jQuery('select[name=os_h_direction]').val());
                let odHprismm = parseInt(jQuery('select[name=od_h_prism]').val());
                let osHprismm = parseInt(jQuery('select[name=os_h_prism]').val());




                // for table
                // first table
                let firstTableData = {
                    'odSHP': odSHP,
                    'osSHP': osSHP,
                    'odSYL': odSYL,
                    'osSYL': osSYL,
                    'odAxis': odAxis,
                    'osAxis': osAxis,
                    'odAdd': odAdd,
                    'osAdd': osAdd,
                    'pd': pd,
                    'odPd': odPd,
                    'osPd': osPd
                };
                let prismTable = {
                    'odVprism': odVprism,
                    'osVprism': osVprism,
                    'odVdirection': odVdirection,
                    'osVdirection': osVdirection,
                    'odHprismm': odHprismm,
                    'osHprismm': osHprismm,
                    'odHdirection': odHdirection,
                    'osHdirection': osHdirection
                };
                populateFirstTable(firstTableData);
                populatePrismTable(prismTable);


                jQuery('input[name=od]').val(calcOD);
                jQuery('#od').val(calcOD);
                jQuery('input[name=os]').val(calcOS);
                jQuery('#os').val(calcOS);
                let calcMBod  = (calcOD * 2) + ed + 2;
                let calcMBos  = (calcOS * 2) + ed + 2;
                jQuery('input[name=mb-od]').val(calcMBod);
                jQuery('#mb-od').val(calcMBod);
                jQuery('input[name=mb-os]').val(calcMBos);
                jQuery('#mb-os').val(calcMBos);
                let mbOd =  calcMBod;
                let mbOs =  calcMBos;





			//Custom Lens
                if(mbOd > 65 || mbOs > 65){
                  jQuery('#custom-l').val('1');
                  console.log('Custom Lens' + 1);
                }else {
                  jQuery('#custom-l').val('0');
                  console.log('Custom Lens' + 0);
                }

              //Custom Sphere
                if (odSHP > -5 && odSHP < 3 || osSHP > -5 && osSHP < 3) {
                    jQuery('#custom-s').val('1');
                  console.log('Custom Sphere' + 1);
                  
                }else {
                    jQuery('#custom-s').val('0');
                   console.log('Custom Sphere' + 0);
                }
              //Custom Cylinder
                if(odSYL > -2 && odSYL < 2 || osSYL > -2 && osSYL < 2 ){
                    jQuery('#custom-c').val('1');
                  	console.log('Custom Cylinder' + 1);
                }else {
                    jQuery('#custom-c').val('0');
                  	console.log('Custom Cylinder' + 0);
                }
              //Custom Prism
                if(odVprism > 0.5 || osVprism > 0.5 || odHprism > 0.5 || osHprism > 0.5){
                    jQuery('#custom-p').val('1');
                  	console.log('Custom Prism' + 1);
                }else{
                    jQuery('#custom-p').val('0');
                  	console.log('Custom Prism' + 0);
                }

              //High Rx Power
                if(odSHP > -6 && odSHP < 4 || odSYL < 5 && odSYL > -5 || osSYL < 5 && osSYL > -5 || (odVprism + osVprism + odHprism + osHprism) > 4){
                    jQuery('#high-power').val('1');
                  	console.log('High Rx Power' + 1);
                }else {
                    jQuery('#high-power').val('0');
                  	console.log('High Rx Power' + 0);
                }

              // Custom Rx

              if(jQuery('#custom-l').val() > 0 || jQuery('#custom-c').val() > 0 ||  jQuery('#custom-p').val() > 0 || jQuery('#high-power').val() > 0) {
                jQuery('#steps-uid-0-p-3 .custom-rx-1 .hiden-row').addClass('no-disabled').addClass('click-row');
                jQuery('#steps-uid-0-p-3 .custom-rx-1 .hiden-row input').prop("disabled", false);
                jQuery('#steps-uid-0-p-3 .custom-rx-0').hide();
                jQuery('#steps-uid-0-p-3 .custom-rx-1').show();
                console.log('Custom Rx ' + 1);
              }else {
                jQuery('#steps-uid-0-p-3 .custom-rx-0 .hiden-row').addClass('no-disabled').addClass('click-row');
                 jQuery('#steps-uid-0-p-3 .custom-rx-0 .hiden-row input').prop("disabled", false);
                jQuery('#steps-uid-0-p-3 .custom-rx-1').hide();
                jQuery('#steps-uid-0-p-3 .custom-rx-0').show();
                console.log('Custom Rx ' + 0);
                
              }


            });

// popup step
            jQuery( ".holder-display .actions li:last-child a" ).addClass('erorr-popup');
            jQuery('input[name=price-step2]').change(function(){
                if(jQuery(this).is(':checked')){
                    jQuery( ".holder-display .actions li:last-child a" ).removeClass('erorr-popup');
                    // jQuery( ".holder-display .actions li:last-child a" ).addClass('add-popup');

                    // for table
                    jQuery( ".holder-display .actions li:last-child a" ).addClass('open-side-container');

                    let PricePopupChecked =  jQuery(this).data('price-without-currency')*1;
                    let PricePopup = PricePopupChecked.toFixed(2);
                    jQuery('.final-price span').html(PricePopup);
                };
            });

            /* jQuery("body").on("click", ".add-popup",function(){
                jQuery('.popup-step-add').addClass('visible');
            }); */

// for table
            jQuery("body").on("click", ".open-side-container",function(){
              	jQuery('.holder-product .col-left, .holder-product .col-right').hide();
                jQuery('.side-container').addClass('side-container_visible');
            });

            jQuery("body").on("click", ".holder-display .erorr-popup",function(){
                jQuery('.popup-step-erorr').addClass('visible');

            });

            /* jQuery( ".holder-display .erorr-popup" ).click(function () {
              jQuery('.popup-step-erorr').addClass('visible');
            });  */

            jQuery(".popup-step").click("click", function () {
                jQuery(".popup-step").removeClass("visible");

                // for table
                jQuery('.side-container').removeClass('side-container_visible');
               jQuery('.holder-product .col-left, .holder-product .col-right').show();
            });

            jQuery(".popup-step .close").click("click", function () {
                jQuery(".popup-step").removeClass("visible");
            });

// for table
            jQuery("body").on("click", ".side-container .edit-lenses",function(){
                jQuery('.side-container').removeClass('side-container_visible');
               jQuery('.holder-product .col-left, .holder-product .col-right').show();
                jQuery('.add-to-cart-prescription').removeClass('added');
            });

            jQuery(".popup-step-content").click("click", function (e) {
                e.stopPropagation();
            });

// for table
            function setSubtotal() {
                let prismPrice = 0;
              	let lensPrice = 0;
                let lensTypePrice = 0;
              	let priceService1 = 0;
              	let priceService2 = 0;
                let sum = 0;
                let finalPrise =  jQuery('.final-price span').html()*1;

                jQuery('#sow-input2').on('change', function() {
                    if (jQuery(this).prop('checked')) {
                        prismPrice = jQuery(this).data('price-without-currency')*1;
                        sum = finalPrise + prismPrice + lensPrice + lensTypePrice + priceService1 + priceService2;

                        // TODO: transfer prism displaying functionality to it's function
                        jQuery('.prism').css({display: 'flex'});
                        jQuery('.prism strong span').html(prismPrice.toFixed(2));

                        jQuery('.final-price span').html(sum.toFixed(2));
                        jQuery('.subtotal strong span').html(sum.toFixed(2));

                        console.table({
                            'prismPrice': prismPrice,
                            'lensTypePrice': lensTypePrice,
                            'finalPrise': finalPrise,
                            'sum': sum.toFixed(2),
                        });
                    } else {
                        sum = sum - prismPrice;
                        prismPrice = 0;

                        // TODO: transfer prism displaying functionality to it's function
                        jQuery('.prism').css({display: 'none'});
                        jQuery('.prism strong span').html('');

                        jQuery('.final-price span').html(sum.toFixed(2));
                        jQuery('.subtotal strong span').html(sum.toFixed(2));


                    }
                });

              jQuery('input[name="price-step1"]').on('change', function() {
                    lensPrice = jQuery(this).data('price-diff-without-currency')*1;
                    sum = finalPrise + prismPrice + lensPrice + lensTypePrice + priceService1 + priceService2;
                
                
 jQuery('.variant-lens-price').html(lensPrice.toFixed(2));
                    jQuery('.final-price span').html(sum.toFixed(2));
                    jQuery('.subtotal strong span').html(sum.toFixed(2));


                    if(jQuery(this).data('add-service') == 1){
                      jQuery('.blue-filter').show();
                    }else {
                      jQuery('.blue-filter').hide();
                        if( jQuery('#blue-filter').prop('checked', true )){
                            jQuery('#blue-filter').click();
                        }
                    }


                });

                jQuery('input[name="price-step2"]').on('change', function() {
                    lensTypePrice = jQuery(this).data('price-diff-without-currency')*1;
                    sum = finalPrise + prismPrice + lensPrice + lensTypePrice + priceService1 + priceService2;

                    jQuery('.final-price span').html(sum.toFixed(2));
                    jQuery('.subtotal strong span').html(sum.toFixed(2));

                  	if(jQuery(this).data('add-service') == 1){
                      jQuery('.anti-reflective').show();
                    }else {
                      jQuery('.anti-reflective').hide();
                      if( jQuery('#anti-reflective').prop('checked', true) ){
                          jQuery('#anti-reflective').click();
                      }
                    }


                });



              jQuery('#anti-reflective').on('change', function() {
                if (jQuery(this).prop('checked')) {
                    priceService1 =  jQuery(this).data('price-diff-without-currency')*1;
                   sum = finalPrise + prismPrice + lensPrice + lensTypePrice + priceService1 + priceService2;

                    jQuery('.final-price span').html(sum.toFixed(2));
                    jQuery('.subtotal strong span').html(sum.toFixed(2));
                }else {
                   priceService1 = 0*1;
                   sum = finalPrise + prismPrice + lensPrice + lensTypePrice + priceService1 + priceService2;

                    jQuery('.final-price span').html(sum.toFixed(2));
                    jQuery('.subtotal strong span').html(sum.toFixed(2));
                }



                });


              jQuery('#blue-filter').on('change', function() {
                     if (jQuery(this).prop('checked')) {
                    priceService2 =  jQuery(this).data('price-diff-without-currency')*1;
                   sum = finalPrise + prismPrice + lensPrice + lensTypePrice + priceService1 + priceService2;

                    jQuery('.final-price span').html(sum.toFixed(2));
                    jQuery('.subtotal strong span').html(sum.toFixed(2));
                }else {
                   priceService2 = 0*1;
                   sum = finalPrise + prismPrice + lensPrice + lensTypePrice + priceService1 + priceService2;

                    jQuery('.final-price span').html(sum.toFixed(2));
                    jQuery('.subtotal strong span').html(sum.toFixed(2));
                }
                });


            };
            setSubtotal();


// toggle finish disabled state
            function toggleFinishDisabled() {
                jQuery('.holder-display .actions li a[href="#finish"]').addClass('disabled').closest('li').addClass('disabled');
                jQuery('#confirm').on('change', function() {
                    if (jQuery(this).prop('checked')) {
                        prescriptionSelectState.finished = true;
                        jQuery('.holder-display .actions li a[href="#finish"]').removeClass('disabled').closest('li').removeClass('disabled');
                    } else {
                        jQuery('.holder-display .actions li a[href="#finish"]').addClass('disabled').closest('li').addClass('disabled');
                    }
                });
            }
            toggleFinishDisabled();


        jQuery('.non-prescription').click(function (){
            jQuery('.hidden-buttons').removeClass('hidden-buttons')
        })
            //addToCart

            var symbol = theme.moneyFormat.split('{')[0];
        function addToCart() {
            let item = jQuery('.product-section__variant-thumbnail.is-active').data('variant-id');
            let uniqueId = new Date().getTime(),
                title = jQuery('.product-section__title').html();
            let od_sph = jQuery('.right-sph').text(),
                os_sph =jQuery('.left-sph').text(),
                od_cyl = jQuery('.right-cyl').text(),
                os_cyl = jQuery('.left-cyl').text(),
                od_axis = jQuery('.right-axis').text(),
                os_axis = jQuery('.left-axis').text(),
                od_add = jQuery('.right-add').text(),
                os_add = jQuery('.left-add').text(),
                od_pd = jQuery('.right-pd').html(),
                os_pd = jQuery('.left-pd').html(),
                pd = jQuery('.single-pd').html(),
                usage = jQuery('input[name=usage]:checked').val(),
                od_v_prism = jQuery('.right-v-prism').html(),
                os_v_prism = jQuery('.left-v-prism').html(),
                od_v_direction = jQuery('.right-v-direction').html(),
                os_v_direction = jQuery('.left-v-direction').html(),
                od_h_prism = jQuery('.right-h-prism').html(),
                os_h_prism = jQuery('.left-h-prism').html(),
                od_h_direction = jQuery('.right-h-direction').html(),
                os_h_direction = jQuery('.left-h-direction').html();
                let formData = {
                  'items': [
                      {
                          'id': item,
                          'quantity': 1,
                          'properties': {
                              'OD_SPH': od_sph,                            
                              'OD_CYL': od_cyl,                           
                              'OD_AXIS': od_axis,                            
                              'OD_ADD': od_add,                            
                             
                              
                              'OD_V_Prism': od_v_prism,                            
                              'OD_V_Direction': od_v_direction,                            
                              'OD_H_Prism': od_h_prism,                            
                              'OD_H_Direction': od_h_direction,
                              'OD_PD': od_pd,
  
                              'OS_SPH': os_sph,
                              'OS_CYL': os_cyl,
                              'OS_AXIS': os_axis,
                              'OS_ADD': os_add,  
                                                       
                              'OS_V_Prism': os_v_prism,
                              'OS_V_Direction': os_v_direction,
                              'OS_H_Prism': os_h_prism,
                              'OS_H_Direction': os_h_direction,
  
                              
                              'OS_PD': os_pd,
                              'PD': pd,
                              'Lenses': usage,
                              'product_prism': '',
                              'product_1': '',
                              'product_2': '',
                              '_unique_id' : uniqueId,
                              '_child_id': 0,
                              'confirmed': prescriptionSelectState.confirmSelection,
                              'finished': prescriptionSelectState.finished
                          }
                      }
                  ]
              };
            let check = jQuery('#sow-input2:checked');
            let addPrizm = {
                'id': check.data('id'),
                'quantity': 1,
                'properties': {
                   
                    '_unique_id' : uniqueId,
                    'parent': title,
                    '_parent_id': 0,
                }
            }
            if( check.length === 1 ) {
                addPrizm.properties._parent_id = item;
                for ( let i in formData.items){
                    if(formData.items[i].id == item){
                        formData.items[i].properties._child_id = jQuery('#sow-input2').data('id')
                        formData.items[i].properties.product_prism = check.data('title');
                    }
                }
            }else{
                formData.items[0].properties._child_id = 0;
                for ( let i in formData.items){
                    if(formData.items[i].id == item){
                        formData.items[i].properties._child_id = 0
                        formData.items[i].properties.product_prism = '';
                    }
                }
                addPrizm.properties._parent_id = 0;
            }
            if(check.length){
                formData.items.unshift(addPrizm);
            }
            let twoStep = jQuery('input[name=price-step1]:checked');
            let addtwoStep;
            if(twoStep){
                addtwoStep = {
                    'id': twoStep.data('id-current'),
                    'quantity': 1,
                    'properties': {
                        'parent': title,
                        '_unique_id' : uniqueId,
                    }
                };
                for ( let i in formData.items){
                    if(formData.items[i].id == item){
                        formData.items[i].properties.product_1 = twoStep.data('title');
                    }
                }
            }
            let blueLightCheck = jQuery('#blue-filter:checked');
            if(blueLightCheck.length === 1){
                let idStep3 = jQuery('.add-product-0').data('id-current');
                addtwoStep = {
                    'id': idStep3,
                    'quantity': 1,
                    'properties': {
                        'parent': title,
                        '_unique_id' : uniqueId,
                    }
                };
                for ( let i in formData.items){
                    if(formData.items[i].id == item){
                        formData.items[i].properties.product_1 = jQuery('.add-product-0').data('title');
                    }
                }
            }
            formData.items.unshift(addtwoStep);
            let lense = jQuery('input[name=price-step2]:checked');
            let addLense;
            if(!lense.data('delete')){
                addLense = {
                    'id': lense.data('lense-id'),
                    'quantity': 1,
                    'properties': {
                        'parent': title,
                        '_unique_id' : uniqueId,
                    }
                };
                for ( let i in formData.items){
                    if(formData.items[i].id == item){
                        formData.items[i].properties.product_2 = lense.data('title');
                    }
                }
                formData.items.unshift(addLense);
            }
            let antiReflectiveCheck = jQuery('#anti-reflective:checked');
            if(antiReflectiveCheck.length === 1){
                let idStep4 = jQuery('.add-product-reflective').data('lense-id');
                addLense = {
                    'id': idStep4,
                    'quantity': 1,
                    'properties': {
                        'parent': title,
                        '_unique_id' : uniqueId,
                    }
                };
                for ( let i in formData.items){
                    if(formData.items[i].id == item){
                        formData.items[i].properties.product_2 = jQuery('.add-product-reflective').data('title');
                    }
                }
                formData.items.unshift(addLense);
            }
            fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    return response.json();
                })
                .then(response => {              
              
                    document.dispatchEvent(new CustomEvent('wmp:cart:added', {
                        detail: {
                            item: response.items[0]
                        }
                    }));
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

const addToCartPrescription = document.querySelector('.add-to-cart-prescription');
addToCartPrescription.addEventListener('click', (e) => {
    e.preventDefault();
    let isAdded = e.target.classList.contains('added');
    if(!isAdded) {
        addToCart();
        e.target.classList.add('added');
        addToCartPrescription.setAttribute('data-qty', 1);
        addToCartPrescription.setAttribute("disabled", "disabled");
        // addToCartPrescription.style.background = '#989898';
//         addToCartPrescription.innerText = 'Added to cart';
    }
})

jQuery('.holder-product .display .usage label').click("click", function () {
                  jQuery('.holder-product .display .usage label').removeClass('active');
                  jQuery(this).addClass('active');
                  jQuery('.usage ').removeClass('error');
                 
                 });


    jQuery('.addToCart-step').click("click", function () {
      addToCart();
    });
             jQuery('.product-section__variant-thumbnail').click("click", function () {
               let textProduct = jQuery(this).data("variant-option1");
               jQuery('.variant-text').html(textProduct)
             });
            
 
            jQuery(document).on('wmp:cart:added', function() {
  			 window.location.href = '/checkout';
    		});