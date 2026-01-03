import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getPsiAResponse, PsiAMessage } from '../lib/mockApi';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PsiAModuleProps {
  onBack: () => void;
}

export function PsiAModule({ onBack }: PsiAModuleProps) {
  const [messages, setMessages] = useLocalStorage<PsiAMessage[]>('psia-messages', [
    {
      role: 'assistant',
      content: "Bonjour ! Je suis PsIA, ton assistant de bien-être. Je suis là pour t'écouter et t'accompagner. Comment te sens-tu aujourd'hui ?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: PsiAMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getPsiAResponse(input);
    const assistantMessage: PsiAMessage = {
      role: 'assistant',
      content: response
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Bonjour ! Je suis PsIA, ton assistant de bien-être. Je suis là pour t'écouter et t'accompagner. Comment te sens-tu aujourd'hui ?"
      }
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-psia p-4 md:p-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 text-warm-black font-inter"
          >
            <ArrowLeft size={24} />
            <span>Retour</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center gap-2 text-warm-brown font-inter"
          >
            <RotateCcw size={20} />
            <span>Réinitialiser</span>
          </motion.button>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-playfair text-4xl md:text-5xl font-bold text-warm-black mb-8"
        >
          PsIA - Ton Assistant
        </motion.h1>

        {/* Messages Container */}
        <div className="flex-1 bg-white rounded-2xl p-6 mb-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-warm-brown text-white'
                      : 'bg-beige text-warm-black'
                  }`}
                >
                  <p className="font-inter leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-beige p-4 rounded-2xl">
                  <Loader2 className="animate-spin text-warm-brown" size={24} />
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écris ton message..."
              className="flex-1 p-3 bg-beige rounded-lg font-inter text-warm-black focus:outline-none focus:ring-2 focus:ring-warm-brown"
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-warm-brown text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={24} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
