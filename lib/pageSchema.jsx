import { z } from 'zod'

export const pageSchema = z.object({
  metadata: z.object({
    seo_title: z
      .string()
      .describe(
        'SEO-friendly title of the page, crafted to target primary keywords and attract search engine clicks.'
      ),
    slug: z
      .string()
      .describe(
        'SEO-optimized URL slug for the page, containing primary keywords for better search engine visibility.'
      ),
    seo_description: z
      .string()
      .describe(
        'Meta description optimized for search engines, highlighting services and unique selling points to improve rankings and click-through rates.'
      ),
  }),
  images: z.object({
    banner_image: z.object({
      url: z.string().describe('Direct URL of the banner image, crucial for page aesthetics and SEO.'),
      alt: z
        .string()
        .describe(
          'Descriptive alt text for the banner image, optimized to include relevant keywords for search engine ranking improvement.'
        ),
    }),
    featured_image: z.object({
      url: z
        .string()
        .describe('Direct URL of the featured image, used to highlight core services or promotions.'),
      alt: z
        .string()
        .describe(
          'Keyword-rich alt text for the featured image, optimized to improve image SEO and contextual relevance.'
        ),
    }),
  }),
  page_title: z
    .string()
    .describe(
      'Main title of the page (h1 tag) designed to be keyword-rich and align with the page’s overall SEO strategy.'
    ),
  content: z.object({
    intro: z
      .string()
      .describe(
        'Engaging introduction for the page in Markdown format, crafted to highlight services, include relevant keywords, and improve SEO performance.'
      ),
    page_content: z
      .array(
        z.object({
          heading: z
            .string()
            .describe(
              'Section heading optimized with location and primary keywords (e.g., shop name, city, state) to boost SEO targeting.'
            ),
          content: z
            .string()
            .describe(
              'Rich, detailed section content in Markdown format, including all relevant information. Crafted to align with SEO best practices and naturally incorporate keywords.'
            ),
        })
      )
      .describe(
        'Structured page content including multiple sections. Each section is optimized to improve search rankings by targeting specific keywords and providing detailed, relevant information.'
      ),
  }),
})
