import fs from 'fs-extra';
import path from 'path';
import { Champion } from '../core/types.js';

const DIST_ROOT = './docs';

async function writeEndpoint(filePath: string, content: string) {
  await fs.outputFile(filePath, content, 'utf8');
}

async function writeImageRedirect(filePath: string, targetUrl: string) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=${targetUrl}">
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to <a href="${targetUrl}">original source</a>.</p>
</body>
</html>`;
  
  await fs.outputFile(path.join(filePath, 'index.html'), html.trim());
}

async function write404Page(basePath: string) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>404 - Champion Not Found</title>
    <style>
      body { font-family: sans-serif; text-align: center; padding: 50px; }
      h1 { font-size: 50px; }
      p { font-size: 20px; }
    </style>
</head>
<body>
    <h1>404</h1>
    <p>Champion not found.</p>
    <p><a href="/">Go back home</a></p>
</body>
</html>`;
  await fs.outputFile(path.join(basePath, '404.html'), html.trim());
}

export async function generateStaticApi(data: Champion[], basePath: string = DIST_ROOT) {
  await fs.emptyDir(basePath);

  await fs.outputFile(path.join(basePath, '.nojekyll'), '');

  await write404Page(basePath);

  const versionedPath = path.join(basePath, 'v1');
  console.log(`Generating Static API at ${versionedPath}...`);

  for (const champ of data) {
    const champPath = path.join(versionedPath, champ.id);

    // /ezreal/name
    await writeEndpoint(path.join(champPath, 'name'), champ.name);
    // /ezreal/title
    await writeEndpoint(path.join(champPath, 'title'), champ.title);
    // /ezreal/lore
    await writeEndpoint(path.join(champPath, 'lore'), champ.lore);

    await fs.outputJson(path.join(champPath, 'json'), champ);
    
    // /ezreal/abilities
    for (const ability of champ.abilities) {
      const abilityPath = path.join(champPath, ability.id);

      // /ezreal/q/name
      await writeEndpoint(path.join(abilityPath, 'name'), ability.name);
      
      // /ezreal/q/description
      await writeEndpoint(path.join(abilityPath, 'description'), ability.description);
      
      // /ezreal/q/cooldown
      await writeEndpoint(path.join(abilityPath, 'cooldown'), ability.cooldown);

      // /ezreal/q/image
      await writeImageRedirect(path.join(abilityPath, 'image'), ability.imageUrl);
    }

    if (champ.skins) {
      for (const skin of champ.skins) {
        const skinPath = path.join(champPath, 'skins', skin.id);
        
        await writeEndpoint(path.join(skinPath, 'name'), skin.name);
        
        await writeImageRedirect(path.join(skinPath, 'image'), skin.imageUrl);
      }
    }
  }
}