import { motion } from 'framer-motion';
import { ArrowLeft, Send, RotateCcw, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getPsiAResponse } from '../lib/mockApi';

interface PsiAModuleProps {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function PsiAModule({ onBack }: PsiAModuleProps) {
  const [messages, setMessages] = useLocalStorage<Message[]>('psia-messages', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getPsiAResponse(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    if (confirm('Es-tu sûr de vouloir effacer toute la conversation ?')) {
      setMessages([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-psia p-4 md:p-8 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brun-terreux hover:text-noir-chaud transition-colors"
        >
          <ArrowLeft size={24} />
          <span className="font-medium">Retour</span>
        </button>
        
        <button
          onClick={resetConversation}
          className="flex items-center gap-2 text-brun-terreux hover:text-red-600 transition-colors"
        >
          <RotateCcw size={20} />
          <span className="text-sm">Réinitialiser</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto w-full flex-1 flex flex-col"
      >
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-noir-chaud mb-2">
            PsIA
          </h1>
          <p className="text-brun-terreux text-lg">
            Ton compagnon IA pour échanger et réfléchir.
          </p>
        </div>

        {/* Chat Container */}
        <Card backgroundColor="bg-white" className="flex-1 flex flex-col" hoverable={false}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[400px] max-h-[500px]">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <p className="text-brun-terreux text-lg mb-4">
                    Bienvenue ! Je suis PsIA, ton compagnon d'écoute.
                  </p>
                  <p className="text-brun-terreux">
                    Tu peux me parler de ce que tu veux, je suis là pour t'écouter 
                    et t'aider à réfléchir.
                  </p>
                </div>
              </div>
            ) : (
              <>
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
                          ? 'bg-brun-terreux text-white'
                          : 'bg-psia text-noir-chaud'
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-white text-opacity-70' : 'text-brun-terreux'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-psia p-4 rounded-2xl">
                      <Loader2 className="animate-spin text-brun-terreux" size={24} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écris ton message ici..."
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-brun-terreux focus:outline-none resize-none"
                rows={2}
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  !input.trim() || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-brun-terreux text-white hover:bg-opacity-90'
                }`}
              >
                <Send size={20} />
              </motion.button>
            </div>
            <p className="text-xs text-brun-terreux mt-2">
              Appuie sur Entrée pour envoyer, Shift+Entrée pour un retour à la ligne
            </p>
          </div>
        </Card>

        {/* Info card */}
        <Card backgroundColor="bg-white" className="mt-4">
          <p className="text-sm text-brun-terreux">
            💡 <strong>Rappel :</strong> PsIA est un outil d'accompagnement, pas un 
            substitut à un professionnel de santé. En cas de détresse, utilise le bouton SOS.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
