import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import RocketMouse from "../game/RocketMouse";
import LaserObstacle from "../game/LaserObstacle"; 
import SoundKeys from "../consts/SoundKeys";

export default class Game extends Phaser.Scene{

    //crearemos la background class
    private background!: Phaser.GameObjects.TileSprite //con el ! le decimos que el valor jamas sera null o undefined
    //crearemos la MouseHole class
    private mouseHole!: Phaser.GameObjects.Image
    /* otras clases */
    private window1!: Phaser.GameObjects.Image
    private window2!: Phaser.GameObjects.Image
    private bookcase1!: Phaser.GameObjects.Image
    private bookcase2!: Phaser.GameObjects.Image
    private bookcases:Phaser.GameObjects.Image[] = []
    private windows:Phaser.GameObjects.Image[] = []
    private laserObstacle!: LaserObstacle
    private coins! : Phaser.Physics.Arcade.StaticGroup
    private scoreLabel! : Phaser.GameObjects.Text
    private mouse! : RocketMouse
    private score = 0

    constructor()
    {
        /* Phaser 3 no nos deja setear una propiedad en el constructor */
        super(SceneKeys.Game)
    }

    init()
    {
        this.score = 0
    }

    create()
    {

         //guardar el ancho y largo del game screen
         const width = this.scale.width
         const height = this.scale.height

        /* Vamos a ocupar TileSprite */
        //guardaremos el TileSprite en this.Background
        this.background = this.add.tileSprite(0,0,width,height,TextureKeys.Background)
        .setOrigin(0,0)
        .setScrollFactor(0,0) //abtenga de hacer scroll
        /* lo seteamos que empieze en la esquina porque por default tiene el origen en 0.5,0.5 que es el medio */

        /* Agregaremos decoracion */
        this.mouseHole = this.add.image(
            Phaser.Math.Between(900,1500), //valor de X
            501, // valor de Y
            TextureKeys.MouseHole
        )

        this.window1 = this.add.image(
            Phaser.Math.Between(900,1300),
            200,
            TextureKeys.Window1
        )

        this.window2 = this.add.image(
            Phaser.Math.Between(1600,2000),
            200,
            TextureKeys.Window2
        )
        //Array de windows
        this.windows = [this.window1,this.window2]

        this.bookcase1 = this.add.image(
            Phaser.Math.Between(2200,2700),
            580,
            TextureKeys.Bookcase1
        )
        .setOrigin(0.5,1)

        this.bookcase2 = this.add.image(
            Phaser.Math.Between(2900,3400),
            580,
            TextureKeys.Bookcase2
        )
        .setOrigin(0.5,1)

        //Array de libreros
        this.bookcases = [this.bookcase1, this.bookcase2]


        //Agregamos los laseres
        this.laserObstacle = new LaserObstacle(this,900,100)
        this.add.existing(this.laserObstacle)

        //Agregamos el grupo de monedas
        this.coins = this.physics.add.staticGroup()
        this.spawnCoins()

        /* // Agregaremops el sprite del raton 
        const mouse = this.physics.add.sprite( //Le agregaremos fisicas al personaje
            width * 0.5,
            height -30, //seteamos y como el top del piso
            TextureKeys.RocketMouse,
            'rocketmouse_fly01.png'
        )
        .setOrigin(0.5,1) //seteamos el origen al pie de la pantalla
        .play(AnimationKeys.RocketMouseRun)
 */     
            //agregamos el nuevo RocketMouse
        const mouse = new RocketMouse(this,width*0.5,height -30)
        this.add.existing(mouse)

     
        //Esto da error porque ya no estamos ocupando el atributo "body"
        //Fisica del cuerpo
        const body = mouse.body as Phaser.Physics.Arcade.Body
        // Esto hace que el body este "atado" al mundo
        body.setCollideWorldBounds(true)
        //seteamos la velocidad -> como es un infinite runner el valor no lo maneja el usuario
        body.setVelocityX(200)

        

        this.physics.world.setBounds(
            0,0, //x,y
            Number.MAX_SAFE_INTEGER,height -55 //ancho y largo
        )

        //crearemos un check para ver si se solapa el laser con el raton
        this.physics.add.overlap(
            this.laserObstacle,
            mouse,
            this.handleOverlapLaser,
            undefined,
            this
        )

        //crearemos el overlap detencion de las monedas
        this.physics.add.overlap(
            this.coins,
            mouse,
            this.handleCollectCoin,
            undefined,
            this
        )

        //creamos el label del collection coins
        this.scoreLabel = this.add.text(10,10,`Monedas: ${this.score}`,{
            fontSize:"24px",
            color:"#080808",
            backgroundColor:"#F8E71C",
            shadow:{fill: true,blur:0, offsetY:0},
            padding: { left:15,right:15,top:10,bottom:10}
        })
        .setScrollFactor(0)

        /* Creamos la camara */

        this.cameras.main.startFollow(mouse) //Esto hace que la camara siga al raton
        this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,height) //la camara no se movera de arriba a abajo solo de izquierda a derecha

    }

    update(time: number /* El tiempo desde que la scene se inicio */, 
            delta: number /* El tiempo pasado desde el ultimo frame */ )
        {
        //scroll el background en el eje X
        this.background.setTilePosition(this.cameras.main.scrollX)
        this.wrapMouseHole()
        this.wrapWindows()
        this.wrapLaserObstacle()
        this.wrapBookcases()
        //El teletrasporte no funciona porque hay un problema con el raton
        /* this.teleportBackwards() */
       
    }

    private handleCollectCoin(
        obj1: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    )
    {
        //objeto 2 sera la moneda
        const coin = obj2 as Phaser.Physics.Arcade.Sprite

        //usar el grupo para ocultarlo
        this.coins.killAndHide(coin)

        //apagar las fisicas del body
        coin.body.enable = false

        //agregamos el sonido
        this.sound.play(SoundKeys.CoinSound)

        //incrementamos en 1
        this.score += 1

        //actualizamos el texto
        this.scoreLabel.text = `Monedas: ${this.score}`
    }

    private wrapMouseHole() {
        const scrollX = this.cameras.main.scrollX //Guarda el valor del eje x de la camara
        const rightEdge = scrollX + this.scale.width // representa el lado derecho de la pantalla

        if(this.mouseHole.x + this.mouseHole.width < scrollX)
        {
            this.mouseHole.x = Phaser.Math.Between(
                rightEdge + 100,
                rightEdge + 1000
            )
        }
    }

    private wrapWindows() {
        const scrollX = this.cameras.main.scrollX //Guarda el valor del eje x de la camara
        const rightEdge = scrollX + this.scale.width // representa el lado derecho de la pantalla

        let width = this.window1.width * 2 //para agregar mas padding
        if(this.window1.x + width < scrollX)
        {
            this.window1.x = 
            Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + 800
            )
            /* Vamos a revisar si se solapa con un librero */
            const overlap = this.bookcases.find(bc =>{
                return Math.abs(this.window1.x - bc.x) <= this.window1.width
            })
            //Lo mostrara solo si no se solapa
            this.window1.visible = !overlap
        }

        width = this.window2.width
        if(this.window2.x + width < scrollX)
        {
            this.window2.x = Phaser.Math.Between(
                this.window1.x + width, //se ocupa window1 como param para que no se traslapen
                this.window1.x + width + 800
            )
            /* Vamos a revisar si se solapa con un librero */
            const overlap = this.bookcases.find(bc =>{
                return Math.abs(this.window2.x - bc.x) <= this.window2.width
            })
            //Lo mostrara solo si no se solapa
            this.window2.visible = !overlap
        }
    }

    private wrapBookcases() {
        const scrollX = this.cameras.main.scrollX //Guarda el valor del eje x de la camara
        const rightEdge = scrollX + this.scale.width // representa el lado derecho de la pantalla

        let width = this.bookcase1.width * 2 //para agregar mas padding
        if(this.bookcase1.x + width < scrollX)
        {
            this.bookcase1.x = Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + 800
            )
            /* Este codigo es parecido al que esta en windows para el problema de solapamiento */
            const overlap = this.windows.find(win =>{
                return Math.abs(this.bookcase1.x - win.x) <= win.width
            })
            this.bookcase1.visible = !overlap
        }
        

        width = this.bookcase2.width
        if(this.bookcase2.x + width < scrollX)
        {
            this.bookcase2.x = Phaser.Math.Between(
                this.bookcase1.x + width, //se ocupa bookcase1 como param para que no se traslapen
                this.bookcase1.x + width + 800
            )
             /* Este codigo es parecido al que esta en windows para el problema de solapamiento */
             const overlap = this.windows.find(win =>{
                return Math.abs(this.bookcase2.x - win.x) <= win.width
            })
            this.bookcase2.visible = !overlap

            //llamo el spawncoin
            this.spawnCoins()
        }
    }

    private wrapLaserObstacle()
    {
        const scrollX = this.cameras.main.scrollX
        const rightEdge = scrollX + this.scale.width

        //body variables con las fisicas especificas del body type
        const body = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody

        //uso del ancho del body
        const width = body.width
        if(this.laserObstacle.x + width < scrollX)
        {
            this.laserObstacle.x = Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + 1000
            )

            this.laserObstacle.y = Phaser.Math.Between(0,300)

            //seteamos las fisicas del body position
            body.position.x = this.laserObstacle.x + body.offset.x
            body.position.y = this.laserObstacle.y

        }
    }

    private handleOverlapLaser(
        obj1: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    )
    {
        const mouse = obj2 as RocketMouse
        console.log("Se chocaron!")
        mouse.kill()
        
    }

    private spawnCoins()
    {
        //Spawn de monedas
        //nos aseguramos que todas las monedas estan inactivas y escondidas
        this.coins.children.each(child =>{
            const coin = child as Phaser.Physics.Arcade.Sprite
            this.coins.killAndHide(coin)
            coin.body.enable = false
        })

        const scrollX = this.cameras.main.scrollX
        const rightEdge = scrollX + this.scale.width

        //empieza 100 px pasado el lado derecho de la pantalla
        let x = rightEdge + 100

        //random number 
        const numCoin = Phaser.Math.Between(1,20)

        //Las monedas basadas en el numero random
        for(let i = 0; i< numCoin; i++){
            const coin = this.coins.get(
                x,
                Phaser.Math.Between(100,this.scale.height - 100),
                TextureKeys.Coin
            ) as Phaser.Physics.Arcade.Sprite

            //Nos aseguramos que el coin este activo y visible
            coin.setVisible(true)
            coin.setActive(true)

            //habilitamos y ajustamos las fisicas del body para ser un circulo
            const body = coin.body as Phaser.Physics.Arcade.StaticBody
            body.setCircle(body.width * 0.5)
            body.enable = true

            //update el body x,y position desde el gameobject
            body.updateFromGameObject()

            //mover x un monto random
            x += coin.width * 1.5

        }
    }

    private teleportBackwards()
    {
        const scrollX = this.cameras.main.scrollX
        const maxX = 2500

        //Hacemos el teleporte una vez hacemos scroll sobre 2500
        if(scrollX > maxX)
        {
            //teleportamos el mouse y el mouseHole
            //Lo que me da error es el mouse que no se puede teletrasportar atras
            /* this.mouse.x -= maxX */
            this.mouseHole.x -= maxX

            //Teleportamos cada ventana
            this.windows.forEach(win =>{
                win.x -= maxX
            })

            //teleportamos cada librero
            this.bookcases.forEach(bc =>{
                bc.x -= maxX
            })

            //teleportamos el laser
            this.laserObstacle.x -= maxX
            const laserBody = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody
            
                //tambien como el laser fisicas body
                laserBody.x -= maxX


            //teleportamos cualquier moneda spawniada
            this.coins.children.each(child =>{
                const coin = child as Phaser.Physics.Arcade.Sprite
                if(!coin.active)
                {
                    return
                }

                coin.x -= maxX
                const body = coin.body as Phaser.Physics.Arcade.StaticBody
                body.updateFromGameObject()
            })
        }
    }

}

