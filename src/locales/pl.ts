import type { Locale } from './types.js';

export const locale: Locale = {
  tools: {
    // KONTAKTY
    fluentcrm_list_contacts: {
      description: 'Pobiera listę wszystkich kontaktów z FluentCRM',
      params: {
        page: 'Numer strony (default: 1)',
        per_page: 'Ilość rekordów na stronę (default: 10)',
        search: 'Szukaj po emailu/imieniu',
      },
    },
    fluentcrm_get_contact: {
      description: 'Pobiera szczegóły konkretnego kontaktu',
      params: { subscriberId: 'ID kontaktu' },
    },
    fluentcrm_find_contact_by_email: {
      description: 'Wyszukuje kontakt po adresie email',
      params: { email: 'Adres email' },
    },
    fluentcrm_create_contact: {
      description: 'Tworzy nowy kontakt w FluentCRM',
      params: {
        email: 'Email kontaktu',
        first_name: 'Imię',
        last_name: 'Nazwisko',
        phone: 'Numer telefonu',
        address_line_1: 'Adres',
        city: 'Miasto',
        country: 'Kraj',
      },
    },
    fluentcrm_update_contact: {
      description: 'Aktualizuje dane kontaktu',
      params: { subscriberId: 'ID kontaktu' },
    },
    fluentcrm_delete_contact: {
      description: 'Usuwa kontakt z FluentCRM',
      params: { subscriberId: 'ID kontaktu do usunięcia' },
    },

    // TAGI
    fluentcrm_list_tags: {
      description: 'Pobiera wszystkie tagi z FluentCRM',
      params: { page: 'Numer strony', search: 'Szukaj tagu' },
    },
    fluentcrm_create_tag: {
      description: 'Tworzy nowy tag w FluentCRM',
      params: {
        title: 'Nazwa tagu (np. "AW-progress-75")',
        slug: 'Slug tagu (np. "aw-progress-75")',
        description: 'Opis tagu',
      },
    },
    fluentcrm_delete_tag: {
      description: 'Usuwa tag z FluentCRM',
      params: { tagId: 'ID tagu' },
    },
    fluentcrm_attach_tag_to_contact: {
      description: 'Przypisuje tag do kontaktu',
      params: { subscriberId: 'ID kontaktu', tagIds: 'Lista ID tagów' },
    },
    fluentcrm_detach_tag_from_contact: {
      description: 'Usuwa tag z kontaktu',
      params: { subscriberId: 'ID kontaktu', tagIds: 'Lista ID tagów' },
    },

    // LISTY
    fluentcrm_list_lists: { description: 'Pobiera wszystkie listy z FluentCRM' },
    fluentcrm_create_list: {
      description: 'Tworzy nową listę w FluentCRM',
      params: { title: 'Nazwa listy', slug: 'Slug listy', description: 'Opis listy' },
    },
    fluentcrm_delete_list: {
      description: 'Usuwa listę z FluentCRM',
      params: { listId: 'ID listy' },
    },
    fluentcrm_attach_contact_to_list: {
      description: 'Przypisuje kontakt do listy',
      params: { subscriberId: 'ID kontaktu', listIds: 'Lista ID list' },
    },
    fluentcrm_detach_contact_from_list: {
      description: 'Usuwa kontakt z listy',
      params: { subscriberId: 'ID kontaktu', listIds: 'Lista ID list' },
    },

    // KAMPANIE
    fluentcrm_list_campaigns: {
      description: 'Pobiera listę kampanii email',
    },
    fluentcrm_create_campaign: {
      description: 'Tworzy nową kampanię email',
      params: {
        title:            'Tytuł kampanii',
        subject:          'Temat emaila',
        template_id:      'ID szablonu do zaimportowania jako treść',
        recipient_list:   'Tablica ID list odbiorców',
        email_pre_header: 'Tekst podglądu wyświetlany po temacie w skrzynkach',
        subjects:         'Tematy A/B: [{subject, ratio}] — ratio to priorytet %',
        from_name:        'Niestandardowa nazwa nadawcy',
        from_email:       'Niestandardowy adres email nadawcy',
        reply_to_name:    'Nazwa dla odpowiedzi',
        reply_to_email:   'Adres email dla odpowiedzi',
        utm_source:       'Źródło UTM (np. newsletter) — WYMAGANE gdy używane jest śledzenie UTM',
        utm_medium:       'Medium UTM (np. email) — WYMAGANE gdy używane jest śledzenie UTM',
        utm_campaign:     'Nazwa kampanii UTM — WYMAGANE gdy używane jest śledzenie UTM',
        utm_term:         'Termin UTM (opcjonalne)',
        utm_content:      'Zawartość UTM (opcjonalne)',
        tags:             'Tablica ID tagów jako odbiorcy kampanii',
        contact_emails:   'Tablica konkretnych adresów email odbiorców',
        scheduled_at:     'Zaplanuj wysyłkę: "YYYY-MM-DD HH:mm:ss". Status kampanii zmienia się na "scheduled".',
      },
    },
    fluentcrm_pause_campaign: {
      description: 'Wstrzymuje kampanię',
      params: { campaignId: 'ID kampanii' },
    },
    fluentcrm_resume_campaign: {
      description: 'Wznawia kampanię',
      params: { campaignId: 'ID kampanii' },
    },
    fluentcrm_delete_campaign: {
      description: 'Usuwa kampanię',
      params: { campaignId: 'ID kampanii' },
    },

    // EMAIL TEMPLATES
    fluentcrm_list_email_templates: { description: 'Pobiera szablony email' },
    fluentcrm_create_email_template: {
      description: 'Tworzy nowy szablon email',
      params: { title: 'Nazwa szablonu', subject: 'Temat', body: 'Treść HTML' },
    },

    // AUTOMATYZACJE
    fluentcrm_list_automations: { description: 'Pobiera automatyzacje (funnels)' },
    fluentcrm_get_automation: {
      description: 'Pobiera konkretną automatyzację (funnel) po ID',
      params: { funnelId: 'ID funnela' },
    },
    fluentcrm_update_funnel_status: {
      description: 'Aktualizuje status funnela (published, draft lub paused)',
      params: { funnelId: 'ID funnela', status: 'Nowy status: published, draft lub paused' },
    },
    fluentcrm_duplicate_funnel: {
      description: 'Tworzy kopię istniejącego funnela',
      params: { funnelId: 'ID funnela do skopiowania' },
    },
    fluentcrm_delete_automation: {
      description: 'Usuwa funnel i zatrzymuje wszystkie aktywne sekwencje',
      params: { funnelId: 'ID funnela do usunięcia' },
    },
    fluentcrm_get_funnel_subscribers: {
      description: 'Pobiera subskrybentów zapisanych do funnela',
      params: { funnelId: 'ID funnela', status: 'Filtruj po statusie: active, completed lub cancelled' },
    },
    fluentcrm_update_funnel_subscriber_status: {
      description: 'Aktualizuje status kontaktu zapisanego w lejku (np. active, paused, cancelled)',
      params: { funnelId: 'ID lejka', subscriberId: 'ID subskrybenta (kontaktu)', status: 'Nowy status: active, paused lub cancelled' },
    },
    fluentcrm_remove_funnel_subscriber: {
      description: 'Usuwa jeden lub więcej kontaktów z funnela',
      params: { funnelId: 'ID funnela', subscriber_ids: 'Tablica ID subskrybentów do usunięcia' },
    },
    fluentcrm_add_subscribers_to_funnel: {
      description: 'Dodaje jeden lub więcej kontaktów do funnela (automatyzacji). Wymaga FluentCRM Pro.',
      params: { funnelId: 'ID funnela, do którego zostaną zapisani kontakci', subscriber_ids: 'Tablica ID kontaktów do dodania do funnela' },
    },
    fluentcrm_get_funnel_report: {
      description: 'Pobiera raport wydajności funnela',
      params: { funnelId: 'ID funnela' },
    },
    fluentcrm_get_funnel_sequences: {
      description: 'Pobiera wszystkie kroki (sekwencje/akcje) w automatyzacji funnela. Zwraca każdy krok z typem, nazwą akcji, ustawieniami i gałęziami warunkowymi.',
      params: { funnelId: 'ID funnela' },
    },

    // WEBHOOKS
    fluentcrm_list_webhooks: { description: 'Pobiera webhooks' },
    fluentcrm_create_webhook: {
      description: 'Tworzy nowy webhook',
      params: { name: 'Nazwa webhook', url: 'URL webhook' },
    },

    // SMART LINKS
    fluentcrm_list_smart_links: {
      description: 'Pobiera listę Smart Links z FluentCRM (może nie być dostępne w obecnej wersji)',
      params: { page: 'Numer strony', search: 'Szukaj Smart Link' },
    },
    fluentcrm_get_smart_link: {
      description: 'Pobiera szczegóły konkretnego Smart Link',
      params: { smartLinkId: 'ID Smart Link' },
    },
    fluentcrm_create_smart_link: {
      description: 'Tworzy nowy Smart Link (może nie być dostępne w obecnej wersji)',
      params: {
        title: 'Nazwa Smart Link (np. "AW-Link-Webinar-Mail")',
        slug: 'Slug (np. "aw-link-webinar-mail")',
        target_url: 'Docelowy URL',
        apply_tags: 'ID tagów do dodania po kliknięciu',
        apply_lists: 'ID list do dodania po kliknięciu',
        remove_tags: 'ID tagów do usunięcia po kliknięciu',
        remove_lists: 'ID list do usunięcia po kliknięciu',
        auto_login: 'Czy automatycznie logować użytkownika',
      },
    },
    fluentcrm_update_smart_link: {
      description: 'Aktualizuje Smart Link (może nie być dostępne w obecnej wersji)',
      params: { smartLinkId: 'ID Smart Link' },
    },
    fluentcrm_delete_smart_link: {
      description: 'Usuwa Smart Link (może nie być dostępne w obecnej wersji)',
      params: { smartLinkId: 'ID Smart Link do usunięcia' },
    },
    fluentcrm_generate_smart_link_shortcode: {
      description: 'Generuje shortcode dla Smart Link',
      params: { slug: 'Slug Smart Link', linkText: 'Tekst linku (opcjonalny)' },
    },
    fluentcrm_validate_smart_link_data: {
      description: 'Waliduje dane Smart Link przed utworzeniem',
      params: { title: 'Nazwa Smart Link', slug: 'Slug', target_url: 'Docelowy URL' },
    },

    // RAPORTY
    fluentcrm_dashboard_stats: { description: 'Pobiera statystyki dashboarda' },
    fluentcrm_custom_fields: { description: 'Pobiera pola niestandardowe' },
  },
};
