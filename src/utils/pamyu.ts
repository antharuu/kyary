import {useCharacterStore} from '../stores/characterStore.ts';

import {Character} from '../types/character.ts';

const warnMessage = `# ${'='.repeat(85)}
# This file is generated automatically with Pamyu. Do not edit this file manually.
# ${'='.repeat(85)}\n\n`;

function getOptions(character: Character): string {
    let options = '';
    const optionsKeys = ['color', 'what_prefix', 'what_suffix', 'who_prefix', 'who_suffix'];
    optionsKeys.forEach((key) => {
        if (character[key]) options += `, ${key}="${character[key]}"`;
    });
    return options;
}

export function getCharactersScript(): string {
    const charactersStrings: string[] = [];

    useCharacterStore().getCharacters.forEach((character) => {
        const options = getOptions(character);
        const characterString = `define ${character._id} = Character("${character.name}"${options})`;
        charactersStrings.push(characterString);
    });
    return warnMessage + charactersStrings.join('\n');
}