import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getIdentityQuestion, generateIdentityPortrait } from '../lib/mockApi';
import type { IdentityQuestion } from '../lib/mockApi';

interface IdentityModuleProps {
  onBack: () => void;
}

type State = 'idle' | 'loading' | 'question' | 'portrait';

export default function IdentityModule({ onBack }: IdentityModuleProps) {
  const [state, setState] = useState<State>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<IdentityQuestion | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [answers, setAnswers] = useLocalStorage<Array<{question: string, answer: string, date: string}>>('identity-answers', []);
  const [portrait, setPortrait] = useState('');

  const MAX_QUESTIONS = 20;
  const MIN_QUESTIONS_FOR_PORTRAIT = 12;
  const progressPercentage = Math.min((answers.length / MAX_QUESTIONS) * 100, 100);
  const canGeneratePortrait = answers.length >= MIN_QUESTIONS_FOR_PORTRAIT;
  const hasReachedLimit = answers.length >= MAX_QUESTIONS;

  const loadNextQuestion = async () => {
    if (hasReachedLimit) {
      alert('Tu as atteint la limite de 20 questions. Tu peux maintenant générer ton portrait !');
      setState('idle');
      return;
    }
    
    setState('loading');
    try {
      const question = await getIdentityQuestion();
      setCurrentQuestion(question);
      setTextAnswer('');
      setState('question');
    } catch (error) {
      console.error('Error loading question:', error);
      setState('idle');
    }
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    setAnswers([...answers, {
      question: currentQuestion.question,
      answer,
      date: new Date().toISOString()
    }]);

    // Check if limit reached after adding answer
    if (answers.length + 1 >= MAX_QUESTIONS) {
      alert('Tu as répondu à 20 questions ! Tu peux maintenant générer ton portrait.');
      setState('idle');
    } else {
      // Load next question automatically
      loadNextQuestion();
    }
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      handleAnswer(textAnswer);
    }
  };

  const generatePortrait = async () => {
    setState('loading');
    try {
      const result = await generateIdentityPortrait(answers);
      setPortrait(result.portrait);
      setState('portrait');
    } catch (error) {
      console.error('Error generating portrait:', error);
      setState('idle');
    }
  };

  const reset = () => {
    setState('idle');
    setCurrentQuestion(null);
    setTextAnswer('');
    setPortrait('');
  };

  const resetAnswers = () => {
    if (confirm('Es-tu sûr de vouloir effacer toutes tes réponses ?')) {
      setAnswers([]);
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-identite p-4 md:p-8">
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
          onClick={resetAnswers}
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
          Exploration Identité
        </h1>
        <p className="text-brun-terreux text-lg mb-8">
          Découvre qui tu es à travers des questions personnalisées par l'IA.
        </p>

        {/* Progress indicator */}
        <Card backgroundColor="bg-white" className="mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-noir-chaud">
                Progression
              </h3>
              <span className="text-sm text-brun-terreux">
                {answers.length} / {MAX_QUESTIONS} questions
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className={`${canGeneratePortrait ? 'text-green-600 font-medium' : 'text-brun-terreux'}`}>
                {canGeneratePortrait 
                  ? '✓ Portrait disponible' 
                  : `Encore ${MIN_QUESTIONS_FOR_PORTRAIT - answers.length} réponses pour le portrait`}
              </span>
              {hasReachedLimit && (
                <span className="text-purple-600 font-medium">
                  ✓ Limite atteinte
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            {canGeneratePortrait && (
              <Button onClick={generatePortrait} variant={hasReachedLimit ? "primary" : "secondary"}>
                <Sparkles size={20} className="mr-2" />
                Générer mon portrait
              </Button>
            )}
            {!hasReachedLimit && (
              <Button 
                onClick={loadNextQuestion} 
                disabled={state === 'loading'}
                variant={canGeneratePortrait ? "outline" : "primary"}
              >
                {state === 'question' ? 'Question suivante' : 'Commencer l\'exploration'}
              </Button>
            )}
          </div>
        </Card>

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
                    {answers.length === 0 
                      ? "L'IA va te poser des questions pour mieux te connaître. Il n'y a pas de bonne ou mauvaise réponse."
                      : hasReachedLimit
                      ? "Tu as répondu à toutes les questions disponibles. Génère ton portrait pour découvrir ce que l'IA a appris de toi !"
                      : "Continue ton exploration pour mieux te connaître."
                    }
                  </p>
                  {!hasReachedLimit && (
                    <Button onClick={loadNextQuestion}>
                      {answers.length === 0 ? 'Commencer l\'exploration' : 'Continuer l\'exploration'}
                    </Button>
                  )}
                  {canGeneratePortrait && (
                    <Button onClick={generatePortrait} variant={hasReachedLimit ? "primary" : "secondary"} className="ml-4">
                      <Sparkles size={20} className="mr-2" />
                      Générer mon portrait
                    </Button>
                  )}
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
                    {state === 'loading' && !portrait ? 'L\'IA génère une question...' : 'Génération de ton portrait...'}
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Question State */}
          {state === 'question' && currentQuestion && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <div className="mb-4">
                  <span className="text-sm text-brun-terreux font-medium">
                    Question #{answers.length + 1}
                  </span>
                </div>

                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-8">
                  {currentQuestion.question}
                </h2>

                {/* Ping-pong (text input) */}
                {currentQuestion.type === 'ping-pong' && (
                  <div>
                    <textarea
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="Écris ta réponse ici..."
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brun-terreux focus:outline-none min-h-[120px] resize-none"
                    />
                    <div className="flex gap-4 mt-4">
                      <Button onClick={handleTextSubmit} disabled={!textAnswer.trim()}>
                        Valider
                      </Button>
                      <Button variant="outline" onClick={loadNextQuestion}>
                        Question suivante
                      </Button>
                    </div>
                  </div>
                )}

                {/* MCQ or True/False */}
                {(currentQuestion.type === 'mcq' || currentQuestion.type === 'true-false') && (
                  <div className="space-y-4">
                    {currentQuestion.options?.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02, x: 8 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option)}
                        className="w-full text-left p-4 bg-identite rounded-xl hover:bg-opacity-60 transition-all border-2 border-transparent hover:border-brun-terreux"
                      >
                        <p className="text-brun-terreux font-medium">
                          {option}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button variant="outline" onClick={reset}>
                    Terminer pour l'instant
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Portrait State */}
          {state === 'portrait' && (
            <motion.div
              key="portrait"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <div className="text-center mb-6">
                  <Sparkles size={48} className="text-brun-terreux mx-auto mb-4" />
                  <h2 className="text-3xl font-playfair font-bold text-noir-chaud mb-2">
                    Ton Portrait Narratif
                  </h2>
                  <p className="text-brun-terreux text-sm">
                    Généré par l'IA à partir de tes {answers.length} réponses
                  </p>
                </div>

                <div className="p-6 bg-identite rounded-xl mb-6">
                  <p className="text-noir-chaud text-lg leading-relaxed">
                    {portrait}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button onClick={loadNextQuestion}>
                    Continuer l'exploration
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    Terminer
                  </Button>
                </div>
              </Card>

              {/* Answers history */}
              <Card backgroundColor="bg-white" className="mt-6">
                <h3 className="text-lg font-playfair font-bold text-noir-chaud mb-4">
                  Tes réponses récentes
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {answers.slice(-5).reverse().map((answer, index) => (
                    <div key={index} className="p-4 bg-beige rounded-xl">
                      <p className="text-sm text-brun-terreux font-medium mb-2">
                        {answer.question}
                      </p>
                      <p className="text-noir-chaud">
                        {answer.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
