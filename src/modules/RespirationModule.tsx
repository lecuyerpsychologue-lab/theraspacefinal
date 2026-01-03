import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface RespirationModuleProps {
  onBack: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export default function RespirationModule({ onBack }: RespirationModuleProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [seconds, setSeconds] = useState(0);
  const [sessionCount, setSessionCount] = useLocalStorage('respiration-sessions', 0);
  const [totalTime, setTotalTime] = useLocalStorage('respiration-total-time', 0);

  const phaseDurations: Record<Phase, number> = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2
  };

  const phaseLabels: Record<Phase, string> = {
    inhale: 'Inspire',
    hold: 'Retiens',
    exhale: 'Expire',
    rest: 'Pause'
  };

  useEffect(() => {
    let interval: number;

    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          const phaseDuration = phaseDurations[phase];

          if (newSeconds >= phaseDuration) {
            // Move to next phase
            const phases: Phase[] = ['inhale', 'hold', 'exhale', 'rest'];
            const currentIndex = phases.indexOf(phase);
            const nextPhase = phases[(currentIndex + 1) % phases.length];
            setPhase(nextPhase);
            
            // Update total time
            setTotalTime(totalTime + 1);
            
            return 0;
          }

          // Update total time
          setTotalTime(totalTime + 1);
          
          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, totalTime]);

  const toggleExercise = () => {
    if (!isActive) {
      setSessionCount(sessionCount + 1);
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setSeconds(0);
  };

  const resetStats = () => {
    if (confirm('Es-tu sûr de vouloir réinitialiser tes statistiques ?')) {
      setSessionCount(0);
      setTotalTime(0);
    }
  };

  const getCircleScale = () => {
    const progress = seconds / phaseDurations[phase];
    if (phase === 'inhale') return 1 + progress * 0.5;
    if (phase === 'exhale') return 1.5 - progress * 0.5;
    return phase === 'hold' ? 1.5 : 1;
  };

  return (
    <div className="min-h-screen bg-respiration p-4 md:p-8">
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
          onClick={resetStats}
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
          Respiration Guidée
        </h1>
        <p className="text-brun-terreux text-lg mb-8">
          Prends quelques minutes pour te recentrer avec cet exercice de respiration.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card backgroundColor="bg-white">
            <p className="text-brun-terreux text-sm mb-1">Sessions complétées</p>
            <p className="text-3xl font-bold text-noir-chaud">{sessionCount}</p>
          </Card>
          <Card backgroundColor="bg-white">
            <p className="text-brun-terreux text-sm mb-1">Temps total</p>
            <p className="text-3xl font-bold text-noir-chaud">
              {Math.floor(totalTime / 60)}min
            </p>
          </Card>
        </div>

        {/* Breathing Exercise */}
        <Card backgroundColor="bg-white" className="text-center py-12">
          {/* Breathing Circle */}
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ 
                scale: getCircleScale(),
              }}
              transition={{ 
                duration: 1,
                ease: "easeInOut"
              }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-respiration to-blue-300 flex items-center justify-center shadow-2xl"
            >
              <div className="text-white text-center">
                <p className="text-2xl font-playfair font-bold mb-2">
                  {phaseLabels[phase]}
                </p>
                <p className="text-5xl font-bold">
                  {phaseDurations[phase] - seconds}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <p className="text-lg text-brun-terreux mb-4">
              {phase === 'inhale' && 'Inspire profondément par le nez'}
              {phase === 'hold' && 'Retiens ta respiration'}
              {phase === 'exhale' && 'Expire lentement par la bouche'}
              {phase === 'rest' && 'Profite de ce moment de calme'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleExercise}
              className="bg-brun-terreux text-white px-8 py-4 rounded-xl font-medium flex items-center gap-3 shadow-lg"
            >
              {isActive ? (
                <>
                  <Pause size={24} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={24} />
                  {seconds > 0 ? 'Reprendre' : 'Commencer'}
                </>
              )}
            </motion.button>

            {(isActive || seconds > 0) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="bg-gray-200 text-brun-terreux px-6 py-4 rounded-xl font-medium"
              >
                Recommencer
              </motion.button>
            )}
          </div>
        </Card>

        {/* Info */}
        <Card backgroundColor="bg-white" className="mt-6">
          <h3 className="font-bold text-noir-chaud mb-2">
            À propos de cet exercice
          </h3>
          <p className="text-brun-terreux text-sm leading-relaxed">
            La respiration 4-4-6-2 est une technique simple mais puissante pour calmer 
            le système nerveux. Pratique régulièrement, elle peut réduire le stress 
            et l'anxiété, améliorer la concentration et favoriser un meilleur sommeil.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
