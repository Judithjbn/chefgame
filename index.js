const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
/* contrucción player */
class Player {
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }
        this.width = 100
        this.height = 100
    }
    draw() {
        /* dibujamos objeto 2d */
        c.fillRect(this.position.x, this.position.x, this.width, this.height)
    }
}
const player = new Player()
player.draw()