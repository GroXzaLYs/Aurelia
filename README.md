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

- Responsive desktop, tablet, and mobile layouts
- Collapsible mobile navigation with keyboard dismissal
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
- Lightweight CSS motion, hover feedback, and viewport reveal transitions
- Respects reduced-motion preferences and uses IntersectionObserver only when available
- No JavaScript or CSS framework dependencies

## Supported interface languages

The skin-name description is localized in 13 languages. Runtime labels are localized in the same language set where the browser/wiki language is available, with English fallback. MediaWiki page-content translation and language availability remain controlled by MediaWiki and installed language/translation extensions.

## Notes

Aurelia uses MediaWiki's SkinMustache template data and ResourceLoader modules. Extensions may provide their own markup and styles; test extension-specific interfaces on the target wiki. After installation or upgrade, purge the page cache and clear ResourceLoader cache if old assets remain visible.

## License

MIT


## Font Awesome

Aurelia bundles **Font Awesome Free 7.3.1** locally; no CDN or external font request is used. The skin loads `resources/vendor/fontawesome/css/all.min.css` through MediaWiki ResourceLoader, with its matching WOFF2 files in `resources/vendor/fontawesome/webfonts/`.

The bundled upstream license is included at `resources/vendor/fontawesome/LICENSE.txt`. Font Awesome Free uses CC BY 4.0 for icons, SIL OFL 1.1 for fonts, and MIT for code. See the included license file and the Font Awesome license page for the applicable terms.

## Icons

Aurelia bundles Font Awesome Free locally through ResourceLoader. Interface icons use Font Awesome classes and local webfonts; no external icon CDN is required. Icons are applied consistently to navigation, header controls, portlet links, page tools, footer links, search, theme controls, account controls, copy-code actions, and back-to-top.

## Extension interface styling

Aurelia includes coordinated styles for common MediaWiki extension and interface components, including OOUI, VisualEditor, WikiEditor, CodeMirror, Echo, DiscussionTools, Cite, CategoryTree, Page Forms, Cargo, Kartographer, Math, Score, and UploadWizard. The styles reuse Aurelia surface, text, border, accent, and spacing tokens, with compact form controls, buttons, notices, menus, tables, editor frames, and responsive overflow handling.

The skin styles extension output only; extension functionality and extension PHP/JavaScript are not modified. Dialogs and popups rendered outside the skin wrapper receive the active Aurelia color theme through the body theme attribute.

The skin version remains 1.0.0.
