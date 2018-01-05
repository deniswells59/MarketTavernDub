// import $ from 'jquery';
//
// require('./yelp.min.js');
// require('./bootstrap.min.js');

(function() {
  const GALLERY_BUTTONS = $('.gallery-button');
  const FORM            = $('#career-form');
  const LEFT            = $('.icon-left-open-big');
  const RIGHT           = $('.icon-right-open-big');

  let scroll = new SmoothScroll('a[href*="#"]');
  let headers = [];
  let galleryState = {
    page: 0,
    label: 'kitchen'
  };
  let gallery = {
    'kitchen': [9, 2, 22, 10, 4, 1, 12, 21, 11, 23, 3, 24],
    'bar'    : [5, 7, 16, 8, 13, 6, 15, 14],
    'market' : [17, 20, 19, 18],
  };

  $(LEFT).click(prevGallery);
  $(RIGHT).click(nextGallery);
  $(GALLERY_BUTTONS).click(changeGallery);
  $(FORM).submit(formSubmit);

  function galleryPrevSize() {
    let chalk1 = document.getElementsByClassName('chalk')[3];
    let chalk2 = document.getElementsByClassName('chalk')[4];
    let prevs  = document.getElementsByClassName('gallery-prev');
    let fullHeight = chalk1.offsetHeight || chalk1.clientHeight ||
                      chalk2.offsetHeight || chalk2.clientHeight;
    for(let key in prevs) {
      if(prevs.hasOwnProperty(key)) {
        let p = prevs[key];

        p.style.height = `${fullHeight / 2}px`;
      }
    }
  }

  function initResponsive() {
    window.addEventListener('resize', setMidWidth);

    // galleryPrevSize();
    // window.addEventListener('resize', galleryPrevSize, true);
  }

  function initScrollAnimations() {
    animate(document.getElementById('info-box'), 'fadeInUp');
    animate(document.getElementById('logo'), 'fadeIn');
    animate(document.getElementById('header-buttons'), 'fadeIn');

    iterateObject(document.getElementsByClassName('outer-button'), addFadeInAnimation);
    iterateObject(document.getElementsByClassName('about-wrapper'), addFadeInAnimation);
  }

  function addFadeInAnimation(el) {
    animate(el, 'fadeInUp')
  }

  function animate(el, animation) {

    el.scrollEvent = function() {
      if(isScrolledIntoView(el)){
        let currentClass = el.getAttribute('class');
        let newClass     = `${currentClass} animated ${animation}`;
        el.setAttribute('class', newClass);
        window.removeEventListener('scroll', el.scrollEvent);
      }
    }

    window.addEventListener('scroll', el.scrollEvent);
    el.scrollEvent();
  }

  function initGallery(label, page) {
    if(['kitchen', 'bar', 'market'].indexOf(label) < 0) return;

    let gall = gallery[label];
    if(!gall || gall.length < 4) return;

    let nums = getGallery(page, gall);

    $('.gallery-prev').each((idx, div) => {
      let a    = $(div).find('a');
      let prev = $(a).children()[0];
      let url  = '/assets/gallery/gallery-';

      $(a).attr('href', `${url}${nums[idx]}.png`);
      $(prev).css({
        'background-image': `url(${url}${nums[idx]}-prev.png)`
      });
    });

    baguetteBox.run('.gallery', {
      buttons: false,
      captions: false,
    });
  }

  function getGallery(page, nums) {
    let spliceOne = page * 4;
    let spliceTwo = spliceOne + 4;

    let numsToReturn = nums.slice(spliceOne, spliceTwo);

    if(numsToReturn.length < 4) {
      numsToReturn = getGallery(page - 1, nums);
      galleryState.page -= 1;
    }
    return numsToReturn;
  }

  function nextGallery() {
    galleryState.page += 1;
    initGallery(galleryState.label, galleryState.page);
  }

  function prevGallery() {
    galleryState.page -= 1;

    if(galleryState.page < 0) galleryState.page = 0;
    initGallery(galleryState.label, galleryState.page);
  }

  function changeGallery() {
    $(GALLERY_BUTTONS).each((i, b) => $(b).removeClass('active'));
    $(this).addClass('active');

    galleryState.page = 0;
    galleryState.label = $(this).text();
    initGallery(galleryState.label, galleryState.page);
  }

  function iterateObject(obj, func) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        func(obj[key]);
      }
    }
  }

  function isScrolledIntoView(el) {
    var elemTop = el.getBoundingClientRect().top;
    var elemBottom = el.getBoundingClientRect().bottom - window.innerHeight * .2;

    var isVisible = (elemBottom <= window.innerHeight);
    return isVisible;
  }


  function BackgroundLoader(opts) {
    headers.push(opts);

    return new Promise(function(resolve, reject) {
      let image = new Image();

      image.onload = function () {
        if(opts.last) {
          let loader = document.getElementById('loader');
          loader.setAttribute('class', 'loading loaded');

          initScrollAnimations();
          showImages(headers);
          setTimeout(() => loader.remove(), 250);
        }

        addHeaderImg({ class: opts.class, src: opts.src }, opts.timeout);
        resolve();
      }

      image.src = opts.src;
    });
  }

  function setMidWidth() {
    let windowWidth = $(window).width();
    if(windowWidth > 1275) {
      let style = `width: ${windowWidth * 0.4 - 12}px;`;
      $('.mid').attr({ style });
    }
  }

  function addHeaderImg(info, timeout) {
    let div = document.getElementById('home');
    let img = $('<img>')[0];

    $(img).attr(info);
    div.append(img);

    setMidWidth();
  }

  function showImages(arr) {
    arr.map(i => {
      setTimeout(() => $(`img.${i.class}`).addClass('appear'), i.timeout);
    });

    removeHeaderTransitions(arr[arr.length - 1].timeout);
  }

  function removeHeaderTransitions(timeout) {
    setTimeout(function () {
      $('div.header-img-col img').addClass('notransition');
    }, timeout * 4);
  }

  function parallax(id, offset) {
  	let $slider = document.getElementById(id);
    let $sliderOffset = $slider.offsetTop;

  	let yPos = window.pageYOffset / 5.25;
  	yPos = -yPos / 2 + offset;

    if(yPos > 0) yPos = 0;

  	let coords = '0% '+ yPos + 'px';
  	$slider.style.backgroundPosition = coords;
  }

  if(window.innerWidth > 992) {
    window.addEventListener('scroll', () => {
      parallax('reservations', 0);
      parallax('careers', 180);
    });
  } else if(window.innerWidth <= 992){
    window.addEventListener('scroll', () => {
      parallax('reservations', 0);
      parallax('careers', 280);
    });
  }

  function formSubmit(e) {
    e.preventDefault();

    $(FORM).children().each((e, el) => {
      if(!$(el).val()) return;
    });

    grecaptcha.execute(); // Goes to get captcha
  }

  window.getCaptcha = function() {
    submitCaptcha(grecaptcha.getResponse());
  }

  function submitCaptcha(captchaRes) {
    let data = new FormData();
    data.append('captcha', captchaRes);
    fetch('captcha.php', {
      'method': 'POST',
      'body': data
    })
    .then(data => { return data.json() })
    .then(res => {
      if(res.verified) {
        sendEmail();
      }
    })
    .catch(err => {
      console.log('ERROR:', err);
    })
  }

  function sendEmail() {
    // emailjs.send('postmark', 'market_tavern_careers', {
    //   'name': document.getElementById('name').value,
    //   'email':document.getElementById('email').value,
    //   'phone':document.getElementById('phone').value
    // })
  }

  function initLargeHeader() {
    BackgroundLoader({
      class: 'right',
      src: '/assets/header-dub-left.png',
      timeout: 300
    })
    .then(() => {
      return BackgroundLoader({
        class: 'mid',
        src: '/assets/header-dub-middle.png',
        timeout: 400,
      })
    })
    .then(() => {
      return BackgroundLoader({
        class: 'left',
        src: '/assets/header-dub-right.png',
        timeout: 480,
        last: true
      })
    })
  }

  initLargeHeader();
  initResponsive();
  initGallery('kitchen', 0);
})();
