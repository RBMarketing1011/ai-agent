'use server'

import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
const openai = new OpenAI()

export const chatStream = async ({ model, prompt, schema }) => // streaming an AI chat completion
{
  const res = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'user',
        content: prompt,
      }
    ],
    response_format: zodResponseFormat(schema, 'content'),
    stream: true
  })

  const stream = new ReadableStream({
    async start (controller)
    {
      for await (const chunk of res)
      {
        const content = chunk.choices[ 0 ]?.delta?.content || ''
        controller.enqueue(new TextEncoder().encode(content))
      }
      controller.close()
    }
  })

  return stream
}