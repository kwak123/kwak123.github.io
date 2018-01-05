let $animImages;
let $window;

function checkIfVisible() {
  let windowHeight = $window.height();
  let windowTop = $window.scrollTop();
  let windowBottom = windowTop + windowHeight;
  
  $.each($animImages, function() {
    let $element = $(this);
    var height = $element.outerHeight();
    var top = $element.offset().top;
    var bottom = (top + height);
    
    //check to see if this current container is within viewport
    if ((bottom >= windowTop) &&
    (top <= windowBottom)) {
      $element.addClass('in-view');
    } else {
      $element.removeClass('in-view');
    }
  });
};

$(document).ready(() => {
  $animImages = $('.project__image');
  $window = $(window);
  
  /* Window handlers */
  $window.on('scroll resize', checkIfVisible);
  $window.trigger('scroll');
  
  let $body = $(document).find('body');
  let $fade = $body.find('.fade__content');
  $fade.hide();
  $fade.removeClass('hide');
  setTimeout(() => $fade.fadeIn(300), 100);
  
  // particlesJS('particles-js', 'assets/js/particles.json');
  
  $('.page-link, .site-title').on('click', function(e) {
    e.preventDefault();
    let newLoc = this.href;
    $fade.fadeOut(400, () => window.location = newLoc);
  });
  
});

document.addEventListener("DOMContentLoaded", function () {
  particlesJS.load('particles-js', 'assets/js/particles.json', () => console.log('success'));
  console.log('load test')
}, false);