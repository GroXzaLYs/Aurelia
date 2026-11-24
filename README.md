# Aurelia MediaWiki Skin

Aurelia is a responsive editorial-style skin for MediaWiki, built with SkinMustache, ResourceLoader, CSS, and vanilla JavaScript.

## Requirements

- MediaWiki 1.39 or newer
- PHP version supported by the installed MediaWiki release

## Installation

1. Extract the `Aurelia` directory into the MediaWiki `skins/` directory.
2. Add this line to `LocalSettings.php`:

   ```php
   wfLoadSkin( 'Aurelia' );
   ```

3. Open `Special:Preferences`, choose **Aurelia**, and save. For a direct preview, append `?useskin=aurelia` to a wiki URL.

## Features

- Manual light/dark theme switch with saved preference
- System color-scheme support before a manual preference is selected
- Article typography, tables, infoboxes, code blocks, TOC, categories, and media styling
- Localization for Indonesian, English, German, Spanish, French, Italian, Brazilian Portuguese, Japanese, Simplified Chinese, Russian, Arabic, Dutch, and Korean
- Font Awesome Free 7.3.1 bundled locally (Solid, Regular, and Brands)
- Reading progress indicator and back-to-top control
- Copy buttons for article code blocks
- Ctrl/⌘ + K search shortcut
- Keyboard-aware mobile navigation and accessible controls
- Consistent 40px header control alignment across desktop and mobile
- Language-aware interface labels for theme, navigation, account, copy, and back-to-top controls
- Respects reduced-motion preferences and uses IntersectionObserver only when available

## License

MIT


## Font Awesome

Aurelia bundles **Font Awesome Free 7.3.1** locally; no CDN or external font request is used. The skin loads `resources/vendor/fontawesome/css/all.min.css` through MediaWiki ResourceLoader, with its matching WOFF2 files in `resources/vendor/fontawesome/webfonts/`.

The bundled upstream license is included at `resources/vendor/fontawesome/LICENSE.txt`. Font Awesome Free uses CC BY 4.0 for icons, SIL OFL 1.1 for fonts, and MIT for code. See the included license file and the Font Awesome license page for the applicable terms.

## Icons

Aurelia bundles Font Awesome Free locally through ResourceLoader. Interface icons use Font Awesome classes and local webfonts; no external icon CDN is required. Icons are applied consistently to navigation, header controls, portlet links, page tools, footer links, search, theme controls, account controls, copy-code actions, and back-to-top.
