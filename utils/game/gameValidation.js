/**
 * Universal game input validation utilities
 * Prevents exploits: negative bets, zero bets, float truncation, overflow
 */

/**
 * Validate bet amount with comprehensive checks
 * @param {string|number} betInput - User input for bet
 * @param {number} min - Minimum allowed bet (default: 1)
 * @param {number} max - Maximum allowed bet (default: 1,000,000,000)
 * @returns {Object} { valid: boolean, amount?: number, error?: string }
 */
export function validateBet(betInput, min = 1, max = 1000000000) {
    // Handle "all" keyword
    if (typeof betInput === 'string' && betInput.toLowerCase() === 'all') {
        return { valid: true, amount: 'all' };
    }
    
    // Parse input - use parseFloat first to catch floats, then floor
    const parsed = parseFloat(betInput);
    
    // Check if valid number
    if (isNaN(parsed) || !isFinite(parsed)) {
        return { 
            valid: false, 
            error: 'Invalid bet amount. Please enter a number.' 
        };
    }
    
    // Take absolute value to prevent negative exploit
    // Floor to prevent float truncation exploit
    const bet = Math.floor(Math.abs(parsed));
    
    // Check if zero or negative (after abs and floor)
    if (bet <= 0) {
        return { 
            valid: false, 
            error: `Minimum bet: ${min} coins` 
        };
    }
    
    // Check minimum
    if (bet < min) {
        return { 
            valid: false, 
            error: `Minimum bet: ${min} coins` 
        };
    }
    
    // Check maximum
    if (bet > max) {
        return { 
            valid: false, 
            error: `Maximum bet: ${max.toLocaleString()} coins` 
        };
    }
    
    // Check for overflow risk
    if (bet > Number.MAX_SAFE_INTEGER) {
        return { 
            valid: false, 
            error: 'Bet amount too large' 
        };
    }
    
    return { valid: true, amount: bet };
}

/**
 * Validate quantity for bulk purchases
 * @param {string|number} quantityInput - User input for quantity
 * @param {number} min - Minimum allowed quantity (default: 1)
 * @param {number} max - Maximum allowed quantity (default: 1000)
 * @returns {Object} { valid: boolean, amount?: number, error?: string }
 */
export function validateQuantity(quantityInput, min = 1, max = 1000) {
    const parsed = parseInt(quantityInput);
    
    if (isNaN(parsed) || !isFinite(parsed)) {
        return { 
            valid: false, 
            error: 'Invalid quantity. Please enter a number.' 
        };
    }
    
    // Take absolute value and floor
    const quantity = Math.floor(Math.abs(parsed));
    
    if (quantity <= 0) {
        return { 
            valid: false, 
            error: `Minimum quantity: ${min}` 
        };
    }
    
    if (quantity < min) {
        return { 
            valid: false, 
            error: `Minimum quantity: ${min}` 
        };
    }
    
    if (quantity > max) {
        return { 
            valid: false, 
            error: `Maximum quantity: ${max}` 
        };
    }
    
    return { valid: true, amount: quantity };
}

/**
 * Check for integer overflow before multiplication
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {boolean} True if multiplication would overflow
 */
export function wouldOverflow(a, b) {
    if (a === 0 || b === 0) return false;
    return Math.abs(a) > Number.MAX_SAFE_INTEGER / Math.abs(b);
}

/**
 * Safe multiplication with overflow check
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {Object} { valid: boolean, result?: number, error?: string }
 */
export function safeMultiply(a, b) {
    if (wouldOverflow(a, b)) {
        return {
            valid: false,
            error: 'Calculation would overflow. Amount too large.'
        };
    }
    
    return {
        valid: true,
        result: a * b
    };
}

/**
 * Validate position for grid-based games (like Mines)
 * @param {string} position - Position string (e.g., "A1", "B3")
 * @param {number} maxCol - Maximum column (default: 5 for A-E)
 * @param {number} maxRow - Maximum row (default: 5)
 * @returns {Object} { valid: boolean, index?: number, col?: number, row?: number, error?: string }
 */
export function validateGridPosition(position, maxCol = 5, maxRow = 5) {
    if (!position || typeof position !== 'string') {
        return { valid: false, error: 'Invalid position format' };
    }
    
    // Match pattern like A1, B3, E5
    const colLetter = String.fromCharCode(64 + maxCol); // A=65, so 64+5=E
    const pattern = new RegExp(`^([A-${colLetter}])([1-${maxRow}])$`, 'i');
    const match = position.match(pattern);
    
    if (!match) {
        return { 
            valid: false, 
            error: `Invalid position. Use format A1-${colLetter}${maxRow}` 
        };
    }
    
    const col = match[1].toUpperCase().charCodeAt(0) - 65; // A=0, B=1, etc
    const row = parseInt(match[2]) - 1; // 1=0, 2=1, etc
    
    // Double-check bounds
    if (col < 0 || col >= maxCol || row < 0 || row >= maxRow) {
        return { 
            valid: false, 
            error: 'Position out of bounds' 
        };
    }
    
    const index = row * maxCol + col;
    
    return { 
        valid: true, 
        index, 
        col, 
        row 
    };
}

/**
 * Normalize bet type string (lowercase, trim)
 * @param {string} betType - Bet type input
 * @returns {string} Normalized bet type
 */
export function normalizeBetType(betType) {
    if (!betType || typeof betType !== 'string') return '';
    return betType.toLowerCase().trim();
}

export default {
    validateBet,
    validateQuantity,
    wouldOverflow,
    safeMultiply,
    validateGridPosition,
    normalizeBetType
};
