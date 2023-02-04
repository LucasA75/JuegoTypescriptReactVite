/* GameObject no tiene children pero tenemos container para esto */
import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
import AnimationKeys from "../consts/AnimationKeys";
import SceneKeys from "../consts/SceneKeys";


/* vamos a crear un enum con los diferentes states que puede tener el raton */
enum MouseState {
    Running,
    Killed,
    Dead
}


export default class RocketMouse extends Phaser.GameObjects.Container {


    private mouseState = MouseState.Running
    //Crearemos una clase de Flames para acceder a ella
    private flames: Phaser.GameObjects.Sprite

    //Creamos una propiedad de raton
    private mouse: Phaser.GameObjects.Sprite

    //Haremos la clase del cursor -> para pulsar teclas
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys // este metodo  es muy util para leer el teclado



    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y)
        /* Creamos un sprite similarmente a como lo hicimos en Game 
        y lo agregamos al container */

        //creatremos el Rocket Mouse sprite
        this.mouse = scene.add.sprite(0, 0, TextureKeys.RocketMouse)
            .setOrigin(0.5, 1)
            .play(AnimationKeys.RocketMouseRun)

        //Agregamnos las flamas y reporducimos la animacion
        this.flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse)
            .play(AnimationKeys.RocketFlamesOn)

        this.enableJetpack(false)

        //Agregamos la animacion
        this.add(this.flames)
        //Agregamos el hijo del container
        this.add(this.mouse)

        //Agregamos las fisicas de body
        scene.physics.add.existing(this)

        //Ajustamos las fisicas
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(this.mouse.width, this.mouse.height)
        body.setOffset(this.mouse.width * -0.5, -this.mouse.height)

        //Intansiamos el CursorKeys
        this.cursors = scene.input.keyboard.createCursorKeys()

        //Ajustaremos el tamaño del box collider
        body.setSize(this.mouse.width * 0.5, this.mouse.height * 0.7)

        //Ajustamos el offset to emparejarse
        body.setOffset(this.mouse.width * -0.3, -this.mouse.height + 15)

    }

    kill() {

        //no hagas nada si no esta en Running
        if (this.mouseState !== MouseState.Running) {
            return
        }

        //seteamos la muerte del raton
        this.mouseState = MouseState.Killed

        this.mouse.play(AnimationKeys.RocketMouseDead)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setAccelerationY(0)
        body.setVelocity(1000, 0)
        this.enableJetpack(false)
    }


    //Esto tambien se puede hacer en Game en update pero por simplicidad lo haremos aca
    preUpdate() {

        const body = this.body as Phaser.Physics.Arcade.Body

        switch (this.mouseState) {
            case MouseState.Running:
                {
                    //Check si la barra spaciadora esta presionada
                    if (this.cursors.space?.isDown) {
                        //seteamos el salto
                        body.setAccelerationY(-600)
                        this.enableJetpack(true)

                        //play la animacion de vuelo
                        this.mouse.play(AnimationKeys.RocketMouseFly, true)
                    }
                    else {
                        //apagamos el jetpack si la tecla no esta apretada
                        body.setAccelerationY(0)
                        this.enableJetpack(false)
                    }

                    //Ckequeamos si toco el suelo el player
                    if (body.blocked.down) {
                        //Corremos la animacion de caminar
                        this.mouse.play(AnimationKeys.RocketMouseRun, true)
                    }
                    else if (body.velocity.y > 0) {
                        //Reproducimos la animacion de caida si no esta subiendo
                        this.mouse.play(AnimationKeys.RocketMouseFall, true)
                    }
                    //break statement
                    break
                }
                case MouseState.Killed:
                    {
                        //reduce la velocidad un 99%
                        body.velocity.x *= 0.99

                        //una vez menos que 5 podemos decir -> Goodbye mouse
                        if(body.velocity.x <= 5)
                        {
                            this.mouseState = MouseState.Dead
                        }
                        break
                    }
                
                case MouseState.Dead:
                    {
                        //Se para completamente
                        body.setVelocity(0,0)
                        //cambiamos de escena
                        this.scene.scene.run(SceneKeys.GameOver)
                        break
                    }
            }
    }

    enableJetpack(enabled: boolean) {
        this.flames.setVisible(enabled)
    }
    /* Le agregaremos fisicas al container enves de al sprite */

   
}