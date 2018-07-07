let $animImages;
let $charts;
let $window;
let $heroDescriptor

// Charts
let languageChart;
let languageData = ['Familiarity', 100, 85, 65, 75, 80];
let languageGen = false;

let frontEndChart;
let frontEndData = ['React', 'jQuery'];
let frontEndGen = false;

let backEndChart;
let backEndData = ['Express', ''];
let backEndGen = false;

let descriptors = ['Redis', 'MERN', 'Climbing', 'JavaScript', 'Node', 'React', 'Express', 'TDD'];

const checkIfVisible = function(animImages) {
  let windowHeight = $window.height();
  let windowTop = $window.scrollTop();
  let windowBottom = windowTop + windowHeight;
  
  $.each(animImages, function() {
    let $element = $(this);
    let height = $element.outerHeight();
    let top = $element.offset().top;
    let bottom = (top + height);
    
    //check to see if this current container is within viewport
    if ((bottom >= windowTop) && (top <= windowBottom)) {
      $element.addClass('in-view');
    } else {
      $element.removeClass('in-view');
    }
  });
};

const checkForCharts = function(animCharts) {
  let windowBottom = $window.scrollTop() + $window.height();
  languageChart.xs();

  $.each(animCharts, function() {
    let $el = $(this);
    let bottom = ($el.offset().top + $el.outerHeight());

    if (bottom <= windowBottom) {
      if ($el.attr('id') === 'language-chart' && !languageGen) {
        languageGen = true;
        languageChart.load({ columns: [languageData] });
      } else {
        // 
      }
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
  $charts = $('.billboard');
  $window = $(window);
  
  /* Window handlers */
  
  $window.on('scroll resize', () => {
    if ($animImages.length) { checkIfVisible($animImages); }
    if ($charts.length) { checkForCharts($charts); }
  });
  $window.trigger('scroll');
  
  
  
  /* Page Handlers */
  
  // Fade
  let $body = $(document).find('body');
  let $hiding = $body.find('.hide');
  $hiding.hide();
  $hiding.removeClass('hide');
  setTimeout(() => $hiding.fadeIn(800), 100);
  
  // Hero
  $heroDescriptor = $('.hero__descriptor');
  if ($heroDescriptor.length) {
    shuffleDescriptor(descriptors.slice()); 
  }


  
  /* Click Handlers */
  
  $('.page-link, .site-title').on('click', function(e) {
    e.preventDefault();
    let newLoc = this.href;
    $hiding.fadeOut(400, () => window.location = newLoc);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  
  // Chart
  let $langChart = $(document).find('#language-chart');
  if ($langChart.length) {
    languageChart = bb.generate({
      bindto: '#language-chart',
      title: { text: 'Languages' },
      data: {
        columns: [['Familiarity', 0, 0, 0, 0, 0]],
        type: 'bar'
      },
      tooltip: {
        format: {
          value: (val) => {
            if (val >= 100) { return 'Strong'; }
            if (val >= 80) { return 'Confident'; }
            if (val >= 60) { return 'Proficient'; }
          }
        }
      },
      axis: {
        rotated: true,
        x: {
          type: 'category',
          categories: ['Javascript', 'Git', 'Ruby', 'Java', 'HTML5/CSS'],
        },
        y: { max: 95 }
      }
    });
  }
  
  // Particles
  if ($(document).find('#particles-js').length) {
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
  }
}, false);