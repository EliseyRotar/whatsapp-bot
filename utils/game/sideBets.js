// Side bet utilities for blackjack

// Check Perfect Pairs side bet
// Pays: Perfect Pair (same suit) 25:1, Colored Pair (same color) 12:1, Mixed Pair (different color) 6:1
export function checkPerfectPairs(playerHand) {
    if (playerHand.length !== 2) return null;
    
    const card1 = playerHand[0];
    const card2 = playerHand[1];
    
    // Check if ranks match
    if (card1.rank !== card2.rank) return null;
    
    // Perfect Pair - same suit
    if (card1.suit === card2.suit) {
        return { type: 'perfect', payout: 25 };
    }
    
    // Colored Pair - same color (both red or both black)
    const redSuits = ['♥️', '♦️'];
    const card1Red = redSuits.includes(card1.suit);
    const card2Red = redSuits.includes(card2.suit);
    
    if (card1Red === card2Red) {
        return { type: 'colored', payout: 12 };
    }
    
    // Mixed Pair - different colors
    return { type: 'mixed', payout: 6 };
}

// Check 21+3 side bet (poker-style combinations with player's 2 cards + dealer's up card)
// Pays: Suited Trips 100:1, Straight Flush 40:1, Three of a Kind 30:1, Straight 10:1, Flush 5:1
export function check21Plus3(playerHand, dealerUpCard) {
    if (playerHand.length !== 2) return null;
    
    const cards = [playerHand[0], playerHand[1], dealerUpCard];
    const ranks = cards.map(c => c.rank);
    const suits = cards.map(c => c.suit);
    
    // Helper to get numeric value for straights
    const getRankValue = (rank) => {
        if (rank === 'A') return 1; // Ace can be 1 or 14
        if (rank === 'J') return 11;
        if (rank === 'Q') return 12;
        if (rank === 'K') return 13;
        return parseInt(rank);
    };
    
    const values = ranks.map(getRankValue).sort((a, b) => a - b);
    
    // Check for flush (all same suit)
    const isFlush = suits.every(s => s === suits[0]);
    
    // Check for three of a kind
    const isThreeOfKind = ranks.every(r => r === ranks[0]);
    
    // Check for straight
    let isStraight = false;
    // Normal straight
    if (values[1] === values[0] + 1 && values[2] === values[1] + 1) {
        isStraight = true;
    }
    // Ace-high straight (Q-K-A)
    if (values[0] === 1 && values[1] === 12 && values[2] === 13) {
        isStraight = true;
    }
    
    // Suited Trips (three of a kind + flush)
    if (isThreeOfKind && isFlush) {
        return { type: 'suitedTrips', payout: 100 };
    }
    
    // Straight Flush
    if (isStraight && isFlush) {
        return { type: 'straightFlush', payout: 40 };
    }
    
    // Three of a Kind
    if (isThreeOfKind) {
        return { type: 'threeOfKind', payout: 30 };
    }
    
    // Straight
    if (isStraight) {
        return { type: 'straight', payout: 10 };
    }
    
    // Flush
    if (isFlush) {
        return { type: 'flush', payout: 5 };
    }
    
    return null;
}

// Get side bet result text
export function getSideBetText(betType, result, lang = 'en') {
    const texts = {
        en: {
            perfectPairs: {
                perfect: '💎 PERFECT PAIR! 💎',
                colored: '🎨 COLORED PAIR! 🎨',
                mixed: '🎭 MIXED PAIR! 🎭'
            },
            '21plus3': {
                suitedTrips: '👑 SUITED TRIPS! 👑',
                straightFlush: '🔥 STRAIGHT FLUSH! 🔥',
                threeOfKind: '💪 THREE OF A KIND! 💪',
                straight: '📈 STRAIGHT! 📈',
                flush: '♠️ FLUSH! ♠️'
            }
        },
        it: {
            perfectPairs: {
                perfect: '💎 COPPIA PERFETTA! 💎',
                colored: '🎨 COPPIA COLORATA! 🎨',
                mixed: '🎭 COPPIA MISTA! 🎭'
            },
            '21plus3': {
                suitedTrips: '👑 TRIS STESSO SEME! 👑',
                straightFlush: '🔥 SCALA COLORE! 🔥',
                threeOfKind: '💪 TRIS! 💪',
                straight: '📈 SCALA! 📈',
                flush: '♠️ COLORE! ♠️'
            }
        },
        ru: {
            perfectPairs: {
                perfect: '💎 ИДЕАЛЬНАЯ ПАРА! 💎',
                colored: '🎨 ЦВЕТНАЯ ПАРА! 🎨',
                mixed: '🎭 СМЕШАННАЯ ПАРА! 🎭'
            },
            '21plus3': {
                suitedTrips: '👑 ТРИ ОДИНАКОВЫХ МАСТИ! 👑',
                straightFlush: '🔥 СТРИТ-ФЛЕШ! 🔥',
                threeOfKind: '💪 ТРИ ОДИНАКОВЫХ! 💪',
                straight: '📈 СТРИТ! 📈',
                flush: '♠️ ФЛЕШ! ♠️'
            }
        }
    };
    
    return texts[lang]?.[betType]?.[result.type] || '';
}
