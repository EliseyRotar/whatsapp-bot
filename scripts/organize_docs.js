import fs from 'fs';
import path from 'path';

const docsStructure = {
    'docs/features': [],
    'docs/guides': [],
    'docs/api': [],
    'docs/changelog': [],
    'docs/commands': []
};

// Create directories
Object.keys(docsStructure).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Move files based on naming patterns
const rootFiles = fs.readdirSync('.');
const docFiles = rootFiles.filter(f => f.endsWith('.md') || f.endsWith('.txt'));

docFiles.forEach(file => {
    const lower = file.toLowerCase();
    let targetDir = 'docs';
    
    if (lower.includes('command') || lower.includes('cmd')) {
        targetDir = 'docs/commands';
    } else if (lower.includes('guide') || lower.includes('tutorial') || lower.includes('quick') || lower.includes('start')) {
        targetDir = 'docs/guides';
    } else if (lower.includes('api') || lower.includes('reference')) {
        targetDir = 'docs/api';
    } else if (lower.includes('changelog') || lower.includes('version') || lower.includes('update')) {
        targetDir = 'docs/changelog';
    } else if (lower.includes('feature') || lower.includes('improvement')) {
        targetDir = 'docs/features';
    }
    
    // Skip README.md
    if (file === 'README.md') return;
    
    const source = path.join('.', file);
    const dest = path.join(targetDir, file);
    
    try {
        fs.renameSync(source, dest);
        console.log(`✅ Moved ${file} -> ${targetDir}/`);
    } catch (error) {
        console.error(`❌ Error moving ${file}:`, error.message);
    }
});

console.log('\n📁 Documentation organized successfully!');
