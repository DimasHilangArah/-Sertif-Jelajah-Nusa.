// ===== 1. NAVBAR =====
function initNavbar() {
  const links = document.querySelectorAll('.navbar .nav-link');
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        links.forEach(function (link) {
          const isActive = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', isActive);

          if (isActive) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function update() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ===== 2. DESTINATIONS =====
function initDestinations() {
  const list = document.querySelector('.dest-cards');
  const cards = document.querySelectorAll('.dest-card');
  if (!list || cards.length === 0) return;

  const bgEl = document.getElementById('destBg');
  const infoEl = document.getElementById('destInfo');
  const titleEl = document.getElementById('destTitle');
  const locationEl = document.getElementById('destLocation');
  const descEl = document.getElementById('destDesc');
  const prevBtn = document.getElementById('destPrev');
  const nextBtn = document.getElementById('destNext');
  const counterEl = document.getElementById('destPage');

  const total = cards.length;
  const FADE_MS = 300;

  let activeIndex = 0;
  let fadeTimer;

  function updateCards() {
    cards.forEach(function (card, i) {
      const offset = (i - activeIndex + total) % total;
      const isActive = offset === 0;

      if (card.classList.contains('is-active') && offset > 1) {
        card.classList.add('is-entering');
        card.style.setProperty('--pos', total - 1);
        void card.offsetWidth;
        card.classList.remove('is-entering');
      }

      card.classList.toggle('is-active', isActive);
      card.style.setProperty('--pos', isActive ? -1 : offset - 1);
      card.tabIndex = isActive ? -1 : 0;
    });

    counterEl.textContent = activeIndex + 1 + ' / ' + total;
  }

  function fillInfo() {
    const card = cards[activeIndex];

    bgEl.src = card.querySelector('img').src;
    titleEl.textContent = card.querySelector('.dest-card-name').textContent;
    locationEl.textContent = card.querySelector('.dest-card-loc').textContent;
    descEl.textContent = card.querySelector('.dest-card-desc').textContent;
  }

  function setFading(isFading) {
    bgEl.classList.toggle('is-changing', isFading);
    infoEl.classList.toggle('is-changing', isFading);
  }

  function changeInfo() {
    clearTimeout(fadeTimer);
    setFading(true);

    fadeTimer = setTimeout(function () {
      fillInfo();
      setFading(false);
    }, FADE_MS);
  }

  function goTo(index) {
    const next = (index + total) % total;
    if (next === activeIndex) return;

    activeIndex = next;
    updateCards();
    changeInfo();
  }

  cards.forEach(function (card, i) {
    card.addEventListener('click', function () {
      goTo(i);
    });
  });

  prevBtn.addEventListener('click', function () {
    goTo(activeIndex - 1);
  });

  nextBtn.addEventListener('click', function () {
    goTo(activeIndex + 1);
  });

  updateCards();
  fillInfo();
  void list.offsetWidth;
  list.classList.add('ready');
}


// ===== 3. PACKAGES =====
function initPackages() {
  const grid = document.getElementById('pkgGrid');
  const tabs = document.querySelectorAll('.pkg-tab');
  if (!grid || tabs.length === 0) return;

  const items = Array.from(grid.querySelectorAll('.pkg-item'));

  function getRating(item) {
    return parseFloat(item.querySelector('.pkg-rating').textContent);
  }

  function filterPackages(type) {
    const list = items.slice();
    if (type === 'rating') {
      list.sort(function (a, b) {
        return getRating(b) - getRating(a);
      });
    }

    list.forEach(function (item) {
      item.hidden = type === 'recommended' && item.dataset.recommended !== 'true';

      grid.appendChild(item);

      item.classList.remove('pkg-in');
      void item.offsetWidth;
      item.classList.add('pkg-in');
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');

      filterPackages(tab.dataset.filter);
    });
  });
}

initNavbar();
initDestinations();
initPackages();
initNavbarScroll();