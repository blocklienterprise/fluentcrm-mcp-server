import type { Locale } from './types.js';

export const locale: Locale = {
  tools: {
    // CONTACTS
    fluentcrm_list_contacts: {
      description: 'Retrieves a list of all contacts from FluentCRM',
      params: {
        page: 'Page number (default: 1)',
        per_page: 'Records per page (default: 10)',
        search: 'Search by email or name',
      },
    },
    fluentcrm_get_contact: {
      description: 'Retrieves details of a specific contact',
      params: { subscriberId: 'Contact ID' },
    },
    fluentcrm_find_contact_by_email: {
      description: 'Finds a contact by email address',
      params: { email: 'Email address' },
    },
    fluentcrm_create_contact: {
      description: 'Creates a new contact in FluentCRM',
      params: {
        email: 'Contact email',
        first_name: 'First name',
        last_name: 'Last name',
        phone: 'Phone number',
        address_line_1: 'Address',
        city: 'City',
        country: 'Country',
      },
    },
    fluentcrm_update_contact: {
      description: 'Updates contact details',
      params: { subscriberId: 'Contact ID' },
    },
    fluentcrm_delete_contact: {
      description: 'Deletes a contact from FluentCRM',
      params: { subscriberId: 'ID of the contact to delete' },
    },

    // TAGS
    fluentcrm_list_tags: {
      description: 'Retrieves all tags from FluentCRM',
      params: { page: 'Page number', search: 'Search tags' },
    },
    fluentcrm_create_tag: {
      description: 'Creates a new tag in FluentCRM',
      params: {
        title: 'Tag name (e.g. "AW-progress-75")',
        slug: 'Tag slug (e.g. "aw-progress-75")',
        description: 'Tag description',
      },
    },
    fluentcrm_delete_tag: {
      description: 'Deletes a tag from FluentCRM',
      params: { tagId: 'Tag ID' },
    },
    fluentcrm_attach_tag_to_contact: {
      description: 'Attaches a tag to a contact',
      params: { subscriberId: 'Contact ID', tagIds: 'List of tag IDs' },
    },
    fluentcrm_detach_tag_from_contact: {
      description: 'Removes a tag from a contact',
      params: { subscriberId: 'Contact ID', tagIds: 'List of tag IDs' },
    },

    // LISTS
    fluentcrm_list_lists: { description: 'Retrieves all lists from FluentCRM' },
    fluentcrm_create_list: {
      description: 'Creates a new list in FluentCRM',
      params: { title: 'List name', slug: 'List slug', description: 'List description' },
    },
    fluentcrm_delete_list: {
      description: 'Deletes a list from FluentCRM',
      params: { listId: 'List ID' },
    },
    fluentcrm_attach_contact_to_list: {
      description: 'Adds a contact to a list',
      params: { subscriberId: 'Contact ID', listIds: 'List of list IDs' },
    },
    fluentcrm_detach_contact_from_list: {
      description: 'Removes a contact from a list',
      params: { subscriberId: 'Contact ID', listIds: 'List of list IDs' },
    },

    // CAMPAIGNS
    fluentcrm_list_campaigns: {
      description: 'Retrieves a list of email campaigns',
    },
    fluentcrm_create_campaign: {
      description: 'Creates a new email campaign',
      params: {
        title: 'Campaign title',
        subject: 'Email subject',
        template_id: 'Template ID',
        recipient_list: 'List IDs',
      },
    },
    fluentcrm_pause_campaign: {
      description: 'Pauses a campaign',
      params: { campaignId: 'Campaign ID' },
    },
    fluentcrm_resume_campaign: {
      description: 'Resumes a paused campaign',
      params: { campaignId: 'Campaign ID' },
    },
    fluentcrm_delete_campaign: {
      description: 'Deletes a campaign',
      params: { campaignId: 'Campaign ID' },
    },

    // EMAIL TEMPLATES
    fluentcrm_list_email_templates: { description: 'Retrieves email templates' },
    fluentcrm_create_email_template: {
      description: 'Creates a new email template',
      params: { title: 'Template name', subject: 'Subject', body: 'HTML body content' },
    },

    // AUTOMATIONS
    fluentcrm_list_automations: { description: 'Retrieves automations (funnels)' },
    fluentcrm_create_automation: {
      description: 'Creates a new automation',
      params: { title: 'Automation name', trigger: 'Trigger type' },
    },

    // WEBHOOKS
    fluentcrm_list_webhooks: { description: 'Retrieves webhooks' },
    fluentcrm_create_webhook: {
      description: 'Creates a new webhook',
      params: { name: 'Webhook name', url: 'Webhook URL' },
    },

    // SMART LINKS
    fluentcrm_list_smart_links: {
      description: 'Retrieves a list of Smart Links from FluentCRM (may not be available in all versions)',
      params: { page: 'Page number', search: 'Search Smart Links' },
    },
    fluentcrm_get_smart_link: {
      description: 'Retrieves details of a specific Smart Link',
      params: { smartLinkId: 'Smart Link ID' },
    },
    fluentcrm_create_smart_link: {
      description: 'Creates a new Smart Link (may not be available in all versions)',
      params: {
        title: 'Smart Link name (e.g. "AW-Link-Webinar-Mail")',
        slug: 'Slug (e.g. "aw-link-webinar-mail")',
        target_url: 'Target URL',
        apply_tags: 'Tag IDs to apply on click',
        apply_lists: 'List IDs to apply on click',
        remove_tags: 'Tag IDs to remove on click',
        remove_lists: 'List IDs to remove on click',
        auto_login: 'Automatically log in the user on click',
      },
    },
    fluentcrm_update_smart_link: {
      description: 'Updates a Smart Link (may not be available in all versions)',
      params: { smartLinkId: 'Smart Link ID' },
    },
    fluentcrm_delete_smart_link: {
      description: 'Deletes a Smart Link (may not be available in all versions)',
      params: { smartLinkId: 'ID of the Smart Link to delete' },
    },
    fluentcrm_generate_smart_link_shortcode: {
      description: 'Generates a shortcode for a Smart Link',
      params: { slug: 'Smart Link slug', linkText: 'Link text (optional)' },
    },
    fluentcrm_validate_smart_link_data: {
      description: 'Validates Smart Link data before creation',
      params: { title: 'Smart Link name', slug: 'Slug', target_url: 'Target URL' },
    },

    // REPORTS
    fluentcrm_dashboard_stats: { description: 'Retrieves dashboard statistics' },
    fluentcrm_custom_fields: { description: 'Retrieves custom fields' },
  },
};
