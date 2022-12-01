import platform from '../img/platform.png'
import background from '../img/nsFJoNv.jpeg'
import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'


console.log(background)
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024 /*window.innerWidth*/
canvas.height = 676 /*window.innerHeight*/

const gravity = 1.5
/* contrucción player */
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 66
        this.height = 150

        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
          stand: {
            right: createImage(spriteStandRight), 
            left: createImage(spriteStandLeft),
            cropWidth: 177,
            width: 66
          } ,
          run: {
            right: createImage(spriteRunRight), 
            left: createImage(spriteRunLeft),
            cropWidth: 341,
            width: 127.875
          }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        /* dibujamos objeto 2d */
        c.drawImage(
          this.currentSprite,
          /* recortar imagen -> origen x, y, ancho final, altura final */
          this.currentCropWidth * this.frames,
          0,
          this.currentCropWidth,
          400,
          //
          this.position.x, 
          this.position.y, 
          this.width, 
          this.height)
    }
    /* añadimos movimiento x y */
    update() { 
        this.frames++
        if (this.frames > 59 && this.currentSprite === this.sprites.stand.right) 
        this.frames = 0 // 28 = num de personajes
        else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)
        )
          this.frames = 0
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
        else this.velocity.y = 0
    }
}

class Platform {
    constructor({x,y, image}) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = image.width
        this.height = 20

    }

    draw() {
      c.drawImage(this.image, this.position.x, this.position.y)
        /*c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)*/
    }
}
class GenericObject {
  constructor({x,y, image}) {
      this.position = {
          x,
          y
      }

      this.image = image
      this.width = image.width
      this.height = image.height

  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
      /*c.fillStyle = 'blue'
      c.fillRect(this.position.x, this.position.y, this.width, this.height)*/
  }
}
/* función crear imagen */
function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

const platformImage = createImage(platform)

const player = new Player()
/* posición de plataformas */
const platforms = [new Platform({x:200, y:400, image: platformImage}), new Platform({x:700, y:500, image: platformImage})]

const genericObjects = [
  new GenericObject ({
    x: 0,
    y: 0,
    image: createImage(background)
  })
]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
/* rastrear cuanto distancia */
let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
      genericObject.draw()
    })

    platforms.forEach((platform) =>{
        platform.draw()
    })
    /* último en imprimir el jugador para que simepre esté delante */
    player.update()

    if(keys.right.pressed && player.position.x < 400 ) {
        player.velocity.x = 5
    }
    else if (keys.left.pressed && player.position.x > 100){
        player.velocity.x = -5
    }
    else {
        player.velocity.x = 0
        /* mueve la plataforma cuando el personaje va a la der/izq */
        if(keys.right.pressed){
            scrollOffset += 5
            platforms.forEach((platform) =>{
                platform.position.x -= 5 
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach((platform) =>{
                platform.position.x += 5
            })
        }
    }
    /* colisión plataforma */
    platforms.forEach((platform) => {
        if (
            player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) 
        {
            player.velocity.y = 0
        }
    })
    /* evento cuando player llegue a 2000 
    if (scrollOffset > 2000){
        //alert('has ganado!')
    }*/
}

animate()
/* config controles de teclado */
window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 37:
            console.log('left')
            keys.left.pressed = true
            player.currentSprite = player.sprites.run.left
            player.currentCropWidth = player.sprites.run.cropWidth
            player.width = player.sprites.run.width
            break
        case 40:
            console.log('down')
            break
        case 39:
            console.log('right')
            keys.right.pressed = true
            player.currentSprite = player.sprites.run.right
            player.currentCropWidth = player.sprites.run.cropWidth
            player.width = player.sprites.run.width
            break
        case 38:
            console.log('up')
            player.velocity.y -= 20
            break
    }
})
window.addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 37:
            console.log('left')
            keys.left.pressed = false
            break
        case 40:
            console.log('down')
            break
        case 39:
            console.log('right')
            keys.right.pressed = false
            player.currentSprite = player.sprites.stand.right
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width
            break
        case 38:
            console.log('up')
            player.velocity.y -= 20
            break
    }
})


