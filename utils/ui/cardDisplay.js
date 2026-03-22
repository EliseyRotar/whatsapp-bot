// Enhanced card display with better graphics

// Get card color based on suit
function getCardColor(suit) {
    const redSuits = ['♥️', '♦️'];
    return redSuits.includes(suit) ? 'red' : 'black';
}

// Format a single card with enhanced graphics
export function formatCard(card, hidden = false) {
    if (hidden) {
        return [
            '┌─────────┐',
            '│░░░░░░░░░│',
            '│░░░░░░░░░│',
            '│░░░🎴░░░░│',
            '│░░░░░░░░░│',
            '│░░░░░░░░░│',
            '└─────────┘'
        ];
    }
    
    const rank = card.rank;
    const suit = card.suit;
    
    // Pad rank to ensure alignment (single char gets space, double char stays as is)
    const topRank = rank.length === 1 ? rank + ' ' : rank;
    const bottomRank = rank.length === 1 ? ' ' + rank : rank;
    
    // Create card with rank and suit
    return [
        '┌─────────┐',
        `│${topRank}       │`,
        '│         │',
        `│    ${suit}    │`,
        '│         │',
        `│       ${bottomRank}│`,
        '└─────────┘'
    ];
}

// Format multiple cards side by side
export function formatHand(cards, hideFirst = false) {
    if (cards.length === 0) return [];
    
    const cardGraphics = cards.map((card, index) => {
        if (index === 0 && hideFirst) {
            return formatCard(card, true);
        }
        return formatCard(card, false);
    });
    
    // Combine cards side by side
    const lines = [];
    for (let i = 0; i < 7; i++) {
        const line = cardGraphics.map(card => card[i]).join(' ');
        lines.push(line);
    }
    
    return lines.join('\n');
}

// Get hand display with cards and total
export function getHandDisplay(hand, total, label, hideFirst = false) {
    const cards = formatHand(hand, hideFirst);
    
    let display = `${label}\n${cards}\n`;
    
    if (hideFirst && hand.length > 1) {
        // When hideFirst is true, first card is hidden, so show second card's value
        // The 'total' parameter should already be calculated correctly by the caller
        display += `📊 Total: ${total}+ (hidden)`;
    } else {
        display += `📊 Total: ${total}`;
        
        // Add status indicators
        if (total === 21 && hand.length === 2) {
            display += ' ⭐ BLACKJACK!';
        } else if (total > 21) {
            display += ' 💥 BUST!';
        } else if (total >= 17 && total <= 20) {
            display += ' 🔥';
        }
    }
    
    return display;
}

// Compact card display for multi-hand (smaller cards)
export function formatCardCompact(card, hidden = false) {
    if (hidden) {
        return [
            '┌─────┐',
            '│░🎴░│',
            '└─────┘'
        ];
    }
    
    const rank = card.rank;
    const suit = card.suit;
    
    // Format: rank + suit, padded to fit
    const cardStr = rank.length === 1 ? `${rank} ${suit}` : `${rank}${suit}`;
    
    return [
        '┌─────┐',
        `│${cardStr.padEnd(5, ' ')}│`,
        '└─────┘'
    ];
}

// Format multiple cards compactly
export function formatHandCompact(cards, hideFirst = false) {
    if (cards.length === 0) return [];
    
    const cardGraphics = cards.map((card, index) => {
        if (index === 0 && hideFirst) {
            return formatCardCompact(card, true);
        }
        return formatCardCompact(card, false);
    });
    
    // Combine cards side by side
    const lines = [];
    for (let i = 0; i < 3; i++) {
        const line = cardGraphics.map(card => card[i]).join(' ');
        lines.push(line);
    }
    
    return lines.join('\n');
}

// Get compact hand display
export function getHandDisplayCompact(hand, total, label, hideFirst = false) {
    const cards = formatHandCompact(hand, hideFirst);
    
    let display = `${label}\n${cards}\n`;
    
    if (hideFirst && hand.length > 1) {
        let visibleTotal = 0;
        const firstCard = hand[0];
        if (firstCard.rank === 'A') visibleTotal = 11;
        else if (['J', 'Q', 'K'].includes(firstCard.rank)) visibleTotal = 10;
        else visibleTotal = parseInt(firstCard.rank);
        
        display += `📊 ${visibleTotal}+`;
    } else {
        display += `📊 ${total}`;
        
        if (total === 21 && hand.length === 2) {
            display += ' ⭐';
        } else if (total > 21) {
            display += ' 💥';
        } else if (total >= 17 && total <= 20) {
            display += ' 🔥';
        }
    }
    
    return display;
}
