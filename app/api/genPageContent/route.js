import { chatStream } from '@/lib/openai'
import { pageSchema } from '@/lib/pageSchema'

const createAiPageContent = async (req) =>
{
  const {
    shopName,
    city,
    state,
    page
  } = await req.json()

  const stream = await chatStream({
    model: 'gpt-4o',
    prompt: `Generate high-quality content for ${ shopName } in ${ city }, ${ state }, specifically for the ${ page } page. Ensure the content is highly SEO-targeted, professional, and engaging. Use a structured layout with multiple sections, including at least 2 sections featuring unordered lists (bullet points). Write in a clear and concise style that maximizes search engine visibility while remaining user-friendly. Do not use emojis or icons. Include relevant keywords naturally throughout. Conclude with a compelling call-to-action section to encourage users to visit the shop or book an appointment today, but do not include phone numbers or addresses, as these are provided elsewhere on the page.`,
    schema: pageSchema
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    }
  })
}

export { createAiPageContent as POST }