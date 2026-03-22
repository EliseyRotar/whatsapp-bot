import { ChessEngine } from './chessEngine.js';
import fs from 'fs';
import path from 'path';

const dataDir = './data';
const gamesFile = path.join(dataDir, 'chess_games.json');

// Active games in memory
const activeGames = new Map();

// Load games from file
export function loadGames() {
    try {
        if (!fs.existsSync(gamesFile)) {
            return {};
        }
        const data = JSON.parse(fs.readFileSync(gamesFile, 'utf8'));
        
        // Restore game engines
        for (const [gameId, gameData] of Object.entries(data)) {
            const engine = new ChessEngine();
            engine.board = gameData.board;
            engine.currentPlayer = gameData.currentPlayer;
            engine.moveHistory = gameData.moveHistory;
            engine.capturedPieces = gameData.capturedPieces;
            engine.kingMoved = gameData.kingMoved;
            engine.rookMoved = gameData.rookMoved;
            engine.enPassantTarget = gameData.enPassantTarget;
            engine.halfMoveClock = gameData.halfMoveClock;
            engine.fullMoveNumber = gameData.fullMoveNumber;
            
            activeGames.set(gameId, {
                engine,
                players: gameData.players,
                startTime: gameData.startTime,
                lastMoveTime: gameData.lastMoveTime
            });
        }
        
        return data;
    } catch (error) {
        console.error('[CHESS] Error loading games:', error.message);
        return {};
    }
}

// Save games to file
export function saveGames() {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const data = {};
        for (const [gameId, game] of activeGames.entries()) {
            data[gameId] = {
                board: game.engine.board,
                currentPlayer: game.engine.currentPlayer,
                moveHistory: game.engine.moveHistory,
                capturedPieces: game.engine.capturedPieces,
                kingMoved: game.engine.kingMoved,
                rookMoved: game.engine.rookMoved,
                enPassantTarget: game.engine.enPassantTarget,
                halfMoveClock: game.engine.halfMoveClock,
                fullMoveNumber: game.engine.fullMoveNumber,
                players: game.players,
                startTime: game.startTime,
                lastMoveTime: game.lastMoveTime
            };
        }
        
        fs.writeFileSync(gamesFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('[CHESS] Error saving games:', error.message);
        return false;
    }
}

// Create a new game
export function createGame(groupId, whitePlayer, blackPlayer, options = {}) {
    const gameId = groupId;
    const engine = new ChessEngine();
    
    const game = {
        engine,
        players: {
            white: whitePlayer,
            black: blackPlayer
        },
        startTime: Date.now(),
        lastMoveTime: Date.now(),
        isAI: options.isAI || false,
        aiDifficulty: options.difficulty || 'medium'
    };
    
    activeGames.set(gameId, game);
    saveGames();
    
    return game;
}

// Get active game
export function getGame(groupId) {
    return activeGames.get(groupId);
}

// Delete game
export function deleteGame(groupId) {
    activeGames.delete(groupId);
    saveGames();
}

// Check if player is in game
export function isPlayerInGame(groupId, playerId) {
    const game = getGame(groupId);
    if (!game) return false;
    return game.players.white === playerId || game.players.black === playerId;
}

// Get player color
export function getPlayerColor(groupId, playerId) {
    const game = getGame(groupId);
    if (!game) return null;
    if (game.players.white === playerId) return 'white';
    if (game.players.black === playerId) return 'black';
    return null;
}

// Check if it's player's turn
export function isPlayerTurn(groupId, playerId) {
    const game = getGame(groupId);
    if (!game) return false;
    const playerColor = getPlayerColor(groupId, playerId);
    return playerColor === game.engine.currentPlayer;
}

// Update last move time
export function updateMoveTime(groupId) {
    const game = getGame(groupId);
    if (game) {
        game.lastMoveTime = Date.now();
        saveGames();
    }
}

// Get game duration
export function getGameDuration(groupId) {
    const game = getGame(groupId);
    if (!game) return 0;
    return Date.now() - game.startTime;
}

// Format duration
export function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

// Clean up old games (older than 24 hours with no moves)
export function cleanupOldGames() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [gameId, game] of activeGames.entries()) {
        if (now - game.lastMoveTime > maxAge) {
            activeGames.delete(gameId);
        }
    }
    
    saveGames();
}

// Initialize on load
loadGames();
