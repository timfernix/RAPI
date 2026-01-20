import { fetchLatestVersion, fetchAllChampions } from './fetchers/ddragon.js';
import { generateStaticApi } from './generators/file-system.js';

async function main() {
  try {
    console.log("Starting daily update workflow...");
    const version = await fetchLatestVersion();
    console.log(`Latest version is: ${version}`);
    
    const champions = await fetchAllChampions(version);
    await generateStaticApi(version, champions);
    
    console.log("✅ Build complete.");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

main();
