function ensureLightbox() {
  var lb = document.getElementById('shared-lightbox');
  if (lb) return lb;

  lb = document.createElement('div');
  lb.id = 'shared-lightbox';
  lb.className = 'lightbox';
  lb.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&larr;</button>' +
    '<img src="" alt="">' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next">&rarr;</button>' +
    '<div class="lightbox-counter"></div>';
  document.body.appendChild(lb);

  lb.querySelector('.lightbox-close').addEventListener('click', function () {
    lb.classList.remove('is-open');
  });
  lb.addEventListener('click', function (e) {
    if (e.target === lb) lb.classList.remove('is-open');
  });

  return lb;
}

function initDemoCarousel(rootId, slides) {
  var root = document.getElementById(rootId);
  if (!root) return;
  var current = 0;

  var img = root.querySelector('.demo-img');
  var prev = root.querySelector('.demo-prev');
  var next = root.querySelector('.demo-next');
  var title = root.querySelector('.demo-title');
  var counter = root.querySelector('.demo-counter');

  var lb = ensureLightbox();
  var lbImg = lb.querySelector('img');
  var lbPrev = lb.querySelector('.lightbox-prev');
  var lbNext = lb.querySelector('.lightbox-next');
  var lbCounter = lb.querySelector('.lightbox-counter');

  function show(i, dir) {
    img.classList.remove('anim-next', 'anim-prev');
    void img.offsetWidth;
    img.src = slides[i].src;
    img.alt = slides[i].title;
    if (dir) img.classList.add(dir === 1 ? 'anim-next' : 'anim-prev');
    title.textContent = slides[i].title;
    counter.textContent = (i + 1) + ' / ' + slides.length;
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
    if (lb.classList.contains('is-open') && lb._activeRoot === rootId) {
      updateLightbox(i);
    }
  }

  function updateLightbox(i) {
    lbImg.src = slides[i].src;
    lbImg.alt = slides[i].title;
    lbCounter.textContent = (i + 1) + ' / ' + slides.length;
    lbPrev.disabled = i === 0;
    lbNext.disabled = i === slides.length - 1;
  }

  prev.addEventListener('click', function () {
    if (current > 0) show(--current, -1);
  });
  next.addEventListener('click', function () {
    if (current < slides.length - 1) show(++current, 1);
  });

  img.addEventListener('click', function () {
    lb._activeRoot = rootId;
    lb._prevHandler && lbPrev.removeEventListener('click', lb._prevHandler);
    lb._nextHandler && lbNext.removeEventListener('click', lb._nextHandler);
    lb._keyHandler && document.removeEventListener('keydown', lb._keyHandler);

    lb._prevHandler = function () {
      if (current > 0) { current--; show(current, -1); }
    };
    lb._nextHandler = function () {
      if (current < slides.length - 1) { current++; show(current, 1); }
    };
    lb._keyHandler = function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') lb.classList.remove('is-open');
      if (e.key === 'ArrowLeft') lb._prevHandler();
      if (e.key === 'ArrowRight') lb._nextHandler();
    };

    lbPrev.addEventListener('click', lb._prevHandler);
    lbNext.addEventListener('click', lb._nextHandler);
    document.addEventListener('keydown', lb._keyHandler);

    updateLightbox(current);
    lb.classList.add('is-open');
  });

  show(0, null);
}
