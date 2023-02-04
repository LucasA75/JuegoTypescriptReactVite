import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
import SceneKeys from "../consts/SceneKeys";
import AnimationKeys from "../consts/AnimationKeys";

export default class Preloader extends Phaser.Scene {

    constructor() {
        super(SceneKeys.Preloader)
    }

    preload() {
        /* Cargaremos el background */
        this.load.image(
            TextureKeys.Background /* Aqui se ocupa un enums */
            , 'assets/bg_repeat_340x640.png')

        /* cargaremos un atlas -> se ocupa para llamar a un JSON para cargar las imagenes */
        this.load.atlas(
            /* un sprite atlas o sprite sheet es una imagen que contiene muchas imagenes pequeñas */
            TextureKeys.RocketMouse,
            'assets/rocket-mouse.png',
            'assets/rocket-mouse.json'
        )

        /* Cargaremos decoracion */
        this.load.image(
            TextureKeys.MouseHole,
            'assets/object_mousehole.png'
        )

        this.load.image(
            TextureKeys.Window1,
            'assets/object_window1.png'
        )
        this.load.image(
            TextureKeys.Window2,
            'assets/object_window2.png'
        )
        //Cargaremos los libreros
        this.load.image(
            TextureKeys.Bookcase1,
            'assets/object_bookcase1.png'
        )

        this.load.image(
            TextureKeys.Bookcase2,
            'assets/object_bookcase2.png'
        )

        this.load.image(
            TextureKeys.LaserEnd,
            'assets/object_laser_end.png'
        )
        this.load.image(
            TextureKeys.LaserMiddle,
            'assets/object_laser.png'
        )
        this.load.image(
            TextureKeys.Coin,
            'assets/object_coin.png'
        )

    }

    create() {

        /* crearemos la animacion */
        this.anims.create({

            key: AnimationKeys.RocketMouseRun, //nombre de la animacion
            //ayuda para generar los frames
            frames: this.anims.generateFrameNames('rocket-mouse', {
                start: 1,
                end: 4,
                prefix: 'rocketmouse_run',
                zeroPad: 2,
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1 //-1 para un loop infinito
        })

        this.anims.create({
            key:AnimationKeys.RocketFlamesOn,
            frames:this.anims.generateFrameNames(TextureKeys.RocketMouse,
                {start:1,end:2,prefix:'flame',suffix:".png"}),
                frameRate:10,
                repeat:-1
        })

        //Animacion de caida
        this.anims.create({
            key:AnimationKeys.RocketMouseFall,
            frames:[{
                key:TextureKeys.RocketMouse,
                frame:"rocketmouse_fall01.png"
            }]
        })

        //Animacion de volar
        this.anims.create({
            key:AnimationKeys.RocketMouseFly,
            frames:[{
                key:TextureKeys.RocketMouse,
                frame:"rocketmouse_fly01.png"
            }]
        })

        //animacion de muerte
        this.anims.create({
            key:AnimationKeys.RocketMouseDead,
            frames: this.anims.generateFrameNames(TextureKeys.RocketMouse,
                {
                    start:1,
                    end:2,
                    prefix:'rocketmouse_dead',
                    zeroPad:2,
                    suffix:'.png'
                }),
                frameRate:10
                
        })
        /* cuando el preaload este cargado entrara en:  */
        this.scene.start(SceneKeys.Game)
    }

}
