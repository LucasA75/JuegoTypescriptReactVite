import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";

export default class LaserObstacle extends Phaser.GameObjects.Container
{
    constructor(scene: Phaser.Scene, x:number, y:number)
    {
        super(scene,x,y)

        //crear el top
        const top = scene.add.image(0,0,TextureKeys.LaserEnd)
        .setOrigin(0.5,0)

        //crear el del mido y setearlo abajo de top
        const middle = scene.add.image(
            0,
            top.y + top.displayHeight,
            TextureKeys.LaserMiddle
        )
        .setOrigin(0.5,0)

        //seteamos la altura del medio laser a 200px
        middle.setDisplaySize(middle.width,200)

        //creamos un laser abajo y que esta dado vuelta abajo del de almedio
        const bottom = scene.add.image(0,middle.y + middle.displayHeight,
            TextureKeys.LaserEnd)
            .setOrigin(0.5,0)
            .setFlipY(true)
            
        //le agregamos fisicas al laser
        scene.physics.add.existing(this,true)

        //Con esto le decimos que el body es static -> un cuerpo statico colisionarta con los normal body
        //con la ventaja que el static no se movera al chocar
        const body = this.body as Phaser.Physics.Arcade.StaticBody
        const width = top.displayWidth
        const height = top.displayHeight + middle.displayHeight + bottom.displayHeight

        body.setSize(width,height - 20)
        body.setOffset(-width * 0.5,0)

        //reposicion del body
        body.position.x = this.x + body.offset.x
        body.position.y = this.y

        
        
            // agregarlos al container
            this.add(top)
            this.add(middle)
            this.add(bottom)
    }


}