import fs from 'fs-extra';
import path from 'path';
import { Champion, Spell, Skin } from '../core/types.js';

const DIST_ROOT = './docs';

async function writeEndpoint(filePath: string, content: string) {
  await fs.outputFile(filePath, content, 'utf8');
}

async function writeJsonEndpoint(filePath: string, content: any) {
    await fs.outputJson(filePath, content);
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Champion Not Found</title>
    <style>
      :root {
          --bg: #091428;
          --gold: #C8AA6E;
          --blue: #0AC8B9;
          --text: #F0E6D2;
      }
      body { 
          font-family: 'Segoe UI', sans-serif; 
          background-color: var(--bg);
          color: var(--text);
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
      }
      h1 { 
          font-size: 120px; 
          margin: 0; 
          color: var(--gold);
          text-shadow: 0 0 20px rgba(200, 170, 110, 0.3);
          animation: float 3s ease-in-out infinite;
      }
      p { 
          font-size: 24px; 
          margin-bottom: 30px; 
      }
      a {
          color: var(--bg);
          background: var(--blue);
          padding: 12px 30px;
          text-decoration: none;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: all 0.3s ease;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
      }
      a:hover {
          background: var(--gold);
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(200, 170, 110, 0.5);
      }
      @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
      }
    </style>
</head>
<body>
    <h1>404</h1>
    <p>The champion you are looking for has recalled to the fountain.</p>
    <a href="/">Return to Base (Home)</a>
</body>
</html>`;
  await fs.outputFile(path.join(basePath, '404.html'), html.trim());
}

async function writeLandingPage(basePath: string, champions: Champion[]) {
    const championList = champions.map(c => ({ id: c.id, name: c.name })).sort((a,b) => a.name.localeCompare(b.name));
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>League Static API - URL Builder</title>
    <style>
      :root {
          --hextech-black: #010A13;
          --hextech-blue: #0AC8B9;
          --hextech-gold: #C8AA6E;
          --hextech-pop: #CDFAFA;
          --text: #F0E6D2;
          --overlay: rgba(1, 10, 19, 0.85);
      }
      
      * { box-sizing: border-box; }

      body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: var(--hextech-black);
          color: var(--text);
          margin: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow-x: hidden;
      }

      header {
          padding: 40px 20px;
          text-align: center;
          border-bottom: 2px solid var(--hextech-gold);
          background: linear-gradient(180deg, rgba(8, 20, 40, 1) 0%, rgba(1, 10, 19, 1) 100%);
          position: relative;
          overflow: hidden;
      }

      h1 {
          font-size: 3rem;
          color: var(--hextech-gold);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
          z-index: 2;
      }
      
      h1 span { color: var(--hextech-blue); }

      p.subtitle {
          color: var(--hextech-pop);
          margin-top: 10px;
          font-size: 1.2rem;
          opacity: 0.8;
      }

      main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
      }

      .builder-container {
          background: rgba(10, 20, 40, 0.6);
          border: 1px solid var(--hextech-gold);
          padding: 30px;
          border-radius: 4px;
          width: 100%;
          box-shadow: 0 0 30px rgba(10, 200, 185, 0.1);
          position: relative;
      }

      .builder-container::before {
          content: '';
          position: absolute;
          top: -1px; left: -1px; right: -1px; bottom: -1px;
          border: 1px solid var(--hextech-blue);
          border-radius: 4px;
          opacity: 0.3;
          pointer-events: none;
      }

      .controls {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 20px;
          margin-bottom: 30px;
      }

      label {
          display: block;
          margin-bottom: 10px;
          color: var(--hextech-gold);
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 1px;
      }

      select, input {
          width: 100%;
          padding: 12px;
          background: #091428;
          border: 1px solid var(--hextech-blue);
          color: var(--hextech-pop);
          font-size: 1rem;
          outline: none;
          transition: box-shadow 0.3s ease;
      }

      select:focus, input:focus {
          box-shadow: 0 0 15px rgba(10, 200, 185, 0.4);
      }

      .path-display {
          background: #04090F;
          padding: 20px;
          border-left: 3px solid var(--hextech-gold);
          font-family: 'Consolas', monospace;
          font-size: 1.2rem;
          color: #2DE0A5;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
      }

      .copy-btn {
          background: transparent;
          border: 1px solid var(--hextech-gold);
          color: var(--hextech-gold);
          padding: 5px 15px;
          cursor: pointer;
          transition: all 0.2s;
      }
      .copy-btn:hover { background: var(--hextech-gold); color: #000; }

      .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
      }

      .resource-btn {
          background: rgba(10, 200, 185, 0.1);
          border: 1px solid var(--hextech-blue);
          color: var(--hextech-pop);
          padding: 15px;
          cursor: pointer;
          text-align: center;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
      }

      .resource-btn:hover {
          background: rgba(10, 200, 185, 0.3);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.5);
      }

      .resource-btn.active {
          background: var(--hextech-gold);
          color: #000;
          border-color: #fff;
      }

      #preview-area {
          margin-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 20px;
          min-height: 100px;
      }
      
      .preview-label { color: var(--hextech-gold); margin-bottom: 10px; display: block; }
      
      iframe, pre {
          width: 100%;
          border: 1px solid #333;
          background: #050a10;
          padding: 15px;
          overflow: auto;
          height: 300px;
          color: #eee;
      }

      @media (max-width: 768px) {
          .controls { grid-template-columns: 1fr; }
      }

      /* Animation for background particles */
      .particles {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background-image: 
            radial-gradient(circle at 50% 50%, rgba(10, 200, 185, 0.05) 1px, transparent 1px),
            radial-gradient(circle at 0% 0%, rgba(200, 170, 110, 0.05) 1px, transparent 1px);
        background-size: 40px 40px;
        z-index: -1;
        opacity: 0.5;
      }

    </style>
</head>
<body>

    <div class="particles"></div>

    <header>
        <h1>League <span>Static API</span></h1>
        <p class="subtitle">Daily Updated. Lightweight. File-based.</p>
    </header>

    <main>
        <div class="builder-container">
            <div class="controls">
                <div>
                    <label>1. Select Champion</label>
                    <select id="champ-select">
                        <option value="" disabled selected>Choose...</option>
                        ${championList.map(c => `<option value="${c.id.toLowerCase()}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label>2. Choose Resource</label>
                    <div id="resource-buttons" class="resources-grid">
                        <div style="grid-column: 1/-1; text-align: center; color: #666; padding: 20px;">Select a champion first</div>
                    </div>
                </div>
            </div>

            <label>Generated URL</label>
            <div class="path-display">
                <span id="url-output">/v1/</span>
                <button class="copy-btn" onclick="copyUrl()">COPY</button>
            </div>

            <div id="preview-area" style="display:none;">
                <span class="preview-label">Live Preview</span>
                <div id="content-viewer"></div>
            </div>
        </div>
    </main>

    <script>
        const RESOURCES = [
            { id: 'name', label: 'Name' },
            { id: 'title', label: 'Title' },
            { id: 'lore', label: 'Lore' },
            { id: 'json', label: 'Full JSON' },
            { id: 'image', label: 'Splash Icon (Redir)' },
            { id: 'stats', label: 'Stats (JSON)' },
            { id: 'q/name', label: 'Q Name' },
            { id: 'q/description', label: 'Q Desc' },
            { id: 'q/image', label: 'Q Image' },
            { id: 'w/name', label: 'W Name' },
            { id: 'w/description', label: 'W Desc' },
            { id: 'e/name', label: 'E Name' },
            { id: 'r/name', label: 'R Name' },
            { id: 'skins/default/image', label: 'Default Skin' }
        ];

        const champSelect = document.getElementById('champ-select');
        const resourceContainer = document.getElementById('resource-buttons');
        const urlOutput = document.getElementById('url-output');
        const previewArea = document.getElementById('preview-area');
        const contentViewer = document.getElementById('content-viewer');

        let currentChamp = '';
        let currentResource = '';

        champSelect.addEventListener('change', (e) => {
            currentChamp = e.target.value;
            renderResources();
            updateUrl();
        });

        function renderResources() {
            resourceContainer.innerHTML = '';
            RESOURCES.forEach(res => {
                const btn = document.createElement('div');
                btn.className = 'resource-btn';
                btn.textContent = res.label;
                btn.onclick = () => selectResource(btn, res.id);
                resourceContainer.appendChild(btn);
            });
        }

        function selectResource(btn, resourceId) {
            document.querySelectorAll('.resource-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentResource = resourceId;
            updateUrl();
            fetchPreview();
        }

        function updateUrl() {
            if(!currentChamp) return;
            const res = currentResource ? \`/\${currentResource}\` : '';
            const fullPath = \`/v1/\${currentChamp}\${res}\`;
            urlOutput.textContent = fullPath;
        }

        async function fetchPreview() {
            if(!currentChamp || !currentResource) return;
            previewArea.style.display = 'block';
            const path = urlOutput.textContent;
            
            // Because we are serving locally or on pages, we use relative link
            const validUrl = '.' + path; 

            contentViewer.innerHTML = '<div style="color:var(--hextech-blue)">Loading...</div>';

            // Check if Image
            if(currentResource.includes('image')) {
                // Since it's a redirect, we might want to show a link or try to load it in iframe
                // But for redirect endpoints (html meta refresh), iframe works
                 contentViewer.innerHTML = \`<iframe src="\${validUrl}" frameborder="0"></iframe>\`;
                 return;
            }

            try {
                const resp = await fetch(validUrl);
                if(currentResource.includes('json') || currentResource.includes('stats')) {
                    const json = await resp.json();
                    contentViewer.innerHTML = \`<pre>\${JSON.stringify(json, null, 2)}</pre>\`;
                } else {
                    const text = await resp.text();
                    contentViewer.innerHTML = \`<pre>\${text}</pre>\`;
                }
            } catch(e) {
                contentViewer.textContent = "Error loading content: " + e;
            }
        }

        function copyUrl() {
            const url = window.location.origin + urlOutput.textContent;
            navigator.clipboard.writeText(url);
            alert('Copied absolute URL: ' + url);
        }
    </script>
</body>
</html>`;

    await fs.outputFile(path.join(basePath, 'index.html'), html.trim());
}

function slugify(text: string): string {
    return text.toLowerCase()
        .replace(/[']/g, '') // Remove apostrophes
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export async function generateStaticApi(version: string, data: Champion[], basePath: string = DIST_ROOT) {
  await fs.emptyDir(basePath);
  await fs.outputFile(path.join(basePath, '.nojekyll'), '');
  await write404Page(basePath);
  await writeLandingPage(basePath, data);

  const versionedPath = path.join(basePath, 'v1');
  console.log(`Generating Static API at ${versionedPath}...`);

  for (const champ of data) {
    const champId = champ.id.toLowerCase();
    const champPath = path.join(versionedPath, champId);

    await writeEndpoint(path.join(champPath, 'name'), champ.name);
    await writeEndpoint(path.join(champPath, 'title'), champ.title);
    await writeEndpoint(path.join(champPath, 'lore'), champ.lore);
    await writeEndpoint(path.join(champPath, 'blurb'), champ.blurb);
    await writeEndpoint(path.join(champPath, 'parttype'), champ.partype);
    
    await writeJsonEndpoint(path.join(champPath, 'stats'), champ.stats);
    await writeJsonEndpoint(path.join(champPath, 'allytips'), champ.allytips);
    await writeJsonEndpoint(path.join(champPath, 'enemytips'), champ.enemytips);
    await writeJsonEndpoint(path.join(champPath, 'tags'), champ.tags);
    await writeJsonEndpoint(path.join(champPath, 'json'), champ);

    const champImgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`;
    await writeImageRedirect(path.join(champPath, 'image'), champImgUrl);

    const spellKeys = ['q', 'w', 'e', 'r'];
    for (let i = 0; i < champ.spells.length; i++) {
        const spell = champ.spells[i];
        const key = i < spellKeys.length ? spellKeys[i] : `s${i + 1}`; // fallback
        
        const spellPath = path.join(champPath, key);
        
        await writeEndpoint(path.join(spellPath, 'name'), spell.name);
        await writeEndpoint(path.join(spellPath, 'description'), spell.description);
        await writeEndpoint(path.join(spellPath, 'cooldown'), JSON.stringify(spell.cooldown)); // Cooldown is array
        
        const spellImgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`;
        await writeImageRedirect(path.join(spellPath, 'image'), spellImgUrl);
    }

    // Passive
    if (champ.passive) {
        const passivePath = path.join(champPath, 'passive');
        await writeEndpoint(path.join(passivePath, 'name'), champ.passive.name);
        await writeEndpoint(path.join(passivePath, 'description'), champ.passive.description);
        
        const passiveImgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${champ.passive.image.full}`;
        await writeImageRedirect(path.join(passivePath, 'image'), passiveImgUrl);
    }

    // Skins
    if (champ.skins) {
        for (const skin of champ.skins) {
            const skinNameSlug = skin.name === 'default' ? 'default' : slugify(skin.name);
            const skinPath = path.join(champPath, 'skins', skinNameSlug);
            
            await writeEndpoint(path.join(skinPath, 'name'), skin.name);
            
            const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_${skin.num}.jpg`;
            await writeImageRedirect(path.join(skinPath, 'image'), splashUrl);
        }
    }
  }
}
