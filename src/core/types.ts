export interface Ability {
  id: string; 
  name: string;
  description: string;
  imageUrl: string; // extenal
  cooldown: string;
}

export interface Skin {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Champion {
  id: string; 
  name: string;
  title: string;
  lore: string;
  abilities: Ability[];
  skins: Skin[];
}