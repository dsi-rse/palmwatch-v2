import { createClient } from 'next-sanity'
import { brandInfoQuery, aboutPageQuery, contactPageQuery, footerInfoQuery, umlInfoQuery, homePageQuery, countyInfoQuery, groupInfoQuery, landingPageContentQuery } from "./groq";
import { BrandSchema } from "@/config/brands/types";

import { apiVersion, dataset, projectId, useCdn } from '../env'
import { AboutPageContent, ContactPageContent, HomePageContent } from './types';
import { SanityClient } from 'sanity';
class CmsClient {
  client: SanityClient;
  
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
      // Next's Data Cache dedupes CMS requests across renders, pages and
      // instances, and keeps serving the last good copy if a refresh fails.
      // ponytail: time-based, so edits take up to a day to appear; add a
      // Sanity webhook + revalidateTag if editors need instant updates.
      return await this.client.fetch<T>(query, params, { next: { revalidate: 86400 } });
    } catch (err) {
      console.error('Sanity fetch failed:', err);
      return null;
    }
  }

  async getBrandInfo(name: string) {
    return await this.fetch<BrandSchema>(brandInfoQuery, { name });
  }

  async getUmlInfo(uml: string) {
    return await this.fetch<Partial<BrandSchema>>(umlInfoQuery, { uml });
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