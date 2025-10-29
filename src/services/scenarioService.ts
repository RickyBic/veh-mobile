import { Scene, InventoryItem } from '../models/types';
import { fetchScenario } from '../utils/api';

export const scenarioService = {
  startScenario: async (): Promise<Scene> => {
    return fetchScenario('/scenario/start');
  },

  getNextScene: async (sceneId: string, choiceId: string): Promise<Scene> => {
    return fetchScenario(`/scenario/next?id=${sceneId}&choice=${choiceId}`);
  },

  getInventory: async (): Promise<InventoryItem[]> => {
    return fetchScenario('/scenario/inventory');
  },
};
