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
		const config = require("../config/config.json");
		const itemConfig = require("../config/itemConfig.json");
		const itemData = require("../db/items/itemData.json");
		const enLocale = require(`../db/locales/en.json`);
		const modPath = __dirname.split("\\").slice(0, -1).join("\\");
		
		//add retextures
		for (const categoryId in itemConfig) {
			for (const itemId in itemConfig[categoryId]) {
				// handle locale
				for (const localeID in database.locales.global) {
					// en placeholder
					if (enLocale[itemId]) {
						for (const localeItemEntry in enLocale[itemId]) {
							database.locales.global[localeID][`${itemId} ${localeItemEntry}`] = enLocale[itemId][localeItemEntry];
						}
					}
					
					// actual locale
					if (VFS.exists(`${modPath}\\locales\\${localeID}.json`) && localeID != "en") {
						const actualLocale = require(`../locales/${localeID}.json`);

						if (actualLocale[itemId]) {
							for (const localeItemEntry in actualLocale[itemId]) {
								database.locales.global[localeID][`${itemId} ${localeItemEntry}`] = actualLocale[itemId][localeItemEntry];
							}
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