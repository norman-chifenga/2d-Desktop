class Ground {
    constructor(desktop, x, y, width, height, color) {
        this.width = width;
        this.height = height;
        this.desktop = desktop;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    setUpdate(context) {
        context.fillStyle = this.color;
        context.fillRect(
            (this.x += this.desktop.moveX),
            (this.y += this.desktop.moveY),
            this.width,
            this.height
        );
    }
}

class BoundBox {
    constructor(desktop) {
        this.desktop = desktop;
        this.left = 150;
        this.top = 150;
        this.moveSpeed = 1;
        this.setOnResize();
    }
    setOnResize() {
        this.right = this.desktop.windowSize[0] - this.left * 2;
        this.bottom = this.desktop.windowSize[1] - this.top * 2;
    }

    setUpdate(context) {
        if (this.desktop.cursor.x < this.left) {
            this.desktop.moveX = this.moveSpeed;
        } else if (this.desktop.cursor.x > this.right) {
            this.desktop.moveX = -this.moveSpeed;
        } else if (this.desktop.cursor.y < this.top) {
            this.desktop.moveY = this.moveSpeed;
        } else if (this.desktop.cursor.y > this.bottom) {
            this.desktop.moveY = -this.moveSpeed;
        } else {
            this.desktop.moveX = 0;
            this.desktop.moveY = 0;
        }
    }
}

class Logo extends Ground {
    constructor(desktop, x, y, width, height, color) {
        super(desktop, x, y, width, height, color);
        this.image = document.getElementById("icon-logo");
    }

    setUpdate(context) {
        context.fillStyle = this.color;
        context.drawImage(
            this.image,
            0,
            0,
            this.width,
            this.height,
            (this.x += this.desktop.moveX),
            (this.y += this.desktop.moveY),
            this.width,
            this.height
        );
    }
}

class Icons {
    constructor(desktop, posX, posY, name) {
        this.image = document.getElementById(`icon-${name}`);
        this.desktop = desktop;
        this.name = name;
        this.x = posX;
        this.y = posY;
        this.width = 100;
        this.frame = 0;
        this.height = 100;
        this.collisionStatus = false;
        this.notification = false;
    }

    setUpdate(context) {
        // context.fillRect(this.x, this.y, this.width, this.height);
        //image,startx,starty,sourceWidth, sourceHeight, destinationX,destinationY, destinationwidth
        context.drawImage(
            this.image,
            this.frame * this.width,
            0,
            this.width,
            this.height,
            (this.x += this.desktop.moveX),
            (this.y += this.desktop.moveY),
            this.width,
            this.height
        );
        if (this.desktop.checkCollision(this.desktop.cursor, this)) {
            if (!this.collisionStatus) {
                this.collisionStatus = true;
                this.frame = 1;
                this.notification = true;
            }
        } else {
            if (this.collisionStatus) {
                this.collisionStatus = false;
                this.desktop.cursorTitle.style.opacity = 0;
                this.frame = 0;
            }
        }
    }
}

//creating the Cursor
class Cursor {
    constructor(desktop) {
        this.width = 80;
        this.height = 89;
        this.image = document.getElementById("icon-cursor")
        this.x = 20; //initial x cordinates
        this.y = 100; //initial y cordinates
        this.speed = 0.04;
        this.maxSpeed = 3;
        this.mouseX = 0;
        this.mouseY = 0;
        this.frame = 0

        desktop.canvas.addEventListener(
            "mousemove",
            (e) => {
                this.mouseX =
                    (e.offsetX * desktop.canvas.width) /
                    desktop.canvas.clientWidth;
                this.mouseY =
                    (e.offsetY * desktop.canvas.height) /
                    desktop.canvas.clientHeight;
            },
            false
        );
        desktop.canvas.addEventListener(
            "touchmove",
            (e) => {
                let r = desktop.canvas.getBoundingClientRect();
                let touch = e.touches[0];
                this.mouseX =
                (touch.clientX * desktop.canvas.width) /
                    desktop.canvas.clientWidth;
                this.mouseY =
                    (touch.clientY * desktop.canvas.height) /
                    desktop.canvas.clientHeight;
            },
            false
        );
    }

    setUpdate(context) {
        this.x = this.x + (this.mouseX - this.x) * this.speed;
        this.y = this.y + (this.mouseY - this.y) * this.speed;
        this.translateXY = [this.x + this.width / 2, this.y + this.height / 2];
        context.translate(this.translateXY[0], this.translateXY[1]);
        let angle = Math.atan2(this.mouseX - this.x, -(this.mouseY - this.y));
        context.rotate(angle);
        context.translate(-this.translateXY[0], -this.translateXY[1]);

        context.drawImage(
            this.image,
            this.frame * this.width,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
        this.frame++
        if(this.frame>3) this.frame = 0
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}

//creating the desktop
class Desktop {
    constructor(game) {
        this.fps = 1000 / 70 // frames per second
        this.cursorTitle = document.getElementById("cursor-title");
        this.ctx = canvas.getContext("2d");
        this.moveX = 0;
        this.moveY = 0;
        this.canvas = document.getElementById("canvas");
        this.cursor = new Cursor(this);
        this.logo = new Logo(this, 800, 350, 250, 250, "#c2eff9");
        this.ground = new Ground(this, -200, -100, 2200, 1250, "#fdfdfd");
        this.selectedIcon = [];
        this.setResizeCanvas();
        //on window resize
        window.addEventListener("resize", () => {
            this.setResizeCanvas();
        });
        //icons
        this.iconsArray = [
            new Icons(this, 300, 800, "home"),
            new Icons(this, 700, 800, "about"),
            new Icons(this, 1100, 800, "skills"),
            new Icons(this, 1500, 800, "work"),

            new Icons(this, 300, 100, "battery"),
            new Icons(this, 700, 100, "wifi"),
            new Icons(this, 1100, 100, "time"),
            new Icons(this, 1500, 100, "date"),

            new Icons(this, 1700, 250, "twitter"),
            new Icons(this, 1700, 470, "github"),
            new Icons(this, 1700, 700, "contact"),

            new Icons(this, 50, 250, "instagram"),
            new Icons(this, 50, 470, "music"),
            new Icons(this, 50, 700, "menu"),
        ];

        this.borderBox = new BoundBox(this);
    }
    //checking for collision
    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
        );
    }

    setResizeCanvas() {
        this.windowSize = [window.innerWidth, window.innerHeight];
        this.canvas.width = this.windowSize[0];
        this.canvas.height = this.windowSize[1];
        if (typeof this.borderBox !== "undefined") {
            this.borderBox.setOnResize();
        }
    }

    //using game loop to render on screen
    animate() {
        this.ctx.clearRect(0, 0, this.windowSize[0], this.windowSize[1]);
        this.ground.setUpdate(this.ctx);
        this.logo.setUpdate(this.ctx);
        if (this.checkCollision(this.cursor, this.ground)) {
            this.borderBox.setUpdate(this.ctx);
        }else{
            this.moveX = 0
            this.moveY = 0
        }
        this.iconsArray.forEach((item) => {
            item.setUpdate(this.ctx);
            if (item.notification) {
                this.cursorTitle.style.opacity = 1;
                this.cursorTitle.innerHTML = item.name;
                item.notification = false;
            }
        });
        this.cursor.setUpdate(this.ctx);
        setTimeout( ()=>{
            requestAnimationFrame(() => this.animate());
        }, this.fps );
    }
}
//staring the applicationo on load
window.onload = () => {
    const desktop = new Desktop();
    desktop.animate();
    document.getElementById("loader").remove();
};
