import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AncrageModuleProps {
  onBack: () => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const steps = [
  {
    title: 'Bienvenue',
    instruction: 'L\'exercice d\'ancrage 5-4-3-2-1 va t\'aider à te reconnecter au moment présent.',
    color: 'bg-ancrage'
  },
  {
    title: '5 choses que tu VOIS',
    instruction: 'Regarde autour de toi et identifie 5 choses que tu peux voir. Prends ton temps.',
    color: 'bg-blue-100'
  },
  {
    title: '4 choses que tu TOUCHES',
    instruction: 'Identifie 4 choses que tu peux toucher autour de toi. La texture de tes vêtements, la surface d\'une table...',
    color: 'bg-green-100'
  },
  {
    title: '3 choses que tu ENTENDS',
    instruction: 'Ferme les yeux si tu le souhaites et concentre-toi sur 3 sons différents.',
    color: 'bg-yellow-100'
  },
  {
    title: '2 choses que tu SENS',
    instruction: 'Identifie 2 odeurs. Si tu n\'en trouves pas, imagine deux odeurs que tu aimes.',
    color: 'bg-purple-100'
  },
  {
    title: '1 chose que tu GOÛTES',
    instruction: 'Concentre-toi sur un goût dans ta bouche, ou imagine le goût de quelque chose que tu aimes.',
    color: 'bg-pink-100'
  }
];

export default function AncrageModule({ onBack }: AncrageModuleProps) {
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [sessionCount, setSessionCount] = useLocalStorage('ancrage-sessions', 0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false, false]);

  const handleNext = () => {
    if (currentStep === 0) {
      setSessionCount(sessionCount + 1);
      setCurrentStep(1);
    } else if (currentStep < 5) {
      const newCompleted = [...completedSteps];
      newCompleted[currentStep - 1] = true;
      setCompletedSteps(newCompleted);
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setCompletedSteps([false, false, false, false, false]);
  };

  const resetStats = () => {
    if (confirm('Es-tu sûr de vouloir réinitialiser tes statistiques ?')) {
      setSessionCount(0);
      reset();
    }
  };

  const isComplete = currentStep === 5;

  return (
    <div className="min-h-screen bg-ancrage p-4 md:p-8">
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
          Ancrage 5-4-3-2-1
        </h1>
        <p className="text-brun-terreux text-lg mb-8">
          Une technique simple pour revenir au moment présent.
        </p>

        {/* Stats */}
        <Card backgroundColor="bg-white" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brun-terreux text-sm mb-1">Sessions complétées</p>
              <p className="text-3xl font-bold text-noir-chaud">{sessionCount}</p>
            </div>
            
            {/* Progress indicators */}
            {currentStep > 0 && (
              <div className="flex gap-2">
                {completedSteps.map((completed, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      completed 
                        ? 'bg-green-500' 
                        : index < currentStep - 1 
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Exercise */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card backgroundColor={steps[currentStep].color}>
            <div className="py-8">
              <div className="text-center mb-8">
                {currentStep > 0 && (
                  <div className="text-4xl font-bold text-brun-terreux mb-2">
                    {6 - currentStep}/5
                  </div>
                )}
                <h2 className="text-3xl font-playfair font-bold text-noir-chaud mb-4">
                  {steps[currentStep].title}
                </h2>
                <p className="text-lg text-brun-terreux leading-relaxed max-w-2xl mx-auto">
                  {steps[currentStep].instruction}
                </p>
              </div>

              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex justify-center mb-6"
                >
                  <CheckCircle2 size={80} className="text-green-600" />
                </motion.div>
              )}

              <div className="flex justify-center gap-4 mt-8">
                {currentStep > 0 && !isComplete && (
                  <Button variant="outline" onClick={handlePrevious}>
                    Précédent
                  </Button>
                )}
                
                {!isComplete && (
                  <Button onClick={handleNext}>
                    {currentStep === 0 ? 'Commencer' : 'Suivant'}
                  </Button>
                )}

                {isComplete && (
                  <>
                    <Button onClick={reset}>
                      Recommencer
                    </Button>
                    <Button variant="outline" onClick={onBack}>
                      Terminer
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Info */}
        {currentStep === 0 && (
          <Card backgroundColor="bg-white" className="mt-6">
            <h3 className="font-bold text-noir-chaud mb-2">
              À propos de cet exercice
            </h3>
            <p className="text-brun-terreux text-sm leading-relaxed">
              L'ancrage 5-4-3-2-1 est une technique de pleine conscience qui utilise 
              les 5 sens pour ramener ton attention au moment présent. Elle est particulièrement 
              utile en cas d'anxiété, de stress ou de pensées envahissantes.
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
