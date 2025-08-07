const translations = {
  fr: {
    page_title: "Daisy Rossi & Associés Immobilier - Gestion Locative Côte d'Azur",
    hero_title: "Gestion Locative d'Excellence sur la Côte d'Azur",
    hero_subtitle: "Confiez-nous votre bien immobilier et bénéficiez d'une gestion locative experte avec garantie totale à Roquebrune-Cap-Martin.",
    hero_cta: "Découvrir nos services",
    offer_badge: "Offre Spéciale Rentrée 2025",
    offer_title: "État des lieux offert & Frais d’entremise / négociation offerts",
    offer_description: "Pour toute signature d’un mandat de location accompagné d’un mandat de gestion locative avant le 30 novembre 2025, profitez de nos avantages exclusifs pour bien démarrer la nouvelle saison !",
    offer_cta: "Profiter de l'offre",
    // ... autres clés de traduction ...
  },
  en: {
    page_title: "Daisy Rossi & Associates Real Estate - Rental Management French Riviera",
    hero_title: "Excellence in Rental Management on the French Riviera",
    hero_subtitle: "Entrust us with your property and benefit from expert rental management with total guarantee in Roquebrune-Cap-Martin.",
    hero_cta: "Discover our services",
    offer_badge: "Special Back-to-School 2025 Offer",
    offer_title: "Inventory Check Free & Brokerage/Negotiation Fees Waived",
    offer_description: "For any signing of a rental lease accompanied by a management mandate before November 30, 2025, enjoy our exclusive benefits to start the new season right!",
    offer_cta: "Take advantage of the offer",
    // ... autres clés de traduction ...
  },
  it: {
    page_title: "Daisy Rossi & Associati Immobiliare - Gestione Locativa Costa Azzurra",
    hero_title: "Gestione Locativa d'Eccellenza sulla Costa Azzurra",
    hero_subtitle: "Affidateci il vostro immobile e beneficiate di una gestione locativa esperta con garanzia totale a Roquebrune-Cap-Martin.",
    hero_cta: "Scoprite i nostri servizi",
    offer_badge: "Offerta Speciale Rientro 2025",
    offer_title: "Inventario gratuito & Spese di mediazione / negoziazione gratuite",
    offer_description: "Per qualsiasi firma di un mandato di locazione accompagnato da un mandato di gestione prima del 30 novembre 2025, approfittate dei nostri vantaggi esclusivi per iniziare bene la nuova stagione!",
    offer_cta: "Approfittare dell'offerta",
    // ... autres clés de traduction ...
  },
  ru: {
    page_title: "Daisy Rossi & Associates Недвижимость - Управление Арендой Лазурный Берег",
    hero_title: "Превосходное Управление Арендой на Лазурном Берегу",
    hero_subtitle: "Доверьте нам вашу недвижимость и получите экспертное управление арендой с полной гарантией в Рокебрюн-Кап-Мартен.",
    hero_cta: "Узнать о наших услугах",
    offer_badge: "Специальное Предложение к осени 2025",
    offer_title: "Бесплатный осмотр и отмена комиссий за посредничество/переговоры",
    offer_description: "При подписании договора аренды в комплекте с договором управления до 30 ноября 2025 года получите эксклюзивные преимущества для успешного начала нового сезона!",
    offer_cta: "Воспользоваться предложением",
    // ... autres clés de traduction ...
  }
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
      // Ignore localStorage issues
    }
  }

  detectBrowserLanguage() {
    const lang = (navigator.language || navigator.userLanguage).split('-')[0].toLowerCase();
    return this.supportedLanguages.includes(lang) ? lang : this.defaultLanguage;
  }

  applyLanguage(lang) {
    if (!translations[lang]) {
      console.warn(`No translations available for language: ${lang}`);
      return;
    }
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      const text = translations[lang][key];
      if (!text) return;
      if (el.tagName.toLowerCase() === 'title') el.textContent = text;
      else if (el.tagName.toLowerCase() === 'meta') el.setAttribute('content', text);
      else el.innerHTML = text;
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
