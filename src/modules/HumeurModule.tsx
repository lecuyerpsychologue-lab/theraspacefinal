import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Share2 } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { saveToJournal, shareContent } from '../lib/shareUtils';

interface HumeurModuleProps {
  onBack: () => void;
}

interface HumeurEntry {
  emotion: string;
  intensity: number;
  context: string;
  notes: string;
  date: string;
}

const emotions = [
  { name: 'Joie', color: '#FFD700', angle: 0 },
  { name: 'Fierté', color: '#FF6B9D', angle: 45 },
  { name: 'Colère', color: '#FF4444', angle: 90 },
  { name: 'Tristesse', color: '#4169E1', angle: 135 },
  { name: 'Peur', color: '#9370DB', angle: 180 },
  { name: 'Dégoût', color: '#32CD32', angle: 225 },
  { name: 'Surprise', color: '#FFA500', angle: 270 },
  { name: 'Calme', color: '#87CEEB', angle: 315 },
];

const contexts = [
  'Famille',
  'École',
  'Amis',
  'Amour',
  'Loisirs',
  'Autre'
];

export default function HumeurModule({ onBack }: HumeurModuleProps) {
  const [step, setStep] = useState<'wheel' | 'intensity' | 'context' | 'notes' | 'summary'>('wheel');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(3);
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [history, setHistory] = useLocalStorage<HumeurEntry[]>('humeur-history', []);

  const handleEmotionSelect = (emotionName: string) => {
    setSelectedEmotion(emotionName);
  };

  const handleSave = () => {
    const entry: HumeurEntry = {
      emotion: selectedEmotion,
      intensity,
      context: selectedContext,
      notes,
      date: new Date().toISOString()
    };
    
    setHistory([...history, entry]);
    setStep('summary');
  };

  const handleSaveToJournal = () => {
    saveToJournal(
      'Humeur',
      `${selectedEmotion} - Intensité ${intensity}/5`,
      `Émotion: ${selectedEmotion}\nIntensité: ${intensity}/5\nContexte: ${selectedContext}\nNotes: ${notes || 'Aucune note'}`
    );
    alert('Enregistré dans ton journal !');
  };

  const handleShare = async () => {
    await shareContent(
      `${selectedEmotion} - Intensité ${intensity}/5`,
      `Aujourd'hui, je ressens ${selectedEmotion.toLowerCase()} avec une intensité de ${intensity}/5 dans le contexte: ${selectedContext}`,
      'Humeur'
    );
  };

  const reset = () => {
    setStep('wheel');
    setSelectedEmotion('');
    setIntensity(3);
    setSelectedContext('');
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-beige p-4 md:p-8">
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-noir-chaud mb-4">
          Ma Météo Émotionnelle
        </h1>
        <p className="text-brun-terreux text-lg mb-8">
          Explore et comprends tes émotions du moment.
        </p>

        <AnimatePresence mode="wait">
          {/* Emotion Wheel */}
          {step === 'wheel' && (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-6 text-center">
                  Quelle émotion ressens-tu ?
                </h2>
                <p className="text-brun-terreux mb-6 text-center">
                  Choisis l'émotion qui correspond le mieux à ton état actuel
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {emotions.map((emotion) => (
                    <motion.button
                      key={emotion.name}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEmotionSelect(emotion.name)}
                      className={`p-6 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 ${
                        selectedEmotion === emotion.name
                          ? 'border-brun-terreux shadow-lg'
                          : 'border-transparent bg-beige hover:bg-opacity-70'
                      }`}
                      style={{
                        backgroundColor: selectedEmotion === emotion.name ? `${emotion.color}20` : undefined
                      }}
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                        style={{ backgroundColor: emotion.color }}
                      >
                        {emotion.name === 'Joie' && '😊'}
                        {emotion.name === 'Fierté' && '🌟'}
                        {emotion.name === 'Colère' && '😠'}
                        {emotion.name === 'Tristesse' && '😢'}
                        {emotion.name === 'Peur' && '😰'}
                        {emotion.name === 'Dégoût' && '🤢'}
                        {emotion.name === 'Surprise' && '😮'}
                        {emotion.name === 'Calme' && '😌'}
                      </div>
                      <span className="font-medium text-noir-chaud">
                        {emotion.name}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => setStep('intensity')} disabled={!selectedEmotion}>
                    Continuer
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Intensity Thermometer */}
          {step === 'intensity' && (
            <motion.div
              key="intensity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-2">
                  Intensité: {selectedEmotion}
                </h2>
                <p className="text-brun-terreux mb-6">
                  À quel point ressens-tu cette émotion ?
                </p>

                <div className="flex flex-col items-center mb-8">
                  {/* Thermometer */}
                  <div className="relative h-96 w-20 bg-gray-200 rounded-full mb-6">
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-300 via-yellow-300 to-red-500 rounded-full"
                      initial={{ height: '60%' }}
                      animate={{ height: `${intensity * 20}%` }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Level markers */}
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className="absolute right-full mr-4 text-brun-terreux font-medium"
                        style={{ bottom: `${level * 20 - 10}%` }}
                      >
                        {level}
                      </div>
                    ))}
                  </div>

                  {/* Slider */}
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full max-w-xs"
                  />
                  
                  <div className="flex justify-between w-full max-w-xs text-sm text-brun-terreux mt-2">
                    <span>Faible</span>
                    <span>Intense</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep('context')}>
                    Suivant
                  </Button>
                  <Button variant="outline" onClick={() => setStep('wheel')}>
                    Retour
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Context Selection */}
          {step === 'context' && (
            <motion.div
              key="context"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-2">
                  Contexte
                </h2>
                <p className="text-brun-terreux mb-6">
                  Dans quel contexte ressens-tu {selectedEmotion.toLowerCase()} ?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {contexts.map((context) => (
                    <motion.button
                      key={context}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedContext(context)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedContext === context
                          ? 'bg-brun-terreux text-white border-brun-terreux'
                          : 'bg-beige text-brun-terreux border-gray-200 hover:border-brun-terreux'
                      }`}
                    >
                      {context}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep('notes')} disabled={!selectedContext}>
                    Suivant
                  </Button>
                  <Button variant="outline" onClick={() => setStep('intensity')}>
                    Retour
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Notes */}
          {step === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-2">
                  Notes personnelles
                </h2>
                <p className="text-brun-terreux mb-6">
                  Ajoute des détails si tu veux (optionnel)
                </p>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Qu'est-ce qui a déclenché cette émotion ? Comment te sens-tu dans ton corps ?..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brun-terreux focus:outline-none min-h-[200px] resize-none mb-6"
                />

                <div className="flex gap-4">
                  <Button onClick={handleSave}>
                    Enregistrer
                  </Button>
                  <Button variant="outline" onClick={() => setStep('context')}>
                    Retour
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Summary */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-6 text-center">
                  Résumé de ta météo émotionnelle
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-beige rounded-xl">
                    <p className="text-sm text-brun-terreux mb-1">Émotion</p>
                    <p className="text-xl font-bold text-noir-chaud">{selectedEmotion}</p>
                  </div>

                  <div className="p-4 bg-beige rounded-xl">
                    <p className="text-sm text-brun-terreux mb-1">Intensité</p>
                    <p className="text-xl font-bold text-noir-chaud">{intensity}/5</p>
                  </div>

                  <div className="p-4 bg-beige rounded-xl">
                    <p className="text-sm text-brun-terreux mb-1">Contexte</p>
                    <p className="text-xl font-bold text-noir-chaud">{selectedContext}</p>
                  </div>

                  {notes && (
                    <div className="p-4 bg-beige rounded-xl">
                      <p className="text-sm text-brun-terreux mb-1">Notes</p>
                      <p className="text-noir-chaud">{notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button onClick={reset}>
                    Nouvelle entrée
                  </Button>
                  <Button variant="secondary" onClick={handleSaveToJournal}>
                    <Save size={20} className="mr-2" />
                    Enregistrer au journal
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 size={20} className="mr-2" />
                    Partager
                  </Button>
                </div>

                <p className="text-xs text-brun-terreux mt-4">
                  {history.length} entrées enregistrées au total
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
