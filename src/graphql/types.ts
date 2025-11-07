// Types générés à partir du schéma GraphQL du backend
// Ne pas modifier manuellement - se référer au backend pour les mises à jour

// ==================== User Types ====================

export interface User {
  mongoId: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetMeResponse {
  me: User;
}

export interface LoginResponse {
  login: {
    token: string;
    success: boolean;
    message: string;
  };
}

export interface CreateUserInput {
  email: string;
  password: string;
  role?: string;
  firstName?: string;
  lastName?: string;
}

export interface CreateUserResponse {
  createUser: {
    user: User | null;
    success: boolean;
    message: string;
  };
}

// ==================== Story Types ====================

export interface Asset {
  mongoId: string;
  url: string;
  name?: string;
  type?: string;
}

export interface Choice {
  mongoId: string;
  text: string;
  order: number;
  toSceneId: {
    mongoId: string;
  };
}

export interface Scene {
  mongoId: string;
  title: string;
  text: string;
  order?: number;
  isStartScene: boolean;
  isEndScene: boolean;
  imageId?: Asset;
  soundId?: Asset; // TTS (narration)
  musicId?: Asset; // Musique d'ambiance
  choices?: Choice[];
}

export interface Scenario {
  mongoId: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt?: string;
  scenes?: Scene[];
}

// ==================== Progress Types ====================

export interface HistoryEntry {
  mongoId: string;
  sceneId: {
    mongoId: string;
  };
  choiceId?: {
    mongoId: string;
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PlayerProgress {
  mongoId: string;
  scenarioId: {
    mongoId: string;
    title?: string;
    description?: string;
  };
  currentSceneId: {
    mongoId: string;
    title?: string;
    text?: string;
  };
  history?: HistoryEntry[];
  isCompleted: boolean;
  completedAt?: string;
  totalTimeSpent?: number;
  progressPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Query Response Types ====================

export interface GetAllScenariosResponse {
  allScenarios: Scenario[];
}

export interface GetScenarioResponse {
  scenarioById: Scenario;
}

export interface GetScenesByScenarioResponse {
  scenesByScenario: Scene[];
}

export interface GetSceneResponse {
  sceneById: Scene;
}

export interface GetChoicesBySceneResponse {
  choicesByScene: Choice[];
}

export interface GetMyProgressResponse {
  myProgress: PlayerProgress[];
}

export interface GetProgressByScenarioResponse {
  progressByUserAndScenario: PlayerProgress;
}

// ==================== Mutation Response Types ====================

export interface CreateProgressResponse {
  createProgress: {
    progress: PlayerProgress;
    success: boolean;
    message: string;
  };
}

export interface RecordProgressResponse {
  recordProgress: {
    progress: PlayerProgress;
    success: boolean;
    message: string;
  };
}

export interface UpdateProgressResponse {
  updateProgress: {
    progress: PlayerProgress;
    success: boolean;
    message: string;
  };
}

// ==================== Input Types ====================

export interface CreateProgressInput {
  scenarioId: string;
  currentSceneId: string;
}

export interface RecordProgressInput {
  progressId: string;
  sceneId: string;
  choiceId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateProgressInput {
  currentSceneId?: string;
  totalTimeSpent?: number;
}
