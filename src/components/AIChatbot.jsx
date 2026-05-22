import { useState, useRef, useEffect } from 'react'

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me anything about parishes, districts, or poverty data.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setError(null)
    setIsLoading(true)

    //const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const apiKey = 'sk-abcdef1234567890abcdef1234567890abcdef12' 
    if (!apiKey) {
      setError('Missing VITE_OPENAI_API_KEY in your .env file.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: updatedMessages,
          temperature: 0.6,
          max_tokens: 400,
          n: 1
        })
      })

      if (!response.ok) {
        const body = await response.text()
        throw new Error(`OpenAI error ${response.status}: ${body}`)
      }

      const data = await response.json()
      const assistantMessage = data.choices?.[0]?.message

      setMessages(prev => [
        ...prev,
        assistantMessage || { role: 'assistant', content: 'Sorry, I did not receive a reply.' }
      ])
    } catch (err) {
      setError(err?.message || 'Unable to send the message.')
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'I could not reach the AI service. Check your API key and network.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chatbot-card">
      <div className="chatbot-header">AI Chat</div>
      <div className="chatbot-body">
        <div className="chat-window">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              <strong>{message.role === 'user' ? 'You' : 'AI'}</strong>
              <div>{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="chat-status">Error: {error}</div>}
        <div className="chat-input-row">
          <textarea
            className="chat-input"
            rows={2}
            value={input}
            placeholder="Type your question here..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="chat-send-button"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <div className="chat-status">
          {isLoading ? 'Waiting for AI response…' : 'Press Enter or Send to ask a question.'}
        </div>
      </div>
    </div>
  )
}

export default AIChatbot
