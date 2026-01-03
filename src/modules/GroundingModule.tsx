import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button';

interface GroundingModuleProps {
  onBack: () => void;
}

export function GroundingModule({ onBack }: GroundingModuleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);

  const steps = [
    {
      number: 5,
      sense: 'la vue',
      prompt: 'Nomme 5 choses que tu peux voir autour de toi',
      placeholder: 'Ex: mon téléphone, une lampe, un livre...'
    },
    {
      number: 4,
      sense: 'le toucher',
      prompt: 'Nomme 4 choses que tu peux toucher',
      placeholder: 'Ex: mes vêtements, ma chaise, mon bureau...'
    },
    {
      number: 3,
      sense: 'l\'ouïe',
      prompt: 'Nomme 3 sons que tu peux entendre',
      placeholder: 'Ex: le vent, une voiture, ma respiration...'
    },
    {
      number: 2,
      sense: 'l\'odorat',
      prompt: 'Nomme 2 odeurs que tu peux sentir',
      placeholder: 'Ex: mon parfum, l\'air frais...'
    },
    {
      number: 1,
      sense: 'le goût',
      prompt: 'Nomme 1 chose que tu peux goûter',
      placeholder: 'Ex: le goût dans ma bouche...'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    alert('Exercice terminé ! Tu es maintenant plus ancré(e) dans le présent.');
    setCurrentStep(0);
    setAnswers(['', '', '', '', '']);
  };

  const updateAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-ancrage p-4 md:p-8">
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
          className="font-playfair text-4xl md:text-5xl font-bold text-warm-black mb-4 text-center"
        >
          Ancrage 5-4-3-2-1
        </motion.h1>

        <p className="font-inter text-warm-brown text-center mb-8">
          Une technique pour revenir au moment présent en utilisant tes 5 sens
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-inter font-bold ${
                    index === currentStep
                      ? 'bg-warm-brown text-white'
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-beige text-warm-brown'
                  }`}
                >
                  {step.number}
                </div>
              ))}
            </div>
            <div className="w-full bg-beige rounded-full h-2">
              <motion.div
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-warm-brown rounded-full"
              />
            </div>
          </div>

          {/* Current Step */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="font-playfair text-3xl font-semibold text-warm-black mb-2">
                {steps[currentStep].prompt}
              </h2>
              <p className="font-inter text-warm-brown">
                Utilise {steps[currentStep].sense}
              </p>
            </div>

            <textarea
              value={answers[currentStep]}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder={steps[currentStep].placeholder}
              className="w-full p-4 bg-beige rounded-lg font-inter text-warm-black resize-none focus:outline-none focus:ring-2 focus:ring-warm-brown"
              rows={6}
            />

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 0 && (
                <Button onClick={handlePrevious} variant="secondary" className="flex-1">
                  Précédent
                </Button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={handleNext} 
                  className="flex-1"
                  disabled={!answers[currentStep].trim()}
                >
                  Suivant
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete} 
                  className="flex-1"
                  disabled={!answers[currentStep].trim()}
                >
                  Terminer
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
