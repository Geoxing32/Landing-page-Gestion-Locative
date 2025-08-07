// script.js

// Si vous utilisez un module bundler, importez ici les traductions 
// Sinon, assurez-vous que translations est disponible globalement (via <script> ou inclus dans ce fichier)
if (typeof translations === 'undefined') {
  console.error("L'objet 'translations' n'est pas défini. Assurez-vous d'importer 'translations.js' avant ce script.");
}

class MultiLanguageManager {
  constructor(translations) {
    this.translations = translations;
    this.supportedLanguages = Object.keys(translations);
    this.defaultLanguage = 'fr';
    this.currentLanguage = this.defaultLanguage;

    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    this.currentLanguage =
      this.getLangFromUrl() ||
      this.getSavedLanguage() ||
      this.detectBrowserLanguage() ||
      this.defaultLanguage;

    this.applyLanguage(this.currentLanguage);
    this.setupLanguageButtons();
    this.updateActiveButton(this.currentLanguage);
    this.updateUrlWithLang(this.currentLanguage);
  }

  getLangFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    return this.supportedLanguages.includes(lang) ? lang : null;
  }

  getSavedLanguage() {
    try {
      const lang = localStorage.getItem('daisy-rossi-language');
      return this.supportedLanguages.includes(lang) ? lang : null;
    } catch {
      return null;
    }
  }

  saveLanguage(lang) {
    try {
      localStorage.setItem('daisy-rossi-language', lang);
    } catch {
      // localStorage peut être bloqué dans certains navigateurs
    }
  }

  detectBrowserLanguage() {
    const lang = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
    return this.supportedLanguages.includes(lang) ? lang : this.defaultLanguage;
  }

  applyLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Pas de traductions disponibles pour la langue : ${lang}`);
      return;
    }

    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
      const key = el.getAttribute('data-translate');
      const translation = this.translations[lang][key];
      if (!translation) return;

      if (el.tagName.toLowerCase() === 'title') {
        el.textContent = translation;
      } else if (el.tagName.toLowerCase() === 'meta') {
        el.setAttribute('content', translation);
      } else {
        el.innerHTML = translation; // Permet d'utiliser du HTML dans les traductions
      }
    });

    document.documentElement.setAttribute('lang', lang);
  }

  setupLanguageButtons() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        if (this.supportedLanguages.includes(lang)) {
          this.switchLanguage(lang);
        }
      });
    });
  }

  switchLanguage(lang) {
    if (lang === this.currentLanguage) return;
    this.currentLanguage = lang;
    this.saveLanguage(lang);
    this.applyLanguage(lang);
    this.updateActiveButton(lang);
    this.updateUrlWithLang(lang);
  }

  updateActiveButton(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  updateUrlWithLang(lang) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  }
}

// Initialisation, en supposant que `translations` est défini globalement
new MultiLanguageManager(translations);
