import fs from "fs";
import axios from "axios";
import memoryManager from "../../utils/memoryUtils.js";
import { isValidAudioFile } from "../../utils/fileUtils.js";
import { getGroupLanguage } from "../../utils/language.js";

const getRandom = (ext) => {
	return memoryManager.generateTempFileName(ext);
};

// Music API base URL
const MUSIC_API_BASE = "https://musicapi.x007.workers.dev";

// Available search engines
const SEARCH_ENGINES = ["seevn", "gaama", "hunjama"];
let currentEngineIndex = 0;

const getNextEngine = () => {
	const engine = SEARCH_ENGINES[currentEngineIndex];
	currentEngineIndex = (currentEngineIndex + 1) % SEARCH_ENGINES.length;
	return engine;
};

const responses = {
	en: {
		enterName: "❌ Enter song name\n\n📝 Example: .music believer",
		searching: "🔍 Searching for:",
		downloading: "⏳ Downloading audio...",
		noResults: "❌ No songs found for:",
		tooLarge: "File too large:",
		failed: "❌ Download failed. Please try again.",
		success: "🎵"
	},
	it: {
		enterName: "❌ Inserisci il nome della canzone\n\n📝 Esempio: .music believer",
		searching: "🔍 Ricerca per:",
		downloading: "⏳ Download audio...",
		noResults: "❌ Nessuna canzone trovata per:",
		tooLarge: "File troppo grande:",
		failed: "❌ Download fallito. Riprova.",
		success: "🎵"
	}
};

export default {
	name: "ytmp3",
	aliases: ["song", "play", "music"],
	category: "downloaders",
	desc: "Download audio by song name",
	usage: ".ytmp3 <song name>",
	
	async execute(sock, msg, args) {
		const from = msg.key.remoteJid;
		const lang = getGroupLanguage(from);
		const t = responses[lang] || responses.en;

		if (!args[0]) {
			return await sock.sendMessage(from, { text: t.enterName }, { quoted: msg });
		}

		const query = args.join(" ");
		let fileDown = getRandom(".mp3");
		let title = "Unknown Song";

		try {
			// Send initial processing message
			await sock.sendMessage(from, { text: `${t.searching} *${query}*...` }, { quoted: msg });
			console.log("Song request:", query);

			// Search for the song using multiple engines
			let searchResults = null;
			let usedEngine = null;
			
			for (let i = 0; i < SEARCH_ENGINES.length; i++) {
				const engine = getNextEngine();
				try {
					console.log(`Searching with engine: ${engine}`);
					const searchUrl = `${MUSIC_API_BASE}/search?q=${encodeURIComponent(query)}&searchEngine=${engine}`;
					const response = await axios.get(searchUrl, { timeout: 10000 });
					
					if (response.data && response.data.status === 200 && response.data.response && response.data.response.length > 0) {
						searchResults = response.data.response;
						usedEngine = engine;
						console.log(`Found ${searchResults.length} results with ${engine}`);
						break;
					}
				} catch (err) {
					console.log(`Engine ${engine} failed:`, err.message);
				}
			}
			
			if (!searchResults || searchResults.length === 0) {
				return await sock.sendMessage(from, { text: `${t.noResults} *${query}*` }, { quoted: msg });
			}
			
			// Get the first result
			const song = searchResults[0];
			title = song.title || "Unknown Song";
			const songId = song.id;
			
			console.log(`Selected: ${title} (ID: ${songId})`);

			// Send downloading message
			await sock.sendMessage(from, { text: t.downloading }, { quoted: msg });

			// Fetch the audio URL
			console.log("Fetching audio URL...");
			const fetchUrl = `${MUSIC_API_BASE}/fetch?id=${songId}`;
			const fetchResponse = await axios.get(fetchUrl, { timeout: 15000 });
			
			if (!fetchResponse.data || fetchResponse.data.status !== 200 || !fetchResponse.data.response) {
				throw new Error("Could not get audio URL");
			}
			
			const audioUrl = fetchResponse.data.response;
			console.log("Got audio URL, downloading...");

			// Download the audio
			const response = await axios({
				method: 'GET',
				url: audioUrl,
				responseType: 'stream',
				timeout: 120000,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
					'Referer': 'https://www.jiosaavn.com/'
				}
			});

			// Create write stream
			const writeStream = memoryManager.createOptimizedWriteStream(fileDown);
			response.data.pipe(writeStream);

			// Wait for download to complete
			await new Promise((resolve, reject) => {
				writeStream.on("finish", () => {
					console.log("Download completed");
					resolve();
				});
				writeStream.on("error", (err) => {
					console.error("Write stream error:", err);
					reject(err);
				});
				response.data.on("error", (err) => {
					console.error("Download stream error:", err);
					reject(err);
				});
			});

			// Check if file was created and has content
			if (!fs.existsSync(fileDown)) {
				throw new Error("Audio file was not created");
			}

			const stats = fs.statSync(fileDown);
			const fileSizeMB = stats.size / 1024 / 1024;

			if (stats.size === 0) {
				throw new Error("Downloaded file is empty");
			}

			// Validate audio file
			if (!isValidAudioFile(fileDown)) {
				throw new Error("Invalid audio file generated");
			}

			if (fileSizeMB > 50) {
				throw new Error(`${t.tooLarge} ${fileSizeMB.toFixed(2)}MB (max 50MB)`);
			}

			console.log(`Audio ready: ${fileSizeMB.toFixed(2)}MB - ${title}`);

			// Send the audio file
			try {
				await sock.sendMessage(
					from,
					{
						audio: { url: fileDown },
						mimetype: "audio/mpeg",
						fileName: `${title}.mp3`,
					},
					{ quoted: msg }
				);
				console.log("Audio sent successfully");
			} catch (sendError) {
				console.error("Error sending audio:", sendError);
				throw new Error("Failed to send audio file");
			}
		} catch (err) {
			console.error("Song download error:", err);

			// Send user-friendly error message
			let errorMsg = t.failed;
			if (err.message && err.message.includes("No songs found")) {
				errorMsg = `${t.noResults} *${query}*`;
			} else if (err.message && err.message.includes("too large")) {
				errorMsg = err.message;
			} else if (err.message && err.message.includes("timeout")) {
				errorMsg = "❌ Download timeout. Please try again.";
			}

			await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
		} finally {
			// Always cleanup the temp file
			memoryManager.safeUnlink(fileDown);
		}
	}
};
