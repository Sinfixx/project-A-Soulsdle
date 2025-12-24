export interface Boss {
  nom: string;
  jeu: string;
  genre: 'Homme' | 'Femme' | 'Inconnu';
  espece: string[];
  phases: number;
  nombre: number | string;
  cutscene: 'Oui' | 'Non';
  optionnel: 'Obligatoire' | 'Optionnel';
  dlc: 'Base' | 'DLC';
}

export interface GuessResponse {
  proposition: string;
  correct: boolean;
  message: string;
  tentatives: number;
  indices: {
    jeu: 'correct' | 'incorrect';
    genre: 'correct' | 'incorrect';
    espece: 'correct' | 'partial' | 'incorrect';
    phases: 'correct' | 'incorrect';
    nombre: 'correct' | 'incorrect';
    cutscene: 'correct' | 'incorrect';
    optionnel: 'correct' | 'incorrect';
    dlc: 'correct' | 'incorrect';
  };
}

export interface GameSession {
  sessionId: string;
  bossSecret: Boss;
  tentatives: number;
  propositions: GuessResponse[];
  terminee: boolean;
}
