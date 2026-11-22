(function () {
  'use strict';

  var root = document.getElementById('aurelia-root');

  if (!root) {
    return;
  }

  var sidebar = root.querySelector('.aurelia-sidebar');
  var navToggle = root.querySelector('.aurelia-nav-toggle');
  var backdrop = root.querySelector('.aurelia-backdrop');
  var themeToggle = root.querySelector('.aurelia-theme-toggle');
  var storageKey = 'aurelia-theme';
  var isArticlePage = document.body.classList.contains('ns-0') && !document.body.classList.contains('mw-special');
  root.setAttribute('data-page-type', isArticlePage ? 'article' : 'other');

  function closeNavigation() {
    root.classList.remove('aurelia-nav-open');

    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }

    if (backdrop) {
      backdrop.hidden = true;
    }
  }

  function toggleNavigation() {
    if (!navToggle || !backdrop) {
      return;
    }

    var open = !root.classList.contains('aurelia-nav-open');

    root.classList.toggle('aurelia-nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    backdrop.hidden = !open;
  }

  if (navToggle && sidebar && backdrop) {
    navToggle.addEventListener('click', toggleNavigation);
    backdrop.addEventListener('click', closeNavigation);

    sidebar.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNavigation);
    });
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme, save) {
    root.setAttribute('data-theme', theme);
    document.body.setAttribute('data-aurelia-theme', theme);

    if (themeToggle) {
      var dark = theme === 'dark';

      themeToggle.setAttribute(
        'aria-label',
        dark ? 'Switch to light theme' : 'Switch to dark theme'
      );

      themeToggle.setAttribute(
        'title',
        dark ? 'Light theme' : 'Dark theme'
      );

      var themeIcon = themeToggle.querySelector('.aurelia-theme-icon');

      if (themeIcon) {
        themeIcon.className = dark
          ? 'aurelia-theme-icon fa-solid fa-sun'
          : 'aurelia-theme-icon fa-solid fa-moon';
      }
    }

    if (save) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        return;
      }
    }
  }

  var mediaQuery = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  var storedTheme = getStoredTheme();

  applyTheme(
    storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : mediaQuery && mediaQuery.matches
        ? 'dark'
        : 'light',
    false
  );

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(
        root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark',
        true
      );
    });
  }

  if (mediaQuery) {
    var handleThemeChange = function (event) {
      var manual = getStoredTheme();

      if (manual !== 'light' && manual !== 'dark') {
        applyTheme(event.matches ? 'dark' : 'light', false);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleThemeChange);
    }
  }

  var searchPanel = root.querySelector('.aurelia-search');
  var searchToggle = root.querySelector('.aurelia-search-toggle');
  var searchClose = root.querySelector('.aurelia-search-close');
  var header = root.querySelector('.aurelia-header');
  var searchInput = root.querySelector(
    '.aurelia-search input[type="search"], .aurelia-search input[name="search"]'
  );

  function openSearch() {
    if (!searchPanel || !header) {
      return;
    }

    searchPanel.hidden = false;
    header.classList.add('aurelia-search-open');

    if (searchToggle) {
      searchToggle.setAttribute('aria-expanded', 'true');
    }

    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }

  function closeSearch() {
    if (!searchPanel || !header) {
      return;
    }

    searchPanel.hidden = true;
    header.classList.remove('aurelia-search-open');

    if (searchToggle) {
      searchToggle.setAttribute('aria-expanded', 'false');
      searchToggle.focus();
    }

    if (searchInput) {
      searchInput.blur();
    }
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  document.addEventListener('click', function (event) {
    if (header && header.classList.contains('aurelia-search-open')) {
      if (searchPanel && !searchPanel.contains(event.target) && searchToggle && !searchToggle.contains(event.target)) {
        closeSearch();
      }
    }
  });

  document.addEventListener('keydown', function (event) {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'k' &&
      searchInput
    ) {
      event.preventDefault();
      openSearch();
    }

    if (event.key === 'Escape') {
      closeNavigation();

      if (header && header.classList.contains('aurelia-search-open')) {
        closeSearch();
      } else if (document.activeElement === searchInput && searchInput) {
        searchInput.blur();
      }
    }
  });

  var progress = root.querySelector('.aurelia-reading-progress');

  if (progress && isArticlePage) {
    var progressBar = progress.querySelector('span');

    if (!progressBar) {
      progressBar = document.createElement('span');
      progress.appendChild(progressBar);
    }

    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');

    var ticking = false;

    function updateScrollUI() {
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var percentage = height > 0
        ? Math.min(100, Math.max(0, window.scrollY / height * 100))
        : 0;

      progressBar.style.width = percentage + '%';
      progress.setAttribute('aria-valuenow', String(Math.round(percentage)));

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollUI);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateScrollUI, { passive: true });

    updateScrollUI();
  }

  var backToTop = document.createElement('button');

  backToTop.type = 'button';
  backToTop.className = 'aurelia-back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';

  root.appendChild(backToTop);

  backToTop.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  function updateBackToTop() {
    backToTop.classList.toggle('is-visible', window.scrollY > 480);
  }

  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();

  if (isArticlePage) root.querySelectorAll('.aurelia-content .mw-parser-output pre').forEach(function (block) {
    if (block.querySelector('.aurelia-copy-code')) {
      return;
    }

    var button = document.createElement('button');

    button.type = 'button';
    button.className = 'aurelia-copy-code';
    button.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i><span>Copy</span>';

    button.addEventListener('click', function () {
      var code = block.querySelector('code');
      var text = code ? code.innerText : block.innerText;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
          button.querySelector('span').textContent = button.getAttribute('data-label-copied') || 'Copied';
        }).catch(function () {
          button.querySelector('span').textContent = button.getAttribute('data-label-failed') || 'Copy failed';
        });
      } else {
        button.querySelector('span').textContent = button.getAttribute('data-label-unavailable') || 'Copy unavailable';
      }
    });

    block.appendChild(button);
  });

  var iconRules = [
    [/^(navigation|p-navigation)$/, 'fa-compass'],
    [/^(toolbox|p-tb)$/, 'fa-toolbox'],
    [/^(languages|p-lang)$/, 'fa-globe'],
    [/^(appearance|p-appearance)$/, 'fa-palette'],
    [/^(personal|p-personal)$/, 'fa-user'],
    [/^(views|p-views)$/, 'fa-eye'],
    [/^(actions|p-cactions)$/, 'fa-sliders']
  ];

  root.querySelectorAll('.aurelia-portlet').forEach(function (portlet) {
    var heading = portlet.querySelector('.aurelia-portlet-label');

    if (!heading || heading.querySelector('.fa-solid')) {
      return;
    }

    var id = (portlet.id || '').toLowerCase();

    var match = iconRules.find(function (rule) {
      return rule[0].test(id);
    });

    if (match) {
      var icon = document.createElement('i');

      icon.className = 'fa-solid ' + match[1];
      icon.setAttribute('aria-hidden', 'true');

      heading.insertBefore(icon, heading.firstChild);
    }
  });

  var linkIconRules = [
    [/search|cari/, 'fa-magnifying-glass'],
    [/watch|pantau|ikuti|follow/, 'fa-eye'],
    [/edit|ubah|sunting/, 'fa-pen'],
    [/history|riwayat|contributions|kontribusi/, 'fa-clock-rotate-left'],
    [/discussion|talk|diskusi/, 'fa-comments'],
    [/move|pindah/, 'fa-arrows-up-down-left-right'],
    [/delete|hapus/, 'fa-trash'],
    [/protect|lindungi/, 'fa-shield-halved'],
    [/refresh|purge|segarkan/, 'fa-rotate'],
    [/print|cetak/, 'fa-print'],
    [/download|unduh/, 'fa-download'],
    [/upload|unggah/, 'fa-upload'],
    [/login|log-in|masuk/, 'fa-right-to-bracket'],
    [/logout|log-out|keluar/, 'fa-right-from-bracket'],
    [/create|new|buat|baru/, 'fa-plus'],
    [/settings|preferences|preferensi|pengaturan/, 'fa-gear'],
    [/language|bahasa/, 'fa-language'],
    [/user|account|akun|profile|profil/, 'fa-user'],
    [/notification|notifikasi|alert|alerts/, 'fa-bell'],
    [/message|messages|pesan/, 'fa-envelope'],
    [/help|bantuan/, 'fa-circle-question'],
    [/random|acak/, 'fa-shuffle'],
    [/permalink|tautan permanen/, 'fa-link'],
    [/cite|kutip/, 'fa-quote-right'],
    [/page|halaman|article|artikel/, 'fa-file-lines']
  ];

  root.querySelectorAll(
    '.aurelia-portlet-list a, .aurelia-page-tools a, .aurelia-header-actions a, .aurelia-footer-icons a'
  ).forEach(function (link) {
    if (link.querySelector(':scope > .aurelia-fa-icon')) return;

    var descriptor = [
      link.id,
      link.className,
      link.getAttribute('title'),
      link.getAttribute('aria-label'),
      link.textContent
    ].join(' ').toLowerCase();
    var match = linkIconRules.find(function (rule) {
      return rule[0].test(descriptor);
    });
    var icon = document.createElement('i');

    icon.className = 'aurelia-fa-icon fa-solid ' + (match ? match[1] : 'fa-arrow-up-right-from-square');
    icon.setAttribute('aria-hidden', 'true');

    link.querySelectorAll(':scope > .mw-ui-icon, :scope > svg').forEach(function (oldIcon) {
      oldIcon.remove();
    });
    link.insertBefore(icon, link.firstChild);
  });
})();

(() => {
    const account = document.querySelector('.aurelia-account');
    if (!account) return;

    const toggle = account.querySelector('.aurelia-account-toggle');
    const menu = account.querySelector('.aurelia-account-menu');

    if (!toggle || !menu) return;

    const closeMenu = () => {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = !menu.hidden;
        menu.hidden = isOpen;
        toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (event) => {
        if (!account.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            toggle.focus();
        }
    });
})();

(function () {
  'use strict';

  var root = document.getElementById('aurelia-root');
  if (!root) return;

  var language = (root.getAttribute('lang') || document.documentElement.lang || 'en')
    .toLowerCase().replace('_', '-');
  var shortLanguage = language.split('-')[0];
  var messages = {
    en: { top: 'Back to top', copy: 'Copy', copied: 'Copied', copyFailed: 'Copy failed',
      light: 'Switch to light theme', dark: 'Switch to dark theme', navigation: 'Open navigation', account: 'Account menu' },
    id: { top: 'Kembali ke atas', copy: 'Salin', copied: 'Tersalin', copyFailed: 'Gagal menyalin',
      light: 'Ganti ke tema terang', dark: 'Ganti ke tema gelap', navigation: 'Buka navigasi', account: 'Menu akun' },
    de: { top: 'Nach oben', copy: 'Kopieren', copied: 'Kopiert', copyFailed: 'Kopieren fehlgeschlagen', light: 'Helles Design aktivieren', dark: 'Dunkles Design aktivieren', navigation: 'Navigation öffnen', account: 'Kontomenü' },
    es: { top: 'Volver arriba', copy: 'Copiar', copied: 'Copiado', copyFailed: 'Error al copiar', light: 'Usar tema claro', dark: 'Usar tema oscuro', navigation: 'Abrir navegación', account: 'Menú de cuenta' },
    fr: { top: 'Retour en haut', copy: 'Copier', copied: 'Copié', copyFailed: 'Échec de la copie', light: 'Activer le thème clair', dark: 'Activer le thème sombre', navigation: 'Ouvrir la navigation', account: 'Menu du compte' },
    it: { top: 'Torna su', copy: 'Copia', copied: 'Copiato', copyFailed: 'Copia non riuscita', light: 'Attiva tema chiaro', dark: 'Attiva tema scuro', navigation: 'Apri navigazione', account: 'Menu account' },
    pt: { top: 'Voltar ao topo', copy: 'Copiar', copied: 'Copiado', copyFailed: 'Falha ao copiar', light: 'Ativar tema claro', dark: 'Ativar tema escuro', navigation: 'Abrir navegação', account: 'Menu da conta' },
    ja: { top: 'ページ上部へ', copy: 'コピー', copied: 'コピーしました', copyFailed: 'コピーに失敗しました', light: 'ライトテーマに切替', dark: 'ダークテーマに切替', navigation: 'ナビゲーションを開く', account: 'アカウントメニュー' },
    zh: { top: '返回顶部', copy: '复制', copied: '已复制', copyFailed: '复制失败', light: '切换浅色主题', dark: '切换深色主题', navigation: '打开导航', account: '账户菜单' },
    ru: { top: 'Наверх', copy: 'Копировать', copied: 'Скопировано', copyFailed: 'Не удалось скопировать', light: 'Светлая тема', dark: 'Тёмная тема', navigation: 'Открыть навигацию', account: 'Меню аккаунта' },
    ar: { top: 'العودة إلى الأعلى', copy: 'نسخ', copied: 'تم النسخ', copyFailed: 'تعذر النسخ', light: 'التبديل إلى المظهر الفاتح', dark: 'التبديل إلى المظهر الداكن', navigation: 'فتح التنقل', account: 'قائمة الحساب' },
    nl: { top: 'Terug naar boven', copy: 'Kopiëren', copied: 'Gekopieerd', copyFailed: 'Kopiëren mislukt', light: 'Licht thema', dark: 'Donker thema', navigation: 'Navigatie openen', account: 'Accountmenu' },
    ko: { top: '맨 위로', copy: '복사', copied: '복사됨', copyFailed: '복사 실패', light: '라이트 테마로 전환', dark: '다크 테마로 전환', navigation: '탐색 열기', account: '계정 메뉴' }
  };
  var text = messages[language] || messages[shortLanguage] || messages.en;

  var navToggle = root.querySelector('.aurelia-nav-toggle');
  if (navToggle) navToggle.setAttribute('aria-label', text.navigation);
  var accountToggle = root.querySelector('.aurelia-account-toggle');
  if (accountToggle) accountToggle.setAttribute('aria-label', text.account);

  var themeToggle = root.querySelector('.aurelia-theme-toggle');
  function refreshThemeLabel() {
    if (!themeToggle) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-label', dark ? text.light : text.dark);
    themeToggle.setAttribute('title', dark ? text.light : text.dark);
  }
  refreshThemeLabel();
  if (themeToggle) themeToggle.addEventListener('click', function () {
    window.requestAnimationFrame(refreshThemeLabel);
  });

  var topButton = root.querySelector('.aurelia-back-to-top');
  if (topButton) topButton.setAttribute('aria-label', text.top);
  root.querySelectorAll('.aurelia-copy-code').forEach(function (button) {
    button.setAttribute('data-label-copied', text.copied);
    button.setAttribute('data-label-failed', text.copyFailed);
    button.setAttribute('data-label-unavailable', text.copyFailed);
    var label = button.querySelector('span');
    if (label && label.textContent.trim() === 'Copy') label.textContent = text.copy;
  });

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window && root.getAttribute('data-page-type') === 'article') {
    var revealTargets = root.querySelectorAll(
      '.aurelia-content h2, .aurelia-content h3, .aurelia-content .infobox, .aurelia-content table.wikitable, .aurelia-categories'
    );
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('au-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -36px 0px', threshold: 0.04 });
    revealTargets.forEach(function (element) {
      element.classList.add('au-reveal');
      observer.observe(element);
    });
  }

  if (!reducedMotion) {
    root.addEventListener('pointerdown', function (event) {
      var target = event.target.closest('button, .aurelia-header-actions a, .aurelia-page-tools a');
      if (!target || !root.contains(target)) return;

      var rect = target.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'au-ripple';
      ripple.setAttribute('aria-hidden', 'true');
      ripple.style.left = (event.clientX - rect.left) + 'px';
      ripple.style.top = (event.clientY - rect.top) + 'px';
      target.appendChild(ripple);
      ripple.addEventListener('animationend', function () {
        ripple.remove();
      }, { once: true });
    }, { passive: true });
  }

  root.classList.add('au-ready');
})();

(function () {
  'use strict';

  var root = document.getElementById('aurelia-root');
  if (!root) return;

  var tools = root.querySelector('.aurelia-page-tools');
  if (tools) {
    var isSpecialPage = document.body.classList.contains('mw-special') ||
      document.body.classList.contains('ns--1');

    if (isSpecialPage) {
      tools.hidden = true;
      tools.setAttribute('aria-hidden', 'true');
    }

    var summary = tools.querySelector('summary');
    if (summary) {
      summary.setAttribute('aria-label', 'More page actions');
      summary.setAttribute('title', 'More page actions');
    }
    document.addEventListener('click', function (event) {
      if (!tools.contains(event.target)) tools.open = false;
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && tools.open) {
        tools.open = false;
        var trigger = tools.querySelector('summary');
        if (trigger) trigger.focus();
      }
    });
  }

  if (root.getAttribute('data-page-type') !== 'article') return;

  var content = root.querySelector('.aurelia-content .mw-parser-output');
  if (!content) return;

  var toc = content.querySelector('#toc, .toc');
  if (toc) {
    var tocTitle = toc.querySelector('.toctitle');
    var tocList = toc.querySelector(':scope > ul, :scope > div > ul');
    if (tocTitle && tocList && !toc.querySelector('.aurelia-toc-toggle')) {
      var toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'aurelia-toc-toggle';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Collapse table of contents');
      toggle.innerHTML = '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i>';
      tocTitle.appendChild(toggle);

      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        toggle.setAttribute('aria-label', expanded ? 'Expand table of contents' : 'Collapse table of contents');
        toc.classList.toggle('aurelia-toc-collapsed', expanded);
        toggle.innerHTML = expanded
          ? '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>'
          : '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i>';
      });
    }
  }
})();
