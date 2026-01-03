// API Client abstraction for Mistral AI
// Uses real Mistral API if VITE_MISTRAL_API_KEY is set, otherwise uses mock API

import * as mockApi from './mockApi';

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Check if we should use the real API
const useRealAPI = !!MISTRAL_API_KEY && MISTRAL_API_KEY !== 'your_mistral_api_key_here';

// Generic function to call Mistral API
async function callMistralAPI(messages: Array<{role: string, content: string}>, temperature = 0.7): Promise<string> {
  if (!useRealAPI) {
    throw new Error('Real API not configured');
  }

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages,
        temperature,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Mistral API call failed:', error);
    throw error;
  }
}

// Export all functions with API/mock fallback logic

export const getEchoScenario = async (): Promise<mockApi.EchoScenario> => {
  if (useRealAPI) {
    try {
      await callMistralAPI([
        {
          role: 'system',
          content: 'Tu es un psychologue pour adolescents. Crée un scénario social réaliste avec 4 réactions possibles.'
        },
        {
          role: 'user',
          content: 'Génère un scénario social difficile pour un adolescent avec 4 façons différentes de réagir.'
        }
      ]);
      
      // Parse the response - for now, fallback to mock if parsing fails
      return mockApi.getEchoScenario();
    } catch {
      return mockApi.getEchoScenario();
    }
  }
  return mockApi.getEchoScenario();
};

export const analyzeEchoChoice = async (situation: string, choice: string): Promise<mockApi.EchoAnalysis> => {
  if (useRealAPI) {
    try {
      const content = await callMistralAPI([
        {
          role: 'system',
          content: 'Tu es un psychologue pour adolescents. Analyse la réaction choisie avec empathie et propose une réflexion.'
        },
        {
          role: 'user',
          content: `Situation: ${situation}\nRéaction choisie: ${choice}\nAnalyse cette réaction et propose une question de réflexion.`
        }
      ]);
      
      return {
        analysis: content.split('\n')[0] || content,
        reflection: content.split('\n')[1] || 'Que penses-tu de ce choix maintenant ?'
      };
    } catch {
      return mockApi.analyzeEchoChoice(situation, choice);
    }
  }
  return mockApi.analyzeEchoChoice(situation, choice);
};

export const getGardenActions = async (domain: string): Promise<mockApi.GardenActions> => {
  if (useRealAPI) {
    try {
      const content = await callMistralAPI([
        {
          role: 'system',
          content: 'Tu es un psychologue pour adolescents. Propose 3 actions concrètes et réalisables.'
        },
        {
          role: 'user',
          content: `Propose 3 actions concrètes quotidiennes pour améliorer: ${domain}`
        }
      ]);
      
      const lines = content.split('\n').filter(l => l.trim());
      return {
        domain,
        actions: lines.slice(0, 3)
      };
    } catch {
      return mockApi.getGardenActions(domain);
    }
  }
  return mockApi.getGardenActions(domain);
};

export const getIdentityQuestion = async (): Promise<mockApi.IdentityQuestion> => {
  if (useRealAPI) {
    try {
      const content = await callMistralAPI([
        {
          role: 'system',
          content: 'Tu es un psychologue pour adolescents. Pose une question introspective intéressante.'
        },
        {
          role: 'user',
          content: 'Génère une question pour aider un adolescent à mieux se connaître.'
        }
      ]);
      
      return {
        id: `q${Date.now()}`,
        type: 'ping-pong',
        question: content
      };
    } catch {
      return mockApi.getIdentityQuestion();
    }
  }
  return mockApi.getIdentityQuestion();
};

export const generateIdentityPortrait = async (answers: Array<{question: string, answer: string}>): Promise<mockApi.IdentityPortrait> => {
  if (useRealAPI) {
    try {
      const answersText = answers.map(a => `Q: ${a.question}\nR: ${a.answer}`).join('\n\n');
      const content = await callMistralAPI([
        {
          role: 'system',
          content: 'Tu es un psychologue pour adolescents. Crée un portrait narratif bienveillant basé sur les réponses.'
        },
        {
          role: 'user',
          content: `Voici les réponses d'un adolescent:\n\n${answersText}\n\nCrée un portrait narratif qui révèle sa personnalité.`
        }
      ]);
      
      return { portrait: content };
    } catch {
      return mockApi.generateIdentityPortrait(answers);
    }
  }
  return mockApi.generateIdentityPortrait(answers);
};

export const getPsiAResponse = async (userMessage: string): Promise<mockApi.PsiAResponse> => {
  if (useRealAPI) {
    try {
      const content = await callMistralAPI([
        {
          role: 'system',
          content: 'Tu es PsIA, un compagnon psychologique bienveillant pour adolescents. Réponds avec empathie et pose des questions ouvertes.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ], 0.8);
      
      return { message: content };
    } catch {
      return mockApi.getPsiAResponse(userMessage);
    }
  }
  return mockApi.getPsiAResponse(userMessage);
};

// New functions for new modules
export interface HumeurData {
  emotion: string;
  intensity: number;
  context: string;
  notes: string;
  date: string;
}

export interface PhareQuestion {
  id: number;
  question: string;
  category: string;
}

export interface PhareResult {
  score: number;
  level: 'Faible' | 'Moyenne-Faible' | 'Moyenne-Élevée' | 'Élevée';
  description: string;
}

export interface PhareWeeklyGoals {
  week: number;
  goals: string[];
}

export const getPhareQuestions = async (): Promise<PhareQuestion[]> => {
  // 18 questions for self-esteem assessment
  return [
    { id: 1, question: "Je suis fier(e) de qui je suis", category: "Estime globale" },
    { id: 2, question: "Je pense que j'ai de la valeur en tant que personne", category: "Estime globale" },
    { id: 3, question: "Je suis satisfait(e) de moi-même", category: "Estime globale" },
    { id: 4, question: "J'ai confiance en mes capacités", category: "Compétence" },
    { id: 5, question: "Je réussis les choses que j'entreprends", category: "Compétence" },
    { id: 6, question: "Je me sens capable de relever des défis", category: "Compétence" },
    { id: 7, question: "Je me sens aimé(e) par les autres", category: "Relations" },
    { id: 8, question: "J'ai des amis sur qui je peux compter", category: "Relations" },
    { id: 9, question: "Je me sens accepté(e) par mon entourage", category: "Relations" },
    { id: 10, question: "Je prends soin de mon apparence", category: "Apparence" },
    { id: 11, question: "Je suis à l'aise avec mon corps", category: "Apparence" },
    { id: 12, question: "J'aime ce que je vois dans le miroir", category: "Apparence" },
    { id: 13, question: "Je me sens en contrôle de ma vie", category: "Autonomie" },
    { id: 14, question: "Je prends mes propres décisions facilement", category: "Autonomie" },
    { id: 15, question: "Je sais ce que je veux dans la vie", category: "Autonomie" },
    { id: 16, question: "Je gère bien mes émotions", category: "Émotions" },
    { id: 17, question: "Je rebondis facilement après un échec", category: "Émotions" },
    { id: 18, question: "Je reste positif(ve) même dans les moments difficiles", category: "Émotions" }
  ];
};

export const calculatePhareResult = (answers: number[]): PhareResult => {
  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  const maxScore = answers.length * 4;
  const percentage = (totalScore / maxScore) * 100;
  
  let level: PhareResult['level'];
  let description: string;
  
  if (percentage < 40) {
    level = 'Faible';
    description = "Ton estime de toi a besoin d'attention. Le programme Phare va t'aider à renforcer ta confiance en toi, pas à pas.";
  } else if (percentage < 60) {
    level = 'Moyenne-Faible';
    description = "Ton estime de toi est en construction. Le programme Phare va t'aider à consolider tes bases et à gagner en confiance.";
  } else if (percentage < 80) {
    level = 'Moyenne-Élevée';
    description = "Tu as une bonne estime de toi, mais il y a toujours place pour grandir. Le programme Phare va t'aider à atteindre ton plein potentiel.";
  } else {
    level = 'Élevée';
    description = "Tu as une excellente estime de toi ! Le programme Phare va t'aider à maintenir et renforcer cette belle confiance.";
  }
  
  return { score: totalScore, level, description };
};

export const getPhareWeeklyGoals = async (week: number, level: string): Promise<PhareWeeklyGoals> => {
  if (useRealAPI) {
    try {
      const content = await callMistralAPI([
        {
          role: 'system',
          content: 'Tu es un psychologue pour adolescents. Propose 3 objectifs concrets hebdomadaires pour renforcer l\'estime de soi.'
        },
        {
          role: 'user',
          content: `Semaine ${week} d'un programme de 8 semaines. Niveau d'estime de soi: ${level}. Propose 3 objectifs concrets et réalisables.`
        }
      ]);
      
      const lines = content.split('\n').filter(l => l.trim());
      return {
        week,
        goals: lines.slice(0, 3)
      };
    } catch (error) {
      // Fallback to predefined goals
    }
  }
  
  // Mock goals based on week
  const goalsByWeek: Record<number, string[]> = {
    1: [
      "Identifie 3 de tes qualités et note pourquoi elles sont importantes",
      "Fais un compliment sincère à quelqu'un chaque jour",
      "Écris une lettre de gratitude à toi-même"
    ],
    2: [
      "Essaie une nouvelle activité qui te fait un peu peur",
      "Partage une réussite récente avec quelqu'un de confiance",
      "Tiens un journal de tes victoires quotidiennes, même petites"
    ],
    3: [
      "Dis non à quelque chose qui ne te convient pas",
      "Passe du temps avec des personnes qui te valorisent",
      "Fais quelque chose de créatif sans jugement"
    ],
    4: [
      "Fixe-toi un objectif réaliste et atteins-le",
      "Accepte un compliment sans le minimiser",
      "Prends soin de ton corps (sport, repos, nutrition)"
    ],
    5: [
      "Pardonne-toi une erreur passée",
      "Demande de l'aide quand tu en as besoin",
      "Célèbre une qualité unique que tu possèdes"
    ],
    6: [
      "Sors de ta zone de confort d'une petite façon",
      "Reconnais tes progrès depuis le début du programme",
      "Partage ton histoire avec quelqu'un qui pourrait en bénéficier"
    ],
    7: [
      "Établis une limite saine dans une relation",
      "Fais quelque chose juste pour le plaisir, sans objectif",
      "Écris une vision positive de ton futur toi"
    ],
    8: [
      "Réfléchis à ton parcours et note tes apprentissages",
      "Planifie comment maintenir tes nouvelles habitudes",
      "Célèbre tes accomplissements de ces 8 semaines"
    ]
  };
  
  return {
    week,
    goals: goalsByWeek[week] || goalsByWeek[1]
  };
};

export const getJournalSuggestion = async (): Promise<string> => {
  if (useRealAPI) {
    try {
      const content = await callMistralAPI([
        {
          role: 'system',
          content: 'Tu es un psychologue pour adolescents. Propose un sujet de réflexion personnalisé pour le journal.'
        },
        {
          role: 'user',
          content: 'Propose un sujet de réflexion intéressant pour un adolescent dans son journal personnel.'
        }
      ]);
      
      return content;
    } catch (error) {
      // Fallback
    }
  }
  
  const suggestions = [
    "Qu'est-ce qui t'a fait sourire aujourd'hui ?",
    "Décris un moment où tu t'es senti(e) fier(e) de toi récemment.",
    "Quelle est une chose que tu aimerais changer dans ta vie ?",
    "Qui est quelqu'un qui t'inspire et pourquoi ?",
    "Qu'est-ce que tu as appris sur toi-même cette semaine ?",
    "Décris ton endroit préféré et ce que tu y ressens.",
    "Quelle est une peur que tu aimerais surmonter ?",
    "Qu'est-ce qui te rend unique ?",
    "Écris une lettre à ton futur toi dans 5 ans.",
    "Quelle est ta plus grande force ?"
  ];
  
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};
