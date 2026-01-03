import { motion } from 'framer-motion';
import { 
  Cloud,
  MessageCircle, Sprout, User, Brain, BookOpen, Phone,
  Smile, Compass, BarChart3
} from 'lucide-react';
import Card from '../components/Card';

interface HomeProps {
  onNavigate: (module: string) => void;
  userData: {
    pseudo: string;
    themes: string[];
  };
}

export default function Home({ onNavigate, userData }: HomeProps) {
  return (
    <div className="min-h-screen bg-beige p-4 md:p-8">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-noir-chaud">
            TheraSpace
          </h1>
          <p className="text-brun-terreux text-sm mt-1">
            Bonjour {userData.pseudo} 👋
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-lg"
        >
          <Phone size={20} />
          SOS
        </motion.button>
      </motion.header>

      {/* New Bento Grid Layout - 4 Lines Strict */}
      <div className="space-y-4 md:space-y-6">
        {/* Line 1: Météo + Humeur (égales) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Météo Intérieure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              backgroundColor="bg-white"
              onClick={() => onNavigate('humeur')}
            >
              <Cloud size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Météo
              </h3>
            </Card>
          </motion.div>

          {/* Humeur Module */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card 
              backgroundColor="bg-pink-50"
              onClick={() => onNavigate('humeur')}
            >
              <Smile size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Humeur
              </h3>
            </Card>
          </motion.div>
        </div>

        {/* Line 2: Identité + Journal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              backgroundColor="bg-identite"
              onClick={() => onNavigate('identite')}
            >
              <User size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Identité
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Card 
              backgroundColor="bg-journal"
              onClick={() => onNavigate('journal')}
            >
              <BookOpen size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Journal
              </h3>
            </Card>
          </motion.div>
        </div>

        {/* Line 3: Écho + Phare + Jardin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              backgroundColor="bg-echo"
              onClick={() => onNavigate('echo')}
            >
              <MessageCircle size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Écho
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Card 
              backgroundColor="bg-gradient-to-br from-blue-50 to-blue-100"
              onClick={() => onNavigate('phare')}
            >
              <Compass size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Phare
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              backgroundColor="bg-jardin"
              onClick={() => onNavigate('jardin')}
            >
              <Sprout size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Jardin
              </h3>
            </Card>
          </motion.div>
        </div>

        {/* Line 4: Statistiques + PsIA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
          >
            <Card 
              backgroundColor="bg-purple-50"
              onClick={() => onNavigate('statistiques')}
            >
              <BarChart3 size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Statistiques
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card 
              backgroundColor="bg-psia"
              onClick={() => onNavigate('psia')}
            >
              <Brain size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                PsIA
              </h3>
            </Card>
          </motion.div>
        </div>


      </div>
    </div>
  );
}
