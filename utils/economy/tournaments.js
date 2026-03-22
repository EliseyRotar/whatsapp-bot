/**
 * Tournament System
 * 
 * Provides tournament functionality for games
 * Supports single-elimination and round-robin formats
 */

import { log } from '../monitoring/loggerV2.js';
import { getUser, addCoins, removeCoins } from '../database/databaseV2.js';

// Active tournaments storage
const activeTournaments = new Map();

/**
 * Tournament class
 */
export class Tournament {
    constructor(id, options = {}) {
        this.id = id;
        this.name = options.name || 'Tournament';
        this.game = options.game || 'blackjack';
        this.format = options.format || 'single-elimination'; // or 'round-robin'
        this.entryFee = options.entryFee || 0;
        this.prizePool = 0;
        this.maxPlayers = options.maxPlayers || 8;
        this.minPlayers = options.minPlayers || 2;
        this.status = 'registration'; // registration, in-progress, completed
        this.participants = [];
        this.matches = [];
        this.currentRound = 0;
        this.winner = null;
        this.createdAt = Date.now();
        this.startedAt = null;
        this.completedAt = null;
        this.groupJid = options.groupJid;
    }
    
    /**
     * Register player for tournament
     */
    registerPlayer(jid, name) {
        if (this.status !== 'registration') {
            return {
                success: false,
                error: 'Tournament registration is closed'
            };
        }
        
        if (this.participants.length >= this.maxPlayers) {
            return {
                success: false,
                error: 'Tournament is full'
            };
        }
        
        if (this.participants.some(p => p.jid === jid)) {
            return {
                success: false,
                error: 'Already registered'
            };
        }
        
        // Check if player has enough coins for entry fee
        if (this.entryFee > 0) {
            try {
                const balance = getUser(jid).balance;
                if (balance < this.entryFee) {
                    return {
                        success: false,
                        error: `Insufficient balance. Entry fee: ${this.entryFee} coins`
                    };
                }
                
                // Deduct entry fee
                removeCoins(jid, this.entryFee);
                this.prizePool += this.entryFee;
            } catch (error) {
                log.error('Tournament registration error', error);
                return {
                    success: false,
                    error: 'Failed to process entry fee'
                };
            }
        }
        
        this.participants.push({
            jid,
            name,
            wins: 0,
            losses: 0,
            score: 0,
            eliminated: false
        });
        
        log.info('Player registered for tournament', {
            tournamentId: this.id,
            player: jid,
            participantCount: this.participants.length
        });
        
        return {
            success: true,
            position: this.participants.length
        };
    }
    
    /**
     * Start tournament
     */
    start() {
        if (this.status !== 'registration') {
            return {
                success: false,
                error: 'Tournament already started'
            };
        }
        
        if (this.participants.length < this.minPlayers) {
            return {
                success: false,
                error: `Need at least ${this.minPlayers} players to start`
            };
        }
        
        this.status = 'in-progress';
        this.startedAt = Date.now();
        
        // Generate first round matches
        if (this.format === 'single-elimination') {
            this.generateSingleEliminationMatches();
        } else {
            this.generateRoundRobinMatches();
        }
        
        log.info('Tournament started', {
            tournamentId: this.id,
            format: this.format,
            participants: this.participants.length
        });
        
        return {
            success: true,
            matches: this.getCurrentRoundMatches()
        };
    }
    
    /**
     * Generate single elimination bracket
     */
    generateSingleEliminationMatches() {
        this.currentRound = 1;
        const players = [...this.participants];
        
        // Shuffle players
        for (let i = players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [players[i], players[j]] = [players[j], players[i]];
        }
        
        // Create matches
        for (let i = 0; i < players.length; i += 2) {
            if (i + 1 < players.length) {
                this.matches.push({
                    id: this.matches.length + 1,
                    round: this.currentRound,
                    player1: players[i].jid,
                    player2: players[i + 1].jid,
                    winner: null,
                    status: 'pending'
                });
            } else {
                // Bye - player advances automatically
                this.matches.push({
                    id: this.matches.length + 1,
                    round: this.currentRound,
                    player1: players[i].jid,
                    player2: null,
                    winner: players[i].jid,
                    status: 'completed'
                });
            }
        }
    }
    
    /**
     * Generate round robin matches
     */
    generateRoundRobinMatches() {
        const players = [...this.participants];
        let matchId = 1;
        
        // Generate all possible pairings
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                this.matches.push({
                    id: matchId++,
                    round: 1,
                    player1: players[i].jid,
                    player2: players[j].jid,
                    winner: null,
                    status: 'pending'
                });
            }
        }
    }
    
    /**
     * Record match result
     */
    recordMatchResult(matchId, winnerJid) {
        const match = this.matches.find(m => m.id === matchId);
        if (!match) {
            return {
                success: false,
                error: 'Match not found'
            };
        }
        
        if (match.status === 'completed') {
            return {
                success: false,
                error: 'Match already completed'
            };
        }
        
        match.winner = winnerJid;
        match.status = 'completed';
        
        // Update participant stats
        const winner = this.participants.find(p => p.jid === winnerJid);
        const loser = this.participants.find(p => 
            p.jid === (match.player1 === winnerJid ? match.player2 : match.player1)
        );
        
        if (winner) {
            winner.wins++;
            winner.score += 3; // 3 points for win
        }
        
        if (loser) {
            loser.losses++;
            if (this.format === 'single-elimination') {
                loser.eliminated = true;
            }
        }
        
        // Check if round is complete
        const roundMatches = this.matches.filter(m => m.round === this.currentRound);
        const allComplete = roundMatches.every(m => m.status === 'completed');
        
        if (allComplete) {
            if (this.format === 'single-elimination') {
                this.advanceSingleElimination();
            } else {
                this.checkRoundRobinComplete();
            }
        }
        
        return {
            success: true,
            roundComplete: allComplete
        };
    }
    
    /**
     * Advance to next round in single elimination
     */
    advanceSingleElimination() {
        const winners = this.matches
            .filter(m => m.round === this.currentRound && m.winner)
            .map(m => m.winner);
        
        if (winners.length === 1) {
            // Tournament complete
            this.winner = winners[0];
            this.status = 'completed';
            this.completedAt = Date.now();
            this.distributePrizes();
            return;
        }
        
        // Create next round
        this.currentRound++;
        for (let i = 0; i < winners.length; i += 2) {
            if (i + 1 < winners.length) {
                this.matches.push({
                    id: this.matches.length + 1,
                    round: this.currentRound,
                    player1: winners[i],
                    player2: winners[i + 1],
                    winner: null,
                    status: 'pending'
                });
            }
        }
    }
    
    /**
     * Check if round robin is complete
     */
    checkRoundRobinComplete() {
        const allComplete = this.matches.every(m => m.status === 'completed');
        
        if (allComplete) {
            // Determine winner by score
            const sorted = [...this.participants].sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return b.wins - a.wins;
            });
            
            this.winner = sorted[0].jid;
            this.status = 'completed';
            this.completedAt = Date.now();
            this.distributePrizes();
        }
    }
    
    /**
     * Distribute prizes
     */
    distributePrizes() {
        if (this.prizePool === 0) return;
        
        // Sort participants by performance
        const sorted = [...this.participants].sort((a, b) => {
            if (b.wins !== a.wins) return b.wins - a.wins;
            return b.score - a.score;
        });
        
        // Prize distribution: 50% to winner, 30% to 2nd, 20% to 3rd
        const prizes = [
            Math.floor(this.prizePool * 0.5),
            Math.floor(this.prizePool * 0.3),
            Math.floor(this.prizePool * 0.2)
        ];
        
        for (let i = 0; i < Math.min(3, sorted.length); i++) {
            if (prizes[i] > 0) {
                addCoins(sorted[i].jid, prizes[i]);
                log.info('Tournament prize awarded', {
                    tournamentId: this.id,
                    player: sorted[i].jid,
                    position: i + 1,
                    prize: prizes[i]
                });
            }
        }
    }
    
    /**
     * Get current round matches
     */
    getCurrentRoundMatches() {
        return this.matches.filter(m => 
            m.round === this.currentRound && m.status === 'pending'
        );
    }
    
    /**
     * Get tournament status
     */
    getStatus() {
        return {
            id: this.id,
            name: this.name,
            game: this.game,
            format: this.format,
            status: this.status,
            participants: this.participants.length,
            maxPlayers: this.maxPlayers,
            entryFee: this.entryFee,
            prizePool: this.prizePool,
            currentRound: this.currentRound,
            winner: this.winner,
            matches: this.matches
        };
    }
}

/**
 * Create new tournament
 */
export function createTournament(groupJid, options) {
    const id = `${groupJid}_${Date.now()}`;
    const tournament = new Tournament(id, { ...options, groupJid });
    activeTournaments.set(id, tournament);
    
    log.info('Tournament created', {
        tournamentId: id,
        game: options.game,
        format: options.format
    });
    
    return tournament;
}

/**
 * Get tournament by ID
 */
export function getTournament(id) {
    return activeTournaments.get(id);
}

/**
 * Get active tournaments for group
 */
export function getGroupTournaments(groupJid) {
    return Array.from(activeTournaments.values())
        .filter(t => t.groupJid === groupJid && t.status !== 'completed');
}

/**
 * Delete completed tournaments older than 24 hours
 */
setInterval(() => {
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);
    
    for (const [id, tournament] of activeTournaments.entries()) {
        if (tournament.status === 'completed' && tournament.completedAt < dayAgo) {
            activeTournaments.delete(id);
            log.info('Tournament cleaned up', { tournamentId: id });
        }
    }
}, 3600000); // Clean every hour

export default {
    Tournament,
    createTournament,
    getTournament,
    getGroupTournaments
};
