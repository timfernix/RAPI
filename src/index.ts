import { fetchAllChampions } from './fetchers/riot-mock.js';
import { generateStaticApi } from './generators/file-system.js';

async function main() {
  try {
    const champions = await fetchAllChampions();
    await generateStaticApi(champions);
    console.log("✅ Build complete.");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

main();