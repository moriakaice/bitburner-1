import { Augmentations }                        from "./Augmentation/Augmentations";
import { applyAugmentation }                    from "./Augmentation/AugmentationHelpers";
import { PlayerOwnedAugmentation }              from "./Augmentation/PlayerOwnedAugmentation";
import { AugmentationNames }                    from "./Augmentation/data/AugmentationNames";
import { BitNodeMultipliers }                   from "./BitNode/BitNodeMultipliers";
import { Bladeburner }                          from "./Bladeburner";
import { CodingContractRewardType }             from "./CodingContracts";
import { Company }                              from "./Company/Company";
import { Companies }                            from "./Company/Companies";
import { getNextCompanyPosition }               from "./Company/GetNextCompanyPosition";
import { getJobRequirementText }                from "./Company/GetJobRequirementText";
import { CompanyPositions }                     from "./Company/CompanyPositions";
import * as posNames                            from "./Company/data/CompanyPositionNames";
import {CONSTANTS}                              from "./Constants";
import { Corporation }                          from "./Corporation/Corporation";
import { Programs }                             from "./Programs/Programs";
import { determineCrimeSuccess }                from "./Crime/CrimeHelpers";
import { Crimes }                               from "./Crime/Crimes";
import {Engine}                                 from "./engine";
import { Faction }                              from "./Faction/Faction";
import { Factions }                             from "./Faction/Factions";
import { displayFactionContent }                from "./Faction/FactionHelpers";
import {Gang, resetGangs}                       from "./Gang";
import {Locations}                              from "./Locations";
import {hasBn11SF, hasWallStreetSF,hasAISF}     from "./NetscriptFunctions";
import { Sleeve }                               from "./PersonObjects/Sleeve/Sleeve";
import {AllServers, Server, AddToAllServers}    from "./Server";
import {Settings}                               from "./Settings/Settings";
import {SpecialServerIps, SpecialServerNames}   from "./SpecialServerIps";
import {SourceFiles, applySourceFile}           from "./SourceFile";
import { SourceFileFlags }                      from "./SourceFile/SourceFileFlags";
import Decimal                                  from "decimal.js";
import {numeralWrapper}                         from "./ui/numeralFormat";
import { MoneySourceTracker }                   from "./utils/MoneySourceTracker";
import {dialogBoxCreate}                        from "../utils/DialogBox";
import {clearEventListeners}                    from "../utils/uiHelpers/clearEventListeners";
import {createRandomIp}                         from "../utils/IPAddress";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver";
import {convertTimeMsToTimeElapsedString}       from "../utils/StringHelperFunctions";

const CYCLES_PER_SEC = 1000 / CONSTANTS.MilliPerCycle;

function PlayerObject() {
    //Skills and stats
    this.hacking_skill  = 1;

    //Combat stats
    this.hp             = 10;
    this.max_hp         = 10;
    this.strength       = 1;
    this.defense        = 1;
    this.dexterity      = 1;
    this.agility        = 1;

    //Labor stats
    this.charisma       = 1;

    //Special stats
    this.intelligence   = 0;

    //Hacking multipliers
    this.hacking_chance_mult    = 1;
    this.hacking_speed_mult     = 1;
    this.hacking_money_mult     = 1;
    this.hacking_grow_mult      = 1;

    //Experience and multipliers
    this.hacking_exp     = 0;
    this.strength_exp    = 0;
    this.defense_exp     = 0;
    this.dexterity_exp   = 0;
    this.agility_exp     = 0;
    this.charisma_exp    = 0;
    this.intelligence_exp= 0;

    this.hacking_mult       = 1;
    this.strength_mult      = 1;
    this.defense_mult       = 1;
    this.dexterity_mult     = 1;
    this.agility_mult       = 1;
    this.charisma_mult      = 1;

    this.hacking_exp_mult    = 1;
    this.strength_exp_mult   = 1;
    this.defense_exp_mult    = 1;
    this.dexterity_exp_mult  = 1;
    this.agility_exp_mult    = 1;
    this.charisma_exp_mult   = 1;

    this.company_rep_mult    = 1;
    this.faction_rep_mult    = 1;

    //Money
    this.money           = new Decimal(1000);

    //IP Address of Starting (home) computer
    this.homeComputer = "";

	//Location information
	this.city 			= Locations.Sector12;
	this.location 		= "";

    // Jobs that the player holds
    // Map of company name (key) -> name of company position (value. Just the name, not the CompanyPosition object)
    // The CompanyPosition name must match a key value in CompanyPositions
    this.jobs = {};

    // Company at which player is CURRENTLY working (only valid when the player is actively working)
    this.companyName = "";      // Name of Company. Must match a key value in Companies map

    //Servers
    this.currentServer          = ""; //IP address of Server currently being accessed through terminal
    this.purchasedServers       = []; //IP Addresses of purchased servers
    this.hacknetNodes           = [];

    //Factions
    this.factions = [];             //Names of all factions player has joined
    this.factionInvitations = [];   //Outstanding faction invitations

    //Augmentations
    this.queuedAugmentations = [];
    this.augmentations = [];

    this.sourceFiles = [];

    //Crime statistics
    this.numPeopleKilled = 0;
    this.karma = 0;

    this.crime_money_mult               = 1;
    this.crime_success_mult             = 1;

    //Flags/variables for working (Company, Faction, Creating Program, Taking Class)
    this.isWorking = false;
    this.workType = "";

    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";

    this.workHackExpGainRate = 0;
    this.workStrExpGainRate = 0;
    this.workDefExpGainRate = 0;
    this.workDexExpGainRate = 0;
    this.workAgiExpGainRate = 0;
    this.workChaExpGainRate = 0;
    this.workRepGainRate = 0;
    this.workMoneyGainRate = 0;
    this.workMoneyLossRate = 0;

    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;

    this.createProgramName = "";
    this.createProgramReqLvl = 0;

    this.className = "";

    this.crimeType = "";

    this.timeWorked = 0;    //in ms
    this.timeWorkedCreateProgram = 0;
    this.timeNeededToCompleteWork = 0;

    this.work_money_mult = 1;

    //Hacknet Node multipliers
    this.hacknet_node_money_mult            = 1;
    this.hacknet_node_purchase_cost_mult    = 1;
    this.hacknet_node_ram_cost_mult         = 1;
    this.hacknet_node_core_cost_mult        = 1;
    this.hacknet_node_level_cost_mult       = 1;

    //Stock Market
    this.hasWseAccount      = false;
    this.hasTixApiAccess    = false;
    this.has4SData          = false;
    this.has4SDataTixApi    = false;

    //Gang
    this.gang = 0;

    //Corporation
    this.corporation = 0;

    //Bladeburner
    this.bladeburner = 0;
    this.bladeburner_max_stamina_mult               = 1;
    this.bladeburner_stamina_gain_mult              = 1;
    this.bladeburner_analysis_mult                  = 1; //Field Analysis Only
    this.bladeburner_success_chance_mult            = 1;

    // Sleeves & Re-sleeving
    this.sleeves = [];
    this.resleeves = [];
    this.sleevesFromCovenant = 0; // # of Duplicate sleeves purchased from the covenant

    //bitnode
    this.bitNodeN = 1;

    //Flags for determining whether certain "thresholds" have been achieved
    this.firstFacInvRecvd = false;
    this.firstAugPurchased = false;
    this.firstTimeTraveled = false;
    this.firstProgramAvailable = false;

	//Used to store the last update time.
	this.lastUpdate = 0;
    this.totalPlaytime = 0;
    this.playtimeSinceLastAug = 0;
    this.playtimeSinceLastBitnode = 0;

    // Keep track of where money comes from
    this.moneySourceA = new MoneySourceTracker(); // Where money comes from since last-installed Augmentation
    this.moneySourceB = new MoneySourceTracker(); // Where money comes from for this entire BitNode run

    // Production since last Augmentation installation
    this.scriptProdSinceLastAug = 0;
};

PlayerObject.prototype.init = function() {
    /* Initialize Player's home computer */
    var t_homeComp = new Server({
        ip:createRandomIp(), hostname:"home", organizationName:"Home PC",
        isConnectedTo:true, adminRights:true, purchasedByPlayer:true, maxRam:8
    });
    this.homeComputer = t_homeComp.ip;
    this.currentServer = t_homeComp.ip;
    AddToAllServers(t_homeComp);

    this.getHomeComputer().programs.push(Programs.NukeProgram.name);
}

PlayerObject.prototype.prestigeAugmentation = function() {
    var homeComp = this.getHomeComputer();
    this.currentServer = homeComp.ip;
    this.homeComputer = homeComp.ip;

    this.numPeopleKilled = 0;
    this.karma = 0;

    //Reset stats
    this.hacking_skill = 1;

    this.strength = 1;
    this.defense = 1;
    this.dexterity = 1;
    this.agility = 1;

    this.charisma = 1;

    this.hacking_exp = 0;
    this.strength_exp = 0;
    this.defense_exp = 0;
    this.dexterity_exp = 0;
    this.agility_exp = 0;
    this.charisma_exp = 0;

    this.money = new Decimal(1000);

    this.city = Locations.Sector12;
    this.location = "";

    this.companyName = "";
    this.jobs = {};

    this.purchasedServers = [];

    this.factions = [];
    this.factionInvitations = [];

    this.queuedAugmentations = [];

    this.resleeves = [];

    for (let i = 0; i < this.sleeves.length; ++i) {
        if (this.sleeves[i] instanceof Sleeve) {
            this.sleeves[i].resetTaskStatus();
        }
    }

    this.isWorking = false;
    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";
    this.createProgramName = "";
    this.className = "";
    this.crimeType = "";

    this.workHackExpGainRate = 0;
    this.workStrExpGainRate = 0;
    this.workDefExpGainRate = 0;
    this.workDexExpGainRate = 0;
    this.workAgiExpGainRate = 0;
    this.workChaExpGainRate = 0;
    this.workRepGainRate = 0;
    this.workMoneyGainRate = 0;

    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;

    this.timeWorked = 0;

    this.lastUpdate = new Date().getTime();

    // Statistics Trackers
    this.playtimeSinceLastAug = 0;
    this.scriptProdSinceLastAug = 0;
    this.moneySourceA.reset();

    this.hacknetNodes.length = 0;

    //Re-calculate skills and reset HP
    this.updateSkillLevels();
    this.hp = this.max_hp;
}

PlayerObject.prototype.prestigeSourceFile = function() {
    var homeComp = this.getHomeComputer();
    this.currentServer = homeComp.ip;
    this.homeComputer = homeComp.ip;

    this.numPeopleKilled = 0;
    this.karma = 0;

    //Reset stats
    this.hacking_skill = 1;

    this.strength = 1;
    this.defense = 1;
    this.dexterity = 1;
    this.agility = 1;

    this.charisma = 1;

    this.hacking_exp = 0;
    this.strength_exp = 0;
    this.defense_exp = 0;
    this.dexterity_exp = 0;
    this.agility_exp = 0;
    this.charisma_exp = 0;

    this.money = new Decimal(1000);

    this.city = Locations.Sector12;
    this.location = "";

    this.companyName = "";
    this.jobs = {};

    this.purchasedServers = [];

    this.factions = [];
    this.factionInvitations = [];

    this.queuedAugmentations = [];
    this.augmentations = [];

    this.resleeves = [];

    // Duplicate sleeves are reset to level 1 every Bit Node (but the number of sleeves you have persists)
    this.sleeves.length = SourceFileFlags[10] + this.sleevesFromCovenant;
    for (let i = 0; i < this.sleeves.length; ++i) {
        this.sleeves[i] = new Sleeve();
    }

    this.isWorking = false;
    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";
    this.createProgramName = "";
    this.className = "";
    this.crimeType = "";

    this.workHackExpGainRate = 0;
    this.workStrExpGainRate = 0;
    this.workDefExpGainRate = 0;
    this.workDexExpGainRate = 0;
    this.workAgiExpGainRate = 0;
    this.workChaExpGainRate = 0;
    this.workRepGainRate = 0;
    this.workMoneyGainRate = 0;

    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;

    this.timeWorked = 0;

    this.lastUpdate = new Date().getTime();

    this.hacknetNodes.length = 0;

    //Gang
    this.gang = null;
    resetGangs();

    //Reset Stock market
    this.hasWseAccount = false;
    this.hasTixApiAccess = false;
    this.has4SData = false;
    this.has4SDataTixApi = false;

    //BitNode 3: Corporatocracy
    this.corporation = 0;

    // Statistics trackers
    this.playtimeSinceLastAug = 0;
    this.playtimeSinceLastBitnode = 0;
    this.scriptProdSinceLastAug = 0;
    this.moneySourceA.reset();
    this.moneySourceB.reset();

    this.updateSkillLevels();
    this.hp = this.max_hp;
}

PlayerObject.prototype.getCurrentServer = function() {
    return AllServers[this.currentServer];
}

PlayerObject.prototype.getHomeComputer = function() {
    return AllServers[this.homeComputer];
}

PlayerObject.prototype.getUpgradeHomeRamCost = function() {
    //Calculate how many times ram has been upgraded (doubled)
    const currentRam = this.getHomeComputer().maxRam;
    const numUpgrades = Math.log2(currentRam);

    //Calculate cost
    //Have cost increase by some percentage each time RAM has been upgraded
    const mult = Math.pow(1.58, numUpgrades);
    var cost = currentRam * CONSTANTS.BaseCostFor1GBOfRamHome * mult * BitNodeMultipliers.HomeComputerRamCost;
    return cost;
}

PlayerObject.prototype.receiveInvite = function(factionName) {
    if(this.factionInvitations.includes(factionName) || this.factions.includes(factionName)) {
        return;
    }
    this.firstFacInvRecvd = true;
    this.factionInvitations.push(factionName);
}

//Calculates skill level based on experience. The same formula will be used for every skill
PlayerObject.prototype.calculateSkill = function(exp, mult=1) {
    return Math.max(Math.floor(mult*(32 * Math.log(exp + 534.5) - 200)), 1);
}

PlayerObject.prototype.updateSkillLevels = function() {
	this.hacking_skill = Math.max(1, Math.floor(this.calculateSkill(this.hacking_exp, this.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier)));
	this.strength      = Math.max(1, Math.floor(this.calculateSkill(this.strength_exp, this.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier)));
    this.defense       = Math.max(1, Math.floor(this.calculateSkill(this.defense_exp, this.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier)));
    this.dexterity     = Math.max(1, Math.floor(this.calculateSkill(this.dexterity_exp, this.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier)));
    this.agility       = Math.max(1, Math.floor(this.calculateSkill(this.agility_exp, this.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier)));
    this.charisma      = Math.max(1, Math.floor(this.calculateSkill(this.charisma_exp, this.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier)));

    if (this.intelligence > 0) {
        this.intelligence = Math.floor(this.calculateSkill(this.intelligence_exp));
    } else {
        this.intelligence = 0;
    }

    var ratio = this.hp / this.max_hp;
    this.max_hp         = Math.floor(10 + this.defense / 10);
    Player.hp = Math.round(this.max_hp * ratio);
}

PlayerObject.prototype.resetMultipliers = function() {
    this.hacking_chance_mult    = 1;
    this.hacking_speed_mult     = 1;
    this.hacking_money_mult     = 1;
    this.hacking_grow_mult      = 1;

    this.hacking_mult       = 1;
    this.strength_mult      = 1;
    this.defense_mult       = 1;
    this.dexterity_mult     = 1;
    this.agility_mult       = 1;
    this.charisma_mult      = 1;

    this.hacking_exp_mult    = 1;
    this.strength_exp_mult   = 1;
    this.defense_exp_mult    = 1;
    this.dexterity_exp_mult  = 1;
    this.agility_exp_mult    = 1;
    this.charisma_exp_mult   = 1;

    this.company_rep_mult    = 1;
    this.faction_rep_mult    = 1;

    this.crime_money_mult       = 1;
    this.crime_success_mult     = 1;

    this.hacknet_node_money_mult            = 1;
    this.hacknet_node_purchase_cost_mult    = 1;
    this.hacknet_node_ram_cost_mult         = 1;
    this.hacknet_node_core_cost_mult        = 1;
    this.hacknet_node_level_cost_mult       = 1;

    this.work_money_mult = 1;

    this.bladeburner_max_stamina_mult               = 1;
    this.bladeburner_stamina_gain_mult              = 1;
    this.bladeburner_analysis_mult                  = 1;
    this.bladeburner_success_chance_mult            = 1;
}

PlayerObject.prototype.hasProgram = function(programName) {
    var home = Player.getHomeComputer();
    if (home == null) {return false;}

    for (var i = 0; i < home.programs.length; ++i) {
        if (programName.toLowerCase() == home.programs[i].toLowerCase()) {return true;}
    }
    return false;
}

PlayerObject.prototype.setMoney = function(money) {
    if (isNaN(money)) {
        console.log("ERR: NaN passed into Player.setMoney()"); return;
    }
    this.money = money;
}

PlayerObject.prototype.gainMoney = function(money) {
    if (isNaN(money)) {
        console.log("ERR: NaN passed into Player.gainMoney()"); return;
    }
	this.money = this.money.plus(money);
}

PlayerObject.prototype.loseMoney = function(money) {
    if (isNaN(money)) {
        console.log("ERR: NaN passed into Player.loseMoney()"); return;
    }
    this.money = this.money.minus(money);
}

PlayerObject.prototype.canAfford = function(cost) {
    if (isNaN(cost)) {
        console.error(`NaN passed into Player.canAfford()`);
        return false;
    }
    return this.money.gte(cost);
}

PlayerObject.prototype.recordMoneySource = function(amt, source) {
    if (!(this.moneySourceA instanceof MoneySourceTracker)) {
        console.warn(`Player.moneySourceA was not properly initialized. Resetting`);
        this.moneySourceA = new MoneySourceTracker();
    }
    if (!(this.moneySourceB instanceof MoneySourceTracker)) {
        console.warn(`Player.moneySourceB was not properly initialized. Resetting`);
        this.moneySourceB = new MoneySourceTracker();
    }
    this.moneySourceA.record(amt, source);
    this.moneySourceB.record(amt, source);
}

PlayerObject.prototype.gainHackingExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainHackingExp()"); return;
    }
    this.hacking_exp += exp;
    if(this.hacking_exp < 0) {
        this.hacking_exp = 0;
    }
}

PlayerObject.prototype.gainStrengthExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainStrengthExp()"); return;
    }
    this.strength_exp += exp;
    if(this.strength_exp < 0) {
        this.strength_exp = 0;
    }
}

PlayerObject.prototype.gainDefenseExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into player.gainDefenseExp()"); return;
    }
    this.defense_exp += exp;
    if(this.defense_exp < 0) {
        this.defense_exp = 0;
    }
}

PlayerObject.prototype.gainDexterityExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainDexterityExp()"); return;
    }
    this.dexterity_exp += exp;
    if(this.dexterity_exp < 0) {
        this.dexterity_exp = 0;
    }
}

PlayerObject.prototype.gainAgilityExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainAgilityExp()"); return;
    }
    this.agility_exp += exp;
    if(this.agility_exp < 0) {
        this.agility_exp = 0;
    }
}

PlayerObject.prototype.gainCharismaExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainCharismaExp()"); return;
    }
    this.charisma_exp += exp;
    if(this.charisma_exp < 0) {
        this.charisma_exp = 0;
    }
}

PlayerObject.prototype.gainIntelligenceExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERROR: NaN passed into Player.gainIntelligenceExp()"); return;
    }
    if (hasAISF || this.intelligence > 0) {
        this.intelligence_exp += exp;
    }
}

//Given a string expression like "str" or "strength", returns the given stat
PlayerObject.prototype.queryStatFromString = function(str) {
    const tempStr = str.toLowerCase();
    if (tempStr.includes("hack"))   {return Player.hacking_skill;}
    if (tempStr.includes("str"))    {return Player.strength;}
    if (tempStr.includes("def"))    {return Player.defense;}
    if (tempStr.includes("dex"))    {return Player.dexterity;}
    if (tempStr.includes("agi"))    {return Player.agility;}
    if (tempStr.includes("cha"))    {return Player.charisma;}
    if (tempStr.includes("int"))    {return Player.intelligence;}
}

/******* Working functions *******/
PlayerObject.prototype.resetWorkStatus = function() {
    this.workHackExpGainRate    = 0;
    this.workStrExpGainRate     = 0;
    this.workDefExpGainRate     = 0;
    this.workDexExpGainRate     = 0;
    this.workAgiExpGainRate     = 0;
    this.workChaExpGainRate     = 0;
    this.workRepGainRate        = 0;
    this.workMoneyGainRate      = 0;
    this.workMoneyLossRate      = 0;

    this.workHackExpGained  = 0;
    this.workStrExpGained   = 0;
    this.workDefExpGained   = 0;
    this.workDexExpGained   = 0;
    this.workAgiExpGained   = 0;
    this.workChaExpGained   = 0;
    this.workRepGained      = 0;
    this.workMoneyGained    = 0;

    this.timeWorked = 0;
    this.timeWorkedCreateProgram = 0;

    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";
    this.createProgramName = "";
    this.className = "";

    document.getElementById("work-in-progress-text").innerHTML = "";
}

PlayerObject.prototype.processWorkEarnings = function(numCycles=1) {
    const hackExpGain = this.workHackExpGainRate * numCycles;
    const strExpGain = this.workStrExpGainRate * numCycles;
    const defExpGain = this.workDefExpGainRate * numCycles;
    const dexExpGain = this.workDexExpGainRate * numCycles;
    const agiExpGain = this.workAgiExpGainRate * numCycles;
    const chaExpGain = this.workChaExpGainRate * numCycles;
    const moneyGain = (this.workMoneyGainRate - this.workMoneyLossRate) * numCycles;

    this.gainHackingExp(hackExpGain);
    this.gainStrengthExp(strExpGain);
    this.gainDefenseExp(defExpGain);
    this.gainDexterityExp(dexExpGain);
    this.gainAgilityExp(agiExpGain);
    this.gainCharismaExp(chaExpGain);
    this.gainMoney(moneyGain);
    this.recordMoneySource(moneyGain, "work");
    this.workHackExpGained  += hackExpGain;
    this.workStrExpGained   += strExpGain;
    this.workDefExpGained   += defExpGain;
    this.workDexExpGained   += dexExpGain;
    this.workAgiExpGained   += agiExpGain;
    this.workChaExpGained   += chaExpGain;
    this.workRepGained      += this.workRepGainRate * numCycles;
    this.workMoneyGained    += this.workMoneyGainRate * numCycles;
    this.workMoneyGained    -= this.workMoneyLossRate * numCycles;
}

/* Working for Company */
PlayerObject.prototype.startWork = function(companyName) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.companyName = companyName;
    this.workType = CONSTANTS.WorkTypeCompany;

    this.workHackExpGainRate    = this.getWorkHackExpGain();
    this.workStrExpGainRate     = this.getWorkStrExpGain();
    this.workDefExpGainRate     = this.getWorkDefExpGain();
    this.workDexExpGainRate     = this.getWorkDexExpGain();
    this.workAgiExpGainRate     = this.getWorkAgiExpGain();
    this.workChaExpGainRate     = this.getWorkChaExpGain();
    this.workRepGainRate        = this.getWorkRepGain();
    this.workMoneyGainRate      = this.getWorkMoneyGain();

    this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer8Hours;

    //Remove all old event listeners from Cancel button
    var newCancelButton = clearEventListeners("work-in-progress-cancel-button");
    newCancelButton.innerHTML = "Cancel Work";
    newCancelButton.addEventListener("click", function() {
        Player.finishWork(true);
        return false;
    });

    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.work = function(numCycles) {
    //Cap the number of cycles being processed to whatever would put you at
    //the work time limit (8 hours)
    var overMax = false;
    if (this.timeWorked + (Engine._idleSpeed * numCycles) >= CONSTANTS.MillisecondsPer8Hours) {
        overMax = true;
        numCycles = Math.round((CONSTANTS.MillisecondsPer8Hours - this.timeWorked) / Engine._idleSpeed);
    }
    this.timeWorked += Engine._idleSpeed * numCycles;

    this.workRepGainRate    = this.getWorkRepGain();
    this.processWorkEarnings(numCycles);

    //If timeWorked == 8 hours, then finish. You can only gain 8 hours worth of exp and money
    if (overMax || this.timeWorked >= CONSTANTS.MillisecondsPer8Hours) {
        return this.finishWork(false);
    }

    var comp = Companies[this.companyName], companyRep = "0";
    if (comp == null || !(comp instanceof Company)) {
        console.error(`Could not find Company: ${this.companyName}`);
    } else {
        companyRep = comp.playerReputation;
    }

    const position = this.jobs[this.companyName];

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working as a " + position +
                    " at " + this.companyName + " (Current Company Reputation: " +
                    numeralWrapper.format(companyRep, '0,0') + ")<br><br>" +
                    "You have been working for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "You have earned: <br><br>" +
                    "$" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + " ($" + numeralWrapper.format(this.workMoneyGainRate * CYCLES_PER_SEC, '0,0.00') + " / sec) <br><br>" +
                    numeralWrapper.format(this.workRepGained, '0,0.0000') + " (" + numeralWrapper.format(this.workRepGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) reputation for this company <br><br>" +
                    numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workHackExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) hacking exp <br><br>" +
                    numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workStrExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) strength exp <br>" +
                    numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workDefExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) defense exp <br>" +
                    numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workDexExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) dexterity exp <br>" +
                    numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workAgiExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) agility exp <br><br> " +
                    numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workChaExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) charisma exp <br><br>" +
                    "You will automatically finish after working for 8 hours. You can cancel earlier if you wish, " +
                    "but you will only gain half of the reputation you've earned so far."
}

PlayerObject.prototype.finishWork = function(cancelled, sing=false) {
    //Since the work was cancelled early, player only gains half of what they've earned so far
    if (cancelled) {
        this.workRepGained /= 2;
    }

    var company = Companies[this.companyName];
    company.playerReputation += (this.workRepGained);

    this.updateSkillLevels();

    var txt = "You earned a total of: <br>" +
              "$" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + "<br>" +
              numeralWrapper.format(this.workRepGained, '0,0.0000') + " reputation for the company <br>" +
              numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking exp <br>" +
              numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " strength exp <br>" +
              numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " defense exp <br>" +
              numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dexterity exp <br>" +
              numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agility exp <br>" +
              numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " charisma exp<br>";

    if (cancelled) {
        txt = "You worked a short shift of " + convertTimeMsToTimeElapsedString(this.timeWorked) + " <br><br> " +
              "Since you cancelled your work early, you only gained half of the reputation you earned. <br><br>" + txt;
    } else {
        txt = "You worked a full shift of 8 hours! <br><br> " + txt;
    }
    if (!sing) {dialogBoxCreate(txt);}

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    this.isWorking = false;
    Engine.loadLocationContent();

    if (sing) {
        var res =  "You worked a short shift of " + convertTimeMsToTimeElapsedString(this.timeWorked) + " and " +
               "earned $" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + ", " +
               numeralWrapper.format(this.workRepGained, '0,0.0000') + " reputation, " +
               numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking exp, " +
               numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " strength exp, " +
               numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " defense exp, " +
               numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dexterity exp, " +
               numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agility exp, and " +
               numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " charisma exp.";
        this.resetWorkStatus();
        return res;
    }
    this.resetWorkStatus();
}

PlayerObject.prototype.startWorkPartTime = function(companyName) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.companyName = companyName;
    this.workType = CONSTANTS.WorkTypeCompanyPartTime;

    this.workHackExpGainRate    = this.getWorkHackExpGain();
    this.workStrExpGainRate     = this.getWorkStrExpGain();
    this.workDefExpGainRate     = this.getWorkDefExpGain();
    this.workDexExpGainRate     = this.getWorkDexExpGain();
    this.workAgiExpGainRate     = this.getWorkAgiExpGain();
    this.workChaExpGainRate     = this.getWorkChaExpGain();
    this.workRepGainRate        = this.getWorkRepGain();
    this.workMoneyGainRate      = this.getWorkMoneyGain();

    this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer8Hours;

    var newCancelButton = clearEventListeners("work-in-progress-cancel-button");
    newCancelButton.innerHTML = "Stop Working";
    newCancelButton.addEventListener("click", function() {
        Player.finishWorkPartTime();
        return false;
    });

    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.workPartTime = function(numCycles) {
    //Cap the number of cycles being processed to whatever would put you at the
    //work time limit (8 hours)
    var overMax = false;
    if (this.timeWorked + (Engine._idleSpeed * numCycles) >= CONSTANTS.MillisecondsPer8Hours) {
        overMax = true;
        numCycles = Math.round((CONSTANTS.MillisecondsPer8Hours - this.timeWorked) / Engine._idleSpeed);
    }
    this.timeWorked += Engine._idleSpeed * numCycles;

    this.workRepGainRate    = this.getWorkRepGain();
    this.processWorkEarnings(numCycles);

    //If timeWorked == 8 hours, then finish. You can only gain 8 hours worth of exp and money
    if (overMax || this.timeWorked >= CONSTANTS.MillisecondsPer8Hours) {
        return this.finishWorkPartTime();
    }

    var comp = Companies[this.companyName], companyRep = "0";
    if (comp == null || !(comp instanceof Company)) {
        console.log("ERROR: Could not find Company: " + this.companyName);
    } else {
        companyRep = comp.playerReputation;
    }

    const position = this.jobs[this.companyName];

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working as a " + position +
                    " at " + this.companyName + " (Current Company Reputation: "  +
                    numeralWrapper.format(companyRep, '0,0') + ")<br><br>" +
                    "You have been working for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "You have earned: <br><br>" +
                    "$" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + " ($" + numeralWrapper.format(this.workMoneyGainRate * CYCLES_PER_SEC, '0,0.00') + " / sec) <br><br>" +
                    numeralWrapper.format(this.workRepGained, '0,0.0000') + " (" + numeralWrapper.format(this.workRepGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) reputation for this company <br><br>" +
                    numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workHackExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) hacking exp <br><br>" +
                    numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workStrExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) strength exp <br>" +
                    numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workDefExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) defense exp <br>" +
                    numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workDexExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) dexterity exp <br>" +
                    numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workAgiExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) agility exp <br><br> " +
                    numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workChaExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) charisma exp <br><br>" +
                    "You will automatically finish after working for 8 hours. You can cancel earlier if you wish, <br>" +
                    "and there will be no penalty because this is a part-time job.";

}

PlayerObject.prototype.finishWorkPartTime = function(sing=false) {
    var company = Companies[this.companyName];
    company.playerReputation += (this.workRepGained);

    this.updateSkillLevels();

    var txt = "You earned a total of: <br>" +
              "$" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + "<br>" +
              numeralWrapper.format(this.workRepGained, '0,0.0000') + " reputation for the company <br>" +
              numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking exp <br>" +
              numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " strength exp <br>" +
              numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " defense exp <br>" +
              numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dexterity exp <br>" +
              numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agility exp <br>" +
              numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " charisma exp<br>";
    txt = "You worked for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br> " + txt;
    if (!sing) {dialogBoxCreate(txt);}

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    this.isWorking = false;
    Engine.loadLocationContent();
    if (sing) {
        var res =  "You worked for " + convertTimeMsToTimeElapsedString(this.timeWorked) + " and " +
               "earned a total of " +
               "$" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + ", " +
               numeralWrapper.format(this.workRepGained, '0,0.0000') + " reputation, " +
               numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking exp, " +
               numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " strength exp, " +
               numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " defense exp, " +
               numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dexterity exp, " +
               numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agility exp, and " +
               numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " charisma exp";
        this.resetWorkStatus();
        return res;
    }
    this.resetWorkStatus();
}

/* Working for Faction */
PlayerObject.prototype.startFactionWork = function(faction) {
    //Update reputation gain rate to account for faction favor
    var favorMult = 1 + (faction.favor / 100);
    if (isNaN(favorMult)) {favorMult = 1;}
    this.workRepGainRate *= favorMult;
    this.workRepGainRate *= BitNodeMultipliers.FactionWorkRepGain;

    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeFaction;
    this.currentWorkFactionName = faction.name;

    this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer20Hours;

    var cancelButton = clearEventListeners("work-in-progress-cancel-button");
    cancelButton.innerHTML = "Stop Faction Work";
    cancelButton.addEventListener("click", function() {
        Player.finishFactionWork(true);
        return false;
    });

    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.startFactionHackWork = function(faction) {
    this.resetWorkStatus();

    this.workHackExpGainRate = .15 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workRepGainRate = this.workRepGainRate = (this.hacking_skill + this.intelligence) / CONSTANTS.MaxSkillLevel * this.faction_rep_mult;

    this.factionWorkType = CONSTANTS.FactionWorkHacking;
    this.currentWorkFactionDescription = "carrying out hacking contracts";

    this.startFactionWork(faction);
}

PlayerObject.prototype.startFactionFieldWork = function(faction) {
    this.resetWorkStatus();

    this.workHackExpGainRate    = .1 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workStrExpGainRate     = .1 * this.strength_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workDefExpGainRate     = .1 * this.defense_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workDexExpGainRate     = .1 * this.dexterity_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workAgiExpGainRate     = .1 * this.agility_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workChaExpGainRate     = .1 * this.charisma_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workRepGainRate        = this.getFactionFieldWorkRepGain();

    this.factionWorkType = CONSTANTS.FactionWorkField;
    this.currentWorkFactionDescription = "carrying out field missions"

    this.startFactionWork(faction);
}

PlayerObject.prototype.startFactionSecurityWork = function(faction) {
    this.resetWorkStatus();

    this.workHackExpGainRate    = 0.05 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workStrExpGainRate     = 0.15 * this.strength_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workDefExpGainRate     = 0.15 * this.defense_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workDexExpGainRate     = 0.15 * this.dexterity_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workAgiExpGainRate     = 0.15 * this.agility_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workChaExpGainRate     = 0.00 * this.charisma_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workRepGainRate        = this.getFactionSecurityWorkRepGain();

    this.factionWorkType = CONSTANTS.FactionWorkSecurity;
    this.currentWorkFactionDescription = "performing security detail"

    this.startFactionWork(faction);
}

PlayerObject.prototype.workForFaction = function(numCycles) {
    var faction = Factions[this.currentWorkFactionName];

    //Constantly update the rep gain rate
    switch (this.factionWorkType) {
        case CONSTANTS.FactionWorkHacking:
            this.workRepGainRate = (this.hacking_skill + this.intelligence) / CONSTANTS.MaxSkillLevel * this.faction_rep_mult;
            break;
        case CONSTANTS.FactionWorkField:
            this.workRepGainRate = this.getFactionFieldWorkRepGain();
            break;
        case CONSTANTS.FactionWorkSecurity:
            this.workRepGainRate = this.getFactionSecurityWorkRepGain();
            break;
        default:
            break;
    }

    //Update reputation gain rate to account for faction favor
    var favorMult = 1 + (faction.favor / 100);
    if (isNaN(favorMult)) {favorMult = 1;}
    this.workRepGainRate *= favorMult;
    this.workRepGainRate *= BitNodeMultipliers.FactionWorkRepGain;

    //Cap the number of cycles being processed to whatever would put you at limit (20 hours)
    var overMax = false;
    if (this.timeWorked + (Engine._idleSpeed * numCycles) >= CONSTANTS.MillisecondsPer20Hours) {
        overMax = true;
        numCycles = Math.round((CONSTANTS.MillisecondsPer20Hours - this.timeWorked) / Engine._idleSpeed);
    }
    this.timeWorked += Engine._idleSpeed * numCycles;

    this.processWorkEarnings(numCycles);

    //If timeWorked == 20 hours, then finish. You can only work for the faction for 20 hours
    if (overMax || this.timeWorked >= CONSTANTS.MillisecondsPer20Hours) {
        return this.finishFactionWork(false);
    }

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently " + this.currentWorkFactionDescription + " for your faction " + faction.name +
                    " (Current Faction Reputation: " + numeralWrapper.format(faction.playerReputation, '0,0') + "). <br>" +
                    "You have been doing this for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "You have earned: <br><br>" +
                    "$" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + " (" + numeralWrapper.format(this.workMoneyGainRate * CYCLES_PER_SEC, '0,0.00') + " / sec) <br><br>" +
                    numeralWrapper.format(this.workRepGained, '0,0.0000') + " (" + numeralWrapper.format(this.workRepGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) reputation for this faction <br><br>" +
                    numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workHackExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) hacking exp <br><br>" +
                    numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workStrExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) strength exp <br>" +
                    numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workDefExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) defense exp <br>" +
                    numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workDexExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) dexterity exp <br>" +
                    numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workAgiExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) agility exp <br><br> " +
                    numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workChaExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) charisma exp <br><br>" +

                    "You will automatically finish after working for 20 hours. You can cancel earlier if you wish.<br>" +
                    "There is no penalty for cancelling earlier.";
}

PlayerObject.prototype.finishFactionWork = function(cancelled, sing=false) {
    var faction = Factions[this.currentWorkFactionName];
    faction.playerReputation += (this.workRepGained);

    this.updateSkillLevels();

    var txt = "You worked for your faction " + faction.name + " for a total of " + convertTimeMsToTimeElapsedString(this.timeWorked) + " <br><br> " +
              "You earned a total of: <br>" +
              "$" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + "<br>" +
              numeralWrapper.format(this.workRepGained, '0,0.0000') + " reputation for the faction <br>" +
              numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking exp <br>" +
              numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " strength exp <br>" +
              numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " defense exp <br>" +
              numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dexterity exp <br>" +
              numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agility exp <br>" +
              numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " charisma exp<br>";
    if (!sing) {dialogBoxCreate(txt);}

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";

    this.isWorking = false;

    Engine.loadFactionContent();
    displayFactionContent(faction.name);
    if (sing) {
        var res="You worked for your faction " + faction.name + " for a total of " + convertTimeMsToTimeElapsedString(this.timeWorked) + ". " +
               "You earned " +
               numeralWrapper.format(this.workRepGained, '0,0.0000') + " rep, " +
               numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking exp, " +
               numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " str exp, " +
               numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " def exp, " +
               numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dex exp, " +
               numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agi exp, and " +
               numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " cha exp.";
        this.resetWorkStatus();
        return res;
    }
    this.resetWorkStatus();
}

//Money gained per game cycle
PlayerObject.prototype.getWorkMoneyGain = function() {
    // If player has SF-11, calculate salary multiplier from favor
    let bn11Mult = 1;
    const company = Companies[this.companyName];
    if (hasBn11SF) { bn11Mult = 1 + (company.favor / 100); }

    // Get base salary
    const companyPositionName = this.jobs[this.companyName];
    const companyPosition = CompanyPositions[companyPositionName];
    if (companyPosition == null) {
        console.error(`Could not find CompanyPosition object for ${companyPositionName}. Work salary will be 0`);
        return 0;
    }

    return companyPosition.baseSalary * company.salaryMultiplier * this.work_money_mult * BitNodeMultipliers.CompanyWorkMoney * bn11Mult;
}

//Hack exp gained per game cycle
PlayerObject.prototype.getWorkHackExpGain = function() {
    const company = Companies[this.companyName];
    const companyPositionName = this.jobs[this.companyName];
    const companyPosition = CompanyPositions[companyPositionName];
    if (company == null || companyPosition == null) {
        console.error([`Could not find Company object for ${this.companyName}`,
                       `or CompanyPosition object for ${companyPositionName}.`,
                       `Work hack exp gain will be 0`].join(" "));
        return 0;
    }

    return companyPosition.hackingExpGain * company.expMultiplier * this.hacking_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Str exp gained per game cycle
PlayerObject.prototype.getWorkStrExpGain = function() {
    const company = Companies[this.companyName];
    const companyPositionName = this.jobs[this.companyName];
    const companyPosition = CompanyPositions[companyPositionName];
    if (company == null || companyPosition == null) {
        console.error([`Could not find Company object for ${this.companyName}`,
                       `or CompanyPosition object for ${companyPositionName}.`,
                       `Work str exp gain will be 0`].join(" "));
        return 0;
    }

    return companyPosition.strengthExpGain * company.expMultiplier * this.strength_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Def exp gained per game cycle
PlayerObject.prototype.getWorkDefExpGain = function() {
    const company = Companies[this.companyName];
    const companyPositionName = this.jobs[this.companyName];
    const companyPosition = CompanyPositions[companyPositionName];
    if (company == null || companyPosition == null) {
        console.error([`Could not find Company object for ${this.companyName}`,
                       `or CompanyPosition object for ${companyPositionName}.`,
                       `Work def exp gain will be 0`].join(" "));
        return 0;
    }

    return companyPosition.defenseExpGain * company.expMultiplier * this.defense_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Dex exp gained per game cycle
PlayerObject.prototype.getWorkDexExpGain = function() {
    const company = Companies[this.companyName];
    const companyPositionName = this.jobs[this.companyName];
    const companyPosition = CompanyPositions[companyPositionName];
    if (company == null || companyPosition == null) {
        console.error([`Could not find Company object for ${this.companyName}`,
                       `or CompanyPosition object for ${companyPositionName}.`,
                       `Work dex exp gain will be 0`].join(" "));
        return 0;
    }

    return companyPosition.dexterityExpGain * company.expMultiplier * this.dexterity_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Agi exp gained per game cycle
PlayerObject.prototype.getWorkAgiExpGain = function() {
    const company = Companies[this.companyName];
    const companyPositionName = this.jobs[this.companyName];
    const companyPosition = CompanyPositions[companyPositionName];
    if (company == null || companyPosition == null) {
        console.error([`Could not find Company object for ${this.companyName}`,
                       `or CompanyPosition object for ${companyPositionName}.`,
                       `Work agi exp gain will be 0`].join(" "));
        return 0;
    }

    return companyPosition.agilityExpGain * company.expMultiplier * this.agility_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Charisma exp gained per game cycle
PlayerObject.prototype.getWorkChaExpGain = function() {
    const company = Companies[this.companyName];
    const companyPositionName = this.jobs[this.companyName];
    const companyPosition = CompanyPositions[companyPositionName];
    if (company == null || companyPosition == null) {
        console.error([`Could not find Company object for ${this.companyName}`,
                       `or CompanyPosition object for ${companyPositionName}.`,
                       `Work cha exp gain will be 0`].join(" "));
        return 0;
    }

    return companyPosition.charismaExpGain * company.expMultiplier * this.charisma_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Reputation gained per game cycle
PlayerObject.prototype.getWorkRepGain = function() {
    const company = Companies[this.companyName];
    const companyPositionName = this.jobs[this.companyName];
    const companyPosition = CompanyPositions[companyPositionName];
    if (company == null || companyPosition == null) {
        console.error([`Could not find Company object for ${this.companyName}`,
                       `or CompanyPosition object for ${companyPositionName}.`,
                       `Work rep gain will be 0`].join(" "));
        return 0;
    }

    var jobPerformance = companyPosition.calculateJobPerformance(this.hacking_skill, this.strength,
                                                                 this.defense, this.dexterity,
                                                                 this.agility, this.charisma);

    //Intelligence provides a flat bonus to job performance
    jobPerformance += (this.intelligence / CONSTANTS.MaxSkillLevel);

    //Update reputation gain rate to account for company favor
    var favorMult = 1 + (company.favor / 100);
    if (isNaN(favorMult)) { favorMult = 1; }
    return jobPerformance * this.company_rep_mult * favorMult;
}

PlayerObject.prototype.getFactionSecurityWorkRepGain = function() {
    var t = 0.9 * (this.hacking_skill  / CONSTANTS.MaxSkillLevel +
                   this.strength       / CONSTANTS.MaxSkillLevel +
                   this.defense        / CONSTANTS.MaxSkillLevel +
                   this.dexterity      / CONSTANTS.MaxSkillLevel +
                   this.agility        / CONSTANTS.MaxSkillLevel) / 4.5;
    return t * this.faction_rep_mult;
}

PlayerObject.prototype.getFactionFieldWorkRepGain = function() {
    var t = 0.9 * (this.hacking_skill  / CONSTANTS.MaxSkillLevel +
                   this.strength       / CONSTANTS.MaxSkillLevel +
                   this.defense        / CONSTANTS.MaxSkillLevel +
                   this.dexterity      / CONSTANTS.MaxSkillLevel +
                   this.agility        / CONSTANTS.MaxSkillLevel +
                   this.charisma       / CONSTANTS.MaxSkillLevel +
                   this.intelligence   / CONSTANTS.MaxSkillLevel) / 5.5;
    return t * this.faction_rep_mult;
}

/* Creating a Program */
PlayerObject.prototype.startCreateProgramWork = function(programName, time, reqLevel) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCreateProgram;

    //Time needed to complete work affected by hacking skill (linearly based on
    //ratio of (your skill - required level) to MAX skill)
    //var timeMultiplier = (CONSTANTS.MaxSkillLevel - (this.hacking_skill - reqLevel)) / CONSTANTS.MaxSkillLevel;
    //if (timeMultiplier > 1) {timeMultiplier = 1;}
    //if (timeMultiplier < 0.01) {timeMultiplier = 0.01;}
    this.createProgramReqLvl = reqLevel;

    this.timeNeededToCompleteWork = time;
    //Check for incomplete program
    for (var i = 0; i < this.getHomeComputer().programs.length; ++i) {
        var programFile = this.getHomeComputer().programs[i];
        if (programFile.startsWith(programName) && programFile.endsWith("%-INC")) {
            var res = programFile.split("-");
            if (res.length != 3) {break;}
            var percComplete = Number(res[1].slice(0, -1));
            if (isNaN(percComplete) || percComplete < 0 || percComplete >= 100) {break;}
            this.timeWorkedCreateProgram = percComplete / 100 * this.timeNeededToCompleteWork;
            this.getHomeComputer().programs.splice(i, 1);
        }
    }

    this.createProgramName = programName;

    var cancelButton = clearEventListeners("work-in-progress-cancel-button");
    cancelButton.innerHTML = "Cancel work on creating program";
    cancelButton.addEventListener("click", function() {
        Player.finishCreateProgramWork(true);
        return false;
    });

    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.createProgramWork = function(numCycles) {
    //Higher hacking skill will allow you to create programs faster
    var reqLvl = this.createProgramReqLvl;
    var skillMult = (this.hacking_skill / reqLvl); //This should always be greater than 1;
    skillMult = 1 + ((skillMult - 1) / 5); //The divider constant can be adjusted as necessary

    //Skill multiplier directly applied to "time worked"
    this.timeWorked += (Engine._idleSpeed * numCycles);
    this.timeWorkedCreateProgram += (Engine._idleSpeed * numCycles * skillMult);
    var programName = this.createProgramName;

    if (this.timeWorkedCreateProgram >= this.timeNeededToCompleteWork) {
        this.finishCreateProgramWork(false);
    }

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working on coding " + programName + ".<br><br> " +
                    "You have been working for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "The program is " + (this.timeWorkedCreateProgram / this.timeNeededToCompleteWork * 100).toFixed(2) + "% complete. <br>" +
                    "If you cancel, your work will be saved and you can come back to complete the program later.";
}

PlayerObject.prototype.finishCreateProgramWork = function(cancelled, sing=false) {
    var programName = this.createProgramName;
    if (cancelled === false) {
        dialogBoxCreate("You've finished creating " + programName + "!<br>" +
                        "The new program can be found on your home computer.");

        this.getHomeComputer().programs.push(programName);
    } else {
        var perc = (Math.floor(this.timeWorkedCreateProgram / this.timeNeededToCompleteWork * 10000)/100).toString();
        var incompleteName = programName + "-" + perc + "%-INC";
        this.getHomeComputer().programs.push(incompleteName);
    }

    if (!cancelled) {
        this.gainIntelligenceExp(this.createProgramReqLvl / CONSTANTS.IntelligenceProgramBaseExpGain);
    }

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";

    this.isWorking = false;

    Engine.loadTerminalContent();
    this.resetWorkStatus();
}

/* Studying/Taking Classes */
PlayerObject.prototype.startClass = function(costMult, expMult, className) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeStudyClass;

    this.className = className;

    var gameCPS = 1000 / Engine._idleSpeed;

    //Base exp gains per second
    var baseStudyComputerScienceExp = 0.5;
    var baseDataStructuresExp       = 1;
    var baseNetworksExp             = 2;
    var baseAlgorithmsExp           = 4;
    var baseManagementExp           = 2;
    var baseLeadershipExp           = 4;
    var baseGymExp                  = 1;

    //Find cost and exp gain per game cycle
    var cost = 0;
    var hackExp = 0, strExp = 0, defExp = 0, dexExp = 0, agiExp = 0, chaExp = 0;
    switch (className) {
        case CONSTANTS.ClassStudyComputerScience:
            hackExp = baseStudyComputerScienceExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassDataStructures:
            cost = CONSTANTS.ClassDataStructuresBaseCost * costMult / gameCPS;
            hackExp = baseDataStructuresExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassNetworks:
            cost = CONSTANTS.ClassNetworksBaseCost * costMult / gameCPS;
            hackExp = baseNetworksExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassAlgorithms:
            cost = CONSTANTS.ClassAlgorithmsBaseCost * costMult / gameCPS;
            hackExp = baseAlgorithmsExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassManagement:
            cost = CONSTANTS.ClassManagementBaseCost * costMult / gameCPS;
            chaExp = baseManagementExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassLeadership:
            cost = CONSTANTS.ClassLeadershipBaseCost * costMult / gameCPS;
            chaExp = baseLeadershipExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassGymStrength:
            cost = CONSTANTS.ClassGymBaseCost * costMult / gameCPS;
            strExp = baseGymExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassGymDefense:
            cost = CONSTANTS.ClassGymBaseCost * costMult / gameCPS;
            defExp = baseGymExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassGymDexterity:
            cost = CONSTANTS.ClassGymBaseCost * costMult / gameCPS;
            dexExp = baseGymExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassGymAgility:
            cost = CONSTANTS.ClassGymBaseCost * costMult / gameCPS;
            agiExp = baseGymExp * expMult / gameCPS;
            break;
        default:
            throw new Error("ERR: Invalid/unrecognized class name");
            return;
    }

    this.workMoneyLossRate      = cost;
    this.workHackExpGainRate    = hackExp * this.hacking_exp_mult * BitNodeMultipliers.ClassGymExpGain;
    this.workStrExpGainRate     = strExp * this.strength_exp_mult * BitNodeMultipliers.ClassGymExpGain;;
    this.workDefExpGainRate     = defExp * this.defense_exp_mult * BitNodeMultipliers.ClassGymExpGain;;
    this.workDexExpGainRate     = dexExp * this.dexterity_exp_mult * BitNodeMultipliers.ClassGymExpGain;;
    this.workAgiExpGainRate     = agiExp * this.agility_exp_mult * BitNodeMultipliers.ClassGymExpGain;;
    this.workChaExpGainRate     = chaExp * this.charisma_exp_mult * BitNodeMultipliers.ClassGymExpGain;;

    var cancelButton = clearEventListeners("work-in-progress-cancel-button");
    if (className == CONSTANTS.ClassGymStrength ||
        className == CONSTANTS.ClassGymDefense ||
        className == CONSTANTS.ClassGymDexterity ||
        className == CONSTANTS.ClassGymAgility) {
        cancelButton.innerHTML = "Stop training at gym";
    } else {
        cancelButton.innerHTML = "Stop taking course";
    }
    cancelButton.addEventListener("click", function() {
        Player.finishClass();
        return false;
    });

    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.takeClass = function(numCycles) {
    this.timeWorked += Engine._idleSpeed * numCycles;
    var className = this.className;

    this.processWorkEarnings(numCycles);

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You have been " + className + " for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "This has cost you: <br>" +
                    "$" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + " ($" + numeralWrapper.format(this.workMoneyLossRate * CYCLES_PER_SEC, '0,0.00') + " / sec) <br><br>" +
                    "You have gained: <br>" +
                    numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workHackExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) hacking exp <br>" +
                    numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workStrExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) strength exp <br>" +
                    numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workDefExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) defense exp <br>" +
                    numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workDexExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) dexterity exp <br>" +
                    numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workAgiExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) agility exp <br>" +
                    numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " (" + numeralWrapper.format(this.workChaExpGainRate * CYCLES_PER_SEC, '0,0.0000') + " / sec) charisma exp <br>" +
                    "You may cancel at any time";
}

//The 'sing' argument defines whether or not this function was called
//through a Singularity Netscript function
PlayerObject.prototype.finishClass = function(sing=false) {
    this.gainIntelligenceExp(CONSTANTS.IntelligenceClassBaseExpGain * Math.round(this.timeWorked / 1000));

    if (this.workMoneyGained > 0) {
        throw new Error("ERR: Somehow gained money while taking class");
    }

    this.updateSkillLevels();
    var txt = "After " + this.className + " for " + convertTimeMsToTimeElapsedString(this.timeWorked) + ", <br>" +
              "you spent a total of $" + numeralWrapper.format(this.workMoneyGained * -1, '0,0.00') + ". <br><br>" +
              "You earned a total of: <br>" +
              numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking exp <br>" +
              numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " strength exp <br>" +
              numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " defense exp <br>" +
              numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dexterity exp <br>" +
              numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agility exp <br>" +
              numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " charisma exp<br>";
    if (!sing) {dialogBoxCreate(txt);}

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";

    this.isWorking = false;

    Engine.loadLocationContent();
    if (sing) {
        var res="After " + this.className + " for " + convertTimeMsToTimeElapsedString(this.timeWorked) + ", " +
              "you spent a total of $" + numeralWrapper.format(this.workMoneyGained * -1, '0,0.00') + ". " +
              "You earned a total of: " +
              numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking exp, " +
              numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " strength exp, " +
              numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " defense exp, " +
              numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dexterity exp, " +
              numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agility exp, and " +
              numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " charisma exp";
        this.resetWorkStatus();
        return res;
    }
    this.resetWorkStatus();
}

//The EXP and $ gains are hardcoded. Time is in ms
PlayerObject.prototype.startCrime = function(crimeType, hackExp, strExp, defExp, dexExp, agiExp, chaExp, money, time, singParams=null) {
    this.crimeType = crimeType;

    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCrime;

    if (singParams && singParams.workerscript) {
        this.committingCrimeThruSingFn = true;
        this.singFnCrimeWorkerScript = singParams.workerscript;
    }

    this.workHackExpGained  = hackExp * this.hacking_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workStrExpGained   = strExp * this.strength_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workDefExpGained   = defExp * this.defense_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workDexExpGained   = dexExp * this.dexterity_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workAgiExpGained   = agiExp * this.agility_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workChaExpGained   = chaExp * this.charisma_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workMoneyGained    = money * this.crime_money_mult * BitNodeMultipliers.CrimeMoney;

    this.timeNeededToCompleteWork = time;

    //Remove all old event listeners from Cancel button
    var newCancelButton = clearEventListeners("work-in-progress-cancel-button")
    newCancelButton.innerHTML = "Cancel crime"
    newCancelButton.addEventListener("click", function() {
        Player.finishCrime(true);
        return false;
    });

    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.commitCrime = function (numCycles) {
    this.timeWorked += Engine._idleSpeed * numCycles;

    if (this.timeWorked >= this.timeNeededToCompleteWork) {this.finishCrime(false); return;}

    var percent = Math.round(this.timeWorked / this.timeNeededToCompleteWork * 100);
    var numBars = Math.round(percent / 5);
    if (numBars < 0) {numBars = 0;}
    if (numBars > 20) {numBars = 20;}
    var progressBar = "[" + Array(numBars+1).join("|") + Array(20 - numBars + 1).join(" ") + "]";

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are attempting to " + this.crimeType + ".<br>" +
                    "Time remaining: " + convertTimeMsToTimeElapsedString(this.timeNeededToCompleteWork - this.timeWorked) + "<br>" +
                    progressBar.replace( / /g, "&nbsp;" );
}

PlayerObject.prototype.finishCrime = function(cancelled) {
    //Determine crime success/failure
    if (!cancelled) {
        var statusText = ""; //TODO, unique message for each crime when you succeed
        if (determineCrimeSuccess(Player, this.crimeType)) {
            //Handle Karma and crime statistics
            let crime = null;
            for(const i in Crimes) {
                if(Crimes[i].type == this.crimeType) {
                    crime = Crimes[i];
                    break;
                }
            }
            if(crime == null) {
                console.log(this.crimeType);
                dialogBoxCreate("ERR: Unrecognized crime type. This is probably a bug please contact the developer");
            }
            Player.gainMoney(this.workMoneyGained);
            Player.recordMoneySource(this.workMoneyGained, "crime");
            this.karma -= crime.karma;
            this.numPeopleKilled += crime.kills;
            if(crime.intelligence_exp > 0) {
                this.gainIntelligenceExp(crime.intelligence_exp);
            }

            //On a crime success, gain 2x exp
            this.workHackExpGained  *= 2;
            this.workStrExpGained   *= 2;
            this.workDefExpGained   *= 2;
            this.workDexExpGained   *= 2;
            this.workAgiExpGained   *= 2;
            this.workChaExpGained   *= 2;
            if (this.committingCrimeThruSingFn) {
                if(this.singFnCrimeWorkerScript.disableLogs.ALL == null && this.singFnCrimeWorkerScript.disableLogs.commitCrime == null) {
                    this.singFnCrimeWorkerScript.scriptRef.log("Crime successful! Gained " +
                                                               numeralWrapper.format(this.workMoneyGained, "$0.000a") + ", " +
                                                               numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hack exp, " +
                                                               numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " str exp, " +
                                                               numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " def exp, " +
                                                               numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dex exp, " +
                                                               numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agi exp, " +
                                                               numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " cha exp.");
                }
            } else {
                dialogBoxCreate("Crime successful! <br><br>" +
                                "You gained:<br>"+
                                "$" + numeralWrapper.format(this.workMoneyGained, '0,0.00') + "<br>" +
                                numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking experience <br>" +
                                numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " strength experience<br>" +
                                numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " defense experience<br>" +
                                numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dexterity experience<br>" +
                                numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agility experience<br>" +
                                numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " charisma experience");
            }

        } else {
            //Exp halved on failure
            this.workHackExpGained  /= 2;
            this.workStrExpGained   /= 2;
            this.workDefExpGained   /= 2;
            this.workDexExpGained   /= 2;
            this.workAgiExpGained   /= 2;
            this.workChaExpGained   /= 2;
            if (this.committingCrimeThruSingFn) {
                if(this.singFnCrimeWorkerScript.disableLogs.ALL == null && this.singFnCrimeWorkerScript.disableLogs.commitCrime == null) {
                    this.singFnCrimeWorkerScript.scriptRef.log("Crime failed! Gained " +
                                                               numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hack exp, " +
                                                               numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " str exp, " +
                                                               numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " def exp, " +
                                                               numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dex exp, " +
                                                               numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agi exp, " +
                                                               numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " cha exp.");
                }
            } else {
                dialogBoxCreate("Crime failed! <br><br>" +
                        "You gained:<br>"+
                        numeralWrapper.format(this.workHackExpGained, '0,0.0000') + " hacking experience <br>" +
                        numeralWrapper.format(this.workStrExpGained, '0,0.0000') + " strength experience<br>" +
                        numeralWrapper.format(this.workDefExpGained, '0,0.0000') + " defense experience<br>" +
                        numeralWrapper.format(this.workDexExpGained, '0,0.0000') + " dexterity experience<br>" +
                        numeralWrapper.format(this.workAgiExpGained, '0,0.0000') + " agility experience<br>" +
                        numeralWrapper.format(this.workChaExpGained, '0,0.0000') + " charisma experience");
            }
        }

        this.gainHackingExp(this.workHackExpGained);
        this.gainStrengthExp(this.workStrExpGained);
        this.gainDefenseExp(this.workDefExpGained);
        this.gainDexterityExp(this.workDexExpGained);
        this.gainAgilityExp(this.workAgiExpGained);
        this.gainCharismaExp(this.workChaExpGained);
    }
    this.committingCrimeThruSingFn = false;
    this.singFnCrimeWorkerScript = null;
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    this.isWorking = false;
    this.resetWorkStatus();
    Engine.loadLocationContent();
}

//Cancels the player's current "work" assignment and gives the proper rewards
//Used only for Singularity functions, so no popups are created
PlayerObject.prototype.singularityStopWork = function() {
    if (!this.isWorking) {return "";}
    var res; //Earnings text for work
    switch (this.workType) {
        case CONSTANTS.WorkTypeStudyClass:
            res =  this.finishClass(true);
            break;
        case CONSTANTS.WorkTypeCompany:
            res = this.finishWork(true, true);
            break;
        case CONSTANTS.WorkTypeCompanyPartTime:
            res = this.finishWorkPartTime(true);
            break;
        case CONSTANTS.WorkTypeFaction:
            res = this.finishFactionWork(true, true);
            break;
        case CONSTANTS.WorkTypeCreateProgram:
            res = this.finishCreateProgramWork(true, true);
            break;
        case CONSTANTS.WorkTypeCrime:
            res = this.finishCrime(true);
            break;
        default:
            console.log("ERROR: Unrecognized work type");
            return "";
    }
    return res;
}


//Returns true if hospitalized, false otherwise
PlayerObject.prototype.takeDamage = function(amt) {
    if (typeof amt !== "number") {
        console.warn(`Player.takeDamage() called without a numeric argument: ${amt}`);
        return;
    }

    this.hp -= amt;
    if (this.hp <= 0) {
        this.hospitalize();
        return true;
    } else {
        return false;
    }
}

PlayerObject.prototype.regenerateHp = function(amt) {
    if (typeof amt !== "number") {
        console.warn(`Player.regenerateHp() called without a numeric argument: ${amt}`);
        return;
    }
    this.hp += amt;
    if (this.hp > this.max_hp) { this.hp = this.max_hp; }
}

PlayerObject.prototype.hospitalize = function() {
    if (Settings.SuppressHospitalizationPopup === false) {
        dialogBoxCreate(
            "You were in critical condition! You were taken to the hospital where " +
            "luckily they were able to save your life. You were charged " +
            numeralWrapper.format(this.max_hp * CONSTANTS.HospitalCostPerHp, '$0.000a')
        );
    }

    this.loseMoney(this.max_hp * CONSTANTS.HospitalCostPerHp);
    this.hp = this.max_hp;
}

/********* Company job application **********/
//Determines the job that the Player should get (if any) at the current company
//The 'sing' argument designates whether or not this is being called from
//the applyToCompany() Netscript Singularity function
PlayerObject.prototype.applyForJob = function(entryPosType, sing=false) {
    // Get current company and job
    let currCompany = null;
    if (this.companyName !== "") {
        currCompany = Companies[this.companyName];
    }
    const currPositionName = this.jobs[this.companyName];

    // Get company that's being applied to
	const company = Companies[this.location]; //Company being applied to
    if (!(company instanceof Company)) {
        if (sing) {
            return "ERROR: Invalid company name: " + this.location + ". applyToCompany() failed";
        } else {
            console.error(`Could not find company that matches the location: ${this.location}. Player.applyToCompany() failed`);
            return;
        }
    }

    let pos = entryPosType;

    if (!this.isQualified(company, pos)) {
        var reqText = getJobRequirementText(company, pos);
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position<br>" + reqText);
        return;
    }

    while (true) {
        let newPos = getNextCompanyPosition(pos);
        if (newPos == null) {break;}

        //Check if this company has this position
        if (company.hasPosition(newPos)) {
            if (!this.isQualified(company, newPos)) {
                //If player not qualified for next job, break loop so player will be given current job
                break;
            }
            pos = newPos;
        } else {
            break;
        }
    }

    //Check if the determined job is the same as the player's current job
    if (currCompany != null) {
        if (currCompany.name == company.name && pos.name == currPositionName) {
            var nextPos = getNextCompanyPosition(pos);
            if (nextPos == null) {
                if (sing) {return false;}
                dialogBoxCreate("You are already at the highest position for your field! No promotion available");
            } else if (company.hasPosition(nextPos)) {
                if (sing) {return false;}
                var reqText = getJobRequirementText(company, nextPos);
                dialogBoxCreate("Unfortunately, you do not qualify for a promotion<br>" + reqText);
            } else {
                if (sing) {return false;}
                dialogBoxCreate("You are already at the highest position for your field! No promotion available");
            }
            return; //Same job, do nothing
        }
    }

    this.companyName = company.name;
    this.jobs[company.name] = pos.name;

    document.getElementById("world-menu-header").click();
    document.getElementById("world-menu-header").click();

    if (sing) { return true; }
    dialogBoxCreate("Congratulations! You were offered a new job at " + this.companyName + " as a " + pos.name + "!");

    Engine.loadLocationContent();
}

//Returns your next position at a company given the field (software, business, etc.)
PlayerObject.prototype.getNextCompanyPosition = function(company, entryPosType) {
    var currCompany = null;
    if (this.companyName !== "") {
        currCompany = Companies[this.companyName];
    }

    //Not employed at this company, so return the entry position
    if (currCompany == null || (currCompany.name != company.name)) {
        return entryPosType;
    }

    //If the entry pos type and the player's current position have the same type,
    //return the player's "nextCompanyPosition". Otherwise return the entryposType
    //Employed at this company, so just return the next position if it exists.
    const currentPositionName = this.jobs[this.companyName];
    const currentPosition = CompanyPositions[currentPositionName];
    if ((currentPosition.isSoftwareJob() && entryPosType.isSoftwareJob()) ||
        (currentPosition.isITJob() && entryPosType.isITJob()) ||
        (currentPosition.isBusinessJob() && entryPosType.isBusinessJob()) ||
        (currentPosition.isSecurityEngineerJob() && entryPosType.isSecurityEngineerJob()) ||
        (currentPosition.isNetworkEngineerJob() && entryPosType.isNetworkEngineerJob()) ||
        (currentPosition.isSecurityJob() && entryPosType.isSecurityJob()) ||
        (currentPosition.isAgentJob() && entryPosType.isAgentJob()) ||
        (currentPosition.isSoftwareConsultantJob() && entryPosType.isSoftwareConsultantJob()) ||
        (currentPosition.isBusinessConsultantJob() && entryPosType.isBusinessConsultantJob()) ||
        (currentPosition.isPartTimeJob() && entryPosType.isPartTimeJob())) {
        return getNextCompanyPosition(currentPosition);
    }

    return entryPosType;
}

PlayerObject.prototype.applyForSoftwareJob = function(sing=false) {
    return this.applyForJob(CompanyPositions[posNames.SoftwareCompanyPositions[0]], sing);
}

PlayerObject.prototype.applyForSoftwareConsultantJob = function(sing=false) {
    return this.applyForJob(CompanyPositions[posNames.SoftwareConsultantCompanyPositions[0]], sing);
}

PlayerObject.prototype.applyForItJob = function(sing=false) {
	return this.applyForJob(CompanyPositions[posNames.ITCompanyPositions[0]], sing);
}

PlayerObject.prototype.applyForSecurityEngineerJob = function(sing=false) {
    var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions[posNames.SecurityEngineerCompanyPositions[0]])) {
        return this.applyForJob(CompanyPositions[posNames.SecurityEngineerCompanyPositions[0]], sing);
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForNetworkEngineerJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions[posNames.NetworkEngineerCompanyPositions[0]])) {
        return this.applyForJob(CompanyPositions[posNames.NetworkEngineerCompanyPositions[0]], sing);
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForBusinessJob = function(sing=false) {
	return this.applyForJob(CompanyPositions[posNames.BusinessCompanyPositions[0]], sing);
}

PlayerObject.prototype.applyForBusinessConsultantJob = function(sing=false) {
    return this.applyForJob(CompanyPositions[posNames.BusinessConsultantCompanyPositions[0]], sing);
}

PlayerObject.prototype.applyForSecurityJob = function(sing=false) {
    // TODO Police Jobs
    // Indexing starts at 2 because 0 is for police officer
	return this.applyForJob(CompanyPositions[posNames.SecurityCompanyPositions[2]], sing);
}

PlayerObject.prototype.applyForAgentJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions[posNames.AgentCompanyPositions[0]])) {
        return this.applyForJob(CompanyPositions[posNames.AgentCompanyPositions[0]], sing);
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForEmployeeJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions[posNames.MiscCompanyPositions[1]])) {
        this.companyName = company.name;
        this.jobs[company.name] = posNames.MiscCompanyPositions[1];
        document.getElementById("world-menu-header").click();
        document.getElementById("world-menu-header").click();
        if (sing) {return true;}
        dialogBoxCreate("Congratulations, you are now employed at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForPartTimeEmployeeJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions[posNames.PartTimeCompanyPositions[1]])) {
        this.companyName = company.name;
        this.jobs[company.name] = posNames.PartTimeCompanyPositions[1];
        document.getElementById("world-menu-header").click();
        document.getElementById("world-menu-header").click();
        if (sing) {return true;}
        dialogBoxCreate("Congratulations, you are now employed part-time at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForWaiterJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions[posNames.MiscCompanyPositions[0]])) {
        this.companyName = company.name;
        this.jobs[company.name] = posNames.MiscCompanyPositions[0];
        document.getElementById("world-menu-header").click();
        document.getElementById("world-menu-header").click();
        if (sing) {return true;}
        dialogBoxCreate("Congratulations, you are now employed as a waiter at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForPartTimeWaiterJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions[posNames.PartTimeCompanyPositions[0]])) {
        this.companyName = company.name;
        this.jobs[company.name] = posNames.PartTimeCompanyPositions[0];
        document.getElementById("world-menu-header").click();
        document.getElementById("world-menu-header").click();
        if (sing) {return true;}
        dialogBoxCreate("Congratulations, you are now employed as a part-time waiter at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

//Checks if the Player is qualified for a certain position
PlayerObject.prototype.isQualified = function(company, position) {
	var offset = company.jobStatReqOffset;
    var reqHacking = position.requiredHacking > 0       ? position.requiredHacking+offset   : 0;
    var reqStrength = position.requiredStrength > 0     ? position.requiredStrength+offset  : 0;
    var reqDefense = position.requiredDefense > 0       ? position.requiredDefense+offset   : 0;
    var reqDexterity = position.requiredDexterity > 0   ? position.requiredDexterity+offset : 0;
    var reqAgility = position.requiredDexterity > 0     ? position.requiredDexterity+offset : 0;
    var reqCharisma = position.requiredCharisma > 0     ? position.requiredCharisma+offset  : 0;

	if (this.hacking_skill >= reqHacking &&
		this.strength 	   >= reqStrength &&
        this.defense       >= reqDefense &&
        this.dexterity     >= reqDexterity &&
        this.agility       >= reqAgility &&
        this.charisma      >= reqCharisma &&
        company.playerReputation >= position.requiredReputation) {
            return true;
    }
    return false;
}

/********** Reapplying Augmentations and Source File ***********/
PlayerObject.prototype.reapplyAllAugmentations = function(resetMultipliers=true) {
    console.log("Re-applying augmentations");
    if (resetMultipliers) {
        this.resetMultipliers();
    }

    for (let i = 0; i < this.augmentations.length; ++i) {
        //Compatibility with new version
        if (this.augmentations[i].name === "HacknetNode NIC Architecture Neural-Upload") {
            this.augmentations[i].name = "Hacknet Node NIC Architecture Neural-Upload";
        }

        const augName = this.augmentations[i].name;
        var aug = Augmentations[augName];
        if (aug == null) {
            console.log(`WARNING: Invalid augmentation name in Player.reapplyAllAugmentations(). Aug ${augName} will be skipped`);
            continue;
        }
        aug.owned = true;
        if (aug.name == AugmentationNames.NeuroFluxGovernor) {
            for (let j = 0; j < aug.level; ++j) {
                applyAugmentation(this.augmentations[i], true);
            }
            continue;
        }
        applyAugmentation(this.augmentations[i], true);
    }
}

PlayerObject.prototype.reapplyAllSourceFiles = function() {
    console.log("Re-applying source files");
    //Will always be called after reapplyAllAugmentations() so multipliers do not have to be reset
    //this.resetMultipliers();

    for (let i = 0; i < this.sourceFiles.length; ++i) {
        var srcFileKey = "SourceFile" + this.sourceFiles[i].n;
        var sourceFileObject = SourceFiles[srcFileKey];
        if (sourceFileObject == null) {
            console.log("ERROR: Invalid source file number: " + this.sourceFiles[i].n);
            continue;
        }
        applySourceFile(this.sourceFiles[i]);
    }
}

/*************** Check for Faction Invitations *************/
//This function sets the requirements to join a Faction. It checks whether the Player meets
//those requirements and will return an array of all factions that the Player should
//receive an invitation to
PlayerObject.prototype.checkForFactionInvitations = function() {
    let invitedFactions = []; //Array which will hold all Factions the player should be invited to

    var numAugmentations = this.augmentations.length;

    const allCompanies = Object.keys(this.jobs);
    const allPositions = Object.values(this.jobs);

    // Given a company name, safely returns the reputation (returns 0 if invalid company is specified)
    function getCompanyRep(companyName) {
        const company = Companies[companyName];
        if (company == null) {
            return 0;
        } else {
            return company.playerReputation;
        }
    }

    // Helper function that returns a boolean indicating whether the Player meets
    // the requirements for the specified company. There are two requirements:
    //      1. High enough reputation
    //      2. Player is employed at the company
    function checkMegacorpRequirements(companyName, repNeeded=CONSTANTS.CorpFactionRepRequirement) {
        return allCompanies.includes(companyName) && (getCompanyRep(companyName) > repNeeded);
    }

    //Illuminati
    var illuminatiFac = Factions["Illuminati"];
    if (!illuminatiFac.isBanned && !illuminatiFac.isMember && !illuminatiFac.alreadyInvited &&
        numAugmentations >= 30 &&
        this.money.gte(150000000000) &&
        this.hacking_skill >= 1500 &&
        this.strength >= 1200 && this.defense >= 1200 &&
        this.dexterity >= 1200 && this.agility >= 1200) {
        invitedFactions.push(illuminatiFac);
    }

    //Daedalus
    var daedalusFac = Factions["Daedalus"];
    if (!daedalusFac.isBanned && !daedalusFac.isMember && !daedalusFac.alreadyInvited &&
        numAugmentations >= Math.round(30 * BitNodeMultipliers.DaedalusAugsRequirement) &&
        this.money.gte(100000000000) &&
        (this.hacking_skill >= 2500 ||
            (this.strength >= 1500 && this.defense >= 1500 &&
             this.dexterity >= 1500 && this.agility >= 1500))) {
        invitedFactions.push(daedalusFac);
    }

    //The Covenant
    var covenantFac = Factions["The Covenant"];
    if (!covenantFac.isBanned && !covenantFac.isMember && !covenantFac.alreadyInvited &&
        numAugmentations >= 20 &&
        this.money.gte(75000000000) &&
        this.hacking_skill >= 850 &&
        this.strength >= 850 &&
        this.defense >= 850 &&
        this.dexterity >= 850 &&
        this.agility >= 850) {
        invitedFactions.push(covenantFac);
    }

    //ECorp
    var ecorpFac = Factions["ECorp"];
    if (!ecorpFac.isBanned && !ecorpFac.isMember && !ecorpFac.alreadyInvited &&
        checkMegacorpRequirements(Locations.AevumECorp)) {
        invitedFactions.push(ecorpFac);
    }

    //MegaCorp
    var megacorpFac = Factions["MegaCorp"];
    if (!megacorpFac.isBanned && !megacorpFac.isMember && !megacorpFac.alreadyInvited &&
        checkMegacorpRequirements(Locations.Sector12MegaCorp)) {
        invitedFactions.push(megacorpFac);
    }

    //Bachman & Associates
    var bachmanandassociatesFac = Factions["Bachman & Associates"];
    if (!bachmanandassociatesFac.isBanned && !bachmanandassociatesFac.isMember &&
        !bachmanandassociatesFac.alreadyInvited &&
        checkMegacorpRequirements(Locations.AevumBachmanAndAssociates)) {
        invitedFactions.push(bachmanandassociatesFac);
    }

    //Blade Industries
    var bladeindustriesFac = Factions["Blade Industries"];
    if (!bladeindustriesFac.isBanned && !bladeindustriesFac.isMember && !bladeindustriesFac.alreadyInvited &&
        checkMegacorpRequirements(Locations.Sector12BladeIndustries)) {
        invitedFactions.push(bladeindustriesFac);
    }

    //NWO
    var nwoFac = Factions["NWO"];
    if (!nwoFac.isBanned && !nwoFac.isMember && !nwoFac.alreadyInvited &&
        checkMegacorpRequirements(Locations.VolhavenNWO)) {
        invitedFactions.push(nwoFac);
    }

    //Clarke Incorporated
    var clarkeincorporatedFac = Factions["Clarke Incorporated"];
    if (!clarkeincorporatedFac.isBanned && !clarkeincorporatedFac.isMember && !clarkeincorporatedFac.alreadyInvited &&
        checkMegacorpRequirements(Locations.AevumClarkeIncorporated)) {
        invitedFactions.push(clarkeincorporatedFac);
    }

    //OmniTek Incorporated
    var omnitekincorporatedFac = Factions["OmniTek Incorporated"];
    if (!omnitekincorporatedFac.isBanned && !omnitekincorporatedFac.isMember && !omnitekincorporatedFac.alreadyInvited &&
        checkMegacorpRequirements(Locations.VolhavenOmniTekIncorporated)) {
        invitedFactions.push(omnitekincorporatedFac);
    }

    //Four Sigma
    var foursigmaFac = Factions["Four Sigma"];
    if (!foursigmaFac.isBanned && !foursigmaFac.isMember && !foursigmaFac.alreadyInvited &&
        checkMegacorpRequirements(Locations.Sector12FourSigma)) {
        invitedFactions.push(foursigmaFac);
    }

    //KuaiGong International
    var kuaigonginternationalFac = Factions["KuaiGong International"];
    if (!kuaigonginternationalFac.isBanned && !kuaigonginternationalFac.isMember &&
        !kuaigonginternationalFac.alreadyInvited &&
        checkMegacorpRequirements(Locations.ChongqingKuaiGongInternational)) {
        invitedFactions.push(kuaigonginternationalFac);
    }

    //Fulcrum Secret Technologies - If u've unlocked fulcrum secret technolgoies server and have a high rep with the company
    var fulcrumsecrettechonologiesFac = Factions["Fulcrum Secret Technologies"];
    var fulcrumSecretServer = AllServers[SpecialServerIps[SpecialServerNames.FulcrumSecretTechnologies]];
    if (fulcrumSecretServer == null) {
        console.log("ERROR: Could not find Fulcrum Secret Technologies Server");
    } else {
        if (!fulcrumsecrettechonologiesFac.isBanned && !fulcrumsecrettechonologiesFac.isMember &&
            !fulcrumsecrettechonologiesFac.alreadyInvited &&
            fulcrumSecretServer.manuallyHacked &&
            checkMegacorpRequirements(Locations.AevumFulcrumTechnologies, 250e3)) {
            invitedFactions.push(fulcrumsecrettechonologiesFac);
        }
    }

    //BitRunners
    var bitrunnersFac = Factions["BitRunners"];
    var homeComp = this.getHomeComputer();
    var bitrunnersServer = AllServers[SpecialServerIps[SpecialServerNames.BitRunnersServer]];
    if (bitrunnersServer == null) {
        console.log("ERROR: Could not find BitRunners Server");
    } else if (!bitrunnersFac.isBanned && !bitrunnersFac.isMember && bitrunnersServer.manuallyHacked &&
               !bitrunnersFac.alreadyInvited && this.hacking_skill >= 500 && homeComp.maxRam >= 128) {
        invitedFactions.push(bitrunnersFac);
    }

    //The Black Hand
    var theblackhandFac = Factions["The Black Hand"];
    var blackhandServer = AllServers[SpecialServerIps[SpecialServerNames.TheBlackHandServer]];
    if (blackhandServer == null) {
        console.log("ERROR: Could not find The Black Hand Server");
    } else if (!theblackhandFac.isBanned && !theblackhandFac.isMember && blackhandServer.manuallyHacked &&
               !theblackhandFac.alreadyInvited && this.hacking_skill >= 350 && homeComp.maxRam >= 64) {
        invitedFactions.push(theblackhandFac);
    }

    //NiteSec
    var nitesecFac = Factions["NiteSec"];
    var nitesecServer = AllServers[SpecialServerIps[SpecialServerNames.NiteSecServer]];
    if (nitesecServer == null) {
        console.log("ERROR: Could not find NiteSec Server");
    } else if (!nitesecFac.isBanned && !nitesecFac.isMember && nitesecServer.manuallyHacked &&
               !nitesecFac.alreadyInvited && this.hacking_skill >= 200 && homeComp.maxRam >= 32) {
        invitedFactions.push(nitesecFac);
    }

    //Chongqing
    var chongqingFac = Factions["Chongqing"];
    if (!chongqingFac.isBanned && !chongqingFac.isMember && !chongqingFac.alreadyInvited &&
        this.money.gte(20000000) && this.city == Locations.Chongqing) {
        invitedFactions.push(chongqingFac);
    }

    //Sector-12
    var sector12Fac = Factions["Sector-12"];
    if (!sector12Fac.isBanned && !sector12Fac.isMember && !sector12Fac.alreadyInvited &&
        this.money.gte(15000000) && this.city == Locations.Sector12) {
        invitedFactions.push(sector12Fac);
    }

    //New Tokyo
    var newtokyoFac = Factions["New Tokyo"];
    if (!newtokyoFac.isBanned && !newtokyoFac.isMember && !newtokyoFac.alreadyInvited &&
        this.money.gte(20000000) && this.city == Locations.NewTokyo) {
        invitedFactions.push(newtokyoFac);
    }

    //Aevum
    var aevumFac = Factions["Aevum"];
    if (!aevumFac.isBanned && !aevumFac.isMember  && !aevumFac.alreadyInvited &&
        this.money.gte(40000000) && this.city == Locations.Aevum) {
        invitedFactions.push(aevumFac);
    }

    //Ishima
    var ishimaFac = Factions["Ishima"];
    if (!ishimaFac.isBanned && !ishimaFac.isMember && !ishimaFac.alreadyInvited &&
        this.money.gte(30000000) && this.city == Locations.Ishima) {
        invitedFactions.push(ishimaFac);
    }

    //Volhaven
    var volhavenFac = Factions["Volhaven"];
    if (!volhavenFac.isBanned && !volhavenFac.isMember && !volhavenFac.alreadyInvited &&
        this.money.gte(50000000) && this.city == Locations.Volhaven) {
        invitedFactions.push(volhavenFac);
    }

    //Speakers for the Dead
    var speakersforthedeadFac = Factions["Speakers for the Dead"];
    if (!speakersforthedeadFac.isBanned && !speakersforthedeadFac.isMember && !speakersforthedeadFac.alreadyInvited &&
        this.hacking_skill >= 100 && this.strength >= 300 && this.defense >= 300 &&
        this.dexterity >= 300 && this.agility >= 300 && this.numPeopleKilled >= 30 &&
        this.karma <= -45 && !allCompanies.includes(Locations.Sector12CIA) &&
        !allCompanies.includes(Locations.Sector12NSA)) {
        invitedFactions.push(speakersforthedeadFac);
    }

    //The Dark Army
    var thedarkarmyFac = Factions["The Dark Army"];
    if (!thedarkarmyFac.isBanned && !thedarkarmyFac.isMember && !thedarkarmyFac.alreadyInvited &&
        this.hacking_skill >= 300 && this.strength >= 300 && this.defense >= 300 &&
        this.dexterity >= 300 && this.agility >= 300 && this.city == Locations.Chongqing &&
        this.numPeopleKilled >= 5 && this.karma <= -45 && !allCompanies.includes(Locations.Sector12CIA) &&
        !allCompanies.includes(Locations.Sector12NSA)) {
        invitedFactions.push(thedarkarmyFac);
    }

    //The Syndicate
    var thesyndicateFac = Factions["The Syndicate"];
    if (!thesyndicateFac.isBanned && !thesyndicateFac.isMember && !thesyndicateFac.alreadyInvited &&
        this.hacking_skill >= 200 && this.strength >= 200 && this.defense >= 200 &&
        this.dexterity >= 200 && this.agility >= 200 &&
        (this.city == Locations.Aevum || this.city == Locations.Sector12) &&
        this.money.gte(10000000) && this.karma <= -90 &&
        !allCompanies.includes(Locations.Sector12CIA) && !allCompanies.includes(Locations.Sector12NSA)) {
        invitedFactions.push(thesyndicateFac);
    }

    //Silhouette
    var silhouetteFac = Factions["Silhouette"];
    if (!silhouetteFac.isBanned && !silhouetteFac.isMember && !silhouetteFac.alreadyInvited &&
        (allPositions.includes("Chief Technology Officer") ||
         allPositions.includes("Chief Financial Officer") ||
         allPositions.includes("Chief Executive Officer")) &&
         this.money.gte(15000000) && this.karma <= -22) {
        invitedFactions.push(silhouetteFac);
    }

    //Tetrads
    var tetradsFac = Factions["Tetrads"];
    if (!tetradsFac.isBanned && !tetradsFac.isMember && !tetradsFac.alreadyInvited &&
        (this.city == Locations.Chongqing || this.city == Locations.NewTokyo ||
        this.city == Locations.Ishima) && this.strength >= 75 && this.defense >= 75 &&
        this.dexterity >= 75 && this.agility >= 75 && this.karma <= -18) {
        invitedFactions.push(tetradsFac);
    }

    //SlumSnakes
    var slumsnakesFac = Factions["Slum Snakes"];
    if (!slumsnakesFac.isBanned && !slumsnakesFac.isMember && !slumsnakesFac.alreadyInvited &&
        this.strength >= 30 && this.defense >= 30 && this.dexterity >= 30 &&
        this.agility >= 30 && this.karma <= -9 && this.money.gte(1000000)) {
        invitedFactions.push(slumsnakesFac);
    }

    //Netburners
    var netburnersFac = Factions["Netburners"];
    var totalHacknetRam = 0;
    var totalHacknetCores = 0;
    var totalHacknetLevels = 0;
    for (var i = 0; i < this.hacknetNodes.length; ++i) {
        totalHacknetLevels += this.hacknetNodes[i].level;
        totalHacknetRam += this.hacknetNodes[i].ram;
        totalHacknetCores += this.hacknetNodes[i].cores;
    }
    if (!netburnersFac.isBanned && !netburnersFac.isMember && !netburnersFac.alreadyInvited &&
        this.hacking_skill >= 80 && totalHacknetRam >= 8 &&
        totalHacknetCores >= 4 && totalHacknetLevels >= 100) {
        invitedFactions.push(netburnersFac);
    }

    //Tian Di Hui
    var tiandihuiFac = Factions["Tian Di Hui"];
    if (!tiandihuiFac.isBanned &&  !tiandihuiFac.isMember && !tiandihuiFac.alreadyInvited &&
        this.money.gte(1000000) && this.hacking_skill >= 50 &&
        (this.city == Locations.Chongqing || this.city == Locations.NewTokyo ||
         this.city == Locations.Ishima)) {
        invitedFactions.push(tiandihuiFac);
    }

    //CyberSec
    var cybersecFac = Factions["CyberSec"];
    var cybersecServer = AllServers[SpecialServerIps[SpecialServerNames.CyberSecServer]];
    if (cybersecServer == null) {
        console.log("ERROR: Could not find CyberSec Server");
    } else if (!cybersecFac.isBanned && !cybersecFac.isMember && cybersecServer.manuallyHacked &&
               !cybersecFac.alreadyInvited && this.hacking_skill >= 50) {
        invitedFactions.push(cybersecFac);
    }

    return invitedFactions;
}


/*************** Gang ****************/
//Returns true if Player is in a gang and false otherwise
PlayerObject.prototype.inGang = function() {
    if (this.gang == null || this.gang == undefined) {return false;}
    return (this.gang instanceof Gang);
}

PlayerObject.prototype.startGang = function(factionName, hacking) {
    this.gang = new Gang(factionName, hacking);
}

/*************** Corporation ****************/
PlayerObject.prototype.hasCorporation = function() {
    if (this.corporation == null) { return false; }
    return (this.corporation instanceof Corporation);
}

/*************** Bladeburner ****************/
PlayerObject.prototype.inBladeburner = function() {
    if (this.bladeburner == null) { return false; }
    return (this.bladeburner instanceof Bladeburner);
}

/************* BitNodes **************/
PlayerObject.prototype.setBitNodeNumber = function(n) {
    this.bitNodeN = n;
}

PlayerObject.prototype.queueAugmentation = function(name) {
    for(const i in this.queuedAugmentations) {
        if(this.queuedAugmentations[i].name == name) {
            console.log('tried to queue '+name+' twice, this may be a bug');
            return;
        }
    }

    for(const i in this.augmentations) {
        if(this.augmentations[i].name == name) {
            console.log('tried to queue '+name+' but we already have that aug');
            return;
        }
    }

    this.firstAugPurchased = true;
    this.queuedAugmentations.push(new PlayerOwnedAugmentation(name));
}

/************* Coding Contracts **************/
PlayerObject.prototype.gainCodingContractReward = function(reward, difficulty=1) {
    if (reward == null || reward.type == null || reward == null) {
        return `No reward for this contract`;
    }

    /* eslint-disable no-case-declarations */
    switch (reward.type) {
        case CodingContractRewardType.FactionReputation:
            if (reward.name == null || !(Factions[reward.name] instanceof Faction)) {
                // If no/invalid faction was designated, just give rewards to all factions
                reward.type = CodingContractRewardType.FactionReputationAll;
                return this.gainCodingContractReward(reward);
            }
            var repGain = CONSTANTS.CodingContractBaseFactionRepGain * difficulty;
            Factions[reward.name].playerReputation += repGain;
            return `Gained ${repGain} faction reputation for ${reward.name}`;
        case CodingContractRewardType.FactionReputationAll:
            const totalGain = CONSTANTS.CodingContractBaseFactionRepGain * difficulty;

            // Ignore Bladeburners and other special factions for this calculation
            const specialFactions = ["Bladeburners"];
            var factions = this.factions.slice();
            factions = factions.filter((f) => {
                return !specialFactions.includes(f);
            });

            // If the player was only part of the special factions, we'll just give money
            if (factions.length == 0) {
                reward.type = CodingContractRewardType.Money;
                return this.gainCodingContractReward(reward, difficulty);
            }

            const gainPerFaction = Math.floor(totalGain / factions.length);
            for (const facName of factions) {
                if (!(Factions[facName] instanceof Faction)) { continue; }
                Factions[facName].playerReputation += gainPerFaction;
            }
            return `Gained ${gainPerFaction} reputation for each of the following factions: ${factions.toString()}`;
            break;
        case CodingContractRewardType.CompanyReputation:
            if (reward.name ==  null || !(Companies[reward.name] instanceof Company)) {
                //If no/invalid company was designated, just give rewards to all factions
                reward.type = CodingContractRewardType.FactionReputationAll;
                return this.gainCodingContractReward(reward);
            }
            var repGain = CONSTANTS.CodingContractBaseCompanyRepGain * difficulty;
            Companies[reward.name].playerReputation += repGain;
            return `Gained ${repGain} company reputation for ${reward.name}`;
            break;
        case CodingContractRewardType.Money:
        default:
            var moneyGain = CONSTANTS.CodingContractBaseMoneyGain * difficulty * BitNodeMultipliers.CodingContractMoney;
            this.gainMoney(moneyGain);
            this.recordMoneySource(moneyGain, "codingcontract");
            return `Gained ${numeralWrapper.format(moneyGain, '$0.000a')}`;
            break;
    }
    /* eslint-enable no-case-declarations */
}

/* Functions for saving and loading the Player data */
function loadPlayer(saveString) {
    Player  = JSON.parse(saveString, Reviver);

    //Parse Decimal.js objects
    Player.money = new Decimal(Player.money);

    if (Player.corporation instanceof Corporation) {
        Player.corporation.funds = new Decimal(Player.corporation.funds);
        Player.corporation.revenue = new Decimal(Player.corporation.revenue);
        Player.corporation.expenses = new Decimal(Player.corporation.expenses);

        for (var i = 0; i < Player.corporation.divisions.length; ++i) {
            var ind = Player.corporation.divisions[i];
            ind.lastCycleRevenue = new Decimal(ind.lastCycleRevenue);
            ind.lastCycleExpenses = new Decimal(ind.lastCycleExpenses);
            ind.thisCycleRevenue = new Decimal(ind.thisCycleRevenue);
            ind.thisCycleExpenses = new Decimal(ind.thisCycleExpenses);
        }
    }
}

PlayerObject.prototype.toJSON = function() {
    return Generic_toJSON("PlayerObject", this);
}

PlayerObject.fromJSON = function(value) {
    return Generic_fromJSON(PlayerObject, value.data);
}

Reviver.constructors.PlayerObject = PlayerObject;

let Player = new PlayerObject();
export {Player, loadPlayer};
