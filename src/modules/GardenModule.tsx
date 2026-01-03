import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getGardenActions } from '../lib/mockApi';

interface GardenModuleProps {
  onBack: () => void;
}

type State = 'domain-selection' | 'loading' | 'action-selection' | 'growing' | 'grid';

const domains = [
  'Relations sociales',
  'Confiance en soi',
  'Gestion des émotions',
  'Créativité'
];

interface PlantCell {
  domain: string;
  action: string;
  growthLevel: number; // 0-3: empty, seed, sprout, flower
  plantedDate: string;
  lastWateredDate: string;
}

type GardenGrid = (PlantCell | null)[][];

export default function GardenModule({ onBack }: GardenModuleProps) {
  const [state, setState] = useState<State>('grid');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [actions, setActions] = useState<string[]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [garden, setGarden] = useLocalStorage<GardenGrid>('garden-grid-9x9', 
    Array(9).fill(null).map(() => Array(9).fill(null))
  );
  const [dailyActions, setDailyActions] = useLocalStorage<{date: string, count: number}>('garden-daily-actions', 
    {date: new Date().toISOString().split('T')[0], count: 0}
  );

  const MAX_DAILY_ACTIONS = 3;

  const canPerformAction = () => {
    const today = new Date().toISOString().split('T')[0];
    if (dailyActions.date !== today) {
      setDailyActions({date: today, count: 0});
      return true;
    }
    return dailyActions.count < MAX_DAILY_ACTIONS;
  };

  const incrementDailyActions = () => {
    const today = new Date().toISOString().split('T')[0];
    if (dailyActions.date !== today) {
      setDailyActions({date: today, count: 1});
    } else {
      setDailyActions({date: today, count: dailyActions.count + 1});
    }
  };

  const checkAndGrowPlants = () => {
    const today = new Date().toISOString().split('T')[0];
    const newGarden = garden.map(row => 
      row.map(cell => {
        if (!cell) return null;
        
        const plantedDate = new Date(cell.plantedDate).toISOString().split('T')[0];
        const lastWatered = new Date(cell.lastWateredDate).toISOString().split('T')[0];
        
        // Check if it's been watered today
        if (lastWatered === today && cell.growthLevel < 3) {
          // Calculate days since planted
          const daysSincePlanted = Math.floor(
            (new Date(today).getTime() - new Date(plantedDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          // Growth level based on days (max 3)
          const newGrowthLevel = Math.min(3, daysSincePlanted + 1);
          
          return {
            ...cell,
            growthLevel: newGrowthLevel
          };
        }
        return cell;
      })
    );
    setGarden(newGarden);
  };

  const handleCellClick = (row: number, col: number) => {
    const cell = garden[row][col];
    
    if (!cell) {
      // Empty cell - start planting
      setSelectedCell({row, col});
      setState('domain-selection');
    } else {
      // Existing plant - water it
      if (!canPerformAction()) {
        alert(`Tu as atteint la limite de ${MAX_DAILY_ACTIONS} actions quotidiennes. Reviens demain !`);
        return;
      }
      
      const today = new Date().toISOString().split('T')[0];
      const lastWatered = new Date(cell.lastWateredDate).toISOString().split('T')[0];
      
      if (lastWatered === today) {
        alert('Tu as déjà arrosé cette plante aujourd\'hui !');
        return;
      }
      
      // Water the plant
      const newGarden = garden.map((r, ri) =>
        r.map((c, ci) => {
          if (ri === row && ci === col && c) {
            return {
              ...c,
              lastWateredDate: new Date().toISOString()
            };
          }
          return c;
        })
      );
      setGarden(newGarden);
      incrementDailyActions();
      checkAndGrowPlants();
      alert('🌱 Plante arrosée ! Reviens demain pour la voir grandir.');
    }
  };

  const handleDomainSelect = async (domain: string) => {
    if (!canPerformAction()) {
      alert(`Tu as atteint la limite de ${MAX_DAILY_ACTIONS} actions quotidiennes. Reviens demain !`);
      setState('grid');
      return;
    }
    
    setSelectedDomain(domain);
    setState('loading');
    
    try {
      const result = await getGardenActions(domain);
      setActions(result.actions);
      setState('action-selection');
    } catch (error) {
      console.error('Error loading actions:', error);
      setState('grid');
    }
  };

  const handleActionSelect = (action: string) => {
    if (selectedCell) {
      // Plant the seed
      const newGarden = garden.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri === selectedCell.row && ci === selectedCell.col) {
            return {
              domain: selectedDomain,
              action: action,
              growthLevel: 0,
              plantedDate: new Date().toISOString(),
              lastWateredDate: new Date().toISOString()
            };
          }
          return cell;
        })
      );
      setGarden(newGarden);
      incrementDailyActions();
      setState('grid');
      setSelectedCell(null);
      alert('🌱 Objectif planté ! Reviens demain pour l\'arroser et le faire grandir.');
    }
  };

  const reset = () => {
    setState('grid');
    setSelectedDomain('');
    setActions([]);
    setSelectedCell(null);
  };

  const resetGarden = () => {
    if (confirm('Es-tu sûr de vouloir réinitialiser ton jardin ?')) {
      setGarden(Array(9).fill(null).map(() => Array(9).fill(null)));
      setDailyActions({date: new Date().toISOString().split('T')[0], count: 0});
      reset();
    }
  };

  const getPlantIcon = (growthLevel: number) => {
    switch(growthLevel) {
      case 0: return '🌰'; // seed
      case 1: return '🌱'; // sprout
      case 2: return '🌿'; // growing
      case 3: return '🌸'; // flower
      default: return '🌰';
    }
  };

  const getTotalPlants = () => {
    return garden.flat().filter(cell => cell !== null).length;
  };

  const getMaturePlants = () => {
    return garden.flat().filter(cell => cell && cell.growthLevel === 3).length;
  };

  const today = new Date().toISOString().split('T')[0];
  const actionsLeft = dailyActions.date === today ? MAX_DAILY_ACTIONS - dailyActions.count : MAX_DAILY_ACTIONS;

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
          Cultive ton bien-être action par action. Plante des objectifs et arrose-les chaque jour.
        </p>

        {/* Growth Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card backgroundColor="bg-white">
            <div className="text-center">
              <p className="text-sm text-brun-terreux mb-1">Objectifs plantés</p>
              <p className="text-3xl font-bold text-noir-chaud">{getTotalPlants()} / 81</p>
            </div>
          </Card>
          
          <Card backgroundColor="bg-white">
            <div className="text-center">
              <p className="text-sm text-brun-terreux mb-1">Plantes matures</p>
              <p className="text-3xl font-bold text-green-600">{getMaturePlants()}</p>
            </div>
          </Card>
          
          <Card backgroundColor="bg-white">
            <div className="text-center">
              <p className="text-sm text-brun-terreux mb-1">Actions quotidiennes</p>
              <p className="text-3xl font-bold text-noir-chaud">{actionsLeft} / {MAX_DAILY_ACTIONS}</p>
            </div>
          </Card>
        </div>

        <AnimatePresence mode="wait">
          {/* Garden Grid */}
          {state === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-4">
                  Ton Jardin 9x9
                </h2>
                <p className="text-brun-terreux mb-6">
                  Clique sur une case vide pour planter un nouvel objectif, ou sur une plante pour l'arroser.
                </p>
                
                {/* Grid */}
                <div className="grid grid-cols-9 gap-1 md:gap-2 mb-6">
                  {garden.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                      <motion.button
                        key={`${rowIndex}-${colIndex}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`aspect-square rounded-lg flex items-center justify-center text-2xl md:text-3xl transition-all ${
                          cell 
                            ? 'bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300' 
                            : 'bg-beige hover:bg-gray-200 border-2 border-dashed border-gray-300'
                        }`}
                        title={cell ? `${cell.domain}: ${cell.action}` : 'Planter un objectif'}
                      >
                        {cell ? getPlantIcon(cell.growthLevel) : '+'}
                      </motion.button>
                    ))
                  ))}
                </div>

                <div className="p-4 bg-beige rounded-xl">
                  <p className="text-sm text-brun-terreux mb-2">
                    <strong>Comment ça marche :</strong>
                  </p>
                  <ul className="text-sm text-brun-terreux space-y-1 list-disc list-inside">
                    <li>Tu peux planter ou arroser {MAX_DAILY_ACTIONS} objectifs par jour</li>
                    <li>Arrose tes plantes chaque jour pour les faire grandir</li>
                    <li>Les plantes passent par 4 stades : 🌰 → 🌱 → 🌿 → 🌸</li>
                    <li>Chaque stade représente 1 jour de croissance</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          )}

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
                    Retour au jardin
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
