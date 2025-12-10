import { Bar } from "../elements/bar.js";  
import { CombatText } from "../elements/combat-text.js";
import {Button} from "../elements/button.js";
import Colors from "../../../configs/colors-config.js";
import { MissionInfoDisplay } from "../elements/missionInfoDisplay.js";

import dungeonConfig from "../../../configs/Dungeon/dungeon.json";
import { getTiledMapLayer } from "../../core/tiled-parser.js";
import { EventBus } from "../../core/event-bus.js";

export class HudView {
    constructor(scene) {
        this.scene = scene;
        // Health Bars
        this.playerHealthBar = null;
        this.bossHealthBar = null;
        this.enemyHealthBars = new Map();
        
        // Gold
        this.goldSprite = null;
        this.goldText = null;

        // Abilities
        this.abilityBackground = null;
        this.abilitySprite = null;
        this.abilityCooldown = null;
        
        // Arrows
        this.normalArrowBackground = null;
        this.specialArrowBackground = null;
        this.normalArrowSprite = null;
        this.specialArrowSprite = null;
        // Arrows pos (could be moved to constants)
        this.selectedArrowX = this.scene.cameras.main.width - 100;
        this.selectedArrowY = this.scene.cameras.main.height - 150;
        this.unselectedArrowX = this.scene.cameras.main.width - 150;
        this.unselectedArrowY = this.scene.cameras.main.height - 100;
        // Flag to know which is active easily
        this.isNormalArrowSelected = true;
        
        // Missions
        this.missionsTitle = null;
        this.noMissionsText = null;
        this.missionDisplays = [];
        
        // Minimap
        this.minimapCam = null;
        this.minimapBG = null;
        this.minimapTitle = null;
        this.isMinimapHidden = false;
    }
// To DO:
/*
- indicador de flechas como objeto encopsulado(cajita de flecha)
*/
    setPresenter(presenter) {
        this.presenter = presenter;
    }

    createMinimap(rooms, paths, currentRoomID){
        const margins = 25;
        const camPosX = -10000;
        const camPosY = -10000;
        const mapZoom = 2;
        const minimapWidth = 200;
        const minimapHeight = 150;
        const minimapX = 0 + margins;
        const minimapY = this.scene.scale.height - minimapHeight - margins;

        this.minimapTitle = this.scene.add.text(minimapX, minimapY-10, 'Map',{
            fontFamily: 'FableFont',
            fontSize: 20,
            color: Colors.Red
        }).setOrigin(0,1);
        this.scene.hudLayer.add(this.minimapTitle);
        this.minimapTitle.setScrollFactor(0);


        this.minimapBG = this.scene.add.nineslice(minimapX-6, minimapY-6, "UIbackground", 0, (minimapWidth+12)/2, (minimapHeight+12)/2, 3,3,3,3).setScale(2).setOrigin(0);
        this.scene.hudLayer.add(this.minimapBG);
        this.minimapBG.setScrollFactor(0);

        this.minimapCam = this.scene.cameras.add(minimapX, minimapY, minimapWidth, minimapHeight);
        this.minimapCam.setBackgroundColor(Colors.DarkBrown);
        this.minimapCam.setScroll(camPosX, camPosY);
        this.minimapCam.ignore(this.scene.hudLayer);

        paths.forEach((path)=>{
            const from = rooms.get(path.from);
            const to = rooms.get(path.to);
            const line = this.scene.add.line(0, 0, camPosX + from.x*mapZoom, camPosY + from.y*mapZoom, 
                                                    camPosX + to.x*mapZoom, camPosY + to.y*mapZoom,
                                            Colors.LightBrownHex, 1).setOrigin(0).setLineWidth(5);
        })
        
        for (const [id, room] of rooms) {
            const circ = this.scene.add.circle(camPosX + room.x*mapZoom, camPosY + room.y*mapZoom, 4*mapZoom, Colors.WhiteHex);
            if(id == currentRoomID){
                this.minimapCam.setScroll(circ.x - this.minimapCam.width/2, circ.y - this.minimapCam.height/2)
                circ.setFillStyle(Colors.RedHex);
            }
        }

        EventBus.on('cameraRotated',(R)=>{
            this.minimapCam.rotation = R;
        });
    }

    toggleMinimap(){
        this.scene.tweens.add({
            targets: [this.minimapBG, this.minimapCam, this.minimapTitle],
            x: `${this.isMinimapHidden?'+':'-'}=${this.minimapBG.width*2+25}`,
            duration: 200,
            ease: 'Quad'
        })
        this.isMinimapHidden = !this.isMinimapHidden;

    }

    createPlayerHealthBar() {
        const x = 50;
        const y = 40;

        this.playerHealthBar = new Bar(this.scene, x, y, 300, 25, Colors.RedHex);
        this.scene.hudLayer.add(this.playerHealthBar);
        this.playerHealthBar.setScrollFactor(0);
    }

    createBossHealthBar() {
        const x = 200;
        const y = 540;

        this.bossHealthBar = new Bar(this.scene, x, y, 400, 25, Colors.RedHex);
        this.scene.hudLayer.add(this.bossHealthBar);
        this.bossHealthBar.setScrollFactor(0);
    }

    createEnemyHealthBar(enemy) {
        const x = enemy.x - 50;
        const y = enemy.y - 40;
        const enemyHealthBar = new Bar(this.scene, x, y, 100, 10, Colors.RedHex);
        this.enemyHealthBars.set(enemy, enemyHealthBar);
        enemyHealthBar.setScrollFactor(0);
        this.scene.hudLayer.add(enemyHealthBar);
    }

    createCombatText(x, y, amount, isHeal = false) {
        const combatText = new CombatText(this.scene, x, y, amount, isHeal);
        combatText.setScrollFactor(0);
        this.scene.hudLayer.add(combatText);
    }

    deleteEnemyHealthBar(enemy) {
        if (this.enemyHealthBars.has(enemy)) {
            this.enemyHealthBars.get(enemy).destroy();
            this.enemyHealthBars.delete(enemy);
        }
    }   

    createGoldIndicator(gold){
        const x = this.scene.cameras.main.width - 50;
        const y = 45;

        // Create Gold Sprite icon
        this.goldSprite = this.scene.add.image(x, y, 'gold', 0).setOrigin(1).setScale(2);
        this.scene.hudLayer.add(this.goldSprite);
        this.goldSprite.setScrollFactor(0);

        // Set item gold value text
        this.goldText = this.scene.add.text(this.goldSprite.x-this.goldSprite.width-10, this.goldSprite.y, gold, {
            color: Colors.Orange,
            fontSize: 10,
            fontFamily: 'MicroChat'
        }).setOrigin(1,1);
        this.scene.hudLayer.add(this.goldText);
        this.goldText.setScrollFactor(0);
    }

    updateGoldIndicator(prevValue, newValue){
        // Tween gold number to increase
        const prevGoldText = prevValue;
        this.scene.tweens.addCounter({
            targets: this.goldText,
            text: newValue,
            duration: 1000,
            ease: 'Cubic.easeInOut',
            onUpdate: (tween, target, key, current, prev, param)=>{
                this.goldText.setText((Number(prevGoldText) + Math.round(current*(Number(newValue)-Number(prevGoldText)))));
            },
            onComplete: (tween)=>{
                tween.destroy(true);
                this.goldText.setText(newValue);
            }
        });
        
        // Show amount added below indicator
        const addedGold = Number(newValue)-Number(prevGoldText);
        const addedGoldIndicator = this.scene.add.text(this.goldText.x, this.goldText.y+this.goldText.height, 
            (addedGold<=0?"":"+") + addedGold, 
        {
            color: Colors.Orange,
            fontSize: 10,
            fontFamily: 'MicroChat'
        }).setOrigin(1,1);
        this.scene.hudLayer.add(addedGoldIndicator);
        addedGoldIndicator.setScrollFactor(0);

        this.scene.tweens.add({
            targets: addedGoldIndicator,
            y: '+=20',
            duration: 700,
            yoyo: true,
            ease: 'Power2',
        });
        this.scene.tweens.add({
            targets: addedGoldIndicator,
            delay: 1000,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: (tween)=>{
                tween.destroy;
                addedGoldIndicator.destroy(true);
            }
        });
    }

    shakeGold(){
        this.goldText.setColor(Colors.Red);
        this.scene.tweens.add({
            targets: this.goldText,
            x:  this.goldText.x-10,
            duration: 50,
            ease: 'Linear',
            repeat: 5,
            yoyo: true,
            onComplete: ()=>{
                this.goldText.setColor(Colors.White);
            }
        })
    }

    createAbilityIndicator(abilityKey){
        const x = this.scene.cameras.main.width - 100;
        const y = this.scene.cameras.main.height - 250;

        if(!this.abilityBackground){
            this.abilityBackground = new Button(this.scene, x, y, null, 40, 40, null, {
                texture: 'UIbackground',
                frame: 0,
                leftWidth: 3,
                rightWidth: 3,
                topHeight: 3,
                bottomHeight: 3
            });
            this.abilityBackground.setScale(2);
            this.scene.hudLayer.add(this.abilityBackground);
            this.abilityBackground.setScrollFactor(0);

            this.abilityCooldown = this.scene.add.rectangle(x+6, y+6, 34, 0, Colors.RedHex)
                .setOrigin(0)
                .setScale(2);
            this.scene.hudLayer.add(this.abilityCooldown);
            this.abilityCooldown.setScrollFactor(0);
        }

        if(this.abilitySprite){
            this.abilitySprite.destroy(true);
        }
        if(abilityKey){
            this.abilitySprite = this.scene.add.sprite(this.abilityBackground.x+this.abilityBackground.buttonNineslice.width, this.abilityBackground.y+this.abilityBackground.buttonNineslice.height, abilityKey, 0).setOrigin(0.5);
            this.abilitySprite.setScale(2);
            this.scene.hudLayer.add(this.abilitySprite);
            this.abilitySprite.setScrollFactor(0);
        }
    }

    abilityTriggered(coolDown){
        this.abilityCooldown.height = 0;
        this.abilityCooldown.alpha = 1;
        this.scene.tweens.add({
            targets: this.abilityCooldown,
            height: 34,
            duration: coolDown,
            ease: 'Linear',
            onComplete: ()=>{
                this.scene.tweens.add({
                    targets: this.abilityCooldown,
                    alpha: 0,
                    duration: 100,
                    ease: 'Linear'
                });
            }
        })
    }

    createArrowIndicators(specialArrowTexture){

        // Create normal arrow background, special arrow background, and normal arrowsprite (these never change)
        if(!this.normalArrowBackground){
            // Normal arrow BG
            this.normalArrowBackground = new Button(this.scene, this.selectedArrowX, this.selectedArrowY, null, 40, 40, null, {
                texture: 'UIbackground',
                frame: 0,
                leftWidth: 3,
                rightWidth: 3,
                topHeight: 3,
                bottomHeight: 3
            });
            this.normalArrowBackground.setScale(2);
            this.scene.hudLayer.add(this.normalArrowBackground);
            this.normalArrowBackground.setScrollFactor(0);

            // Normal arrow
            this.normalArrowSprite = this.scene.add.sprite(this.normalArrowBackground.x+this.normalArrowBackground.buttonNineslice.width, this.normalArrowBackground.y+this.normalArrowBackground.buttonNineslice.height, 'arrow', 0)
                .setAngle(-45)
                .setOrigin(0.5)
                .setScale(2);
            this.scene.hudLayer.add(this.normalArrowSprite);
            this.normalArrowSprite.setScrollFactor(0);

            // Special arrow BG
            this.specialArrowBackground = new Button(this.scene, this.unselectedArrowX, this.unselectedArrowY, null, 40, 40, null, {
                texture: 'UIbackground',
                frame: 0,
                leftWidth: 3,
                rightWidth: 3,
                topHeight: 3,
                bottomHeight: 3
            }).setDepth(this.normalArrowBackground.depth-10);
            this.specialArrowBackground.setScale(2);
            this.scene.hudLayer.add(this.specialArrowBackground);
            this.specialArrowBackground.setScrollFactor(0);
        }

        
        // Special arrow
        if(this.specialArrowSprite){
            this.specialArrowSprite.destroy(true);
        }        
        this.specialArrowSprite = this.scene.add.sprite(this.specialArrowBackground.x+this.specialArrowBackground.buttonNineslice.width, this.specialArrowBackground.y+this.specialArrowBackground.buttonNineslice.height, specialArrowTexture, 0)
                .setAngle(-45)
                .setOrigin(0.5)
                .setScale(2)
                .setDepth(this.specialArrowBackground.depth+0.1);
        this.scene.hudLayer.add(this.specialArrowSprite);
        this.specialArrowSprite.setScrollFactor(0);
    }

    switchArrowIndicators(){
        this.isNormalArrowSelected = !this.isNormalArrowSelected;

        // Update elements depths
        if(!this.isNormalArrowSelected){
            this.specialArrowBackground.depth += 11;
            if(this.specialArrowSprite) this.specialArrowSprite.depth = this.specialArrowBackground.depth+0.1;
        }
        else{
            this.specialArrowBackground.depth -= 11;
            if(this.specialArrowSprite) this.specialArrowSprite.depth = this.specialArrowBackground.depth+0.1;
        }

        // Tween elements
        this.scene.tweens.add({
            targets: this.specialArrowBackground,
            x: this.isNormalArrowSelected?this.unselectedArrowX:this.selectedArrowX,
            y: this.isNormalArrowSelected?this.unselectedArrowY:this.selectedArrowY,
            duration: 200,
            ease: 'Quad'
        });
        if(this.specialArrowSprite){
            this.scene.tweens.add({
                targets: this.specialArrowSprite,
                x: this.isNormalArrowSelected?this.unselectedArrowX+this.specialArrowBackground.buttonNineslice.width:this.selectedArrowX+this.specialArrowBackground.buttonNineslice.width,
                y: this.isNormalArrowSelected?this.unselectedArrowY+this.specialArrowBackground.buttonNineslice.height:this.selectedArrowY+this.specialArrowBackground.buttonNineslice.height,
                duration: 200,
                ease: 'Quad'
            });
        }
        this.scene.tweens.add({
            targets: this.normalArrowBackground,
            x: this.isNormalArrowSelected?this.selectedArrowX:this.unselectedArrowX,
            y: this.isNormalArrowSelected?this.selectedArrowY:this.unselectedArrowY,
            duration: 200,
            ease: 'Quad'
        });
        this.scene.tweens.add({
            targets: this.normalArrowSprite,
            x: this.isNormalArrowSelected?this.selectedArrowX+this.normalArrowBackground.buttonNineslice.width:this.unselectedArrowX+this.normalArrowBackground.buttonNineslice.width,
            y: this.isNormalArrowSelected?this.selectedArrowY+this.normalArrowBackground.buttonNineslice.height:this.unselectedArrowY+this.normalArrowBackground.buttonNineslice.height,
            duration: 200,
            ease: 'Quad'
        });
    }

    createMissionTexts(missions, areCompleted){
        this.missionsTitle = this.scene.add.text(this.scene.cameras.main.width - 50, 75, 'Missions',{
            fontFamily: 'FableFont',
            fontSize: 20,
            color: Colors.Red
        }).setOrigin(1);

        this.scene.hudLayer.add(this.missionsTitle);
        this.missionsTitle.setScrollFactor(0);

        if(!this.noMissionsText){
            this.noMissionsText = this.scene.add.text(this.scene.cameras.main.width - 50, 100, 'No missions',{
                fontFamily: 'MicroChat',
                    fontSize: 10,
                    color: Colors.White
                }).setOrigin(1).setAlpha(0);
            this.scene.hudLayer.add(this.noMissionsText);
            this.noMissionsText.setScrollFactor(0);
        }

        missions.forEach((mission) => {
            this.addMissionText(mission, areCompleted);
        });
        
        if(this.missionDisplays.length == 0){
            this.noMissionsText.setAlpha(1);
        }
    }

    addMissionText(mission, isCompleted){
        const x = this.scene.cameras.main.width - 50;
        const y = 100;

        if(this.noMissionsText.alpha == 1){
            this.noMissionsText.setAlpha(0);
        }

        const missionDisplay = new MissionInfoDisplay(this.scene, x, y+this.missionDisplays.length*25, mission, isCompleted);
        missionDisplay.missionSummary.setOrigin(1);
        this.missionDisplays.push(missionDisplay);
        this.scene.hudLayer.add(missionDisplay);
        missionDisplay.setScrollFactor(0);
    }

    completeMission(missionIdx){
        const missionDisplay = this.missionDisplays[missionIdx];
        missionDisplay.completeMission();
    }

    removeMission(missionIdx){
        const missionDisplay = this.missionDisplays[missionIdx];
        this.missionDisplays.splice(missionIdx, 1)
        missionDisplay.remove();

        if(this.missionDisplays.length == 0){
            this.noMissionsText.setAlpha(1);
        }
    }

    updateMissionProgress(){
        this.missionDisplays.forEach((mission)=>{
            mission.updateProgress();
        })
    }
}