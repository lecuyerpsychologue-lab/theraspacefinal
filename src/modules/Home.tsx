import { motion } from 'framer-motion';
import React from 'react';
import { 
  Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, Wind,
  MessageCircle, Sprout, User, Brain, BookOpen, Phone,
  Smile, Compass, BarChart3, Anchor, Wind as Breath
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

export default function Home({ onNavigate, userData }: HomeProps) {
  const [selectedWeather, setSelectedWeather] = useState<number | null>(null);
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);
  const [weatherExpanded, setWeatherExpanded] = useState(false);

  const handleWeatherClick = (index: number) => {
    if (selectedWeather === index && !weatherExpanded) {
      // Enlarge the icon at center
      setWeatherExpanded(true);
      setTimeout(() => {
        // After showing enlarged, navigate to humeur
        onNavigate('humeur');
      }, 800);
    } else {
      setSelectedWeather(index);
      setShowWeatherDetail(true);
      setWeatherExpanded(false);
      
      // Auto-hide after 2 seconds
      setTimeout(() => setShowWeatherDetail(false), 2000);
    }
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

      {/* New Bento Grid Layout */}
      <div className="space-y-4 md:space-y-6">
        {/* Line 1: Météo Intérieure (2/3) + Humeur (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Météo Intérieure - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card 
              backgroundColor="bg-white" 
              hoverable={false}
              onClick={weatherExpanded ? () => onNavigate('humeur') : undefined}
              className={weatherExpanded ? 'cursor-pointer' : ''}
            >
              <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-4">
                Ma Météo Intérieure
              </h2>
              
              {!weatherExpanded && (
                <>
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
                        Clique à nouveau pour explorer davantage.
                      </p>
                    </motion.div>
                  )}
                </>
              )}
              
              {weatherExpanded && selectedWeather !== null && (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.5 }}
                  className="flex items-center justify-center h-48"
                >
                  {React.createElement(weatherIcons[selectedWeather].Icon, {
                    size: 120,
                    color: weatherIcons[selectedWeather].color,
                    strokeWidth: 2
                  })}
                </motion.div>
              )}
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

        {/* Line 5: Ancrage + Respiration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
          >
            <Card 
              backgroundColor="bg-ancrage"
              onClick={() => onNavigate('ancrage')}
            >
              <Anchor size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Ancrage
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card 
              backgroundColor="bg-respiration"
              onClick={() => onNavigate('respiration')}
            >
              <Breath size={36} className="text-brun-terreux mb-3" strokeWidth={2} />
              <h3 className="text-xl font-playfair font-bold text-noir-chaud">
                Respiration
              </h3>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
