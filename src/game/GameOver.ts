import Phaser from "phaser";

import SceneKeys from "../consts/SceneKeys";

export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super(SceneKeys.GameOver)
    }

    create()
    {
        //destructuracion de objetos
        const {width, height} = this.scale
        /* Esto es lo mismo que haber escrito 
        const width = this.scale.width
        const height = this.scale.height

        */

        //x,y seran el medio de la pantalla
        const x = width * 0.5
        const y = height * 0.5

        //agregamos el texto
        this.add.text(x,y,"Apreta Espacio para jugar",{
            fontSize:"32px",
            color:"#FFFFFF",
            backgroundColor:"#000000",
            shadow:{ fill: true, blur:0, offsetY:0},
            padding: {left:15, right:15, top:10, bottom:10}
        })
        .setOrigin(0.5)

        //Haremos que cuando se aprete el space bar se pueda volver a jugar
        this.input.keyboard.once("keydown-SPACE", () =>{
            //parar la scene de GameOver
            this.scene.stop(SceneKeys.GameOver)

            //Reiniciar la escena de juego
            this.scene.stop(SceneKeys.Game)
            this.scene.start(SceneKeys.Game)
        })
    }
}