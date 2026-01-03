import { motion } from 'framer-motion';
import { 
  Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, Wind,
  Heart, Footprints, MessageCircle, Sprout, User, Brain, BookOpen, Phone
} from 'lucide-react';
import { useState } from 'react';
import Card from '../components/Card';

interface HomeProps {
  onNavigate: (module: string) => void;
  userData: {
    pseudo: string;
    themes: string[];
  };
}

const weatherIcons = [
  { Icon: Sun, label: 'Ensoleillé', color: '#FFD700' },
  { Icon: Cloud, label: 'Nuageux', color: '#B0C4DE' },
  { Icon: CloudRain, label: 'Pluvieux', color: '#4682B4' },
  { Icon: CloudSnow, label: 'Neigeux', color: '#E0F2F7' },
  { Icon: CloudDrizzle, label: 'Bruine', color: '#87CEEB' },
  { Icon: Wind, label: 'Venteux', color: '#D3D3D3' },
];

const modules = [
  { id: 'respiration', name: 'Respiration', Icon: Heart, color: 'bg-respiration', description: 'Exercices de respiration guidée' },
  { id: 'ancrage', name: 'Ancrage', Icon: Footprints, color: 'bg-ancrage', description: 'Techniques d\'ancrage 5-4-3-2-1' },
  { id: 'echo', name: 'Écho', Icon: MessageCircle, color: 'bg-echo', description: 'Scénarios et réflexions' },
  { id: 'jardin', name: 'Jardin', Icon: Sprout, color: 'bg-jardin', description: 'Cultive ton bien-être' },
  { id: 'identite', name: 'Identité', Icon: User, color: 'bg-identite', description: 'Découvre qui tu es' },
  { id: 'psia', name: 'PsIA', Icon: Brain, color: 'bg-psia', description: 'Ton compagnon IA' },
  { id: 'journal', name: 'Journal', Icon: BookOpen, color: 'bg-journal', description: 'Ton espace personnel' },
];

export default function Home({ onNavigate, userData }: HomeProps) {
  const [selectedWeather, setSelectedWeather] = useState<number | null>(null);
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);

  const handleWeatherClick = (index: number) => {
    setSelectedWeather(index);
    setShowWeatherDetail(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => setShowWeatherDetail(false), 3000);
  };

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

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Météo Intérieure - Large widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 lg:col-span-2"
        >
          <Card backgroundColor="bg-white" hoverable={false}>
            <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-4">
              Ma Météo Intérieure
            </h2>
            <p className="text-brun-terreux mb-6">Comment te sens-tu aujourd'hui ?</p>
            
            <div className="grid grid-cols-3 gap-4">
              {weatherIcons.map((weather, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWeatherClick(index)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    selectedWeather === index 
                      ? 'bg-beige ring-2 ring-brun-terreux' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <weather.Icon 
                    size={32} 
                    color={weather.color}
                    strokeWidth={2}
                  />
                  <span className="text-xs text-brun-terreux font-medium">
                    {weather.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {showWeatherDetail && selectedWeather !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-beige rounded-xl"
              >
                <p className="text-brun-terreux text-center">
                  Tu te sens <strong>{weatherIcons[selectedWeather].label.toLowerCase()}</strong> aujourd'hui. 
                  C'est tout à fait normal. Explore les modules pour prendre soin de toi.
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Module Cards */}
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + (index * 0.05) }}
            className={index < 2 ? 'md:col-span-1' : ''}
          >
            <Card 
              backgroundColor={module.color}
              onClick={() => onNavigate(module.id)}
            >
              <module.Icon size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud mb-2">
                {module.name}
              </h3>
              <p className="text-sm text-brun-terreux">
                {module.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
