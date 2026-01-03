import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { getEchoScenario, getEchoAnalysis, EchoScenario, EchoAnalysis } from '../lib/mockApi';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface EchoModuleProps {
  onBack: () => void;
}

type State = 'situation' | 'loading' | 'choice' | 'analysis';

interface Session {
  scenario: EchoScenario | null;
  chosenReaction: string | null;
  analysis: EchoAnalysis | null;
}

export function EchoModule({ onBack }: EchoModuleProps) {
  const [state, setState] = useState<State>('loading');
  const [session, setSession] = useState<Session>({
    scenario: null,
    chosenReaction: null,
    analysis: null
  });
  const [, setHistory] = useLocalStorage<EchoAnalysis[]>('echo-history', []);

  useEffect(() => {
    loadScenario();
  }, []);

  const loadScenario = async () => {
    setState('loading');
    const scenario = await getEchoScenario();
    setSession({ scenario, chosenReaction: null, analysis: null });
    setState('situation');
  };

  const handleReactionChoice = async (reaction: string) => {
    setSession(prev => ({ ...prev, chosenReaction: reaction }));
    setState('loading');
    
    const analysis = await getEchoAnalysis(reaction);
    setSession(prev => ({ ...prev, analysis }));
    setHistory(prev => [...prev, analysis]);
    setState('analysis');
  };

  const handleReset = () => {
    setSession({ scenario: null, chosenReaction: null, analysis: null });
    loadScenario();
  };

  return (
    <div className="min-h-screen bg-echo p-4 md:p-8">
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
          className="font-playfair text-4xl md:text-5xl font-bold text-warm-black mb-8"
        >
          Module Écho
        </motion.h1>

        <AnimatePresence mode="wait">
          {/* Loading State */}
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[400px]"
            >
              <Loader2 className="animate-spin text-warm-brown mb-4" size={48} />
              <p className="font-inter text-warm-brown">Génération en cours...</p>
            </motion.div>
          )}

          {/* Situation State */}
          {state === 'situation' && session.scenario && (
            <motion.div
              key="situation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-6">
                Situation
              </h2>
              <p className="font-inter text-lg text-warm-brown mb-8 leading-relaxed">
                {session.scenario.situation}
              </p>

              <h3 className="font-playfair text-xl font-semibold text-warm-black mb-4">
                Choisis ta réaction :
              </h3>
              
              <div className="space-y-3">
                {session.scenario.reactions.map((reaction, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReactionChoice(reaction)}
                    className="w-full text-left p-4 bg-beige rounded-lg font-inter text-warm-black hover:bg-warm-brown hover:text-white transition-all duration-200"
                  >
                    {reaction}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analysis State */}
          {state === 'analysis' && session.analysis && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-4">
                  Ta réaction
                </h2>
                <p className="font-inter text-lg text-warm-brown mb-6 bg-beige p-4 rounded-lg">
                  {session.analysis.chosenReaction}
                </p>

                <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-4">
                  Analyse
                </h2>
                <p className="font-inter text-lg text-warm-brown leading-relaxed">
                  {session.analysis.analysis}
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleReset} className="flex-1">
                  Nouvelle situation
                </Button>
                <Button onClick={onBack} variant="secondary" className="flex-1">
                  Retour à l'accueil
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
