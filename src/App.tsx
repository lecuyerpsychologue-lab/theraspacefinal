import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './modules/Home';
import RespirationModule from './modules/RespirationModule';
import AncrageModule from './modules/AncrageModule';
import EchoModule from './modules/EchoModule';
import GardenModule from './modules/GardenModule';
import IdentityModule from './modules/IdentityModule';
import PsiAModule from './modules/PsiAModule';
import JournalModule from './modules/JournalModule';

type Module = 
  | 'home' 
  | 'respiration' 
  | 'ancrage' 
  | 'echo' 
  | 'jardin' 
  | 'identite' 
  | 'psia' 
  | 'journal';

function App() {
  const [currentModule, setCurrentModule] = useState<Module>('home');

  const navigateToModule = (module: string) => {
    setCurrentModule(module as Module);
  };

  const navigateToHome = () => {
    setCurrentModule('home');
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentModule}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentModule === 'home' && <Home onNavigate={navigateToModule} />}
        {currentModule === 'respiration' && <RespirationModule onBack={navigateToHome} />}
        {currentModule === 'ancrage' && <AncrageModule onBack={navigateToHome} />}
        {currentModule === 'echo' && <EchoModule onBack={navigateToHome} />}
        {currentModule === 'jardin' && <GardenModule onBack={navigateToHome} />}
        {currentModule === 'identite' && <IdentityModule onBack={navigateToHome} />}
        {currentModule === 'psia' && <PsiAModule onBack={navigateToHome} />}
        {currentModule === 'journal' && <JournalModule onBack={navigateToHome} />}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
