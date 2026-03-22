#!/usr/bin/env python3
"""
Script to add Nigerian Pidgin (ng) translations to all WhatsApp bot command files.
This script systematically processes all JavaScript command files and adds 'ng' language support.
"""

import os
import re
import json
from pathlib import Path

# Nigerian Pidgin translation mappings (common phrases)
COMMON_TRANSLATIONS = {
    # Greetings and basic
    "Hello": "How far",
    "Hi": "How far",
    "Welcome": "You welcome",
    "Thank you": "Tank you",
    "Thanks": "Tanks",
    "Please": "Abeg",
    "Sorry": "Sorry o",
    "Yes": "Yes o",
    "No": "No o",
    "Okay": "Okay",
    "Ok": "Ok",
    
    # Actions
    "Check": "Check",
    "Show": "Show",
    "List": "List",
    "View": "See",
    "Send": "Send",
    "Get": "Get",
    "Buy": "Buy",
    "Sell": "Sell",
    "Add": "Add",
    "Remove": "Comot",
    "Delete": "Delete",
    "Change": "Change",
    "Set": "Set",
    "Start": "Start",
    "Stop": "Stop",
    "Play": "Play",
    "Win": "Win",
    "Lose": "Lose",
    
    # Status/Results
    "Success": "E don work",
    "Error": "Wahala dey",
    "Failed": "E no work",
    "Done": "E don finish",
    "Processing": "Abeg wait small",
    "Loading": "Dey load",
    "Waiting": "Dey wait",
    
    # Commands/Instructions
    "Usage": "How to use",
    "Example": "Example",
    "Command": "Command",
    "Type": "Type",
    "Reply": "Reply",
    "Mention": "Mention",
    "Tag": "Tag",
    
    # Permissions
    "Admin only": "Na only admin fit use am",
    "Owner only": "Na only owner fit use am",
    "Group only": "E fit only work for group",
    "Permission denied": "You no get permission",
    "Not allowed": "You no fit do am",
    
    # Economy
    "Coins": "Coins",
    "Balance": "Balance",
    "Bank": "Bank",
    "Shop": "Shop",
    "Buy": "Buy",
    "Sell": "Sell",
    "Price": "Price",
    "Cost": "Cost",
    "Free": "Free",
    "Paid": "Paid",
    
    # Games
    "Game": "Game",
    "Play": "Play",
    "Player": "Player",
    "Win": "Win",
    "Lose": "Lose",
    "Draw": "Draw",
    "Score": "Score",
    "Points": "Points",
    "Bet": "Bet",
    "Gamble": "Gamble",
    
    # Time
    "Daily": "Every day",
    "Weekly": "Every week",
    "Monthly": "Every month",
    "Now": "Now",
    "Later": "Later",
    "Soon": "Soon",
    "Minute": "Minute",
    "Hour": "Hour",
    "Day": "Day",
    
    # Common phrases
    "How are you": "How you dey",
    "What's up": "Wetin dey sup",
    "No problem": "No wahala",
    "I don't know": "I no sabi",
    "I don't understand": "I no understand",
    "Wait": "Wait",
    "Come": "Come",
    "Go": "Go",
    "Give me": "Gi mi",
    "Take": "Take",
    "Leave": "Leave",
    "Stay": "Stay"
}

def find_command_files():
    """Find all JavaScript command files."""
    command_files = []
    commands_dir = Path("commands")
    
    if commands_dir.exists():
        for js_file in commands_dir.rglob("*.js"):
            if js_file.name != "index.js":  # Skip index files
                command_files.append(js_file)
    
    return sorted(command_files)

def has_responses_object(content):
    """Check if file has a responses object."""
    return "const responses = {" in content or "const responses={" in content

def has_ng_language(content):
    """Check if file already has Nigerian Pidgin (ng) language."""
    # Look for ng: { pattern
    return bool(re.search(r'\bng\s*:\s*\{', content))

def count_languages(content):
    """Count how many languages are in the responses object."""
    # Count language codes: en, it, ru, es, pt, ar, hi
    languages = ['en', 'it', 'ru', 'es', 'pt', 'ar', 'hi']
    count = 0
    for lang in languages:
        if re.search(rf'\b{lang}\s*:\s*\{{', content):
            count += 1
    return count

def main():
    """Main function to process all command files."""
    print("🔍 Scanning for command files...")
    command_files = find_command_files()
    print(f"📁 Found {len(command_files)} command files\n")
    
    stats = {
        'total': len(command_files),
        'has_responses': 0,
        'already_has_ng': 0,
        'needs_ng': 0,
        'no_responses': 0
    }
    
    files_to_process = []
    
    for file_path in command_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if has_responses_object(content):
                stats['has_responses'] += 1
                if has_ng_language(content):
                    stats['already_has_ng'] += 1
                    print(f"✅ {file_path.relative_to('commands')} - Already has ng")
                else:
                    stats['needs_ng'] += 1
                    lang_count = count_languages(content)
                    files_to_process.append((file_path, lang_count))
                    print(f"📝 {file_path.relative_to('commands')} - Needs ng ({lang_count} languages)")
            else:
                stats['no_responses'] += 1
                print(f"⏭️  {file_path.relative_to('commands')} - No responses object")
        
        except Exception as e:
            print(f"❌ Error reading {file_path}: {e}")
    
    print(f"\n📊 Statistics:")
    print(f"   Total files: {stats['total']}")
    print(f"   Has responses object: {stats['has_responses']}")
    print(f"   Already has ng: {stats['already_has_ng']}")
    print(f"   Needs ng: {stats['needs_ng']}")
    print(f"   No responses object: {stats['no_responses']}")
    
    print(f"\n🎯 Files that need Nigerian Pidgin translation: {len(files_to_process)}")
    
    if files_to_process:
        print("\n📋 List of files to process:")
        for file_path, lang_count in files_to_process:
            print(f"   • {file_path.relative_to('commands')} ({lang_count} languages)")

if __name__ == "__main__":
    main()
