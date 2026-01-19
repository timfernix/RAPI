import { Champion } from '../core/types.js';

export async function fetchAllChampions(): Promise<Champion[]> {
  console.log("Fetching champion data...");
  
  // Mocking Ezreal
  return [
    {
      id: "ezreal",
      name: "Ezreal",
      title: "The Prodigal Explorer",
      lore: "A dashing adventurer, unknowingly gifted in the magical arts...",
      abilities: [
        {
          id: "q",
          name: "Mystic Shot",
          description: "Ezreal fires a bolt of energy...",
          imageUrl: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/spell/EzrealQ.png",
          cooldown: "5.5/5.25/5/4.75/4.5"
        },
        {
          id: "w",
          name: "Essence Flux",
          description: "Ezreal fires an orb that sticks to the first champion hit...",
          imageUrl: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/spell/EzrealW.png",
          cooldown: "8"
        }
      ],
      skins: [
        {
          id: "default",
          name: "Default Ezreal",
          imageUrl: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_0.jpg"
        },
        {
          id: "frosted",
          name: "Frosted Ezreal",
          imageUrl: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_1.jpg"
        }
      ]
    }
  ];
}