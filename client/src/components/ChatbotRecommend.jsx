import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X } from 'lucide-react'

const occasionKeywords = {
  romantic: ['romantic', 'iubire', 'trandafir'],
  aniversare: ['aniversare', 'zi de nastere', 'sarbatore'],
  corporate: ['corporate', 'business', 'oficial'],
  multumire: ['multumire', 'thank', 'apreciere'],
  eleganta: ['elegant', 'premium', 'deluxe', 'grace']
}

const colorKeywords = {
  rosu: ['rosu', 'red'],
  alb: ['alb', 'white'],
  roz: ['roz', 'pink', 'blush'],
  galben: ['galben', 'yellow'],
  albastru: ['albastru', 'blue'],
  verde: ['verde', 'green']
}

const flowerKeywords = {
  trandafiri: ['trandafir', 'rose'],
  lalele: ['lalea', 'tulip'],
  bujori: ['bujor', 'peony'],
  crizanteme: ['crizantema', 'chrysanthemum'],
  iris: ['iris'],
  eucalipt: ['eucalipt', 'eucalyptus'],
  plante: ['planta', 'monstera']
}

const quickChips = [
  { label: 'Romantic', text: 'romantic' },
  { label: 'Aniversare', text: 'aniversare' },
  { label: 'Buget 100', text: 'buget 100' },
  { label: 'Alb', text: 'alb' },
  { label: 'Trandafiri', text: 'trandafiri' },
  { label: 'Bujori', text: 'bujori' },
  { label: 'Planta', text: 'planta' }
]

const getRecommendations = (products, prefSet) => {
  if (!products.length) return []

  const scored = products.map((product) => {
    const name = `${product.name} ${product.description}`.toLowerCase()
    let score = 0

    if (prefSet.occasion) {
      const keys = occasionKeywords[prefSet.occasion] || []
      if (keys.some((word) => name.includes(word))) score += 3
    }

    if (prefSet.color) {
      const keys = colorKeywords[prefSet.color] || []
      if (keys.some((word) => name.includes(word))) score += 3
    }

    if (prefSet.flower) {
      const keys = flowerKeywords[prefSet.flower] || []
      if (keys.some((word) => name.includes(word)) || product.category === prefSet.flower) score += 4
    }

    if (prefSet.budget) {
      if (product.price <= prefSet.budget) score += 2
      else score -= 2
    }

    return { product, score }
  })

  const filtered = scored.filter((item) => item.score > 0)
  const sorted = (filtered.length ? filtered : scored)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return sorted.map((item) => item.product)
}

const defaultMessages = [
  {
    role: 'bot',
    text: 'Salut! Spune-mi ocazia, bugetul sau culoarea preferata si iti recomand buchete.'
  }
]

const ChatbotRecommend = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(defaultMessages)
  const [input, setInput] = useState('')
  const [prefs, setPrefs] = useState({
    occasion: null,
    color: null,
    flower: null,
    budget: null
  })

  const parseBudget = (text) => {
    const match = text.match(/(\d{2,4})/)
    return match ? Number(match[1]) : null
  }

  const detectKey = (text, map) => {
    const lower = text.toLowerCase()
    return Object.keys(map).find((key) => map[key].some((word) => lower.includes(word)))
  }

  const handleMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const nextPrefs = { ...prefs }
    const occasion = detectKey(trimmed, occasionKeywords)
    const color = detectKey(trimmed, colorKeywords)
    const flower = detectKey(trimmed, flowerKeywords)
    const budget = parseBudget(trimmed)

    if (occasion) nextPrefs.occasion = occasion
    if (color) nextPrefs.color = color
    if (flower) nextPrefs.flower = flower
    if (budget) nextPrefs.budget = budget

    const nextRecommendations = getRecommendations(products, nextPrefs)
    const summaryParts = []
    if (nextPrefs.occasion) summaryParts.push(`ocazie ${nextPrefs.occasion}`)
    if (nextPrefs.color) summaryParts.push(`culoare ${nextPrefs.color}`)
    if (nextPrefs.flower) summaryParts.push(`flori ${nextPrefs.flower}`)
    if (nextPrefs.budget) summaryParts.push(`buget ${nextPrefs.budget} RON`)

    const summary = summaryParts.length
      ? `Am inteles: ${summaryParts.join(', ')}.`
      : 'Am notat preferintele.'

    const suggestionText = products.length
      ? nextRecommendations.length
        ? `Recomandari: ${nextRecommendations.map((item) => item.name).join(', ')}.`
        : 'Spune-mi inca o preferinta pentru recomandari mai bune.'
      : 'Catalogul nu este disponibil momentan.'

    setPrefs(nextPrefs)
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'bot', text: `${summary} ${suggestionText}` }
    ])
    setInput('')
  }

  const handleReset = () => {
    setPrefs({ occasion: null, color: null, flower: null, budget: null })
    setMessages([...defaultMessages])
  }

  const recommendations = useMemo(() => getRecommendations(products, prefs), [products, prefs])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-[380px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Asistent Petunia</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleReset} className="text-xs font-semibold text-pink-600">
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 p-1 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.role === 'bot' ? 'bg-white text-slate-700' : 'bg-pink-500 text-white'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {quickChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleMessage(chip.text)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleMessage(input)
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ex: buget 120, alb"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button className="rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-600">
              Trimite
            </button>
          </form>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-slate-700">Recomandari</p>
            {products.length === 0 ? (
              <p className="text-sm text-slate-500">Catalog indisponibil momentan.</p>
            ) : recommendations.length === 0 ? (
              <p className="text-sm text-slate-500">Spune-mi inca o preferinta.</p>
            ) : (
              <ul className="space-y-2">
                {recommendations.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2 py-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{product.name}</p>
                      <p className="text-[11px] text-slate-500">{product.price} RON</p>
                    </div>
                    <Link
                      to={`/products/${product.id}`}
                      className="rounded-md bg-pink-500 px-2 py-1 text-[11px] font-semibold text-white"
                    >
                      Vezi
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-pink-600"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </button>
    </div>
  )
}

export default ChatbotRecommend
