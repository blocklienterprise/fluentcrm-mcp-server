#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { t } from './i18n.js';
import { randomUUID } from 'crypto';

dotenv.config();

const FLUENTCRM_API_URL = process.env.FLUENTCRM_API_URL || 'https://your-domain.com/wp-json/fluent-crm/v2';
const FLUENTCRM_API_USERNAME = process.env.FLUENTCRM_API_USERNAME || '';
const FLUENTCRM_API_PASSWORD = process.env.FLUENTCRM_API_PASSWORD || '';

/**
 * FluentCRM API Client
 * Based on: https://rest-api.fluentcrm.com/#introduction
 */
class FluentCRMClient {
  private apiClient: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string, username: string, password: string) {
    this.baseURL = baseURL;
    
    // Basic Auth dla FluentCRM API
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    
    this.apiClient = axios.create({
      baseURL,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    // Error interceptor
    this.apiClient.interceptors.response.use(
      response => response,
      error => {
        const message = error.response?.data?.message || error.message;
        throw new Error(`FluentCRM API Error: ${message}`);
      }
    );
  }

  // ===== SUBSCRIBERS / KONTAKTY =====
  
  async listContacts(params: any = {}) {
    const response = await this.apiClient.get('/subscribers', { params });
    return response.data;
  }

  async getContact(subscriberId: number) {
    const response = await this.apiClient.get(`/subscribers/${subscriberId}`);
    return response.data;
  }

  async findContactByEmail(email: string) {
    const response = await this.apiClient.get('/subscribers', {
      params: { search: email },
    });
    return response.data.data?.[0] || null;
  }

  async createContact(data: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address_line_1?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    [key: string]: any;
  }) {
    const response = await this.apiClient.post('/subscribers', data);
    return response.data;
  }

  async updateContact(subscriberId: number, data: any) {
    const response = await this.apiClient.put(`/subscribers/${subscriberId}`, data);
    return response.data;
  }

  async deleteContact(subscriberId: number) {
    const response = await this.apiClient.delete(`/subscribers/${subscriberId}`);
    return response.data;
  }

  // ===== TAGI =====

  async listTags(params: any = {}) {
    const response = await this.apiClient.get('/tags', { params });
    return response.data;
  }

  async getTag(tagId: number) {
    const response = await this.apiClient.get(`/tags/${tagId}`);
    return response.data;
  }

  async createTag(data: {
    title: string;
    slug?: string;
    description?: string;
  }) {
    const response = await this.apiClient.post('/tags', data);
    return response.data;
  }

  async updateTag(tagId: number, data: any) {
    const response = await this.apiClient.put(`/tags/${tagId}`, data);
    return response.data;
  }

  async deleteTag(tagId: number) {
    const response = await this.apiClient.delete(`/tags/${tagId}`);
    return response.data;
  }

  async attachTagToContact(subscriberId: number, tagIds: number[]) {
    const response = await this.apiClient.post(
      `/subscribers/${subscriberId}/tags`,
      { tags: tagIds }
    );
    return response.data;
  }

  async detachTagFromContact(subscriberId: number, tagIds: number[]) {
    const response = await this.apiClient.post(
      `/subscribers/${subscriberId}/tags/detach`,
      { tags: tagIds }
    );
    return response.data;
  }

  // ===== LISTY =====

  async listLists(params: any = {}) {
    const response = await this.apiClient.get('/lists', { params });
    return response.data;
  }

  async getList(listId: number) {
    const response = await this.apiClient.get(`/lists/${listId}`);
    return response.data;
  }

  async createList(data: {
    title: string;
    slug?: string;
    description?: string;
  }) {
    const response = await this.apiClient.post('/lists', data);
    return response.data;
  }

  async updateList(listId: number, data: any) {
    const response = await this.apiClient.put(`/lists/${listId}`, data);
    return response.data;
  }

  async deleteList(listId: number) {
    const response = await this.apiClient.delete(`/lists/${listId}`);
    return response.data;
  }

  async attachContactToList(subscriberId: number, listIds: number[]) {
    const response = await this.apiClient.post(
      `/subscribers/${subscriberId}/lists`,
      { lists: listIds }
    );
    return response.data;
  }

  async detachContactFromList(subscriberId: number, listIds: number[]) {
    const response = await this.apiClient.post(
      `/subscribers/${subscriberId}/lists/detach`,
      { lists: listIds }
    );
    return response.data;
  }

  // ===== KAMPANIE =====

  async listCampaigns(params: any = {}) {
    const response = await this.apiClient.get('/campaigns', { params });
    return response.data;
  }

  async getCampaign(campaignId: number) {
    const response = await this.apiClient.get(`/campaigns/${campaignId}`);
    return response.data;
  }

  async createCampaign(data: any) {
    const response = await this.apiClient.post('/campaigns', data);
    return response.data;
  }

  async updateCampaign(campaignId: number, data: any) {
    const response = await this.apiClient.put(`/campaigns/${campaignId}`, data);
    return response.data;
  }

  async pauseCampaign(campaignId: number) {
    const response = await this.apiClient.post(`/campaigns/${campaignId}/pause`);
    return response.data;
  }

  async resumeCampaign(campaignId: number) {
    const response = await this.apiClient.post(`/campaigns/${campaignId}/resume`);
    return response.data;
  }

  async deleteCampaign(campaignId: number) {
    const response = await this.apiClient.delete(`/campaigns/${campaignId}`);
    return response.data;
  }

  // ===== EMAIL TEMPLATES =====

  async listEmailTemplates(params: any = {}) {
    const response = await this.apiClient.get('/email-templates', { params });
    return response.data;
  }

  async getEmailTemplate(templateId: number) {
    const response = await this.apiClient.get(`/email-templates/${templateId}`);
    return response.data;
  }

  async createEmailTemplate(data: any) {
    const response = await this.apiClient.post('/email-templates', data);
    return response.data;
  }

  async updateEmailTemplate(templateId: number, data: any) {
    const response = await this.apiClient.put(`/email-templates/${templateId}`, data);
    return response.data;
  }

  async deleteEmailTemplate(templateId: number) {
    const response = await this.apiClient.delete(`/email-templates/${templateId}`);
    return response.data;
  }

  // ===== AUTOMATION FUNNELS =====

  async listAutomations(params: any = {}) {
    const response = await this.apiClient.get('/funnels', { params });
    return response.data;
  }

  async getAutomation(funnelId: number) {
    const response = await this.apiClient.get(`/funnels/${funnelId}`);
    return response.data;
  }

  async createAutomation(data: any) {
    const response = await this.apiClient.post('/funnels', data);
    return response.data;
  }

  async updateAutomation(funnelId: number, data: any) {
    const response = await this.apiClient.put(`/funnels/${funnelId}`, data);
    return response.data;
  }

  async deleteAutomation(funnelId: number) {
    const response = await this.apiClient.delete(`/funnels/${funnelId}`);
    return response.data;
  }

  // ===== WEBHOOKS =====

  async listWebhooks(params: any = {}) {
    const response = await this.apiClient.get('/webhooks', { params });
    return response.data;
  }

  async createWebhook(data: {
    name: string;
    status: 'pending' | 'subscribed';
    url: string;
    tags?: number[];
    lists?: number[];
  }) {
    const response = await this.apiClient.post('/webhook', data);
    return response.data;
  }

  async updateWebhook(webhookId: number, data: any) {
    const response = await this.apiClient.put(`/webhook/${webhookId}`, data);
    return response.data;
  }

  async deleteWebhook(webhookId: number) {
    const response = await this.apiClient.delete(`/webhook/${webhookId}`);
    return response.data;
  }

  // ===== CUSTOM FIELDS =====

  async listCustomFields() {
    const response = await this.apiClient.get('/custom-fields');
    return response.data;
  }

  // ===== SMART LINKS =====
  // Note: FluentCRM doesn't have native REST API for Smart Links yet
  // These methods prepare for future API or work with existing endpoints

  async listSmartLinks(params: any = {}) {
    // Try to get smart links - this might not work until FluentCRM adds the endpoint
    try {
      const response = await this.apiClient.get('/smart-links', { params });
      return response.data;
    } catch (error: any) {
      // If endpoint doesn't exist, return helpful message
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Smart Links API endpoint not available yet in FluentCRM",
          suggestion: "Use FluentCRM admin panel to manage Smart Links manually",
          available_endpoints: [
            "FluentCRM → Smart Links (admin panel)",
            "Custom WordPress hooks for Smart Links"
          ]
        };
      }
      throw error;
    }
  }

  async getSmartLink(smartLinkId: number) {
    try {
      const response = await this.apiClient.get(`/smart-links/${smartLinkId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Smart Links API endpoint not available yet in FluentCRM",
          suggestion: "Use FluentCRM admin panel to view Smart Link details"
        };
      }
      throw error;
    }
  }

  async createSmartLink(data: {
    title: string;
    slug?: string;
    target_url: string;
    apply_tags?: number[];
    apply_lists?: number[];
    remove_tags?: number[];
    remove_lists?: number[];
    auto_login?: boolean;
  }) {
    try {
      const response = await this.apiClient.post('/smart-links', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Smart Links API endpoint not available yet in FluentCRM",
          suggestion: "Create Smart Link manually in FluentCRM admin panel",
          recommended_data: data
        };
      }
      throw error;
    }
  }

  async updateSmartLink(smartLinkId: number, data: any) {
    try {
      const response = await this.apiClient.put(`/smart-links/${smartLinkId}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Smart Links API endpoint not available yet in FluentCRM",
          suggestion: "Update Smart Link manually in FluentCRM admin panel"
        };
      }
      throw error;
    }
  }

  async deleteSmartLink(smartLinkId: number) {
    try {
      const response = await this.apiClient.delete(`/smart-links/${smartLinkId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Smart Links API endpoint not available yet in FluentCRM",
          suggestion: "Delete Smart Link manually in FluentCRM admin panel"
        };
      }
      throw error;
    }
  }

  // Helper method to generate Smart Link shortcode
  generateSmartLinkShortcode(slug: string, linkText?: string): string {
    if (linkText) {
      return `<a href="{{fc_smart_link slug='${slug}'}}">${linkText}</a>`;
    }
    return `{{fc_smart_link slug='${slug}'}}`;
  }

  // Helper method to validate Smart Link data
  validateSmartLinkData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.title || typeof data.title !== 'string') {
      errors.push('Title is required and must be a string');
    }
    
    if (!data.target_url || typeof data.target_url !== 'string') {
      errors.push('Target URL is required and must be a string');
    }
    
    if (data.target_url && !data.target_url.startsWith('http')) {
      errors.push('Target URL must start with http:// or https://');
    }
    
    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ===== REPORTS =====

  async getDashboardStats() {
    const response = await this.apiClient.get('/reports/dashboard-stats');
    return response.data;
  }

  async getSubscribersGrowthRate(params: any = {}) {
    const response = await this.apiClient.get('/reports/subscribers-growth-rate', { params });
    return response.data;
  }
}

// ===== MCP SERVER SETUP =====

function createMcpServer(client: FluentCRMClient): Server {
const server = new Server(
  {
    name: 'fluentcrm-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // ===== CONTACTS =====
      {
        name: 'fluentcrm_list_contacts',
        description: t('fluentcrm_list_contacts'),
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: t('fluentcrm_list_contacts', 'page') },
            per_page: { type: 'number', description: t('fluentcrm_list_contacts', 'per_page') },
            search: { type: 'string', description: t('fluentcrm_list_contacts', 'search') },
          },
        },
      },
      {
        name: 'fluentcrm_get_contact',
        description: t('fluentcrm_get_contact'),
        inputSchema: {
          type: 'object',
          properties: {
            subscriberId: { type: 'number', description: t('fluentcrm_get_contact', 'subscriberId') },
          },
          required: ['subscriberId'],
        },
      },
      {
        name: 'fluentcrm_find_contact_by_email',
        description: t('fluentcrm_find_contact_by_email'),
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', description: t('fluentcrm_find_contact_by_email', 'email') },
          },
          required: ['email'],
        },
      },
      {
        name: 'fluentcrm_create_contact',
        description: t('fluentcrm_create_contact'),
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', description: t('fluentcrm_create_contact', 'email') },
            first_name: { type: 'string', description: t('fluentcrm_create_contact', 'first_name') },
            last_name: { type: 'string', description: t('fluentcrm_create_contact', 'last_name') },
            phone: { type: 'string', description: t('fluentcrm_create_contact', 'phone') },
            address_line_1: { type: 'string', description: t('fluentcrm_create_contact', 'address_line_1') },
            city: { type: 'string', description: t('fluentcrm_create_contact', 'city') },
            country: { type: 'string', description: t('fluentcrm_create_contact', 'country') },
          },
          required: ['email'],
        },
      },
      {
        name: 'fluentcrm_update_contact',
        description: t('fluentcrm_update_contact'),
        inputSchema: {
          type: 'object',
          properties: {
            subscriberId: { type: 'number', description: t('fluentcrm_update_contact', 'subscriberId') },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            phone: { type: 'string' },
          },
          required: ['subscriberId'],
        },
      },
      {
        name: 'fluentcrm_delete_contact',
        description: t('fluentcrm_delete_contact'),
        inputSchema: {
          type: 'object',
          properties: {
            subscriberId: { type: 'number', description: t('fluentcrm_delete_contact', 'subscriberId') },
          },
          required: ['subscriberId'],
        },
      },

      // ===== TAGS =====
      {
        name: 'fluentcrm_list_tags',
        description: t('fluentcrm_list_tags'),
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: t('fluentcrm_list_tags', 'page') },
            search: { type: 'string', description: t('fluentcrm_list_tags', 'search') },
          },
        },
      },
      {
        name: 'fluentcrm_create_tag',
        description: t('fluentcrm_create_tag'),
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: t('fluentcrm_create_tag', 'title') },
            slug: { type: 'string', description: t('fluentcrm_create_tag', 'slug') },
            description: { type: 'string', description: t('fluentcrm_create_tag', 'description') },
          },
          required: ['title'],
        },
      },
      {
        name: 'fluentcrm_delete_tag',
        description: t('fluentcrm_delete_tag'),
        inputSchema: {
          type: 'object',
          properties: {
            tagId: { type: 'number', description: t('fluentcrm_delete_tag', 'tagId') },
          },
          required: ['tagId'],
        },
      },
      {
        name: 'fluentcrm_attach_tag_to_contact',
        description: t('fluentcrm_attach_tag_to_contact'),
        inputSchema: {
          type: 'object',
          properties: {
            subscriberId: { type: 'number', description: t('fluentcrm_attach_tag_to_contact', 'subscriberId') },
            tagIds: { type: 'array', items: { type: 'number' }, description: t('fluentcrm_attach_tag_to_contact', 'tagIds') },
          },
          required: ['subscriberId', 'tagIds'],
        },
      },
      {
        name: 'fluentcrm_detach_tag_from_contact',
        description: t('fluentcrm_detach_tag_from_contact'),
        inputSchema: {
          type: 'object',
          properties: {
            subscriberId: { type: 'number', description: t('fluentcrm_detach_tag_from_contact', 'subscriberId') },
            tagIds: { type: 'array', items: { type: 'number' }, description: t('fluentcrm_detach_tag_from_contact', 'tagIds') },
          },
          required: ['subscriberId', 'tagIds'],
        },
      },

      // ===== LISTS =====
      {
        name: 'fluentcrm_list_lists',
        description: t('fluentcrm_list_lists'),
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'fluentcrm_create_list',
        description: t('fluentcrm_create_list'),
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: t('fluentcrm_create_list', 'title') },
            slug: { type: 'string', description: t('fluentcrm_create_list', 'slug') },
            description: { type: 'string', description: t('fluentcrm_create_list', 'description') },
          },
          required: ['title'],
        },
      },
      {
        name: 'fluentcrm_delete_list',
        description: t('fluentcrm_delete_list'),
        inputSchema: {
          type: 'object',
          properties: {
            listId: { type: 'number', description: t('fluentcrm_delete_list', 'listId') },
          },
          required: ['listId'],
        },
      },
      {
        name: 'fluentcrm_attach_contact_to_list',
        description: t('fluentcrm_attach_contact_to_list'),
        inputSchema: {
          type: 'object',
          properties: {
            subscriberId: { type: 'number', description: t('fluentcrm_attach_contact_to_list', 'subscriberId') },
            listIds: { type: 'array', items: { type: 'number' }, description: t('fluentcrm_attach_contact_to_list', 'listIds') },
          },
          required: ['subscriberId', 'listIds'],
        },
      },
      {
        name: 'fluentcrm_detach_contact_from_list',
        description: t('fluentcrm_detach_contact_from_list'),
        inputSchema: {
          type: 'object',
          properties: {
            subscriberId: { type: 'number', description: t('fluentcrm_detach_contact_from_list', 'subscriberId') },
            listIds: { type: 'array', items: { type: 'number' }, description: t('fluentcrm_detach_contact_from_list', 'listIds') },
          },
          required: ['subscriberId', 'listIds'],
        },
      },

      // ===== CAMPAIGNS =====
      {
        name: 'fluentcrm_list_campaigns',
        description: t('fluentcrm_list_campaigns'),
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            search: { type: 'string' },
          },
        },
      },
      {
        name: 'fluentcrm_create_campaign',
        description: t('fluentcrm_create_campaign'),
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: t('fluentcrm_create_campaign', 'title') },
            subject: { type: 'string', description: t('fluentcrm_create_campaign', 'subject') },
            template_id: { type: 'number', description: t('fluentcrm_create_campaign', 'template_id') },
            recipient_list: { type: 'array', items: { type: 'number' }, description: t('fluentcrm_create_campaign', 'recipient_list') },
          },
          required: ['title', 'subject'],
        },
      },
      {
        name: 'fluentcrm_pause_campaign',
        description: t('fluentcrm_pause_campaign'),
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: { type: 'number', description: t('fluentcrm_pause_campaign', 'campaignId') },
          },
          required: ['campaignId'],
        },
      },
      {
        name: 'fluentcrm_resume_campaign',
        description: t('fluentcrm_resume_campaign'),
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: { type: 'number', description: t('fluentcrm_resume_campaign', 'campaignId') },
          },
          required: ['campaignId'],
        },
      },
      {
        name: 'fluentcrm_delete_campaign',
        description: t('fluentcrm_delete_campaign'),
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: { type: 'number', description: t('fluentcrm_delete_campaign', 'campaignId') },
          },
          required: ['campaignId'],
        },
      },

      // ===== EMAIL TEMPLATES =====
      {
        name: 'fluentcrm_list_email_templates',
        description: t('fluentcrm_list_email_templates'),
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'fluentcrm_create_email_template',
        description: t('fluentcrm_create_email_template'),
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: t('fluentcrm_create_email_template', 'title') },
            subject: { type: 'string', description: t('fluentcrm_create_email_template', 'subject') },
            body: { type: 'string', description: t('fluentcrm_create_email_template', 'body') },
          },
          required: ['title', 'subject', 'body'],
        },
      },

      // ===== AUTOMATIONS =====
      {
        name: 'fluentcrm_list_automations',
        description: t('fluentcrm_list_automations'),
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            search: { type: 'string' },
          },
        },
      },
      {
        name: 'fluentcrm_create_automation',
        description: t('fluentcrm_create_automation'),
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: t('fluentcrm_create_automation', 'title') },
            description: { type: 'string' },
            trigger: { type: 'string', description: t('fluentcrm_create_automation', 'trigger') },
          },
          required: ['title', 'trigger'],
        },
      },

      // ===== WEBHOOKS =====
      {
        name: 'fluentcrm_list_webhooks',
        description: t('fluentcrm_list_webhooks'),
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'fluentcrm_create_webhook',
        description: t('fluentcrm_create_webhook'),
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: t('fluentcrm_create_webhook', 'name') },
            url: { type: 'string', description: t('fluentcrm_create_webhook', 'url') },
            status: { type: 'string', enum: ['pending', 'subscribed'] },
            tags: { type: 'array', items: { type: 'number' } },
            lists: { type: 'array', items: { type: 'number' } },
          },
          required: ['name', 'url', 'status'],
        },
      },

      // ===== SMART LINKS =====
      {
        name: 'fluentcrm_list_smart_links',
        description: t('fluentcrm_list_smart_links'),
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: t('fluentcrm_list_smart_links', 'page') },
            search: { type: 'string', description: t('fluentcrm_list_smart_links', 'search') },
          },
        },
      },
      {
        name: 'fluentcrm_get_smart_link',
        description: t('fluentcrm_get_smart_link'),
        inputSchema: {
          type: 'object',
          properties: {
            smartLinkId: { type: 'number', description: t('fluentcrm_get_smart_link', 'smartLinkId') },
          },
          required: ['smartLinkId'],
        },
      },
      {
        name: 'fluentcrm_create_smart_link',
        description: t('fluentcrm_create_smart_link'),
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: t('fluentcrm_create_smart_link', 'title') },
            slug: { type: 'string', description: t('fluentcrm_create_smart_link', 'slug') },
            target_url: { type: 'string', description: t('fluentcrm_create_smart_link', 'target_url') },
            apply_tags: { type: 'array', items: { type: 'number' }, description: t('fluentcrm_create_smart_link', 'apply_tags') },
            apply_lists: { type: 'array', items: { type: 'number' }, description: t('fluentcrm_create_smart_link', 'apply_lists') },
            remove_tags: { type: 'array', items: { type: 'number' }, description: t('fluentcrm_create_smart_link', 'remove_tags') },
            remove_lists: { type: 'array', items: { type: 'number' }, description: t('fluentcrm_create_smart_link', 'remove_lists') },
            auto_login: { type: 'boolean', description: t('fluentcrm_create_smart_link', 'auto_login') },
          },
          required: ['title', 'target_url'],
        },
      },
      {
        name: 'fluentcrm_update_smart_link',
        description: t('fluentcrm_update_smart_link'),
        inputSchema: {
          type: 'object',
          properties: {
            smartLinkId: { type: 'number', description: t('fluentcrm_update_smart_link', 'smartLinkId') },
            title: { type: 'string' },
            target_url: { type: 'string' },
            apply_tags: { type: 'array', items: { type: 'number' } },
            apply_lists: { type: 'array', items: { type: 'number' } },
            remove_tags: { type: 'array', items: { type: 'number' } },
            remove_lists: { type: 'array', items: { type: 'number' } },
            auto_login: { type: 'boolean' },
          },
          required: ['smartLinkId'],
        },
      },
      {
        name: 'fluentcrm_delete_smart_link',
        description: t('fluentcrm_delete_smart_link'),
        inputSchema: {
          type: 'object',
          properties: {
            smartLinkId: { type: 'number', description: t('fluentcrm_delete_smart_link', 'smartLinkId') },
          },
          required: ['smartLinkId'],
        },
      },
      {
        name: 'fluentcrm_generate_smart_link_shortcode',
        description: t('fluentcrm_generate_smart_link_shortcode'),
        inputSchema: {
          type: 'object',
          properties: {
            slug: { type: 'string', description: t('fluentcrm_generate_smart_link_shortcode', 'slug') },
            linkText: { type: 'string', description: t('fluentcrm_generate_smart_link_shortcode', 'linkText') },
          },
          required: ['slug'],
        },
      },
      {
        name: 'fluentcrm_validate_smart_link_data',
        description: t('fluentcrm_validate_smart_link_data'),
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: t('fluentcrm_validate_smart_link_data', 'title') },
            slug: { type: 'string', description: t('fluentcrm_validate_smart_link_data', 'slug') },
            target_url: { type: 'string', description: t('fluentcrm_validate_smart_link_data', 'target_url') },
            apply_tags: { type: 'array', items: { type: 'number' } },
            apply_lists: { type: 'array', items: { type: 'number' } },
            remove_tags: { type: 'array', items: { type: 'number' } },
            remove_lists: { type: 'array', items: { type: 'number' } },
            auto_login: { type: 'boolean' },
          },
          required: ['title', 'target_url'],
        },
      },

      // ===== REPORTS =====
      {
        name: 'fluentcrm_dashboard_stats',
        description: t('fluentcrm_dashboard_stats'),
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'fluentcrm_custom_fields',
        description: t('fluentcrm_custom_fields'),
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'fluentcrm_list_contacts':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listContacts(args || {}), null, 2) }] };
      case 'fluentcrm_get_contact':
        return { content: [{ type: 'text', text: JSON.stringify(await client.getContact((args as any)?.subscriberId), null, 2) }] };
      case 'fluentcrm_find_contact_by_email':
        return { content: [{ type: 'text', text: JSON.stringify(await client.findContactByEmail((args as any)?.email), null, 2) }] };
      case 'fluentcrm_create_contact':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createContact(args as any), null, 2) }] };
      case 'fluentcrm_update_contact':
        return { content: [{ type: 'text', text: JSON.stringify(await client.updateContact((args as any)?.subscriberId, args as any), null, 2) }] };
      case 'fluentcrm_delete_contact':
        return { content: [{ type: 'text', text: JSON.stringify(await client.deleteContact((args as any)?.subscriberId), null, 2) }] };
      case 'fluentcrm_list_tags':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listTags(args || {}), null, 2) }] };
      case 'fluentcrm_create_tag':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createTag(args as any), null, 2) }] };
      case 'fluentcrm_delete_tag':
        return { content: [{ type: 'text', text: JSON.stringify(await client.deleteTag((args as any)?.tagId), null, 2) }] };
      case 'fluentcrm_attach_tag_to_contact':
        return { content: [{ type: 'text', text: JSON.stringify(await client.attachTagToContact((args as any)?.subscriberId, (args as any)?.tagIds), null, 2) }] };
      case 'fluentcrm_detach_tag_from_contact':
        return { content: [{ type: 'text', text: JSON.stringify(await client.detachTagFromContact((args as any)?.subscriberId, (args as any)?.tagIds), null, 2) }] };
      case 'fluentcrm_list_lists':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listLists(), null, 2) }] };
      case 'fluentcrm_create_list':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createList(args as any), null, 2) }] };
      case 'fluentcrm_delete_list':
        return { content: [{ type: 'text', text: JSON.stringify(await client.deleteList((args as any)?.listId), null, 2) }] };
      case 'fluentcrm_attach_contact_to_list':
        return { content: [{ type: 'text', text: JSON.stringify(await client.attachContactToList((args as any)?.subscriberId, (args as any)?.listIds), null, 2) }] };
      case 'fluentcrm_detach_contact_from_list':
        return { content: [{ type: 'text', text: JSON.stringify(await client.detachContactFromList((args as any)?.subscriberId, (args as any)?.listIds), null, 2) }] };
      case 'fluentcrm_list_campaigns':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listCampaigns(args || {}), null, 2) }] };
      case 'fluentcrm_create_campaign':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createCampaign(args as any), null, 2) }] };
      case 'fluentcrm_pause_campaign':
        return { content: [{ type: 'text', text: JSON.stringify(await client.pauseCampaign((args as any)?.campaignId), null, 2) }] };
      case 'fluentcrm_resume_campaign':
        return { content: [{ type: 'text', text: JSON.stringify(await client.resumeCampaign((args as any)?.campaignId), null, 2) }] };
      case 'fluentcrm_delete_campaign':
        return { content: [{ type: 'text', text: JSON.stringify(await client.deleteCampaign((args as any)?.campaignId), null, 2) }] };
      case 'fluentcrm_list_email_templates':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listEmailTemplates(), null, 2) }] };
      case 'fluentcrm_create_email_template':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createEmailTemplate(args as any), null, 2) }] };
      case 'fluentcrm_list_automations':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listAutomations(args || {}), null, 2) }] };
      case 'fluentcrm_create_automation':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createAutomation(args as any), null, 2) }] };
      case 'fluentcrm_list_webhooks':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listWebhooks(), null, 2) }] };
      case 'fluentcrm_create_webhook':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createWebhook(args as any), null, 2) }] };
      case 'fluentcrm_dashboard_stats':
        return { content: [{ type: 'text', text: JSON.stringify(await client.getDashboardStats(), null, 2) }] };
      case 'fluentcrm_custom_fields':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listCustomFields(), null, 2) }] };
      
      // ===== SMART LINKS =====
      case 'fluentcrm_list_smart_links':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listSmartLinks(args || {}), null, 2) }] };
      case 'fluentcrm_get_smart_link':
        return { content: [{ type: 'text', text: JSON.stringify(await client.getSmartLink((args as any)?.smartLinkId), null, 2) }] };
      case 'fluentcrm_create_smart_link':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createSmartLink(args as any), null, 2) }] };
      case 'fluentcrm_update_smart_link':
        return { content: [{ type: 'text', text: JSON.stringify(await client.updateSmartLink((args as any)?.smartLinkId, args as any), null, 2) }] };
      case 'fluentcrm_delete_smart_link':
        return { content: [{ type: 'text', text: JSON.stringify(await client.deleteSmartLink((args as any)?.smartLinkId), null, 2) }] };
      case 'fluentcrm_generate_smart_link_shortcode':
        return { content: [{ type: 'text', text: JSON.stringify({ shortcode: client.generateSmartLinkShortcode((args as any)?.slug, (args as any)?.linkText) }, null, 2) }] };
      case 'fluentcrm_validate_smart_link_data':
        return { content: [{ type: 'text', text: JSON.stringify(client.validateSmartLinkData(args as any), null, 2) }] };
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `❌ Error: ${error.message}` }],
      isError: true,
    };
  }
});

return server;
}

// ─── HTTP transport (used on Render / any cloud host) ───────────────────────
async function startHTTP(port: number): Promise<void> {
  const transports = new Map<string, StreamableHTTPServerTransport>();
  const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;

  const readBody = (req: IncomingMessage): Promise<string> =>
    new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (c: Buffer) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks).toString()));
      req.on('error', reject);
    });

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // Health-check endpoint — always public, no auth required
    if (req.url === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', server: 'fluentcrm-mcp' }));
      return;
    }

    // Optional bearer-token auth (applied to all other routes)
    if (AUTH_TOKEN) {
      const auth = req.headers['authorization'] || '';
      if (!auth.startsWith('Bearer ') || auth.slice(7) !== AUTH_TOKEN) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
    }

    // Ensure Accept header satisfies MCP Streamable HTTP requirements.
    // Some agents/clients omit text/event-stream — inject it so the SDK
    // doesn't return 406 Not Acceptable.
    if (req.url?.startsWith('/mcp')) {
      const accept = req.headers['accept'] || '';
      if (!accept.includes('text/event-stream')) {
        req.headers['accept'] = accept
          ? `${accept}, text/event-stream`
          : 'application/json, text/event-stream';
      }
    }

    const url = new URL(req.url || '/', `http://localhost:${port}`);
    if (url.pathname !== '/mcp') {
      res.writeHead(404);
      res.end();
      return;
    }

    if (req.method === 'POST') {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports.has(sessionId)) {
        transport = transports.get(sessionId)!;
      } else {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid) => { transports.set(sid, transport); },
        });
        transport.onclose = () => {
          if (transport.sessionId) transports.delete(transport.sessionId);
        };
        const fcrmUrl  = (req.headers['x-fluentcrm-url']      as string) || FLUENTCRM_API_URL;
        const fcrmUser = (req.headers['x-fluentcrm-username'] as string) || FLUENTCRM_API_USERNAME;
        const fcrmPass = (req.headers['x-fluentcrm-password'] as string) || FLUENTCRM_API_PASSWORD;
        const sessionClient = new FluentCRMClient(fcrmUrl, fcrmUser, fcrmPass);
        const sessionServer = createMcpServer(sessionClient);
        await sessionServer.connect(transport);
      }

      const rawBody = await readBody(req);
      const body = JSON.parse(rawBody);
      await transport.handleRequest(req, res, body);

    } else if (req.method === 'GET') {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      if (!sessionId || !transports.has(sessionId)) {
        res.writeHead(400);
        res.end('Invalid session ID');
        return;
      }
      await transports.get(sessionId)!.handleRequest(req, res);

    } else if (req.method === 'DELETE') {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      if (sessionId && transports.has(sessionId)) {
        await transports.get(sessionId)!.close();
        transports.delete(sessionId);
      }
      res.writeHead(200);
      res.end();

    } else {
      res.writeHead(405);
      res.end();
    }
  });

  httpServer.listen(port, '0.0.0.0', () => {
    console.error(`🚀 FluentCRM MCP Server running on HTTP port ${port}`);
    console.error(`📡 MCP endpoint: http://0.0.0.0:${port}/mcp`);
    console.error(`📡 FluentCRM API: ${FLUENTCRM_API_URL}`);
    if (AUTH_TOKEN) console.error('🔒 Bearer auth enabled (MCP_AUTH_TOKEN is set)');
    else console.error('⚠️  No MCP_AUTH_TOKEN set — endpoint is open');

    // ── Keep-alive ping (prevents Render free-tier cold starts) ──────────────
    // Render spins down after 15 min of inactivity. We self-ping every 14 min.
    // RENDER_EXTERNAL_URL is set automatically by Render.
    const renderUrl = process.env.RENDER_EXTERNAL_URL;
    if (renderUrl) {
      const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes
      setInterval(async () => {
        try {
          const res = await fetch(`${renderUrl}/health`);
          console.error(`🏓 Keep-alive ping → ${res.status}`);
        } catch (err: any) {
          console.error(`⚠️  Keep-alive ping failed: ${err.message}`);
        }
      }, PING_INTERVAL_MS);
      console.error(`🏓 Keep-alive enabled — pinging ${renderUrl}/health every 14 min`);
    }
  });
}

// ─── Entrypoint ──────────────────────────────────────────────────────────────
async function main() {
  if (process.env.PORT) {
    await startHTTP(parseInt(process.env.PORT, 10));
  } else {
    const stdioClient = new FluentCRMClient(FLUENTCRM_API_URL, FLUENTCRM_API_USERNAME, FLUENTCRM_API_PASSWORD);
    const stdioServer = createMcpServer(stdioClient);
    const transport = new StdioServerTransport();
    await stdioServer.connect(transport);
    console.error('🚀 FluentCRM MCP Server running on stdio');
    console.error(`📡 API URL: ${FLUENTCRM_API_URL}`);
    console.error(`👤 Username: ${FLUENTCRM_API_USERNAME}`);
  }
}

main().catch((error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});
