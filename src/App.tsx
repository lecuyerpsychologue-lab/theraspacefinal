import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocalStorage } from './hooks/useLocalStorage';
import Onboarding, { UserData } from './components/Onboarding';
import PINLock from './components/PINLock';
import Home from './modules/Home';
import RespirationModule from './modules/RespirationModule';
import AncrageModule from './modules/AncrageModule';
import EchoModule from './modules/EchoModule';
import GardenModule from './modules/GardenModule';
import IdentityModule from './modules/IdentityModule';
import PsiAModule from './modules/PsiAModule';
import JournalModule from './modules/JournalModule';
import HumeurModule from './modules/HumeurModule';
import PhareModule from './modules/PhareModule';
import StatistiquesModule from './modules/StatistiquesModule';

type Module = 
  | 'home' 
  | 'respiration' 
  | 'ancrage' 
  | 'echo' 
  | 'jardin' 
  | 'identite' 
  | 'psia' 
  | 'journal'
  | 'humeur'
  | 'phare'
  | 'statistiques';

function App() {
  const [currentModule, setCurrentModule] = useState<Module>('home');
  const [userData, setUserData] = useLocalStorage<UserData | null>('user-data', null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check if app needs unlocking on mount
  useEffect(() => {
    if (userData && userData.hasPIN) {
      setIsUnlocked(false);
    } else {
      setIsUnlocked(true);
    }
  }, [userData]);

  const navigateToModule = (module: string) => {
    setCurrentModule(module as Module);
  };

  const navigateToHome = () => {
    setCurrentModule('home');
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setIsUnlocked(true);
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  // Show onboarding if no user data
  if (!userData) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show PIN lock if user has PIN and not unlocked
  if (userData.hasPIN && !isUnlocked) {
    return <PINLock expectedPIN={userData.pin!} onUnlock={handleUnlock} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentModule}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentModule === 'home' && <Home onNavigate={navigateToModule} userData={userData} />}
        {currentModule === 'respiration' && <RespirationModule onBack={navigateToHome} />}
        {currentModule === 'ancrage' && <AncrageModule onBack={navigateToHome} />}
        {currentModule === 'echo' && <EchoModule onBack={navigateToHome} />}
        {currentModule === 'jardin' && <GardenModule onBack={navigateToHome} />}
        {currentModule === 'identite' && <IdentityModule onBack={navigateToHome} />}
        {currentModule === 'psia' && <PsiAModule onBack={navigateToHome} />}
        {currentModule === 'journal' && <JournalModule onBack={navigateToHome} />}
        {currentModule === 'humeur' && <HumeurModule onBack={navigateToHome} />}
        {currentModule === 'phare' && <PhareModule onBack={navigateToHome} />}
        {currentModule === 'statistiques' && <StatistiquesModule onBack={navigateToHome} />}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
