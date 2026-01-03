import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Calendar, MessageCircle, User, Sprout, Heart, Footprints, BookOpen } from 'lucide-react';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface JournalModuleProps {
  onBack: () => void;
}

export default function JournalModule({ onBack }: JournalModuleProps) {
  const [echoHistory] = useLocalStorage<Array<{situation: string, choice: string, date: string}>>('echo-history', []);
  const [identityAnswers] = useLocalStorage<Array<{question: string, answer: string, date: string}>>('identity-answers', []);
  const [gardenGrowth] = useLocalStorage('garden-growth', 0);
  const [respirationSessions] = useLocalStorage('respiration-sessions', 0);
  const [respirationTotalTime] = useLocalStorage('respiration-total-time', 0);
  const [ancrageSessions] = useLocalStorage('ancrage-sessions', 0);
  const [psiMessages] = useLocalStorage<Array<{role: string, content: string, timestamp: string}>>('psia-messages', []);
  const [notes, setNotes] = useLocalStorage('journal-notes', '');

  const resetJournal = () => {
    if (confirm('Es-tu sûr de vouloir effacer toutes tes notes personnelles ?')) {
      setNotes('');
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-journal p-4 md:p-8">
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
          onClick={resetJournal}
          className="flex items-center gap-2 text-brun-terreux hover:text-red-600 transition-colors"
        >
          <RotateCcw size={20} />
          <span className="text-sm">Réinitialiser notes</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-noir-chaud mb-4">
          Mon Journal
        </h1>
        <p className="text-brun-terreux text-lg mb-8">
          Retrouve toutes tes activités et notes personnelles.
        </p>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card backgroundColor="bg-respiration">
            <Heart className="text-brun-terreux mb-2" size={24} />
            <p className="text-2xl font-bold text-noir-chaud">{respirationSessions}</p>
            <p className="text-sm text-brun-terreux">Respirations</p>
          </Card>
          
          <Card backgroundColor="bg-ancrage">
            <Footprints className="text-brun-terreux mb-2" size={24} />
            <p className="text-2xl font-bold text-noir-chaud">{ancrageSessions}</p>
            <p className="text-sm text-brun-terreux">Ancrages</p>
          </Card>
          
          <Card backgroundColor="bg-echo">
            <MessageCircle className="text-brun-terreux mb-2" size={24} />
            <p className="text-2xl font-bold text-noir-chaud">{echoHistory.length}</p>
            <p className="text-sm text-brun-terreux">Sessions Écho</p>
          </Card>
          
          <Card backgroundColor="bg-jardin">
            <Sprout className="text-brun-terreux mb-2" size={24} />
            <p className="text-2xl font-bold text-noir-chaud">{gardenGrowth}/10</p>
            <p className="text-sm text-brun-terreux">Croissance</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Notes */}
          <Card backgroundColor="bg-white">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-brun-terreux" size={24} />
              <h2 className="text-2xl font-playfair font-bold text-noir-chaud">
                Notes Personnelles
              </h2>
            </div>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Écris tes pensées, réflexions ou tout ce que tu veux noter..."
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-brun-terreux focus:outline-none resize-none"
            />
          </Card>

          {/* Recent Echo Sessions */}
          <Card backgroundColor="bg-white">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="text-brun-terreux" size={24} />
              <h2 className="text-2xl font-playfair font-bold text-noir-chaud">
                Sessions Écho Récentes
              </h2>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {echoHistory.length === 0 ? (
                <p className="text-brun-terreux text-center py-8">
                  Aucune session pour le moment
                </p>
              ) : (
                echoHistory.slice(-5).reverse().map((session, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-echo rounded-xl"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Calendar size={16} className="text-brun-terreux mt-1 flex-shrink-0" />
                      <p className="text-xs text-brun-terreux">
                        {formatDate(session.date)}
                      </p>
                    </div>
                    <p className="text-sm text-noir-chaud font-medium mb-2">
                      {session.situation.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-brun-terreux">
                      <strong>Ta réaction :</strong> {session.choice.substring(0, 80)}...
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          {/* Identity Answers */}
          <Card backgroundColor="bg-white">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-brun-terreux" size={24} />
              <h2 className="text-2xl font-playfair font-bold text-noir-chaud">
                Exploration Identité
              </h2>
            </div>
            
            <div className="mb-4">
              <p className="text-brun-terreux">
                <strong>{identityAnswers.length}</strong> réponses enregistrées
              </p>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {identityAnswers.length === 0 ? (
                <p className="text-brun-terreux text-center py-8">
                  Aucune réponse pour le moment
                </p>
              ) : (
                identityAnswers.slice(-5).reverse().map((answer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-identite rounded-xl"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Calendar size={16} className="text-brun-terreux mt-1 flex-shrink-0" />
                      <p className="text-xs text-brun-terreux">
                        {formatDate(answer.date)}
                      </p>
                    </div>
                    <p className="text-sm text-noir-chaud font-medium mb-2">
                      {answer.question}
                    </p>
                    <p className="text-sm text-brun-terreux">
                      {answer.answer}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          {/* PsIA Conversations */}
          <Card backgroundColor="bg-white">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="text-brun-terreux" size={24} />
              <h2 className="text-2xl font-playfair font-bold text-noir-chaud">
                Conversations PsIA
              </h2>
            </div>
            
            <div className="mb-4">
              <p className="text-brun-terreux">
                <strong>{psiMessages.length}</strong> messages échangés
              </p>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {psiMessages.length === 0 ? (
                <p className="text-brun-terreux text-center py-8">
                  Aucune conversation pour le moment
                </p>
              ) : (
                psiMessages.slice(-6).reverse().map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-xl ${
                      message.role === 'user' ? 'bg-brun-terreux text-white' : 'bg-psia'
                    }`}
                  >
                    <p className="text-sm">
                      {message.content.substring(0, 150)}
                      {message.content.length > 150 && '...'}
                    </p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white text-opacity-70' : 'text-brun-terreux'
                    }`}>
                      {formatDate(message.timestamp)}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Summary Card */}
        <Card backgroundColor="bg-white" className="mt-6">
          <h3 className="text-xl font-playfair font-bold text-noir-chaud mb-4">
            Résumé de ton parcours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brun-terreux">
            <div>
              <p className="mb-2">
                🫁 <strong>Temps de respiration :</strong> {Math.floor(respirationTotalTime / 60)} minutes
              </p>
              <p className="mb-2">
                💬 <strong>Scénarios explorés :</strong> {echoHistory.length} situations
              </p>
            </div>
            <div>
              <p className="mb-2">
                🌱 <strong>Croissance du jardin :</strong> {gardenGrowth} actions complétées
              </p>
              <p className="mb-2">
                🎭 <strong>Questions d'identité :</strong> {identityAnswers.length} réponses
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
