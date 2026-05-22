export function tier(p) {
  return p >= 50 ? 'high' : p >= 25 ? 'med' : 'low'
}

export function downloadSvg(chartId, filename) {
  const chart = document.getElementById(chartId)
  const svg = chart?.querySelector('svg')
  if (!svg) return
  const serializer = new XMLSerializer()
  const source = serializer.serializeToString(svg)
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

export async function generateAiReply(prompt) {
  const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY
  const model = import.meta.env.VITE_HUGGING_FACE_MODEL || 'gpt2'

  console.log('API Key present:', !!apiKey)
  console.log('Model:', model)

  if (!apiKey) {
    console.warn('No Hugging Face API key found')
    return getFallbackReply(prompt)
  }

  try {
    const url = `https://api-inference.huggingface.co/models/${model}`
    console.log('Calling HF API:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true, use_cache: false }
      })
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('HF API error:', response.status, errorText)
      return getFallbackReply(prompt)
    }

    const data = await response.json()
    console.log('HF API response:', data)

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim() || getFallbackReply(prompt)
    }

    if (typeof data?.generated_text === 'string') {
      return data.generated_text.trim() || getFallbackReply(prompt)
    }

    if (typeof data?.text === 'string') {
      return data.text.trim() || getFallbackReply(prompt)
    }

    console.warn('Unexpected response format:', data)
    return getFallbackReply(prompt)
  } catch (error) {
    console.error('HF API exception:', error.message)
    return getFallbackReply(prompt)
  }
}

function getFallbackReply(prompt) {
  const lower = prompt.toLowerCase()
  if (!lower.trim()) return 'Ask anything about parish comparisons, district filters, or poverty themes.'
  if (lower.includes('compare') && lower.includes('parish')) return 'Use the compare panel to choose two parishes and see their average rates side by side.'
  if (lower.includes('district') || lower.includes('community')) return 'Pick a parish first, then select a parish and district from the filter panels.'
  if (lower.includes('download')) return 'Click the download buttons on each chart to export the chart as an SVG file.'
  if (lower.includes('map')) return 'The top section includes an SVG map visual to orient parish data on the homepage.'
  return 'I can help with parish-level comparisons, district filtering, and what the charts reveal about poverty or inequality.'
}

export function downloadFilteredCsv(data, downloadLabel) {
  if (!data.length) return
  const headers = ['parish', 'community', 'poverty', 'gini', 'population']
  const rows = data.map(r => [r.parish, r.community, r.poverty, r.gini, r.population || '']).map(row =>
    row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${downloadLabel || 'filtered-data'}.csv`
  a.click()
  URL.revokeObjectURL(url)
}