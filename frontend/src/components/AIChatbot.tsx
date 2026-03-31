import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

const BRAND = '#b5472a'

type Message = { role: 'bot' | 'user'; text: string }

const SUGGESTIONS = [
  'What properties are available in Sarajevo?',
  'What is the buying process?',
  'Do you have waterfront properties?',
  'How do I schedule a viewing?',
]

const RESPONSES: Record<string, string> = {
  'What properties are available in Sarajevo?':
    'We currently have 12 properties in Sarajevo ranging from modern apartments in Novo Sarajevo to heritage homes in Baščaršija. Browse our full listings page to filter by type and price.',
  'What is the buying process?':
    'Our process has 3 steps: Discovery (we curate a shortlist for you), Visit (private guided tours with full documentation), and Close (negotiation, legal review, and ownership transfer). We handle everything.',
  'Do you have waterfront properties?':
    'Yes — we have several lakefront and riverside properties in Jablanica and Mostar, plus Adriatic coast listings in Croatia. Would you like me to highlight any specific area?',
  'How do I schedule a viewing?':
    'Simply click "Browse Listings", find a property you\'re interested in, and use the "Request Information" button. One of our advisors will reach out within 24 hours to schedule a private tour.',
}

const FALLBACK =
  "That's a great question. Our advisors would love to help you personally. Please use the Request Information button on any listing or call us at +387 33 123 456."

const GREETING: Message = {
  role: 'bot',
  text: 'Hi! I\'m the Zlatni Kvadrat assistant. How can I help you find your ideal property today?',
}

export function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        { role: 'bot', text: RESPONSES[text] ?? FALLBACK },
      ])
    }, 900)
  }

  return (
    <>
      {/* Floating trigger */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-elevated cursor-pointer select-none"
              style={{ background: `linear-gradient(160deg, #c85232 0%, #8a3120 100%)` }}
              onClick={() => setOpen(true)}
            >
              <Bot className="w-4 h-4" />
              Ask us anything
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen((o) => !o)}
          whileTap={{ scale: 0.93 }}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-elevated"
          style={{ background: `linear-gradient(160deg, #c85232 0%, #8a3120 100%)` }}
          aria-label="Open AI assistant"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-28 right-6 z-40 w-[min(380px,calc(100vw-3rem))] rounded-2xl overflow-hidden flex flex-col"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2d9cc',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
              maxHeight: '70vh',
            }}
          >
            {/* Header */}
            <div className="px-4 py-3.5 flex items-center gap-3 border-b border-border" style={{ background: `linear-gradient(160deg, #c85232 0%, #8a3120 100%)` }}>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Zlatni Kvadrat</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-white/70 text-xs">AI Assistant · Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? { backgroundColor: BRAND, color: '#fff', borderBottomRightRadius: 4 }
                        : { backgroundColor: '#f3ede4', color: '#1c1410', borderBottomLeftRadius: 4 }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: '#f3ede4', borderBottomLeftRadius: 4 }}>
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: '#b5472a',
                            opacity: 0.5,
                            animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions — only show if no user message yet */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-muted-bg"
                    style={{ borderColor: '#e2d9cc', color: '#6b7280' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-border">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
                  style={{ backgroundColor: BRAND, color: 'white' }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}
