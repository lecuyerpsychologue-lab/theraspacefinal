import { useState } from 'react';
import { Home } from './modules/Home';
import { BreathingModule } from './modules/BreathingModule';
import { GroundingModule } from './modules/GroundingModule';
import { EchoModule } from './modules/EchoModule';
import { GardenModule } from './modules/GardenModule';
import { IdentityModule } from './modules/IdentityModule';
import { PsiAModule } from './modules/PsiAModule';
import { JournalModule } from './modules/JournalModule';

function App() {
  const [currentModule, setCurrentModule] = useState('home');

  const handleNavigate = (module: string) => {
    setCurrentModule(module);
  };

  const handleBack = () => {
    setCurrentModule('home');
  };

  const renderModule = () => {
    switch (currentModule) {
      case 'breathing':
        return <BreathingModule onBack={handleBack} />;
      case 'grounding':
        return <GroundingModule onBack={handleBack} />;
      case 'echo':
        return <EchoModule onBack={handleBack} />;
      case 'garden':
        return <GardenModule onBack={handleBack} />;
      case 'identity':
        return <IdentityModule onBack={handleBack} />;
      case 'psia':
        return <PsiAModule onBack={handleBack} />;
      case 'journal':
        return <JournalModule onBack={handleBack} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="font-inter">
      {renderModule()}
    </div>
  );
}

export default App;
