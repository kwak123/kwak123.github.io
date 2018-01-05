let $animImages;
let $window;
let $heroDescriptor
let descriptors = ['Redis', 'Climbing', 'Javascript', 'Node', 'React', 'Express', 'TDD'];

const checkIfVisible = function() {
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

const shuffleDescriptor = (words) => {
  if (!words.length) { words = descriptors.slice(); }
  if (!$heroDescriptor.text()) {
    $heroDescriptor.text(words.pop());
    return setTimeout(() => shuffleDescriptor(words), 3000)
  }
  $heroDescriptor.fadeOut(() => {
    $heroDescriptor.text(words.pop());
    $heroDescriptor.fadeIn(() => setTimeout(() => shuffleDescriptor(words), 3000));
  })
};

$(document).ready(() => {
  $animImages = $('.project__image');
  $window = $(window);
  
  /* Window handlers */
  $window.on('scroll resize', checkIfVisible);
  $window.trigger('scroll');

  $heroDescriptor = $('.hero__descriptor');
  if ($heroDescriptor.length) {
    shuffleDescriptor(descriptors.slice()); 
  }
  
  let $body = $(document).find('body');
  let $hiding = $body.find('.hide');
  $hiding.hide();
  $hiding.removeClass('hide');
  setTimeout(() => $hiding.fadeIn(800), 100);

  
  
  $('.page-link, .site-title').on('click', function(e) {
    e.preventDefault();
    let newLoc = this.href;
    $hiding.fadeOut(400, () => window.location = newLoc);
  });
});

document.addEventListener('DOMContentLoaded', function () {
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
        "value": "#e6eebd"
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
        "color": "#e6eebd",
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
          "distance": 150,
          "size": 6
        }
      }
    },
    "retina_detect": true
  });
}, false);