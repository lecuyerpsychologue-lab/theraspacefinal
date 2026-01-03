import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Heart, Shield, Compass, ChevronRight, Lock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

interface OnboardingProps {
  onComplete: (userData: UserData) => void;
}

export interface UserData {
  pseudo: string;
  birthYear: number;
  themes: string[];
  isMinor: boolean;
  parentalConsentEmail?: string;
  hasPIN: boolean;
  pin?: string;
}

type Step = 'intro' | 'age' | 'parental-consent' | 'pin-setup' | 'profile';

const themes = [
  { id: 'stress', label: 'Stress', icon: '😰' },
  { id: 'confiance', label: 'Confiance', icon: '💪' },
  { id: 'relations', label: 'Relations', icon: '👥' },
  { id: 'emotions', label: 'Émotions', icon: '❤️' },
  { id: 'sommeil', label: 'Sommeil', icon: '😴' },
  { id: 'ecole', label: 'École', icon: '📚' },
  { id: 'famille', label: 'Famille', icon: '🏠' },
  { id: 'corps', label: 'Corps', icon: '🧘' },
];

const introSlides = [
  {
    icon: Heart,
    title: 'Bienvenue sur TheraSpace',
    description: 'Un espace sûr pour explorer tes émotions, cultiver ton bien-être et grandir en confiance.',
    color: '#FFB6C1'
  },
  {
    icon: Shield,
    title: 'Un espace sécurisé',
    description: 'Toutes tes données restent sur ton appareil. Personne d\'autre n\'y a accès. C\'est ton espace personnel.',
    color: '#87CEEB'
  },
  {
    icon: Compass,
    title: 'Explore à ton rythme',
    description: 'Pas de jugement, pas de pression. Utilise les outils qui te parlent, quand tu en as besoin.',
    color: '#98FB98'
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<Step>('intro');
  const [introSlide, setIntroSlide] = useState(0);
  const [birthYear, setBirthYear] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [parentEmail, setParentEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [wantsPIN, setWantsPIN] = useState<boolean | null>(null);

  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - parseInt(birthYear) : 0;
  const isMinor = age > 0 && age < 15;

  const handleNextIntro = () => {
    if (introSlide < introSlides.length - 1) {
      setIntroSlide(introSlide + 1);
    } else {
      setStep('age');
    }
  };

  const handleAgeSubmit = () => {
    if (isMinor) {
      setStep('parental-consent');
    } else {
      setStep('pin-setup');
    }
  };

  const handleParentalConsent = () => {
    // In real app, send email here
    if (parentEmail) {
      alert('Un e-mail de validation a été envoyé à ' + parentEmail);
      setStep('pin-setup');
    }
  };

  const handlePINChoice = (choice: boolean) => {
    setWantsPIN(choice);
    if (!choice) {
      setStep('profile');
    }
  };

  const handlePINSubmit = () => {
    if (pin.length === 4 && pin === confirmPin) {
      setStep('profile');
    }
  };

  const handleProfileSubmit = () => {
    if (pseudo && selectedThemes.length > 0) {
      const userData: UserData = {
        pseudo,
        birthYear: parseInt(birthYear),
        themes: selectedThemes,
        isMinor,
        parentalConsentEmail: isMinor ? parentEmail : undefined,
        hasPIN: wantsPIN || false,
        pin: wantsPIN ? pin : undefined
      };
      onComplete(userData);
    }
  };

  const toggleTheme = (themeId: string) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(t => t !== themeId));
    } else if (selectedThemes.length < 3) {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };

  const currentSlide = introSlides[introSlide];

  return (
    <div className="min-h-screen bg-beige p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {/* Introduction Carousel */}
          {step === 'intro' && (
            <motion.div
              key={`intro-${introSlide}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card backgroundColor="bg-white">
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="mb-6"
                  >
                    <div 
                      className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentSlide.color }}
                    >
                      <currentSlide.icon size={48} className="text-white" strokeWidth={2} />
                    </div>
                  </motion.div>

                  <h1 className="text-3xl md:text-4xl font-playfair font-bold text-noir-chaud mb-4">
                    {currentSlide.title}
                  </h1>
                  
                  <p className="text-lg text-brun-terreux mb-8 leading-relaxed">
                    {currentSlide.description}
                  </p>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-2 mb-8">
                    {introSlides.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === introSlide ? 'bg-brun-terreux w-8' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <Button onClick={handleNextIntro}>
                    {introSlide === introSlides.length - 1 ? 'Commencer' : 'Suivant'}
                    <ChevronRight size={20} className="ml-2 inline" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Age Verification */}
          {step === 'age' && (
            <motion.div
              key="age"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-noir-chaud mb-4">
                  Quelle est ton année de naissance ?
                </h2>
                <p className="text-brun-terreux mb-6">
                  Nous avons besoin de cette information pour assurer ta sécurité (RGPD).
                </p>
                
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="Ex: 2010"
                  min={1990}
                  max={currentYear}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brun-terreux focus:outline-none text-lg mb-2"
                />
                
                {age > 0 && (
                  <p className="text-sm text-brun-terreux mb-6">
                    Tu as {age} ans
                  </p>
                )}
                
                <Button 
                  onClick={handleAgeSubmit}
                  disabled={!birthYear || age < 13 || age > 100}
                >
                  Continuer
                </Button>

                {age > 0 && age < 13 && (
                  <p className="mt-4 text-red-600 text-sm">
                    TheraSpace est conçu pour les 13-18 ans. Nous te conseillons d'en parler avec un adulte.
                  </p>
                )}
              </Card>
            </motion.div>
          )}

          {/* Parental Consent */}
          {step === 'parental-consent' && (
            <motion.div
              key="parental"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-noir-chaud mb-4">
                  Consentement parental
                </h2>
                <p className="text-brun-terreux mb-6">
                  Comme tu as moins de 15 ans, nous devons demander l'accord d'un de tes parents.
                  Entre l'e-mail d'un parent pour qu'il reçoive un lien de validation.
                </p>
                
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="email.parent@exemple.com"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brun-terreux focus:outline-none mb-6"
                />
                
                <Button 
                  onClick={handleParentalConsent}
                  disabled={!parentEmail || !parentEmail.includes('@')}
                >
                  Envoyer le lien de validation
                </Button>

                <p className="mt-4 text-xs text-brun-terreux">
                  Note: Dans cette démo, tu peux continuer sans validation réelle.
                </p>
              </Card>
            </motion.div>
          )}

          {/* PIN Setup */}
          {step === 'pin-setup' && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <div className="text-center mb-6">
                  <Lock size={48} className="text-brun-terreux mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-playfair font-bold text-noir-chaud mb-4">
                    Sécurise ton espace
                  </h2>
                  <p className="text-brun-terreux">
                    Veux-tu protéger ton accès avec un code PIN à 4 chiffres ?
                  </p>
                </div>

                {wantsPIN === null && (
                  <div className="space-y-4">
                    <Button onClick={() => handlePINChoice(true)}>
                      Oui, je veux un code PIN
                    </Button>
                    <Button variant="outline" onClick={() => handlePINChoice(false)}>
                      Non merci, continuer sans code
                    </Button>
                  </div>
                )}

                {wantsPIN && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-brun-terreux mb-2">
                        Choisis ton code PIN (4 chiffres)
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brun-terreux focus:outline-none text-center text-2xl tracking-widest"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brun-terreux mb-2">
                        Confirme ton code PIN
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brun-terreux focus:outline-none text-center text-2xl tracking-widest"
                      />
                    </div>

                    {pin.length === 4 && confirmPin.length === 4 && pin !== confirmPin && (
                      <p className="text-red-600 text-sm">
                        Les codes ne correspondent pas
                      </p>
                    )}

                    <Button 
                      onClick={handlePINSubmit}
                      disabled={pin.length !== 4 || pin !== confirmPin}
                    >
                      Continuer
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Profile Setup */}
          {step === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card backgroundColor="bg-white">
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-noir-chaud mb-4">
                  Crée ton profil
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-brun-terreux mb-2">
                      Choisis un pseudo
                    </label>
                    <input
                      type="text"
                      value={pseudo}
                      onChange={(e) => setPseudo(e.target.value)}
                      placeholder="Ton pseudo..."
                      maxLength={20}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brun-terreux focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brun-terreux mb-3">
                      Qu'est-ce qui t'amène ici ? (Choisis 1 à 3 thèmes)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {themes.map((theme) => (
                        <motion.button
                          key={theme.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleTheme(theme.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedThemes.includes(theme.id)
                              ? 'bg-brun-terreux text-white border-brun-terreux'
                              : 'bg-white text-brun-terreux border-gray-200 hover:border-brun-terreux'
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{theme.icon}</span>
                          <span className="text-sm font-medium">{theme.label}</span>
                        </motion.button>
                      ))}
                    </div>
                    <p className="text-xs text-brun-terreux mt-2">
                      {selectedThemes.length}/3 thèmes sélectionnés
                    </p>
                  </div>

                  <Button 
                    onClick={handleProfileSubmit}
                    disabled={!pseudo || selectedThemes.length === 0}
                  >
                    Commencer mon voyage
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
