import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind,
  Wind as Breath,
  Anchor,
  MessageCircle,
  Sprout,
  User,
  Bot,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';
import { Card } from '../components/Card';
import { Header } from '../components/Header';

interface HomeProps {
  onNavigate: (module: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  const weatherIcons = [
    { icon: Sun, label: 'Ensoleillé', color: 'text-yellow-500' },
    { icon: Cloud, label: 'Nuageux', color: 'text-gray-400' },
    { icon: CloudRain, label: 'Pluvieux', color: 'text-blue-500' },
    { icon: CloudSnow, label: 'Neigeux', color: 'text-blue-200' },
    { icon: Wind, label: 'Venteux', color: 'text-gray-500' },
  ];

  const modules = [
    { 
      id: 'breathing', 
      title: 'Respiration', 
      icon: Breath, 
      color: 'bg-respiration',
      description: 'Exercices de respiration guidée'
    },
    { 
      id: 'grounding', 
      title: 'Ancrage', 
      icon: Anchor, 
      color: 'bg-ancrage',
      description: 'Techniques d\'ancrage au présent'
    },
    { 
      id: 'echo', 
      title: 'Écho', 
      icon: MessageCircle, 
      color: 'bg-echo',
      description: 'Scenarios avec IA'
    },
    { 
      id: 'garden', 
      title: 'Jardin', 
      icon: Sprout, 
      color: 'bg-jardin',
      description: 'Cultive tes actions'
    },
    { 
      id: 'identity', 
      title: 'Identité', 
      icon: User, 
      color: 'bg-identite',
      description: 'Découvre-toi'
    },
    { 
      id: 'psia', 
      title: 'PsIA', 
      icon: Bot, 
      color: 'bg-psia',
      description: 'Conversation avec l\'IA'
    },
    { 
      id: 'journal', 
      title: 'Journal', 
      icon: BookOpen, 
      color: 'bg-journal',
      description: 'Ton espace personnel'
    },
  ];

  const handleWeatherClick = (label: string) => {
    setSelectedWeather(label);
    setShowWeatherModal(true);
    setTimeout(() => setShowWeatherModal(false), 3000);
  };

  const handleSOSClick = () => {
    alert('Numéros d\'urgence:\n\n3114 - Numéro national de prévention du suicide\n119 - Allô Enfance en Danger\n0800 235 236 - Fil Santé Jeunes');
  };

  return (
    <div className="min-h-screen bg-beige p-4 md:p-8">
      <Header onSOSClick={handleSOSClick} />
      
      <div className="max-w-7xl mx-auto">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          
          {/* Weather Widget - Larger card */}
          <Card 
            colSpan={2} 
            rowSpan={1}
            color="bg-white"
            className="flex flex-col justify-between"
            onClick={() => {}}
          >
            <div>
              <h3 className="font-playfair text-2xl font-semibold text-warm-black mb-2">
                Ma Météo Intérieure
              </h3>
              <p className="font-inter text-sm text-warm-brown">
                Comment te sens-tu aujourd'hui ?
              </p>
            </div>
            
            <div className="flex justify-around items-center mt-4">
              {weatherIcons.map((weather) => (
                <motion.div
                  key={weather.label}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWeatherClick(weather.label);
                  }}
                  className={`cursor-pointer ${weather.color} ${
                    selectedWeather === weather.label ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <weather.icon size={36} />
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Module Cards */}
          {modules.map((module, index) => (
            <Card
              key={module.id}
              colSpan={index === 0 || index === 6 ? 2 : 1}
              rowSpan={1}
              color={module.color}
              onClick={() => onNavigate(module.id)}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <module.icon size={32} className="text-warm-black mb-3" />
                  <h3 className="font-playfair text-xl font-semibold text-warm-black">
                    {module.title}
                  </h3>
                </div>
                <p className="font-inter text-sm text-warm-brown mt-2">
                  {module.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Weather Modal */}
      <AnimatePresence>
        {showWeatherModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md mx-4"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
            >
              <h3 className="font-playfair text-2xl font-semibold text-warm-black mb-4">
                Tu te sens {selectedWeather?.toLowerCase()}
              </h3>
              <p className="font-inter text-warm-brown">
                C'est tout à fait normal de ressentir cela. Prends un moment pour toi et explore les modules qui peuvent t'aider.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
