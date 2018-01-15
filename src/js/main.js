(function() {
  const FORM   = $('#career-form');
  const SUBMIT = $('#submit');
  const LOAD   = $('#load');

  let scroll = new SmoothScroll('a[href*="#"]');
  let headers = [];
  let galleryState = {
    page: 0,
    label: 'kitchen'
  };
  let galleryStop  = -5;
  let galleryLimit = 24;
  let animatingGallery = false;

  $(LOAD).click($(window).width() < 769 ? initGalleryMobile : initGallery);
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
  }

  function initScrollAnimations() {
    animate(document.getElementById('info-box'), 'fadeInUp', 1000);
    animate(document.getElementById('logo'), 'fadeIn');
    animate(document.getElementById('header-buttons'), 'fadeIn');

    iterateObject(document.getElementsByClassName('outer-button'), addFadeInAnimation);
    iterateObject(document.getElementsByClassName('about-wrapper'), addFadeInAnimation);
    iterateObjectWithTimeout(document.getElementsByClassName('gallery-prev'), addFadeInAnimation);
  }

  function addFadeInAnimation(opts) {
    animate(opts.el, 'fadeInUpCustom', opts.timeout || 0);
  }

  function animate(el, animation, timeout) {

    el.scrollEvent = function() {
      if(isScrolledIntoView(el)){
        let currentClass = el.getAttribute('class');
        let newClass     = `${currentClass} animated ${animation}`;

        setTimeout(() => el.setAttribute('class', newClass), timeout || 0);
        window.removeEventListener('scroll', el.scrollEvent);
      }
    }

    window.addEventListener('scroll', el.scrollEvent);
    el.scrollEvent();
  }

  function initGallery() {
    if(animatingGallery) return;
    animatingGallery = true;

    let firstload = false;
    if(galleryStop < 0) firstload = true;

    galleryStop += 6;
    if(galleryStop > galleryLimit) galleryStop = 1;

    $('.gallery-prev').each((idx, div) => {
      let a      = $(div).find('a');
      let prev   = $(a).children()[0];
      let url    = '/assets/gallery/gallery-';
      let imgNum = galleryStop + idx;

      if(!firstload) {
        $(div).removeClass('fadeInUpCustom fadeOut').addClass('fadeOut');
        setTimeout(showNewImage, 650);
      } else {
        showNewImage();
      }

      function showNewImage() {
        $(a).attr('href', `${url}${imgNum}.png`);
        $(prev).css({
          'background-image': `url(${url}${imgNum}-prev.jpg)`
        });

        if(!firstload) {
          setTimeout(() => {
            $(div).removeClass('fadeOut fadeInUpCustom').addClass('fadeInUpCustom');
          }, 150 * idx);
        }

        setTimeout(() => animatingGallery = false, 1250);
      }
    });

    baguetteBox.run('.gallery', {
      buttons: false,
      captions: false,
    });
  }

  function initGalleryMobile() {
    if(animatingGallery) return;
    animatingGallery = true;

    galleryStop += 6;
    if(galleryStop > galleryLimit) {
      $(LOAD).attr({ disabled: true });
      return;
    };

    let height = $('.gallery').height();
    $('.gallery').css({ minHeight: height + 600 });

    setTimeout(() => {
      for(var i = 0; i < 6; i++) {
        let div    = $('.gallery-prev').clone()[0];
        let a      = $(div).find('a');
        let prev   = $(a).children()[0];
        let url    = '/assets/gallery/gallery-';
        let imgNum = galleryStop + i;

        $(a).attr('href', `${url}${imgNum}.png`);
        $(prev).css({
          'background-image': `url(${url}${imgNum}-prev.png)`
        });

        $('.gallery-grid').append(div);
        animatingGallery = false;
      }
    }, 200);
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
        let opts = { el: obj[key] };
        func(opts);
      }
    }
  }

  function iterateObjectWithTimeout(obj, func) {
    let i = 0;

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let opts = { el: obj[key], timeout: i * 150 };
        func(opts);
        i++;
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

        if(opts.class !== 'mobile') {
          addHeaderImg({ class: opts.class, src: opts.src }, opts.timeout);
        }
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

  function disableSubmit() {
    $(SUBMIT).attr({ disabled: true });
  }
  function enableSubmit() {
    $(SUBMIT).attr({ disabled: false });
  }

  function formSubmit(e) {
    e.preventDefault();
    disableSubmit();

    $(FORM).children().each((e, el) => {
      if(!$(el).val()) return enableSubmit();
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
      if(!res.verified) return enableSubmit();
      sendEmail();
    })
    .catch(err => {
      console.log('ERROR:', err);
    })
  }

  function sendEmail() {
    emailjs.send('postmark', 'market_tavern_dub_careers', {
      'name': document.getElementById('name').value,
      'email':document.getElementById('email').value,
      'phone':document.getElementById('phone').value
    })
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
  function initSmallHeader() {
    BackgroundLoader({
        class:'mobile',
        src: '/assets/small-header.jpg',
        last: true,
        timeout: 300
      })
  }

  if($(window).width() > 1276) {
    initLargeHeader();
  } else {
    initSmallHeader();
  }
  initResponsive();
  initGallery();
})();
