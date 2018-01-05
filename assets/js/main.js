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
  
  $('.page-link, .site-title').on('click', function(e) {
    e.preventDefault();
    let newLoc = this.href;
    $fade.fadeOut(400, () => window.location = newLoc);
  });
  console.log('asdf');
});

document.addEventListener('DOMContentLoaded', function () {
  console.log(document.body.clientWidth > 600)
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 100,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#1f4452"
      },
      "shape": {
        "type": "star"
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 4,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#1f4452",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": document.body.clientWidth > 600 ? "bubble" : "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": document.body.clientWidth > 600 ? "repulse" : "push"
        },
        "resize": true
      },
      "modes": {
        "repulse": {
          "distance": document.body.clientWidth > 600 ? 100 : 50,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "bubble": {
          "distance": 200,
          "size": 6
        }
      }
    },
    "retina_detect": true
  });
}, false);