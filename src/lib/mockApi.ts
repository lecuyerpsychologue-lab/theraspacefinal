import { delay, getRandomElement } from './utils';

// Types for Echo Module
export interface EchoScenario {
  situation: string;
  reactions: string[];
}

export interface EchoAnalysis {
  chosenReaction: string;
  analysis: string;
}

// Types for Garden Module
export interface GardenAction {
  domain: string;
  actions: string[];
}

// Types for Identity Module
export interface IdentityQuestion {
  id: string;
  type: 'ping-pong' | 'qcm' | 'true-false';
  question: string;
  options?: string[];
}

export interface IdentityPortrait {
  narrative: string;
}

// Types for PsIA Module
export interface PsiAMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Echo Module Mock API
const echoSituations = [
  {
    situation: "Tu es au lycée et ton meilleur ami commence à t'ignorer sans raison apparente. Comment réagis-tu ?",
    reactions: [
      "Je l'affronte directement pour comprendre ce qui ne va pas",
      "Je prends mes distances et j'attends qu'il vienne vers moi",
      "J'en parle à d'autres amis pour avoir leur avis",
      "Je lui écris un message pour exprimer ce que je ressens"
    ]
  },
  {
    situation: "Tu as raté un examen important alors que tu avais beaucoup révisé. Quelle est ta réaction ?",
    reactions: [
      "Je me dis que ce n'est qu'un examen parmi d'autres et je passe à autre chose",
      "J'analyse mes erreurs pour comprendre ce qui n'a pas fonctionné",
      "Je me sens découragé(e) et j'ai du mal à me remettre au travail",
      "Je cherche du soutien auprès de ma famille ou mes amis"
    ]
  },
  {
    situation: "Tes parents te mettent beaucoup de pression pour tes études. Comment gères-tu cette situation ?",
    reactions: [
      "Je leur explique calmement ce que je ressens et mes limites",
      "Je fais comme si de rien n'était et j'essaie de répondre à leurs attentes",
      "Je me rebelle et je refuse de faire ce qu'ils demandent",
      "Je cherche un compromis qui satisfait tout le monde"
    ]
  }
];

const echoAnalyses = [
  "Ta réaction montre une capacité à affronter les situations difficiles de manière directe. C'est une force, mais n'oublie pas que parfois, prendre du recul peut aussi être bénéfique.",
  "Tu as une approche réfléchie qui te permet d'analyser les situations en profondeur. Continue à cultiver cette qualité tout en restant ouvert(e) aux émotions immédiates.",
  "Ton choix révèle une sensibilité aux relations interpersonnelles. C'est précieux, mais veille à ne pas trop dépendre du regard des autres sur toi.",
  "Tu privilégies la communication écrite, ce qui te permet de mieux exprimer tes pensées. C'est une belle compétence qui peut t'aider dans de nombreuses situations."
];

export async function getEchoScenario(): Promise<EchoScenario> {
  await delay(1500);
  return getRandomElement(echoSituations);
}

export async function getEchoAnalysis(chosenReaction: string): Promise<EchoAnalysis> {
  await delay(2000);
  return {
    chosenReaction,
    analysis: getRandomElement(echoAnalyses)
  };
}

// Garden Module Mock API
const gardenDomains = {
  'Relations sociales': [
    "Envoie un message à un ami que tu n'as pas vu depuis longtemps",
    "Participe à une activité de groupe cette semaine",
    "Fais un compliment sincère à quelqu'un aujourd'hui"
  ],
  'Bien-être physique': [
    "Fais 15 minutes d'exercice physique",
    "Prends le temps de préparer un repas équilibré",
    "Dors au moins 8 heures cette nuit"
  ],
  'Créativité': [
    "Dessine ou écris pendant 20 minutes sans jugement",
    "Écoute un nouveau genre de musique",
    "Essaie une nouvelle recette de cuisine"
  ],
  'Apprentissage': [
    "Lis un article sur un sujet qui t'intéresse",
    "Regarde un documentaire éducatif",
    "Apprends 5 nouveaux mots dans une langue étrangère"
  ]
};

export async function getGardenActions(domain: string): Promise<GardenAction> {
  await delay(1000);
  const actions = gardenDomains[domain as keyof typeof gardenDomains] || gardenDomains['Relations sociales'];
  return {
    domain,
    actions
  };
}

// Identity Module Mock API
const identityQuestions = [
  {
    id: '1',
    type: 'ping-pong' as const,
    question: "Si tu pouvais avoir un super-pouvoir pour une journée, lequel choisirais-tu et pourquoi ?"
  },
  {
    id: '2',
    type: 'qcm' as const,
    question: "Quand tu es stressé(e), tu préfères :",
    options: [
      "Être seul(e) pour te ressourcer",
      "Parler à quelqu'un de confiance",
      "Faire du sport ou une activité physique",
      "Écouter de la musique ou regarder une série"
    ]
  },
  {
    id: '3',
    type: 'true-false' as const,
    question: "Je me sens souvent incompris(e) par mon entourage",
    options: ["Vrai", "Faux"]
  },
  {
    id: '4',
    type: 'ping-pong' as const,
    question: "Quel est ton meilleur souvenir de cette année ? Décris-le en quelques mots."
  },
  {
    id: '5',
    type: 'qcm' as const,
    question: "Dans un groupe d'amis, tu es plutôt :",
    options: [
      "Celui/celle qui prend des initiatives",
      "Celui/celle qui écoute et conseille",
      "Celui/celle qui apporte de l'humour",
      "Celui/celle qui suit le mouvement"
    ]
  },
  {
    id: '6',
    type: 'true-false' as const,
    question: "J'ai confiance en ma capacité à surmonter les difficultés",
    options: ["Vrai", "Faux"]
  },
  {
    id: '7',
    type: 'ping-pong' as const,
    question: "Si tu devais te décrire en trois mots, lesquels choisirais-tu ?"
  },
  {
    id: '8',
    type: 'qcm' as const,
    question: "Qu'est-ce qui te motive le plus au quotidien ?",
    options: [
      "Réussir mes études",
      "Passer du temps avec mes proches",
      "Poursuivre mes passions",
      "Aider les autres"
    ]
  }
];

let questionIndex = 0;

export async function getIdentityQuestion(): Promise<IdentityQuestion> {
  await delay(800);
  const question = identityQuestions[questionIndex % identityQuestions.length];
  questionIndex++;
  return question;
}

export async function generateIdentityPortrait(answers: Record<string, string>): Promise<IdentityPortrait> {
  await delay(2500);
  
  const narratives = [
    "Tu es une personne qui valorise l'authenticité et la connexion avec les autres. Ton parcours révèle une sensibilité particulière aux relations humaines et une capacité à réfléchir profondément sur tes expériences. Tu as une vision unique du monde qui mérite d'être explorée et partagée.",
    "Tes réponses montrent quelqu'un de réfléchi, qui prend le temps d'analyser ses émotions et ses pensées. Tu as développé une bonne conscience de toi-même et tu continues à évoluer. Ta capacité d'introspection est une force qui te permettra de naviguer les défis de l'adolescence avec sagesse.",
    "Tu es quelqu'un de curieux et d'ouvert aux nouvelles expériences. Tes réponses révèlent une personnalité dynamique qui aime explorer différentes facettes de la vie. Continue à cultiver cette ouverture tout en restant fidèle à tes valeurs profondes.",
    "Ton portrait révèle une personne empathique et attentive aux autres. Tu as une capacité naturelle à comprendre les émotions et les perspectives différentes. Cette sensibilité est un don précieux qui peut t'aider à créer des relations authentiques et significatives."
  ];
  
  return {
    narrative: getRandomElement(narratives)
  };
}

// PsIA Module Mock API
const psiAResponses = [
  "Je comprends ce que tu ressens. C'est tout à fait normal de traverser des moments difficiles. Peux-tu m'en dire un peu plus sur ce qui se passe ?",
  "Merci d'avoir partagé ça avec moi. Tes émotions sont valides et importantes. Comment cette situation affecte-t-elle ton quotidien ?",
  "C'est intéressant ce que tu me dis là. On dirait que tu es en train de faire un travail important sur toi-même. Qu'est-ce qui t'aide le plus dans ces moments-là ?",
  "Je vois que c'est quelque chose qui te préoccupe vraiment. As-tu déjà essayé d'en parler avec quelqu'un de ton entourage ?",
  "Tu sembles avoir une bonne conscience de ce que tu ressens. C'est une qualité importante. Que pourrais-tu faire pour prendre soin de toi dans cette situation ?",
  "C'est courageux de ta part de t'exprimer ainsi. Souviens-toi que demander de l'aide n'est pas une faiblesse, mais une force. Qu'est-ce qui pourrait t'aider à te sentir mieux aujourd'hui ?"
];

export async function getPsiAResponse(userMessage: string): Promise<string> {
  await delay(1200);
  
  // Simple logic to make responses more contextual
  if (userMessage.toLowerCase().includes('triste') || userMessage.toLowerCase().includes('déprimé')) {
    return "Je vois que tu traverses un moment difficile. La tristesse est une émotion naturelle, même si elle est inconfortable. Qu'est-ce qui pourrait t'apporter un peu de réconfort en ce moment ?";
  }
  
  if (userMessage.toLowerCase().includes('stress') || userMessage.toLowerCase().includes('anxieux')) {
    return "Le stress et l'anxiété peuvent être vraiment pesants. As-tu déjà essayé des techniques de respiration ou de relaxation ? Parfois, prendre quelques minutes pour soi peut faire une grande différence.";
  }
  
  if (userMessage.toLowerCase().includes('ami') || userMessage.toLowerCase().includes('relation')) {
    return "Les relations avec les autres sont essentielles, mais elles peuvent aussi être complexes. Comment te sens-tu dans tes relations actuelles ? Y a-t-il quelque chose que tu aimerais changer ?";
  }
  
  return getRandomElement(psiAResponses);
}
