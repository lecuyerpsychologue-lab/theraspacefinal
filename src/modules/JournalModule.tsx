import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EchoAnalysis } from '../lib/mockApi';

interface JournalModuleProps {
  onBack: () => void;
}

export function JournalModule({ onBack }: JournalModuleProps) {
  const [echoHistory] = useLocalStorage<EchoAnalysis[]>('echo-history', []);
  const [identityAnswers] = useLocalStorage<Record<string, string>>('identity-answers', {});
  const [gardenGrowth] = useLocalStorage<number>('garden-growth', 0);
  const [personalNotes, setPersonalNotes] = useLocalStorage<string>('journal-notes', '');

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données du journal ?')) {
      localStorage.removeItem('echo-history');
      localStorage.removeItem('identity-answers');
      localStorage.removeItem('garden-growth');
      localStorage.removeItem('journal-notes');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-journal p-4 md:p-8">
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
          className="font-playfair text-4xl md:text-5xl font-bold text-warm-black mb-8"
        >
          Mon Journal
        </motion.h1>

        <div className="space-y-6">
          {/* Garden Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-4">
              Mon Jardin
            </h2>
            <p className="font-inter text-warm-brown">
              Niveau de croissance : <span className="font-semibold">{gardenGrowth}/10</span>
            </p>
            <div className="mt-4 w-full bg-beige rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(gardenGrowth / 10) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-green-500"
              />
            </div>
          </motion.div>

          {/* Echo Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-4">
              Historique Écho
            </h2>
            {echoHistory.length > 0 ? (
              <div className="space-y-4">
                {echoHistory.slice(-5).reverse().map((session, index) => (
                  <div key={index} className="bg-beige p-4 rounded-lg">
                    <p className="font-inter text-sm text-warm-brown mb-2">
                      <span className="font-semibold">Réaction :</span> {session.chosenReaction}
                    </p>
                    <p className="font-inter text-sm text-warm-brown">
                      <span className="font-semibold">Analyse :</span> {session.analysis}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-inter text-warm-brown">
                Aucune session Écho enregistrée pour le moment.
              </p>
            )}
          </motion.div>

          {/* Identity Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-4">
              Module Identité
            </h2>
            <p className="font-inter text-warm-brown mb-4">
              Questions répondues : <span className="font-semibold">{Object.keys(identityAnswers).length}</span>
            </p>
            {Object.keys(identityAnswers).length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.entries(identityAnswers).map(([id, answer]) => (
                  <div key={id} className="bg-beige p-3 rounded-lg">
                    <p className="font-inter text-sm text-warm-brown">
                      {answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Personal Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-playfair text-2xl font-semibold text-warm-black mb-4">
              Mes Notes Personnelles
            </h2>
            <textarea
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Écris tes pensées, tes réflexions..."
              className="w-full p-4 bg-beige rounded-lg font-inter text-warm-black resize-none focus:outline-none focus:ring-2 focus:ring-warm-brown"
              rows={8}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
