export interface Card {
id  : string;
name : string;
category : 'weapon' | 'armor' | 'accessory';
level : number;
progress :number;
maxProgress :number;
image : string;
description: string;
unlocked:boolean;
requiredCardId? : string;
weaponType? :string;

}

export interface GameState{
  energy : number;
  maxEnergy: number;
  energyRegenRate: number;
  lastEnergyUpdate: number;
  cards : Card[];
  unlockedLevels : number[];

}
export interface ProgressRequest {

  cardId : string;
  clicks : number;
}


export interface ProgressResponse {
  success: boolean;              
  cardId: string;                
  newProgress: number;           
  maxProgress: number;           
  energyUsed: number;            
  remainingEnergy: number;       
  leveledUp: boolean;            
  newLevel?: number;             
  unlockedCards?: string[];      
}

export interface EnergyResponse {
  energy: number;                
  maxEnergy: number;            
  regenRate: number;             
  timeToFull: number;            
}
export interface BatchUpgradeRequest {
  cardId: string;                
  clicks: number;                
  }

  export interface BatchUpgradeResponse {
  success: boolean;             
  cardId: string;                
  newProgress: number;        
  energyUsed: number;          
  remainingEnergy: number;       
  leveledUp: boolean;            
  newLevel?: number;             
  unlockedCards?: string[];      
  error?: string;             
}