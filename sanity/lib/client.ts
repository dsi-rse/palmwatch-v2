import { createClient } from 'next-sanity'
import { brandInfoQuery, aboutPageQuery, contactPageQuery, footerInfoQuery, umlInfoQuery, homePageQuery, countyInfoQuery, groupInfoQuery, landingPageContentQuery } from "./groq";
import { BrandSchema } from "@/config/brands/types";

import { apiVersion, dataset, projectId, useCdn } from '../env'
import { AboutPageContent, ContactPageContent, HomePageContent } from './types';
import { SanityClient } from 'sanity';
class CmsClient {
  client: SanityClient;
  brandData: Record<string, BrandSchema> = {}
  umlData: Record<string, Partial<BrandSchema>> = {}
  
  constructor() {
    this.client = createClient({
      apiVersion,
      dataset,
      projectId,
      useCdn,
      // Fail fast so the catch in fetch() runs before the function times out:
      // worst case ~6s (2 tries x 3s) vs. the default 5-min timeout x 6 tries.
      timeout: 3000,
      maxRetries: 1,
    }) as SanityClient;
  }

  // CMS down or over quota → pages render without CMS content instead of 5XX.
  private async fetch<T>(query: string, params: Record<string, string> = {}): Promise<T | null> {
    try {
      return await this.client.fetch<T>(query, params);
    } catch (err) {
      console.error('Sanity fetch failed:', err);
      return null;
    }
  }

  async getBrandInfo(name: string) {
    if (this.brandData[name]) {
      return this.brandData[name];
    }
    const data = await this.fetch<BrandSchema>(brandInfoQuery, { name });
    if (data) this.brandData[name] = data;
    return data;
  }

  async getUmlInfo(uml: string) {
    if (this.umlData[uml]) {
      return this.umlData[uml];
    }
    const data = await this.fetch<Partial<BrandSchema>>(umlInfoQuery, { uml });
    if (data) this.umlData[uml] = data;
    return data;
  }

  async getCountryInfo(country: string) {
    return await this.fetch<Partial<BrandSchema>>(countyInfoQuery, { country });
  }
  async getGroupInfo(group: string) {
    return await this.fetch<Partial<BrandSchema>>(groupInfoQuery, { group });
  }
  async getLandingPageContent(page: string) {
    return await this.fetch<{content?: any[]; disclaimer?:any[]}>(landingPageContentQuery, { page });
  }
  async getAboutPage() {
    return await this.fetch<AboutPageContent>(aboutPageQuery);
  }

  async getContactPage(){
    return await this.fetch<ContactPageContent>(contactPageQuery);
  }
  async getFooterContent() {
    return await this.fetch<any>(footerInfoQuery);
  }
  async getHomeContent() {
    return await this.fetch<HomePageContent>(homePageQuery)
  }
}

const client =  new CmsClient();

export default client;