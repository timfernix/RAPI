# League of Legends Static API

A daily-updated, file-based API for League of Legends champion data. 
Designed to be served with zero backend logic.

![Hextech Header](https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Heimerdinger_0.jpg)

## 🚀 How it Works

1. **Daily Cron Job**: A GitHub Action runs every day at midnight (UTC).
2. **Fetch Data**: It queries the official Riot [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) 
3. **Generate Files**: It processes the JSON and generates a static filesystem structure.
4. **Deploy**: The resulting `docs/` folder is pushed to the `gh-pages` branch (or served directly).

## 🗺️ API Structure

The API is structured as a directory tree of resources. Access data by simply navigating to the URL.

**Base URL**: `https://<username>.github.io/<repo>/v1/`

### Example Endpoints (Champion: Aatrox)

| Resource | URL Path | Type | Description |
| :--- | :--- | :--- | :--- |
| **Name** | `/v1/aatrox/name` | Text | "Aatrox" |
| **Title** | `/v1/aatrox/title` | Text | "the Darkin Blade" |
| **Lore** | `/v1/aatrox/lore` | Text | Full lore paragraph. |
| **JSON** | `/v1/aatrox/json` | JSON | Complete champion object. |
| **Image** | `/v1/aatrox/image` | Redirect | Redirects to the official CDN square image. |
| **Stats** | `/v1/aatrox/stats` | JSON | Base stats (HP, AD, etc.). |
| **Q Name** | `/v1/aatrox/q/name` | Text | "The Darkin Blade" |
| **Skin Image** | `/v1/aatrox/skins/justicar/image` | Redirect | Splash art for Justicar skin. |

## 🛠️ URL Builder

Visit the **Index Page** (e.g., `https://<your-site>/`) to use the interactive **URL Builder**.

- Select a champion.
- Click a resource type.
- Instant `live preview` of the data.
- Copy the absolute URL.

### Project Structure

- `src/fetchers/`: Handles fetching data from Riot/DDragon.
- `src/generators/`: Logic for creating the folder structure and HTML files.
- `src/core/`: TypeScript interfaces.

## 📄 Info

This project is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
