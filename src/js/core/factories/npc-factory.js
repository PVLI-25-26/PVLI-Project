import npcsConfig from '../../../configs/NPCs/NPC-config.json'
import { NPC } from '../../entities/NPC';

/**
 * NPC template descriptor loaded from configs/NPCs/NPC-config.json
 * (shape depends on JSON schema; commonly includes keys such as `key`, `sprite`,
 * `health`, `damage`, `behavior`, etc.)
 *
 * @typedef {Object} NPCTemplate
 * @property {string} key - Unique template key.
 * @property {string} [sprite] - Sprite key for the NPC.
 * @property {number} [health] - Base health value.
 * @property {number} [damage] - Base damage value.
 * @property {Object} [behavior] - AI/behavior configuration.
 */

/**
 * Scene object data for an NPC placed in tilemap/object layer.
 *
 * @typedef {Object} ObjSceneData
 * @property {number} x - X position in the scene.
 * @property {number} y - Y position in the scene.
 * @property {string} type - NPC type/template key (matches NPCTemplate.key).
 * @property {string|number} [id] - Optional id from the level data.
 */

/**
 * Map of NPC template key -> template object loaded from configuration.
 * @type {Map<string, NPCTemplate>}
 */
const npcTemplates = new Map();
npcsConfig.forEach(cfg =>{
    npcTemplates.set(cfg.key, cfg);
});

/**
 * Create an NPC entity in the given scene using object-layer data.
 *
 * If no template is found for objSceneData.type the function will pass undefined
 *
 * @param {Phaser.Scene} scene - The Phaser scene where the NPC will be created.
 * @param {ObjSceneData} objSceneData - Object layer data describing the NPC placement and type.
 * @returns {NPC} Constructed NPC instance.
 */
export function createNPC(scene, objSceneData){
    let npc;
    let npcTemplate = npcTemplates.get(objSceneData.type);
    npc = new NPC(scene, objSceneData.x, objSceneData.y, npcTemplate);
    return npc
}