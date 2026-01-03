import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../components/Button';

interface BreathingModuleProps {
  onBack: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export function BreathingModule({ onBack }: BreathingModuleProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [count, setCount] = useState(4);

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
    if (!isActive) return;

    const interval = setInterval(() => {
      setCount(prev => {
        if (prev > 1) return prev - 1;
        
        // Move to next phase
        const phases: Phase[] = ['inhale', 'hold', 'exhale', 'rest'];
        const currentIndex = phases.indexOf(phase);
        const nextPhase = phases[(currentIndex + 1) % phases.length];
        setPhase(nextPhase);
        return phaseDurations[nextPhase];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleActive = () => {
    if (!isActive) {
      setPhase('inhale');
      setCount(4);
    }
    setIsActive(!isActive);
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 0.8;
      case 'rest': return 0.8;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-respiration p-4 md:p-8">
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
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-playfair text-4xl md:text-5xl font-bold text-warm-black mb-8 text-center"
        >
          Respiration Guidée
        </motion.h1>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col items-center space-y-8">
            {/* Breathing Circle */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                animate={{ scale: getCircleScale() }}
                transition={{ duration: phaseDurations[phase], ease: 'easeInOut' }}
                className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 opacity-50"
              />
              
              <div className="z-10 text-center">
                <motion.p
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-playfair text-3xl font-semibold text-warm-black mb-2"
                >
                  {phaseLabels[phase]}
                </motion.p>
                {isActive && (
                  <motion.p
                    key={`${phase}-${count}`}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-inter text-5xl font-bold text-warm-brown"
                  >
                    {count}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Instructions */}
            {!isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="font-inter text-warm-brown mb-4">
                  Trouve un endroit calme et confortable. Clique sur le bouton ci-dessous pour commencer.
                </p>
                <p className="font-inter text-sm text-warm-brown">
                  Technique 4-4-6-2 : Inspire 4s, retiens 4s, expire 6s, pause 2s
                </p>
              </motion.div>
            )}

            {/* Control Button */}
            <Button
              onClick={toggleActive}
              className="flex items-center gap-2"
              size="lg"
            >
              {isActive ? (
                <>
                  <Pause size={20} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Commencer</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
