import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, RotateCcw, Sprout, Leaf } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getGardenActions } from '../lib/mockApi';

interface GardenModuleProps {
  onBack: () => void;
}

type State = 'domain-selection' | 'loading' | 'action-selection' | 'growing';

const domains = [
  'Relations sociales',
  'Confiance en soi',
  'Gestion des émotions',
  'Créativité'
];

export default function GardenModule({ onBack }: GardenModuleProps) {
  const [state, setState] = useState<State>('domain-selection');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [actions, setActions] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [growthLevel, setGrowthLevel] = useLocalStorage('garden-growth', 0);

  const handleDomainSelect = async (domain: string) => {
    setSelectedDomain(domain);
    setState('loading');
    
    try {
      const result = await getGardenActions(domain);
      setActions(result.actions);
      setState('action-selection');
    } catch (error) {
      console.error('Error loading actions:', error);
      setState('domain-selection');
    }
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    setState('growing');
  };

  const handleActionComplete = () => {
    setGrowthLevel(Math.min(growthLevel + 1, 10));
  };

  const reset = () => {
    setState('domain-selection');
    setSelectedDomain('');
    setActions([]);
    setSelectedAction('');
  };

  const resetGarden = () => {
    if (confirm('Es-tu sûr de vouloir réinitialiser ton jardin ?')) {
      setGrowthLevel(0);
      reset();
    }
  };

  const getPlantSize = () => {
    return 40 + (growthLevel * 20); // Grows from 40 to 240
  };

  return (
    <div className="min-h-screen bg-jardin p-4 md:p-8">
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
          onClick={resetGarden}
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
          Mon Jardin
        </h1>
        <p className="text-brun-terreux text-lg mb-8">
          Cultive ton bien-être action par action.
        </p>

        {/* Growth Visualization */}
        <Card backgroundColor="bg-white" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-noir-chaud mb-2">
                Niveau de croissance
              </h3>
              <p className="text-brun-terreux">
                {growthLevel}/10 actions complétées
              </p>
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              {growthLevel < 5 ? (
                <Sprout 
                  size={getPlantSize()} 
                  className="text-green-600"
                  strokeWidth={1.5}
                />
              ) : (
                <Leaf 
                  size={getPlantSize()} 
                  className="text-green-700"
                  strokeWidth={1.5}
                />
              )}
            </motion.div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${growthLevel * 10}%` }}
              className="bg-green-500 h-3 rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>
        </Card>

        <AnimatePresence mode="wait">
          {/* Domain Selection */}
          {state === 'domain-selection' && (
            <motion.div
              key="domain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-6">
                  Choisis un domaine à cultiver
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domains.map((domain) => (
                    <motion.button
                      key={domain}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDomainSelect(domain)}
                      className="p-6 bg-jardin rounded-xl text-left border-2 border-transparent hover:border-green-600 transition-all"
                    >
                      <h3 className="font-bold text-noir-chaud text-lg">
                        {domain}
                      </h3>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Loading */}
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
                    L'IA génère des actions pour toi...
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Action Selection */}
          {state === 'action-selection' && (
            <motion.div
              key="action"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-2">
                  {selectedDomain}
                </h2>
                <p className="text-brun-terreux mb-6">
                  Choisis une action concrète à réaliser
                </p>

                <div className="space-y-4">
                  {actions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleActionSelect(action)}
                      className="w-full text-left p-4 bg-jardin rounded-xl hover:bg-opacity-80 transition-all border-2 border-transparent hover:border-green-600"
                    >
                      <p className="text-brun-terreux">
                        <span className="font-bold mr-2">{index + 1}.</span>
                        {action}
                      </p>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6">
                  <Button variant="outline" onClick={reset}>
                    Changer de domaine
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Growing */}
          {state === 'growing' && (
            <motion.div
              key="growing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-4">
                  Ton action du jour
                </h2>
                
                <div className="p-6 bg-jardin rounded-xl mb-6">
                  <p className="text-lg text-noir-chaud font-medium">
                    {selectedAction}
                  </p>
                </div>

                <p className="text-brun-terreux mb-6">
                  Une fois que tu as réalisé cette action, clique sur le bouton ci-dessous 
                  pour faire grandir ton jardin !
                </p>

                <div className="flex gap-4">
                  <Button onClick={handleActionComplete}>
                    ✅ J'ai fait mon action aujourd'hui
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    Choisir une autre action
                  </Button>
                </div>

                {growthLevel === 10 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 bg-green-100 rounded-xl text-center"
                  >
                    <p className="text-green-800 font-bold">
                      🎉 Félicitations ! Ton jardin a atteint sa pleine maturité !
                    </p>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
