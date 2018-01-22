var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const fs = require('fs');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
		colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
	 token: auth.token,
	 autorun: true
});
bot.on('ready', function (evt) {
		logger.info('Connected');
		logger.info('Logged in as: ');
		logger.info(bot.username + ' - (' + bot.id + ')');
	bot.setPresence({game: {name: "With my code", type: 0}});
});

function keepTrack(user) {
	var data = user + '\r\n'
	fs.appendFile('data/users.txt', data, (err) => {
		if (err) throw err;
		console.log('The user ' + user + ' is now registered.');
	});
}

function makeUser(user, userID, channelID) {
	filename = 'data/' + user + userID + '.txt'
	blankfile = user + ' ' + userID + '\r\n' + 'var info = [ "class", "level", "name", "race", "weapon", "armor", "artifact"]\r\n';
	fs.open(filename, 'wx+', (err, fd) => {
		if (err) {
			bot.sendMessage({
				to: channelID,
				message: 'You have already created a user, <@!' + userID + '> :S'
			});
			return;
		} else {
			bot.sendMessage({
				to: channelID,
				message: 'Sure, <@!' + userID + '>!'
			});
			keepTrack(user);
			var newuserfile = fs.createWriteStream(filename);
			newuserfile.write(blankfile);
		}
	});
}

function setClass(user, userID, channelID, mod2) {
	switch(mod2){  //bot responses for the various classes
		case 'wizard':
		bot.sendMessage({
			to: channelID,
			message: 'Yer a wizard, <@!' + userID + '>!'
		});
		break;
		case 'cleric':
		bot.sendMessage({
			to: channelID,
			message: 'By the light!'
		});
		break;
		case 'warrior':
		bot.sendMessage({
			to: channelID,
			message: 'You will be unstoppable!'
		});
		break;
		case 'ranger':
		bot.sendMessage({
			to: channelID,
			message: 'Nature is your ally!'
		});
		break;
		case 'rogue':
		bot.sendMessage({
			to: channelID,
			message: 'Sneaky, sneaky!'
		});
		break;
		case 'paladin':
		bot.sendMessage({
			to: channelID,
			message: 'Justice demands retribution!'
		});
		break;
		case 'druid':
		bot.sendMessage({
			to: channelID,
			message: 'Nature must be preserved!'
		});
		break;
		case 'shaman':
		bot.sendMessage({
			to: channelID,
			message: 'Storm and Thunder!'
		});
		break;
		case 'warlock':
		bot.sendMessage({
			to: channelID,
			message: 'Unlimited Powah!'
		});
	}
	if (mod2 == 'warrior' || mod2 == 'shaman' ||
		mod2 == 'rogue' || mod2 == 'wizard' ||
		mod2 == 'cleric' || mod2 == 'ranger' ||
		mod2 == 'druid' || mod2 == 'paladin' || mod2 == 'warlock') {
		//editClass(user, userID, mod2);
	} else if (mod2 == 'help') {
		bot.sendMessage({
			to: channelID,
			message: 'Choose one of the following classes: Warrior, Paladin, Cleric, Shaman, Druid, Ranger, Rogue, Wizard, Warlock.'
		});
	} else {
		bot.sendMessage({
			to: channelID,
			message: "Not a valid class. Try '&choose class help' if you're unsure."
		});
	}
}

bot.on('message', function (user, userID, channelID, message, evt) {
	// Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `&`
	if (message.substring(0, 1) == '&') {
		var args = message.substring(1).split(' ');
		var cmd = args[0];  //first word after the &
		var mod = args[1];  //second word after the &
		var mod2 = args[2];  //third word after the &

		args = args.splice(1);
		switch(cmd) {
			case 'ping':
			bot.sendMessage({
				to: channelID,
				message: 'Pong!'
			});
			break;

			case 'hi':
			case 'howdy':
			case 'hey':
			case 'hello':
			bot.sendMessage({
				to: channelID,
				message: 'Hi :) '
			});
			break;

			case 'tasty':
			case 'food':
			case 'nom':
			bot.sendMessage({
				to: channelID,
				message: ':A'
			});
			break;

			case 'ilu':
			if(userID == '110687475193634816') {    //if Moly uses command, ping Freo
				bot.sendMessage({
					to: channelID,
					message: 'I love you, <@!237665802415898626>! <3'
				});
			} else if(userID == '237665802415898626') {  //if Freo uses command, ping Moly
				bot.sendMessage({
					to: channelID,
					message: 'I love you, <@!110687475193634816>! <3'
				})
			} else if(userID == '337068093186768896') {  //if Tonks uses command, ping Tonks
				bot.sendMessage({
					to: channelID,
					message: 'I love you, <@!337068093186768896>! <3'
				})
			}
			break;

			case 'createuser':
			makeUser(user, userID, channelID);
			break;

			case 'choose':
			switch(mod){
				case 'class':
				setClass(user, userID, channelID, mod2);
				break;
			}
		}
	}
});
