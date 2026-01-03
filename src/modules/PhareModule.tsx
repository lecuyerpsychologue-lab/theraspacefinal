import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Share2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getPhareQuestions, calculatePhareResult, getPhareWeeklyGoals } from '../lib/apiClient';
import type { PhareResult, PhareWeeklyGoals, PhareQuestion } from '../lib/apiClient';
import { saveToJournal, shareContent } from '../lib/shareUtils';

interface PhareModuleProps {
  onBack: () => void;
}

type Step = 'intro' | 'questionnaire' | 'result' | 'program';

interface WeekProgress {
  week: number;
  goals: string[];
  completed: boolean[];
  startDate: string;
}

export default function PhareModule({ onBack }: PhareModuleProps) {
  const [step, setStep] = useState<Step>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useLocalStorage<number[]>('phare-answers', []);
  const [result, setResult] = useLocalStorage<PhareResult | null>('phare-result', null);
  const [weekProgress, setWeekProgress] = useLocalStorage<WeekProgress[]>('phare-week-progress', []);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weeklyGoals, setWeeklyGoals] = useState<PhareWeeklyGoals | null>(null);
  const [questions, setQuestions] = useState<PhareQuestion[]>([]);

  useEffect(() => {
    // Load questions when component mounts
    const loadQuestions = async () => {
      const loadedQuestions = await getPhareQuestions();
      setQuestions(loadedQuestions);
    };
    loadQuestions();
  }, []);

  const totalQuestions = 18;
  const progress = (currentQuestion / totalQuestions) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const calculatedResult = calculatePhareResult(newAnswers);
      setResult(calculatedResult);
      setStep('result');
    }
  };

  const startProgram = async () => {
    if (!result) return;
    
    // Load first week goals
    const goals = await getPhareWeeklyGoals(1, result.level);
    setWeeklyGoals(goals);
    
    // Initialize week progress
    const newWeekProgress: WeekProgress = {
      week: 1,
      goals: goals.goals,
      completed: [false, false, false],
      startDate: new Date().toISOString()
    };
    setWeekProgress([newWeekProgress]);
    setCurrentWeek(1);
    setStep('program');
  };

  const toggleGoal = (goalIndex: number) => {
    const updatedProgress = [...weekProgress];
    const currentWeekIndex = updatedProgress.findIndex(w => w.week === currentWeek);
    
    if (currentWeekIndex !== -1) {
      updatedProgress[currentWeekIndex].completed[goalIndex] = 
        !updatedProgress[currentWeekIndex].completed[goalIndex];
      setWeekProgress(updatedProgress);
    }
  };

  const loadNextWeek = async () => {
    if (currentWeek >= 8 || !result) return;
    
    const nextWeek = currentWeek + 1;
    const goals = await getPhareWeeklyGoals(nextWeek, result.level);
    setWeeklyGoals(goals);
    
    const newWeekProgress: WeekProgress = {
      week: nextWeek,
      goals: goals.goals,
      completed: [false, false, false],
      startDate: new Date().toISOString()
    };
    setWeekProgress([...weekProgress, newWeekProgress]);
    setCurrentWeek(nextWeek);
  };

  const getCurrentWeekProgress = (): WeekProgress | undefined => {
    return weekProgress.find(w => w.week === currentWeek);
  };

  const areAllGoalsCompleted = (): boolean => {
    const current = getCurrentWeekProgress();
    return current ? current.completed.every(c => c) : false;
  };

  const getDaysUntilNextWeek = (): number => {
    const current = getCurrentWeekProgress();
    if (!current || !areAllGoalsCompleted()) return 0;
    
    const startDate = new Date(current.startDate);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - diffDays);
  };

  const getBoatPosition = (): number => {
    // Calculate progress through the 8-week program
    const totalWeeks = 8;
    return (currentWeek / totalWeeks) * 100;
  };

  const handleSaveToJournal = () => {
    if (!result) return;
    
    saveToJournal(
      'Phare',
      `Évaluation d'estime de soi - ${result.level}`,
      `Score: ${result.score}\nNiveau: ${result.level}\n${result.description}`
    );
    alert('Enregistré dans ton journal !');
  };

  const handleShare = async () => {
    if (!result) return;
    
    await shareContent(
      `Mon niveau d'estime de soi: ${result.level}`,
      result.description,
      'Phare'
    );
  };

  const reset = () => {
    if (confirm('Es-tu sûr de vouloir recommencer ? Cela effacera tes progrès.')) {
      setAnswers([]);
      setResult(null);
      setWeekProgress([]);
      setCurrentQuestion(0);
      setCurrentWeek(1);
      setStep('intro');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-beige p-4 md:p-8">
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
        
        {result && (
          <button
            onClick={reset}
            className="text-brun-terreux hover:text-red-600 text-sm"
          >
            Recommencer
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-noir-chaud mb-4">
          Programme Phare
        </h1>
        <p className="text-brun-terreux text-lg mb-8">
          Un voyage de 60 jours pour renforcer ton estime de toi.
        </p>

        <AnimatePresence mode="wait">
          {/* Intro */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <div className="text-center py-8">
                  <div className="text-6xl mb-6">🏮</div>
                  <h2 className="text-3xl font-playfair font-bold text-noir-chaud mb-4">
                    Bienvenue dans le Programme Phare
                  </h2>
                  <p className="text-brun-terreux text-lg mb-6 leading-relaxed">
                    Ce programme va t'aider à renforcer ton estime de toi en 8 semaines (60 jours).
                  </p>
                  
                  <div className="text-left max-w-md mx-auto space-y-4 mb-8">
                    <div className="flex gap-3">
                      <div className="text-2xl">1️⃣</div>
                      <div>
                        <p className="font-bold text-noir-chaud">Évaluation initiale</p>
                        <p className="text-sm text-brun-terreux">18 questions pour évaluer ton niveau d'estime de soi</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="text-2xl">2️⃣</div>
                      <div>
                        <p className="font-bold text-noir-chaud">Programme personnalisé</p>
                        <p className="text-sm text-brun-terreux">3 objectifs concrets chaque semaine pendant 8 semaines</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="text-2xl">3️⃣</div>
                      <div>
                        <p className="font-bold text-noir-chaud">Suivi de progression</p>
                        <p className="text-sm text-brun-terreux">Visualise ton voyage vers le phare de confiance</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => setStep('questionnaire')}>
                    Commencer l'évaluation
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Questionnaire */}
          {step === 'questionnaire' && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-brun-terreux mb-2">
                    <span>Question {currentQuestion + 1} sur {totalQuestions}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-brun-terreux h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {questions[currentQuestion] && (
                  <div>
                    <p className="text-sm text-brun-terreux mb-2">
                      {questions[currentQuestion].category}
                    </p>
                    <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-8">
                      {questions[currentQuestion].question}
                    </h2>

                    <div className="space-y-3">
                      {[
                        { value: 1, label: 'Pas du tout d\'accord' },
                        { value: 2, label: 'Plutôt pas d\'accord' },
                        { value: 3, label: 'Plutôt d\'accord' },
                        { value: 4, label: 'Tout à fait d\'accord' }
                      ].map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02, x: 8 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(option.value)}
                          className="w-full text-left p-4 bg-beige rounded-xl hover:bg-brun-terreux hover:text-white transition-all border-2 border-transparent hover:border-brun-terreux"
                        >
                          <p className="font-medium">{option.label}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Result */}
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <div className="text-center py-8">
                  <div className="text-6xl mb-6">🎯</div>
                  <h2 className="text-3xl font-playfair font-bold text-noir-chaud mb-2">
                    Ton niveau d'estime de soi
                  </h2>
                  <p className="text-4xl font-bold text-brun-terreux mb-6">
                    {result.level}
                  </p>
                  
                  <div className="max-w-2xl mx-auto mb-8">
                    <p className="text-lg text-brun-terreux leading-relaxed">
                      {result.description}
                    </p>
                  </div>

                  <div className="p-4 bg-beige rounded-xl mb-8 max-w-md mx-auto">
                    <p className="text-sm text-brun-terreux mb-1">Ton score</p>
                    <p className="text-3xl font-bold text-noir-chaud">{result.score} / 72</p>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button onClick={startProgram}>
                      Démarrer le programme de 60 jours
                    </Button>
                    <Button variant="secondary" onClick={handleSaveToJournal}>
                      <Save size={20} className="mr-2" />
                      Enregistrer
                    </Button>
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 size={20} className="mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Program */}
          {step === 'program' && weeklyGoals && (
            <motion.div
              key="program"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Visualization */}
              <Card backgroundColor="bg-white" className="mb-6">
                <h3 className="text-xl font-bold text-noir-chaud mb-4 text-center">
                  Ton voyage vers le Phare
                </h3>
                
                {/* Modern minimalist progress visualization */}
                <div className="relative h-32 bg-gradient-to-r from-blue-50 via-blue-100 to-orange-50 rounded-xl overflow-hidden p-6">
                  {/* Progress path */}
                  <div className="absolute top-1/2 left-4 right-4 h-2 bg-white/50 rounded-full -translate-y-1/2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                      animate={{ width: `${getBoatPosition()}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Start marker */}
                  <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                  </div>

                  {/* Milestone markers */}
                  {[2, 3, 4, 5, 6, 7].map((week) => {
                    const position = (week / 8) * 100;
                    return (
                      <div
                        key={week}
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{ left: `${position}%` }}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          week <= currentWeek 
                            ? 'bg-orange-400 text-white' 
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}>
                          {week}
                        </div>
                      </div>
                    );
                  })}

                  {/* Lighthouse (goal) */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xl">🏮</span>
                      </div>
                      {currentWeek === 8 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1"
                        >
                          <span className="text-2xl">✨</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Current position indicator */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    animate={{ left: `${Math.max(8, Math.min(92, getBoatPosition()))}%` }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-400">
                        <span className="text-2xl">⛵</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-brun-terreux">
                    Semaine {currentWeek} sur 8 • {Math.round(getBoatPosition())}% du voyage
                  </p>
                </div>
              </Card>

              {/* Weekly Goals */}
              <Card backgroundColor="bg-white">
                <h3 className="text-2xl font-playfair font-bold text-noir-chaud mb-2">
                  Semaine {currentWeek}
                </h3>
                <p className="text-brun-terreux mb-6">
                  Complète ces 3 objectifs cette semaine
                </p>

                <div className="space-y-4 mb-6">
                  {weeklyGoals.goals.map((goal, index) => {
                    const isCompleted = getCurrentWeekProgress()?.completed[index] || false;
                    
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleGoal(index)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          isCompleted
                            ? 'bg-green-100 border-green-500'
                            : 'bg-beige border-gray-200 hover:border-brun-terreux'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isCompleted
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300'
                          }`}>
                            {isCompleted && <Check size={16} className="text-white" />}
                          </div>
                          <p className={`flex-1 ${isCompleted ? 'line-through text-gray-600' : 'text-noir-chaud'}`}>
                            {goal}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {areAllGoalsCompleted() && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-100 rounded-xl text-center mb-6"
                  >
                    <p className="text-green-800 font-bold mb-2">
                      🎉 Bravo ! Tous les objectifs de la semaine sont complétés !
                    </p>
                    {getDaysUntilNextWeek() > 0 ? (
                      <p className="text-green-700 text-sm">
                        Prochaine semaine disponible dans {getDaysUntilNextWeek()} jour{getDaysUntilNextWeek() > 1 ? 's' : ''}
                      </p>
                    ) : currentWeek < 8 ? (
                      <Button onClick={loadNextWeek} className="mt-4">
                        Passer à la semaine {currentWeek + 1}
                      </Button>
                    ) : (
                      <p className="text-green-700 font-bold text-lg mt-2">
                        🏆 Félicitations ! Tu as terminé le programme complet !
                      </p>
                    )}
                  </motion.div>
                )}

                {!areAllGoalsCompleted() && (
                  <p className="text-sm text-brun-terreux">
                    {getCurrentWeekProgress()?.completed.filter(c => c).length || 0} sur 3 objectifs complétés
                  </p>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
