export interface Scene {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
}

export interface GameState {
  currentSceneId: string;
  inventory: InventoryItem[];
}
