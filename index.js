const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

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

        this.width = 30
        this.height = 30
    }

    draw() {
        /* dibujamos objeto 2d */
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    /* añadimos movimiento x y */
    update() {        
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
        else this.velocity.y = 0
    }
}

class Platform {
    constructor({x,y}) {
        this.position = {
            x,
            y
        }

        this.width = 200
        this.height = 20
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player()
/* posición de plataformas */
const platforms = [new Platform({x:200, y:400}), new Platform({x:700, y:400})]

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
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    platforms.forEach((platform) =>{
        platform.draw()
    })

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
            break
        case 40:
            console.log('down')
            break
        case 39:
            console.log('right')
            keys.right.pressed = true
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
            break
        case 38:
            console.log('up')
            player.velocity.y -= 20
            break
    }
})