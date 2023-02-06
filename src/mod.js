"use strict";

class Mod
{
	
	postDBLoad(container) 
	{
		// Constants
		const logger = container.resolve("WinstonLogger");
		const database = container.resolve("DatabaseServer").getTables();
		const core = container.resolve("JustNUCore");
		const VFS = container.resolve("VFS");
		const modLoader = container.resolve("PreAkiModLoader");
		const config = require("../config/config.json");
		const itemConfig = require("../config/itemConfig.json");
		const itemData = require("../db/items/itemData.json");
		const enLocale = require(`../db/locales/en.json`);
		const modPath = modLoader.getModPath("Bad Dragon Armband");
		
		//add retextures
		for (const categoryId in itemConfig) {
			for (const itemId in itemConfig[categoryId]) {
				// handle locale
				for (const localeID in database.locales.global) {
					// en placeholder
					if (enLocale[itemId]) {
						if (enLocale[itemId].Name)
							database.locales.global[localeID][`${itemId} Name`] = enLocale[itemId].Name;
						if (enLocale[itemId].ShortName)
							database.locales.global[localeID][`${itemId} ShortName`] = enLocale[itemId].ShortName;
						if (enLocale[itemId].Description)
							database.locales.global[localeID][`${itemId} Description`] = enLocale[itemId].Description;
					}
					
					// actual locale
					if (VFS.exists(`${modPath}locales/${localeID}.json`) && localeID != "en") {
						const actualLocale = require(`../locales/${localeID}.json`);

						if (actualLocale[itemId]) {
							if (actualLocale[itemId].Name)
								database.locales.global[localeID][`${itemId} Name`] = actualLocale[itemId].Name;
							if (actualLocale[itemId].ShortName)
								database.locales.global[localeID][`${itemId} ShortName`] = actualLocale[itemId].ShortName;
							if (actualLocale[itemId].Description)
								database.locales.global[localeID][`${itemId} Description`] = actualLocale[itemId].Description;
						}
					}
					
				}
				
				// add item retexture that is 1:1 to original item
				if (itemConfig[categoryId][itemId]) {
					const data = itemData[itemId];
					
					core.addItemRetexture(itemId, data.BaseItemID, data.BundlePath, config.EnableTradeOffers, config.AddToBots, data.LootWeigthMult);
				}
			}
		}
	}
}

module.exports = { mod: new Mod() }