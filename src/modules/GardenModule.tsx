import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Loader2, Sprout } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button';
import { getGardenActions, GardenAction } from '../lib/mockApi';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface GardenModuleProps {
  onBack: () => void;
}

type State = 'domain' | 'loading' | 'actions' | 'growing';

export function GardenModule({ onBack }: GardenModuleProps) {
  const [state, setState] = useState<State>('domain');
  const [, setSelectedDomain] = useState<string | null>(null);
  const [gardenData, setGardenData] = useState<GardenAction | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [growthLevel, setGrowthLevel] = useLocalStorage<number>('garden-growth', 0);

  const domains = ['Relations sociales', 'Bien-être physique', 'Créativité', 'Apprentissage'];

  const handleDomainSelect = async (domain: string) => {
    setSelectedDomain(domain);
    setState('loading');
    const data = await getGardenActions(domain);
    setGardenData(data);
    setState('actions');
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    setState('growing');
  };

  const handleActionComplete = () => {
    setGrowthLevel(prev => Math.min(prev + 1, 10));
  };

  const handleReset = () => {
    setState('domain');
    setSelectedDomain(null);
    setGardenData(null);
    setSelectedAction(null);
    setGrowthLevel(0);
  };

  const getPlantHeight = () => {
    return 50 + (growthLevel * 20); // 50px base, grows 20px per level
  };

  const getPlantColor = () => {
    const colors = ['#DEF5E5', '#C9EDD5', '#B4E5C5', '#9FDDB5', '#8AD5A5'];
    return colors[Math.min(Math.floor(growthLevel / 2), colors.length - 1)];
  };

  return (
    <div className="min-h-screen bg-jardin p-4 md:p-8">
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
          Mon Jardin Intérieur
        </motion.h1>

        {/* Plant Growth Display */}
        <motion.div
          className="bg-white rounded-2xl p-8 mb-8 flex items-end justify-center"
          style={{ minHeight: '200px' }}
        >
          <motion.div
            animate={{ 
              height: getPlantHeight(),
              backgroundColor: getPlantColor()
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="rounded-t-full flex items-start justify-center pt-4"
            style={{ width: '60px' }}
          >
            <Sprout size={32} className="text-green-800" />
          </motion.div>
        </motion.div>
        
        <p className="font-inter text-center text-warm-brown mb-8">
          Niveau de croissance : {growthLevel}/10
        </p>

        <AnimatePresence mode="wait">
          {/* Domain Selection */}
          {state === 'domain' && (
            <motion.div
              key="domain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-6">
                Choisis un domaine à développer
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domains.map((domain) => (
                  <motion.button
                    key={domain}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDomainSelect(domain)}
                    className="p-6 bg-beige rounded-xl font-inter text-warm-black hover:bg-warm-brown hover:text-white transition-all duration-200"
                  >
                    {domain}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl"
            >
              <Loader2 className="animate-spin text-warm-brown mb-4" size={48} />
              <p className="font-inter text-warm-brown">L'IA génère des actions...</p>
            </motion.div>
          )}

          {/* Actions Display */}
          {state === 'actions' && gardenData && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-2">
                {gardenData.domain}
              </h2>
              <p className="font-inter text-warm-brown mb-6">
                Choisis une action concrète à réaliser :
              </p>
              
              <div className="space-y-3">
                {gardenData.actions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleActionSelect(action)}
                    className="w-full text-left p-4 bg-beige rounded-lg font-inter text-warm-black hover:bg-warm-brown hover:text-white transition-all duration-200"
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Growing State */}
          {state === 'growing' && selectedAction && (
            <motion.div
              key="growing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 shadow-lg space-y-6"
            >
              <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-4">
                Ton action
              </h2>
              <p className="font-inter text-lg text-warm-brown bg-beige p-4 rounded-lg">
                {selectedAction}
              </p>

              <Button 
                onClick={handleActionComplete}
                className="w-full"
                disabled={growthLevel >= 10}
              >
                J'ai fait mon action aujourd'hui
              </Button>

              {growthLevel >= 10 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-inter text-center text-warm-brown"
                >
                  🌟 Félicitations ! Ton jardin est en pleine floraison !
                </motion.p>
              )}

              <div className="flex gap-4">
                <Button onClick={() => setState('domain')} variant="secondary" className="flex-1">
                  Nouvelle action
                </Button>
                <Button onClick={onBack} variant="outline" className="flex-1">
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
