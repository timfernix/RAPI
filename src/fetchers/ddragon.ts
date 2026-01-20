import { Champion } from '../core/types.js';

const BASE_URL = 'https://ddragon.leagueoflegends.com';

export async function fetchLatestVersion(): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/versions.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch versions: ${response.statusText}`);
  }
  const versions = await response.json() as string[];
  return versions[0];
}

interface ChampionListResponse {
  type: string;
  format: string;
  version: string;
  data: {
    [key: string]: {
      id: string;
    };
  };
}

interface ChampionDetailResponse {
  type: string;
  format: string;
  version: string;
  data: {
    [key: string]: Champion;
  };
}

export async function fetchAllChampions(version: string): Promise<Champion[]> {
  console.log(`Fetching champion list for version ${version}...`);
  const listResponse = await fetch(`${BASE_URL}/cdn/${version}/data/en_US/champion.json`);
  if (!listResponse.ok) {
     throw new Error(`Failed to fetch champion list: ${listResponse.statusText}`);
  }
  const listData = await listResponse.json() as ChampionListResponse;
  
  const championIds = Object.keys(listData.data);
  const champions: Champion[] = [];

  console.log(`Found ${championIds.length} champions. Fetching details...`);

  const BATCH_SIZE = 5;
  for (let i = 0; i < championIds.length; i += BATCH_SIZE) {
    const batch = championIds.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (id) => {
        try {
            const url = `${BASE_URL}/cdn/${version}/data/en_US/champion/${id}.json`;
            const detailResponse = await fetch(url);
            if (!detailResponse.ok) {
                console.error(`Failed to fetch champion ${id}: ${detailResponse.statusText}`);
                return null;
            }
            const detailData = await detailResponse.json() as ChampionDetailResponse;
            return detailData.data[id];
        } catch (e) {
            console.error(`Error fetching champion ${id}`, e);
            return null;
        }
    });

    const results = await Promise.all(promises);
    results.forEach(c => {
        if (c) champions.push(c);
    });
    
    if ((i + BATCH_SIZE) % 20 === 0 || i + BATCH_SIZE >= championIds.length) {
        console.log(`Fetched ${Math.min(i + BATCH_SIZE, championIds.length)}/${championIds.length}`);
    }
  }

  return champions;
}
