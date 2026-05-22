import { useState } from 'react'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

const SYSTEM_PROMPT = `You are a data assistant for a Jamaica poverty mapping dashboard built from the PIOJ (Planning Institute of Jamaica) Poverty Maps dataset.

The dataset contains 829 communities across Jamaica's 14 parishes. Each community record has:
- COMMNAME: Community name
- ParishName: One of 14 parishes (Kingston, St. Andrew, St. Thomas, Portland, St. Mary, St. Ann, Trelawny, St. James, Hanover, Westmoreland, St. Elizabeth, Manchester, Clarendon, St. Catherine)
- Population: Total population
- Households: Number of households
- Poverty: Poverty rate (percentage, 0–100) — the share of the population below the poverty line
- GINI: Gini coefficient (0–1) — measure of income inequality; higher = more unequal
- Consumptio: Mean per-capita consumption (Jamaican dollars)
- Min_Consum: Minimum consumption in the community
- Max_Consum: Maximum consumption in the community
- AREA: Geographic area in square meters
- COMM_CODE / COMMNO: Community identifier codes

Key facts you know from the data:
- There are 829 communities total
- Parishes range from urban (Kingston, St. Andrew) to rural (Portland, Hanover, Trelawny)
- Poverty rates vary significantly across communities and parishes
- GINI values reflect intra-community inequality
- Consumption figures are in Jamaican dollars

You can answer questions about:
- Which communities or parishes have the highest/lowest poverty rates
- Comparisons between parishes or districts
- Relationships between poverty, GINI, consumption, and population
- How to interpret the data fields
- Dashboard filter and chart suggestions

Be concise, specific, and data-informed. If asked about something not in this dataset (e.g. time trends, employment), say so clearly.`

async function callOpenRouter(messages) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages,
      max_tokens: 512,
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `OpenRouter error ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || 'No response received.'
}

export default function ChatWidget() {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Ask me about parish poverty rates, community comparisons, GINI inequality, or consumption data across Jamaica.' }
  ])
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChatSubmit = async (event) => {
    event.preventDefault()
    if (!question.trim() || isLoading) return

    const userText = question.trim()
    setQuestion('')
    setError(null)

    const newMessages = [...chatMessages, { role: 'user', text: userText }]
    setChatMessages([...newMessages, { role: 'assistant', text: 'Thinking...' }])
    setIsLoading(true)

    try {
      // Build the message history for the API (excluding the placeholder)
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...newMessages.map(m => ({ role: m.role, content: m.text }))
      ]

      const reply = await callOpenRouter(apiMessages)

      setChatMessages(prev =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 && msg.text === 'Thinking...'
            ? { ...msg, text: reply }
            : msg
        )
      )
    } catch (err) {
      setError(err.message)
      setChatMessages(prev => prev.filter(m => m.text !== 'Thinking...'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card chat-card">
      <div className="card-title">Jamaica Poverty Data Assistant</div>
      <div className="card-desc">Ask about parish comparisons, poverty rates, GINI scores, or consumption across 829 communities.</div>

      <div className="chat-window">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {error && (
        <div className="chat-error" style={{ color: 'red', fontSize: 12, padding: '4px 0' }}>
          Error: {error}
        </div>
      )}

      <form className="chat-form" onSubmit={handleChatSubmit}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="e.g. Which parish has the highest poverty rate?"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? 'Waiting...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
