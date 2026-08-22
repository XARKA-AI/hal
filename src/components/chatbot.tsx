import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { useLanguage } from "./language-context"

interface Message {
  id: number
  text: string
  isBot: boolean
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", isBot: true }
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Thank you for your message. Our team will get back to you soon.",
        "You can reach us at info@haloffshore.com or call +91-22-4236 9200",
        "We offer comprehensive offshore services including EPC, marine logistics, and subsea intervention.",
        "Our fleet includes SEAMEC Anant, HAL Supporter, and GOODMAN vessels.",
        "HAL Offshore has been serving the industry since 1998 with 25+ years of experience."
      ]
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#001F3F] text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#001F3F] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#001F3F] rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#001F3F]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">HAL Assistant</h3>
                  <p className="text-xs text-white/60">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm ${
                      message.isBot
                        ? "bg-white border border-border text-foreground"
                        : "bg-[#001F3F] text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-background border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("chat.placeholder")}
                  className="flex-1 px-4 py-2.5 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001F3F]/50"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 bg-[#001F3F] text-white rounded-lg flex items-center justify-center hover:bg-[#000F25] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
