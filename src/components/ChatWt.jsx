/*import { useState } from 'react'
import { generateAiReply } from '../utils/helpers.js'

export default function ChatWidget() {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Ask me about parish comparisons, district filters, or chart options.' }
  ])
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChatSubmit = async (event) => {
    event.preventDefault()
    if (!question.trim() || isLoading) return

    const userMessage = { role: 'user', text: question }
    const placeholderReply = { role: 'assistant', text: 'Thinking...' }
    setChatMessages(prev => [...prev, userMessage, placeholderReply])
    setQuestion('')
    setIsLoading(true)

    const reply = await generateAiReply(question)
    setChatMessages(prev => prev.map((msg, idx) => idx === prev.length - 1 && msg.role === 'assistant' ? { ...msg, text: reply } : msg))
    setIsLoading(false)
  }

  return (
    <div className="card chat-card">
      <div className="card-title">Messaging AI</div>
      <div className="card-desc">Ask a dashboard assistant about the data or filters.</div>
      <div className="chat-window">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>{msg.text}</div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleChatSubmit}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask about the data..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? 'Waiting...' : 'Send'}
        </button>
      </form>
    </div>
  )
}*/