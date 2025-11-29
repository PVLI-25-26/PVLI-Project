import npcsConfig from '../../../configs/NPCs/NPC-config.json'
import { NPC } from '../../entities/NPC';

const npcTemplates = new Map();
npcsConfig.forEach(cfg =>{
    npcTemplates.set(cfg.key, cfg);
});

export function createNPC(scene, objSceneData){
    let npc;
    let npcTemplate = npcTemplates.get(objSceneData.type);
    npc = new NPC(scene, objSceneData.x, objSceneData.y, npcTemplate);
    return npc
}