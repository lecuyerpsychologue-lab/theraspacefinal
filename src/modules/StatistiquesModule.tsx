import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, Heart, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import Card from '../components/Card';

interface StatistiquesModuleProps {
  onBack: () => void;
}

interface Stats {
  totalSessions: number;
  favoriteModule: string;
  streakDays: number;
  emotionsTracked: number;
  goalsCompleted: number;
}

export default function StatistiquesModule({ onBack }: StatistiquesModuleProps) {
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    favoriteModule: 'Respiration',
    streakDays: 0,
    emotionsTracked: 0,
    goalsCompleted: 0
  });

  useEffect(() => {
    // Gather stats from localStorage
    const respirationSessions = parseInt(localStorage.getItem('respiration-sessions') || '0');
    const ancrageSessions = parseInt(localStorage.getItem('ancrage-sessions') || '0');
    const echoHistory = JSON.parse(localStorage.getItem('echo-history') || '[]');
    const humeurHistory = JSON.parse(localStorage.getItem('humeur-history') || '[]');
    const phareProgress = JSON.parse(localStorage.getItem('phare-week-progress') || '[]');
    const identityAnswers = JSON.parse(localStorage.getItem('identity-answers') || '[]');

    const totalSessions = respirationSessions + ancrageSessions + echoHistory.length + identityAnswers.length;
    
    // Calculate goals completed from Phare program
    let goalsCompleted = 0;
    phareProgress.forEach((week: any) => {
      goalsCompleted += week.completed.filter((c: boolean) => c).length;
    });

    setStats({
      totalSessions,
      favoriteModule: respirationSessions > ancrageSessions ? 'Respiration' : 'Ancrage',
      streakDays: calculateStreak(),
      emotionsTracked: humeurHistory.length,
      goalsCompleted
    });
  }, []);

  const calculateStreak = (): number => {
    // Simple streak calculation based on journal entries
    const entries = JSON.parse(localStorage.getItem('journal-entries') || '[]');
    if (entries.length === 0) return 0;

    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasEntry = entries.some((entry: any) => 
        entry.date.startsWith(dateStr)
      );

      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const getModuleUsage = () => {
    const respirationSessions = parseInt(localStorage.getItem('respiration-sessions') || '0');
    const ancrageSessions = parseInt(localStorage.getItem('ancrage-sessions') || '0');
    const echoHistory = JSON.parse(localStorage.getItem('echo-history') || '[]');
    const identityAnswers = JSON.parse(localStorage.getItem('identity-answers') || '[]');

    return [
      { name: 'Respiration', count: respirationSessions, color: '#E3F0FA' },
      { name: 'Ancrage', count: ancrageSessions, color: '#D4F0EC' },
      { name: 'Écho', count: echoHistory.length, color: '#FCE8EF' },
      { name: 'Identité', count: identityAnswers.length, color: '#EDE8FA' }
    ].sort((a, b) => b.count - a.count);
  };

  const moduleUsage = getModuleUsage();
  const maxCount = Math.max(...moduleUsage.map(m => m.count), 1);

  return (
    <div className="min-h-screen bg-beige p-4 md:p-8">
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-noir-chaud mb-4">
          Mes Statistiques
        </h1>
        <p className="text-brun-terreux text-lg mb-8">
          Visualise ton parcours thérapeutique.
        </p>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card backgroundColor="bg-white">
              <TrendingUp size={32} className="text-brun-terreux mb-2" />
              <p className="text-sm text-brun-terreux mb-1">Sessions totales</p>
              <p className="text-3xl font-bold text-noir-chaud">{stats.totalSessions}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card backgroundColor="bg-white">
              <Calendar size={32} className="text-brun-terreux mb-2" />
              <p className="text-sm text-brun-terreux mb-1">Jours consécutifs</p>
              <p className="text-3xl font-bold text-noir-chaud">{stats.streakDays}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card backgroundColor="bg-white">
              <Heart size={32} className="text-brun-terreux mb-2" />
              <p className="text-sm text-brun-terreux mb-1">Émotions suivies</p>
              <p className="text-3xl font-bold text-noir-chaud">{stats.emotionsTracked}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card backgroundColor="bg-white">
              <Target size={32} className="text-brun-terreux mb-2" />
              <p className="text-sm text-brun-terreux mb-1">Objectifs atteints</p>
              <p className="text-3xl font-bold text-noir-chaud">{stats.goalsCompleted}</p>
            </Card>
          </motion.div>
        </div>

        {/* Module Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card backgroundColor="bg-white">
            <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-6">
              Modules les plus utilisés
            </h2>

            <div className="space-y-4">
              {moduleUsage.map((module, index) => (
                <div key={module.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-brun-terreux font-medium">{module.name}</span>
                    <span className="text-noir-chaud font-bold">{module.count} sessions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(module.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + (index * 0.1) }}
                      className="h-3 rounded-full"
                      style={{ backgroundColor: module.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <Card backgroundColor="bg-white">
            <h2 className="text-2xl font-playfair font-bold text-noir-chaud mb-4">
              Observations
            </h2>
            
            <div className="space-y-4">
              {stats.totalSessions > 0 && (
                <div className="p-4 bg-beige rounded-xl">
                  <p className="text-brun-terreux">
                    💪 Tu as utilisé TheraSpace <strong>{stats.totalSessions} fois</strong>. 
                    C'est un bel engagement envers ton bien-être !
                  </p>
                </div>
              )}

              {stats.streakDays >= 3 && (
                <div className="p-4 bg-green-100 rounded-xl">
                  <p className="text-green-800">
                    🔥 Impressionnant ! Tu as une série de <strong>{stats.streakDays} jours consécutifs</strong>. 
                    La régularité est la clé du progrès !
                  </p>
                </div>
              )}

              {stats.goalsCompleted >= 3 && (
                <div className="p-4 bg-blue-100 rounded-xl">
                  <p className="text-blue-800">
                    🎯 Tu as complété <strong>{stats.goalsCompleted} objectifs</strong> dans le programme Phare. 
                    Continue comme ça !
                  </p>
                </div>
              )}

              {stats.emotionsTracked >= 5 && (
                <div className="p-4 bg-purple-100 rounded-xl">
                  <p className="text-purple-800">
                    💜 Tu as suivi <strong>{stats.emotionsTracked} états émotionnels</strong>. 
                    Cette conscience de soi est précieuse.
                  </p>
                </div>
              )}

              {stats.totalSessions === 0 && (
                <div className="p-4 bg-beige rounded-xl">
                  <p className="text-brun-terreux">
                    👋 Bienvenue sur TheraSpace ! Commence ton voyage en explorant les différents modules.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
