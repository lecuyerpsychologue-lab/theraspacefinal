// Mock API for IA simulation
// This simulates the Mistral API responses with delays

export interface EchoScenario {
  situation: string;
  reactions: string[];
}

export interface EchoAnalysis {
  analysis: string;
  reflection: string;
}

export interface GardenActions {
  domain: string;
  actions: string[];
}

export interface IdentityQuestion {
  id: string;
  type: 'ping-pong' | 'mcq' | 'true-false';
  question: string;
  options?: string[];
}

export interface IdentityPortrait {
  portrait: string;
}

export interface PsiAResponse {
  message: string;
}

// ÉCHO Module - Generate scenarios
export const getEchoScenario = async (): Promise<EchoScenario> => {
  await delay(2000);
  
  const scenarios = [
    {
      situation: "Ton meilleur ami a partagé un secret que tu lui avais confié avec d'autres personnes. Tu te sens trahi et ne sais pas comment réagir.",
      reactions: [
        "Je l'affronte immédiatement et lui dis que j'ai perdu confiance en lui",
        "Je garde mes distances sans rien dire et attends qu'il se rende compte de son erreur",
        "Je lui demande calmement pourquoi il a fait ça et j'essaie de comprendre sa perspective",
        "Je fais comme si de rien n'était car je ne veux pas de conflit"
      ]
    },
    {
      situation: "Tes parents ne comprennent pas ton besoin d'avoir plus d'intimité et de temps seul. Ils pensent que tu t'isoles trop.",
      reactions: [
        "Je claque la porte et refuse de discuter avec eux",
        "J'essaie d'expliquer calmement mes besoins et je propose un compromis",
        "Je cède à leurs demandes même si ça me frustre",
        "Je leur montre des articles sur l'importance de l'autonomie à mon âge"
      ]
    },
    {
      situation: "Tu as échoué à un examen important malgré tous tes efforts. Tu te sens découragé et commences à douter de tes capacités.",
      reactions: [
        "Je me dis que je ne suis pas fait pour cette matière et j'abandonne",
        "J'analyse ce qui n'a pas marché et je demande de l'aide à mon prof",
        "Je me compare aux autres et me sens encore plus mal",
        "Je prends du recul et me rappelle que ma valeur ne dépend pas d'une note"
      ]
    }
  ];

  return scenarios[Math.floor(Math.random() * scenarios.length)];
};

// ÉCHO Module - Analyze choice
export const analyzeEchoChoice = async (_situation: string, choice: string): Promise<EchoAnalysis> => {
  await delay(1500);
  
  return {
    analysis: `Tu as choisi : "${choice}". Cette réaction révèle plusieurs aspects de ta manière de gérer les situations difficiles. Elle montre comment tu équilibres tes besoins personnels avec ceux des autres, et comment tu navigues dans l'incertitude émotionnelle.`,
    reflection: `Pour approfondir ta réflexion : Qu'est-ce qui t'a poussé à choisir cette réaction plutôt qu'une autre ? As-tu déjà vécu une situation similaire ? Comment te sentirais-tu si quelqu'un réagissait de cette façon avec toi ?`
  };
};

// JARDIN Module - Get action suggestions
export const getGardenActions = async (domain: string): Promise<GardenActions> => {
  await delay(1500);
  
  const actionsByDomain: Record<string, string[]> = {
    "Relations sociales": [
      "Envoyer un message à quelqu'un que tu n'as pas vu depuis longtemps",
      "Faire un compliment sincère à une personne de ton entourage",
      "Organiser une activité avec un ami ou ta famille"
    ],
    "Confiance en soi": [
      "Faire une chose qui te fait peur mais que tu veux accomplir",
      "Noter 3 qualités que tu possèdes et pourquoi elles sont importantes",
      "Essayer quelque chose de nouveau sans craindre l'échec"
    ],
    "Gestion des émotions": [
      "Identifier l'émotion que tu ressens et l'écrire dans un journal",
      "Pratiquer 5 minutes de respiration consciente",
      "Exprimer ce que tu ressens à quelqu'un de confiance"
    ],
    "Créativité": [
      "Dessiner ou peindre pendant 15 minutes sans jugement",
      "Écrire une courte histoire ou un poème sur ton humeur du jour",
      "Créer une playlist qui représente ton état émotionnel actuel"
    ]
  };

  return {
    domain,
    actions: actionsByDomain[domain] || actionsByDomain["Relations sociales"]
  };
};

// IDENTITÉ Module - Generate questions
let questionIndex = 0;

export const getIdentityQuestion = async (): Promise<IdentityQuestion> => {
  await delay(1000);
  
  const questions: IdentityQuestion[] = [
    {
      id: 'q1',
      type: 'ping-pong',
      question: 'Si tu pouvais avoir un super-pouvoir pour une journée, lequel choisirais-tu et pourquoi ?'
    },
    {
      id: 'q2',
      type: 'mcq',
      question: 'Quel mot te décrit le mieux en ce moment ?',
      options: ['Curieux', 'Réservé', 'Énergique', 'Réfléchi']
    },
    {
      id: 'q3',
      type: 'true-false',
      question: 'Je me sens à l\'aise pour exprimer mes émotions aux autres',
      options: ['Vrai', 'Faux']
    },
    {
      id: 'q4',
      type: 'ping-pong',
      question: 'Quelle est la dernière chose qui t\'a fait vraiment rire ?'
    },
    {
      id: 'q5',
      type: 'mcq',
      question: 'Comment réagis-tu face à un changement imprévu ?',
      options: ['Je m\'adapte facilement', 'J\'ai besoin de temps', 'Ça me stresse', 'Je trouve ça excitant']
    },
    {
      id: 'q6',
      type: 'ping-pong',
      question: 'Décris-toi en trois mots qui commencent par la première lettre de ton prénom.'
    },
    {
      id: 'q7',
      type: 'true-false',
      question: 'Je préfère passer du temps seul(e) plutôt qu\'en groupe',
      options: ['Vrai', 'Faux']
    },
    {
      id: 'q8',
      type: 'mcq',
      question: 'Quelle activité te ressource le plus ?',
      options: ['Écouter de la musique', 'Faire du sport', 'Lire ou regarder des films', 'Passer du temps avec des amis']
    }
  ];

  const question = questions[questionIndex % questions.length];
  questionIndex++;
  
  return question;
};

// IDENTITÉ Module - Generate portrait
export const generateIdentityPortrait = async (answers: Array<{question: string, answer: string}>): Promise<IdentityPortrait> => {
  await delay(2000);
  
  if (answers.length === 0) {
    return {
      portrait: "Continue à répondre aux questions pour que je puisse créer ton portrait narratif."
    };
  }

  return {
    portrait: `Voici ce que tes réponses révèlent sur toi : Tu es une personne unique avec des facettes multiples. Tes choix montrent que tu es ${answers.length > 5 ? 'quelqu\'un de réfléchi qui prend le temps d\'explorer ses pensées' : 'en train de découvrir qui tu es'}. Tu as une capacité à ${answers.length > 3 ? 't\'introspection' : 'te questionner'} qui est précieuse. Ce voyage de découverte de soi est en constante évolution, et chaque réponse ajoute une nouvelle couleur à ton portrait. Continue d'explorer, car il n'y a pas de bonne ou de mauvaise réponse - seulement ta vérité du moment.`
  };
};

// PsIA Module - Chat response
export const getPsiAResponse = async (userMessage: string): Promise<PsiAResponse> => {
  await delay(1500);
  
  const responses = [
    `Je comprends ce que tu me dis. Peux-tu m'en dire un peu plus sur ce que tu ressens par rapport à "${userMessage}" ?`,
    `C'est intéressant que tu me parles de ça. Comment est-ce que cette situation t'affecte au quotidien ?`,
    `Je t'entends. Ce que tu décris résonne avec ce que beaucoup d'adolescents vivent. Qu'est-ce qui serait le plus aidant pour toi maintenant ?`,
    `Merci de partager ça avec moi. As-tu déjà vécu quelque chose de similaire auparavant ? Comment avais-tu fait face ?`,
    `C'est une question importante que tu soulèves. Prenons le temps d'explorer ensemble ce qui se cache derrière ces sentiments.`
  ];
  
  // Simple logic to vary responses
  if (userMessage.includes('triste') || userMessage.includes('mal')) {
    return {
      message: "Je vois que tu traverses un moment difficile. Ces émotions sont valides et il est courageux de les partager. Qu'est-ce qui te semble le plus lourd en ce moment ?"
    };
  }
  
  if (userMessage.includes('stressé') || userMessage.includes('anxieux')) {
    return {
      message: "Le stress et l'anxiété peuvent être vraiment pesants. Essayons ensemble d'identifier ce qui déclenche ces sensations. Peux-tu me décrire ce qui se passe dans ton corps quand tu ressens ça ?"
    };
  }
  
  return {
    message: responses[Math.floor(Math.random() * responses.length)]
  };
};

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
