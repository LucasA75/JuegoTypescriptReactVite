import Phaser from 'phaser'
import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameOver from './game/GameOver'
import GameStart from './game/GameStart'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 250 },
			debug:false
			
		}
	},
	scene: [Preloader,GameStart,Game,GameOver]
}
 
export default new Phaser.Game(config)
