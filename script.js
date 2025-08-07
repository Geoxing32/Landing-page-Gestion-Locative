const translations = {
  // ... insérez ici l'objet complet comme dans le point 3 ...
};

class MultiLanguageManager {
  constructor() {
    this.supportedLanguages = ['fr', 'en', 'it', 'ru'];
    this.defaultLanguage = 'fr';
    this.currentLanguage = this.defaultLanguage;
    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    this.currentLanguage = this.getLangFromUrl() || this.getSavedLanguage() || this.detectBrowserLanguage() || this.defaultLanguage;
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
      // localStorage bloqué ou indisponible
    }
  }

  detectBrowserLanguage() {
    const lang = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
    return this.supportedLanguages.includes(lang) ? lang : this.defaultLanguage;
  }

  applyLanguage(lang) {
    if (!translations[lang]) {
      console.warn(`Pas de traduction disponible pour la langue: ${lang}`);
      return;
    }
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      const text = translations[lang][key];
      if (!text) return;

      if (el.tagName.toLowerCase() === 'title') {
        el.textContent = text;
      } else if (el.tagName.toLowerCase() === 'meta') {
        el.setAttribute('content', text);
      } else {
        el.innerHTML = text;
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

new MultiLanguageManager();

