import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getEchoScenario, analyzeEchoChoice } from '../lib/mockApi';

interface EchoModuleProps {
  onBack: () => void;
}

type State = 'idle' | 'loading' | 'choice' | 'analysis';

export default function EchoModule({ onBack }: EchoModuleProps) {
  const [state, setState] = useState<State>('idle');
  const [situation, setSituation] = useState('');
  const [reactions, setReactions] = useState<string[]>([]);
  const [selectedReaction, setSelectedReaction] = useState('');
  const [analysis, setAnalysis] = useState({ analysis: '', reflection: '' });
  const [history, setHistory] = useLocalStorage<Array<{situation: string, choice: string, date: string}>>('echo-history', []);

  const startNewScenario = async () => {
    setState('loading');
    try {
      const scenario = await getEchoScenario();
      setSituation(scenario.situation);
      setReactions(scenario.reactions);
      setState('choice');
    } catch (error) {
      console.error('Error loading scenario:', error);
      setState('idle');
    }
  };

  const handleChoiceSelection = async (reaction: string) => {
    setSelectedReaction(reaction);
    setState('loading');
    
    try {
      const result = await analyzeEchoChoice(situation, reaction);
      setAnalysis(result);
      
      // Save to history
      setHistory([...history, {
        situation,
        choice: reaction,
        date: new Date().toISOString()
      }]);
      
      setState('analysis');
    } catch (error) {
      console.error('Error analyzing choice:', error);
      setState('choice');
    }
  };

  const reset = () => {
    setState('idle');
    setSituation('');
    setReactions([]);
    setSelectedReaction('');
    setAnalysis({ analysis: '', reflection: '' });
  };

  const resetHistory = () => {
    if (confirm('Es-tu sûr de vouloir effacer tout l\'historique ?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-echo p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brun-terreux hover:text-noir-chaud transition-colors"
        >
          <ArrowLeft size={24} />
          <span className="font-medium">Retour</span>
        </button>
        
        <button
          onClick={resetHistory}
          className="flex items-center gap-2 text-brun-terreux hover:text-red-600 transition-colors"
        >
          <RotateCcw size={20} />
          <span className="text-sm">Réinitialiser</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-noir-chaud mb-4">
          Module Écho
        </h1>
        <p className="text-brun-terreux text-lg mb-8">
          Explore des situations et découvre tes réactions naturelles.
        </p>

        <AnimatePresence mode="wait">
          {/* Idle State */}
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <div className="text-center py-12">
                  <p className="text-xl text-brun-terreux mb-8">
                    Prêt à explorer une nouvelle situation ?
                  </p>
                  <Button onClick={startNewScenario}>
                    Commencer une session
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Loading State */}
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card backgroundColor="bg-white">
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="animate-spin text-brun-terreux mb-4" size={48} />
                  <p className="text-brun-terreux">
                    L'IA génère une situation pour toi...
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Choice State */}
          {state === 'choice' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-4">
                  Situation
                </h2>
                <p className="text-brun-terreux text-lg mb-8 leading-relaxed">
                  {situation}
                </p>

                <h3 className="text-xl font-playfair font-bold text-noir-chaud mb-4">
                  Comment réagirais-tu ?
                </h3>
                <div className="space-y-4">
                  {reactions.map((reaction, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChoiceSelection(reaction)}
                      className="w-full text-left p-4 bg-beige rounded-xl hover:bg-opacity-80 transition-all border-2 border-transparent hover:border-brun-terreux"
                    >
                      <p className="text-brun-terreux">
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                        {reaction}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Analysis State */}
          {state === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white" className="mb-4">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-4">
                  Analyse de ta réaction
                </h2>
                
                <div className="mb-6 p-4 bg-beige rounded-xl">
                  <p className="text-sm text-brun-terreux font-medium mb-2">
                    Tu as choisi :
                  </p>
                  <p className="text-noir-chaud">
                    "{selectedReaction}"
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-noir-chaud mb-2">Analyse :</h3>
                  <p className="text-brun-terreux leading-relaxed">
                    {analysis.analysis}
                  </p>
                </div>

                <div className="p-4 bg-identite rounded-xl">
                  <h3 className="font-bold text-noir-chaud mb-2">Pour réfléchir :</h3>
                  <p className="text-brun-terreux leading-relaxed">
                    {analysis.reflection}
                  </p>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={startNewScenario}>
                    Nouvelle situation
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    Terminer
                  </Button>
                </div>
              </Card>

              {/* History Preview */}
              {history.length > 0 && (
                <Card backgroundColor="bg-white">
                  <h3 className="text-lg font-playfair font-bold text-noir-chaud mb-4">
                    Historique ({history.length} sessions)
                  </h3>
                  <p className="text-sm text-brun-terreux">
                    Retrouve toutes tes sessions dans le module Journal.
                  </p>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
