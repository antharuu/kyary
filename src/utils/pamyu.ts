import {invoke} from '@tauri-apps/api/tauri';

import {useCharacterStore} from '../stores/characterStore.ts';
import {useScenesStore} from '../stores/scenesStore.ts';

import {Character} from '../types/character.ts';
import {Action, JumpAction, MessageAction, RawAction} from '../types/scene.ts';

import {path} from '../main';

import {getIndent} from './tools.ts';

const warnMessage = `# ${'='.repeat(85)}
# This file is generated automatically with Pamyu. Do not edit this file manually.
# ${'='.repeat(85)}\n\n`;

function getOptions(character: Character): string {
    let options = '';
    const optionsKeys: (keyof Character)[] = ['color', 'what_prefix', 'what_suffix', 'who_prefix', 'who_suffix'];
    optionsKeys.forEach((key: keyof Character) => {
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

export function updateScenesScipts(): void {
    console.log('📂 Updating scenes scripts');

    // TODO: Save scenes and check if they have changed before last update
    useScenesStore().getScenes.forEach((scene) => {
        let sceneString = `${warnMessage}label ${scene._id}:\n`;
        const indent = getIndent();
        const actionsLines = getActionsLines(useScenesStore().getAllActionsOfScene(scene._id));
        sceneString += indent + actionsLines.join(`\n${indent}`);

        invoke('update_script', {
            path,
            file: 'scenes/' + scene._id + '.rpy',
            data: sceneString
        }).catch((e) => console.error(e));
    });
}

function getActionsLines(actions: Action[]): string[] {
    const actionsLines: string[] = [];

    actions.forEach((action) =>
        actionsLines.push(...getActionLines(action)));

    return actionsLines;
}

function getActionLines(action: Action): string[] {
    const lines: string[] = [];

    switch (action.type) {
        case 'message':
            lines.push(...getMessageActionLines(action));
            break;
        case 'jump':
            lines.push(...getJumpActionLines(action));
            break;
        case 'raw':
            lines.push(...getRawActionLines(action));
            break;
    }

    return lines;
}

function getRawActionLines(action: RawAction): string[] {
    if (action.code.trim().length === 0) return [];
    const lines: string[] = [];

    lines.push(...action.code.split('\n'));

    return lines;
}

function getJumpActionLines(action: JumpAction): string[] {
    const lines: string[] = [];

    if (action.sceneId) {
        lines.push(`jump ${action.sceneId}`);
    }

    return lines;
}

function getMessageActionLines(action: MessageAction): string[] {
    if (!action.character && action.message.length === 0) return [];

    const lines: string[] = [];
    const characterString = getCharacterString(action);

    if (action.message.includes('\n')) {
        lines.push(`${characterString}"""`);
        action.message.split('\n').forEach((line) => lines.push(getIndent() + line));
        lines.push('"""');
    } else {
        lines.push(`${characterString}"${action.message}"`);
    }

    return lines;
}

function getCharacterString(action: MessageAction): string {
    let characterString = '';

    if (action.character) {
        const character = useCharacterStore().getCharacterById(action.character);
        if (character) {
            characterString = character._id + ' ';
        }
    }

    return characterString;
}