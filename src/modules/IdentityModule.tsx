import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { getIdentityQuestion, generateIdentityPortrait, IdentityQuestion } from '../lib/mockApi';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface IdentityModuleProps {
  onBack: () => void;
}

type State = 'loading' | 'question' | 'portrait';

export function IdentityModule({ onBack }: IdentityModuleProps) {
  const [state, setState] = useState<State>('loading');
  const [currentQuestion, setCurrentQuestion] = useState<IdentityQuestion | null>(null);
  const [answers, setAnswers] = useLocalStorage<Record<string, string>>('identity-answers', {});
  const [portrait, setPortrait] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  useEffect(() => {
    loadNextQuestion();
  }, []);

  const loadNextQuestion = async () => {
    setState('loading');
    const question = await getIdentityQuestion();
    setCurrentQuestion(question);
    setCurrentAnswer('');
    setState('question');
  };

  const handleAnswerSubmit = (answer: string) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    
    loadNextQuestion();
  };

  const handleGeneratePortrait = async () => {
    setState('loading');
    const result = await generateIdentityPortrait(answers);
    setPortrait(result.narrative);
    setState('portrait');
  };

  const handleReset = () => {
    setAnswers({});
    setPortrait(null);
    setCurrentAnswer('');
    loadNextQuestion();
  };

  return (
    <div className="min-h-screen bg-identite p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
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
          className="font-playfair text-4xl md:text-5xl font-bold text-warm-black mb-4"
        >
          Module Identité
        </motion.h1>

        <p className="font-inter text-warm-brown mb-8">
          Réponses enregistrées : {Object.keys(answers).length}
        </p>

        <AnimatePresence mode="wait">
          {/* Loading State */}
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl"
            >
              <Loader2 className="animate-spin text-warm-brown mb-4" size={48} />
              <p className="font-inter text-warm-brown">Génération en cours...</p>
            </motion.div>
          )}

          {/* Question State */}
          {state === 'question' && currentQuestion && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 shadow-lg space-y-6"
            >
              <h2 className="font-playfair text-2xl font-semibold text-warm-black">
                {currentQuestion.question}
              </h2>

              {/* Ping-Pong (Open text) */}
              {currentQuestion.type === 'ping-pong' && (
                <div className="space-y-4">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="w-full p-4 bg-beige rounded-lg font-inter text-warm-black resize-none focus:outline-none focus:ring-2 focus:ring-warm-brown"
                    rows={4}
                    placeholder="Écris ta réponse ici..."
                  />
                  <Button 
                    onClick={() => handleAnswerSubmit(currentAnswer)}
                    disabled={!currentAnswer.trim()}
                    className="w-full"
                  >
                    Suivant
                  </Button>
                </div>
              )}

              {/* QCM or True/False */}
              {(currentQuestion.type === 'qcm' || currentQuestion.type === 'true-false') && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSubmit(option)}
                      className="w-full text-left p-4 bg-beige rounded-lg font-inter text-warm-black hover:bg-warm-brown hover:text-white transition-all duration-200"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}

              {Object.keys(answers).length >= 3 && (
                <Button 
                  onClick={handleGeneratePortrait}
                  variant="secondary"
                  className="w-full mt-6"
                >
                  Générer mon Portrait Narratif
                </Button>
              )}
            </motion.div>
          )}

          {/* Portrait State */}
          {state === 'portrait' && portrait && (
            <motion.div
              key="portrait"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 shadow-lg space-y-6"
            >
              <h2 className="font-playfair text-3xl font-semibold text-warm-black text-center mb-6">
                Ton Portrait Narratif
              </h2>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-beige p-6 rounded-xl"
              >
                <p className="font-inter text-lg text-warm-black leading-relaxed">
                  {portrait}
                </p>
              </motion.div>

              <div className="flex gap-4">
                <Button onClick={loadNextQuestion} className="flex-1">
                  Continuer à explorer
                </Button>
                <Button onClick={onBack} variant="secondary" className="flex-1">
                  Retour
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
