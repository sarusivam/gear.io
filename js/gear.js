
document.addEventListener('DOMContentLoaded', function(){
    const websocketClient = new WebSocket('ws://localhost:12345/')

    websocketClient.onopen = function(){
        const canvas = document.getElementById("viewPort");
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight



        class InputHandler{
            constructor(){

                this.mouseX = 0;
                this.mouseY = 0;
                this.mouseDown = false;

                window.addEventListener('mousemove', e => {
                    this.mouseX = e.clientX;
                    this.mouseY = e.clientY;
                })

                window.addEventListener('mousedown', e=> {
                    this.mouseDown = true
                }) 
                window.addEventListener('mouseup', e=>{
                    this.mouseDown = false
                }) 
            }
        }
        
        class GameControler{
            constructor(players, regions){
                this.players = players
                this.regions = regions
            
            }

            getElementsInsideObjectRegion(player){
                player.regionIn.forEach(objectRegion => {
                    objectRegion.objectsInside.forEach(object =>{
                        if (object.globalX - ((object.size / canvas.width) * viewPortWidth) < (player.globalX + (viewPortWidth / 2)) && 
                            object.globalX > (player.globalX - (viewPortWidth / 2)) &&
                            object.globalY - ((object.size / canvas.height) * viewPortHeight) < (player.globalY + (viewPortHeight / 2)) &&
                            object.globalY > (player.globalY - (viewPortHeight / 2))){

                            let diffX = (((player.globalX + (viewPortWidth / 2)) - object.globalX) / viewPortWidth)
                            let diffY = (((player.globalY + (viewPortHeight / 2)) - object.globalY) / viewPortHeight)

                            let VPx = diffX * canvas.width
                            let VPy = diffY * canvas.height
        
                            let isTouchingPlayer = false
                            
                            if (imagesTouching(object.globalX, object.globalY, (object.size / canvas.width) * viewPortWidth, (object.size / canvas.height) * viewPortHeight, player.globalX, player.globalY, (player.size / canvas.width) * viewPortWidth, (player.size / canvas.height) * viewPortHeight)){
                                isTouchingPlayer = true
                            }
                            // else {
                            //     if (player.constructor.name == 'Bot'){

                            // }                    
        

                            object.draw(ctx, player, VPx, VPy, isTouchingPlayer)
                        }
                    })  
                });
            }

            isInsideRegion(region, object, type='player'){
                if (type == 'player'){
                    if ((object.globalX > region.globalX &&
                    object.globalX < (region.globalX + region.width) &&
                    object.globalY > region.globalY &&
                    object.globalY < (region.globalY + region.height)) ||
                    (object.globalX + (viewPortWidth / 2) > region.globalX && 
                    object.globalX - (viewPortWidth / 2) < region.globalX) || 
                    (object.globalY + (viewPortHeight / 2) > region.globalY && 
                    object.globalY - (viewPortHeight / 2) < region.globalY)){
                        return true
                    }
                } else {
                    if ((object.globalX > region.globalX &&
                        object.globalX < (region.globalX + region.width) &&
                        object.globalY > region.globalY &&
                        object.globalY < (region.globalY + region.height))){
                            return true
                        }
                }
            }
        }

        class Region{
            constructor(globalX, globalY, width, height, surroundingRegions=[]){
                this.globalX = globalX
                this.globalY = globalY
                this.objectsInside = []
                this.surroundingRegions = surroundingRegions
                this.width = width
                this.height = height

            }



        }

        class Spinner{
                constructor(gameWidth, gameHeight){
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.size = 50
                this.image = document.getElementById('spinner')
                this.VPx = window.innerWidth / 2;
                this.VPy = window.innerHeight / 2;
                this.globalX = Math.random()* (Math.random() * worldWidth);
                this.globalY = Math.random()* (Math.random() * worldHeight);
                this.speedX = 0.5;
                this.speedY = 1;
                this.degrees = 1
                this.score = 0
                this.degreeIncrease = 0.1;
                this.isSprinting = false;
                this.sprintInterval = 15
                this.countInterval = 1
                this.regionIn = []
                this.name = 'Player(you)'


            }

            draw(context){
                context.clearRect(0,0,canvas.width,canvas.height);


                context.save();
            

                context.translate(canvas.width/2,canvas.height/2);
            

                context.rotate(this.degrees*Math.PI/180);
            

                context.drawImage(this.image, (-(this.size+10))/2, (-(this.size+10))/2, this.size+10, this.size+10);
            


                context.restore();


                if (this.degrees > 359){
                    this.degrees = 0
                } else this.degrees += this.degreeIncrease



            }



            update(){
                this.x = (window.innerWidth / 2) - (this.size / 2);
                this.y = (window.innerHeight / 2) - (this.size / 2);

                
                let mouseXDiff = input.mouseX - this.x
                let mouseYDiff = input.mouseY  - this.y




                
                if (mouseXDiff > 0){
                    this.globalX -= this.speedX
                } else if(mouseXDiff < 0){
                    this.globalX += this.speedX
                }   

                if (mouseYDiff > 0){
                    this.globalY -= this.speedY
            } else if(mouseYDiff < 0){
                this.globalY += this.speedY
            }



                if (input.mouseDown) {
                    this.isSprinting = true
                } else {
                    this.isSprinting = false           
                }


                if (this.isSprinting  && this.score > 0){
                    this.speedX = 0.67;
                    this.speedY = 1.3;

                    if (this.countInterval >= this.sprintInterval){
                        this.score -= 1
                        this.size -= 0.5

                        disturbuteFood(1, (this.globalX + ((Math.random() * (0.1 * (this.size + 20)) * (mouseXDiff / Math.abs(mouseXDiff))))), (this.globalY + ((Math.random() * (0.1 * (this.size + 20)) *  (mouseYDiff / Math.abs(mouseYDiff))))))

                        this.countInterval = 1;

                    }else {
                        this.countInterval += 1;

                    }
                } else {
                    this.speedX = 0.33;
                    this.speedY = 0.67;                     
                }       


            }



            increaseSize(){
                if (this.size < 1000.0){
                    this.size += 0.5

                if (this.degreeIncrease < 30){
                this.degreeIncrease += 0.05;
                }
            }
                this.score += 1

            }   

        }

        class Bot{
            constructor(globalX, globalY, name){
                this.globalX = globalX
                this.globalY = globalY
                this.size = 50
                this.score = 0
                this.image = document.getElementById('spinner')
                this.destinationX = 0
                this.destinationY = 0
                this.isMoving = false
                this.regionIn = []
                this.name = name
                this.degreeIncrease = 0.1;
                this.degrees = 1

            }

            move(){
                this.isMoving = true

                let diffX = this.globalX - this.destinationX
                let diffY = this.globalY - this.destinationY


                if (diffX > 0){
                    this.globalX -= 0.2;
                } else if (diffX < 0){
                    this.globalX += 0.2;
                }

                if (diffY > 0){
                    this.globalY -= 0.2;
                } else if (diffY < 0){
                    this.globalY += 0.2;
                }
                if (Math.round(diffX) == 0 && Math.round(diffY) == 0){
                    this.isMoving = false
                }

        }

        increaseSize(){
        if (this.size < 1000.0){
                this.size += 0.5

            if (this.degreeIncrease < 30){
                this.degreeIncrease += 0.05;
            }
        } 
            this.score += 1

        }




        draw(context, player, VPx, VPy, isTouchingPlayer){

            context.drawImage(this.image, VPx,  VPy, this.size, this.size)


            displayText(context, this.score, VPx + (this.size / 2) - (0.05  * this.size), VPy + this.size + 25, "20px Arial", "white")
            displayText(context, this.name, VPx + (this.size / 2) - (0.125 * (this.name.length * 45)), VPy -  (0.125 * this.size), "23px Arial", "white")

            if (isTouchingPlayer){
                if (this.score < player.score){
                    bots.splice(bots.indexOf(this), 1)
                    regions.forEach(region => {
                        let g = new GameControler()
                        let isInside = g.isInsideRegion(region, this)
                        if (isInside){
                            region.objectsInside.splice(region.objectsInside.indexOf(this), 1)
                        }
                    })
                    let XP
                    let YP
                    if (player.constructor.name == 'Spinner'){
                        if (Math.random() > 0.5){
                            XP = -1
                        } else {
                        
                            XP = 1
                        }
                        if (Math.random() > 0.5){
                            YP = -1
                        } else {
                            YP = 1
                        }
                        for (let i = 0; i < this.score; i++){
                            disturbuteFood(1, this.globalX + ((Math.random() * (0.2 * (this.size + 20))) * XP), this.globalY + ((Math.random() * (0.2 * (this.size + 20))) * YP))
                        }
                    } 
                    else {
                        for (let i = 0; i < this.score; i++){
                            player.increaseSize()
                        }
                    }
                }
                else {
                    if (player.constructor.name == 'Spinner'){
                        for (let i = 0; i < player.score; i++){
                            console.log(true, player.constructor.name)
                            this.increaseSize()
                        }
                        player.globalX = Math.random() *worldWidth
                        player.globalY = Math.random() * worldHeight
                        player.size = 50
                        player.score = 0
                        player.degreeIncrease = 0.1
                        player.degrees = 1

                    
                    }

                }
            } 
            else {
                if (this.score > player.score){
                    this.destinationX = player.globalX
                    this.destinationY = player.globalY
                }
            }
        }
    }

        class Food{
            constructor(gameWidth, gameHeight, globalX, globalY){
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.image = document.getElementById("burger");
                this.size = 50
                this.globalX  = globalX;
                this.globalY = globalY;



            }


            draw(context, player, VPx, VPy, isTouchingPlayer){

                if (isTouchingPlayer){
                    player.increaseSize()
                    player.regionIn.forEach(playerRegion =>{
                        playerRegion.objectsInside.forEach(objectInsideRegion =>{
                            if (objectInsideRegion == this){
                                playerRegion.objectsInside.splice(playerRegion.objectsInside.indexOf(this), 1)
                            }
                        })
                    })

                } else {
                    context.drawImage(this.image, VPx, VPy, this.size, this.size)
                }

                }
                

            }
            
        class MiniMap{
            constructor(x, y, width, height, player, botsList){
                this.x = x
                this.y = y
                this.width = width
                this.height = height
                this.player = player
                this.bots = botsList
            }

            render(context){
                context.fillStyle = '#0f0f0f'
                context.fillRect(this.x, this.y, this.width, this.height)
                let allMovingEntities = this.bots.concat([player])

                allMovingEntities.forEach(entity => {
                    let circleX = (((worldWidth - entity.globalX) / worldWidth) * this.width) + this.x
                    let circleY = (((worldHeight - entity.globalY) / worldHeight) * this.height) + this.y
                    context.beginPath();

                    if (entity.constructor.name == 'Spinner'){
                        context.strokeStyle = "#FFFFFF"
                        context.fillStyle = "#FFFFFF"
                    } else {
                        context.strokeStyle = "#FF0000"
                        context.fillStyle = "#FF0000"
                    }

                    context.arc(circleX, circleY, 3, 0, 2 * Math.PI)
                    context.fill()        
                    context.stroke()
                })
            
            
            }

            update(player, bots, x, y, width, height){
                this.playerX = player
                this.bots = bots
                this.x = x
                this.y = y
                this.width = width
                this.height = height

            }

        }

        function disturbuteFood(num, x=null, y=null){
            var g  = new GameControler([], [])
            for (let i = 0; i < num; i++) {
                if (x == null && y == null){
                    foodX = Math.random() * worldWidth
                    foodY = Math.random() * worldHeight
                    var food = new Food(canvas.width, canvas.height, foodX, foodY)
                    regions.forEach(region => {
                        isInside = g.isInsideRegion(region, food)
                        if (isInside){
                            region.objectsInside.push(food)
                        }
                    })
                } else {
                    regions.forEach(region =>{
                        var food = new Food(canvas.width, canvas.height, x, y)
                        isInside = g.isInsideRegion(region, food)
                        if (isInside){
                            region.objectsInside.push(food)
                        }
                    })
        
                }
            } 
        }



        function imagesTouching(x1, y1, w1, h1, x2, y2, w2, h2) {
            if (x1-(w1 / 2) >= x2+(w2 / 2) || x1+(w1 / 2) <= x2- (w2 / 2)) return false;   // too far to the side
            if (y1 - (h1 / 2) >= y2+(h2 / 2) || y1+(h1 / 2) <= y2 - (h2 / 2)) return false; // too far above/below
            return true;                                                    // otherwise, overlap   
            }

        function displayText(context, text, x, y, fontSize, color){
            context.fillStyle = color
            context.font = fontSize
            context.fillText(text, x, y)
        }
        function random_item(items){
            let randomItem = items[Math.floor(Math.random()*items.length)]
            return randomItem;
            
        }
        function checkWhetherItemInList(items, item){
            let isItemInList = false
            items.forEach(i => {
                if (i.name == item){
                    isItemInList = true
                }
            })
            return isItemInList
        }

        const worldWidth = 4000;
        const worldHeight = 4000;

        const input = new InputHandler()
        const player = new Spinner(canvas.width, canvas.height)

        const botNames = [
            'Hacker',
            'George',
            'Dream',
            'Technoblade',
            'Captain',
            'Newton',
            'Einstein',
            'Sapnap',
            'IronMan',
            'Thor',
            'Thanos',
            'King',
            'Coder',
            'Gamer',
            'Friendly',
            'Bubble',
            'Alpha',
            'Miner',
            'Axeb',
            'Cloud',
            'Magnet',
            'ChatterBot',
            'Eater'
        ]

        var bots = []
        function distrubuteBots(num){
            for (let i = 0; i < num; i++) {

                let randomItem = random_item(botNames)

                while (checkWhetherItemInList(bots, randomItem)){
                    randomItem = random_item(botNames)
                }
                
                bots.push(new Bot(Math.random() * worldWidth, Math.random() * worldHeight, randomItem))
            }
        }
        var regions = []
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++){
                regions.push(new Region((worldWidth / 2)*i, (worldHeight / 2)*j, worldWidth / 2, worldHeight / 2) )

            }
        }



        var viewPortWidth = (player.size / 2) + 50;
        var viewPortHeight = (player.size / 2) + 50;   

        disturbuteFood(40000)
        distrubuteBots(13)
        setInterval(function(){
            disturbuteFood(300)
        }, 10000)
        setInterval(function(){
            if (bots.length < 23){

                distrubuteBots(1)
            }

        }, 10000)

        const minimap = new MiniMap(canvas.width - (canvas.width / (0.0025*canvas.width) + 10), canvas.height - (canvas.height / (0.0025*canvas.height) + 10), canvas.width / (0.0025*canvas.width) , canvas.height / (0.0025*canvas.height), player, bots)
        const spinnerGameControler = new GameControler([player], regions)

        function animate(){
        

            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            minimap.update(
                player,
                bots,
                canvas.width - (canvas.width / (0.01*canvas.width) + 3), 
                canvas.height - (canvas.height / (0.01*canvas.height) + 3), 
                (canvas.width / 4) / (0.0025*canvas.width), 
                (canvas.height / 4) / (0.0025*canvas.height)
    
            )


            regions.forEach(region =>{
                playerInside = spinnerGameControler.isInsideRegion(region, player)
                let regionAldreadyInList = false
                player.regionIn.forEach(playerInRegion =>{
                    if (playerInRegion == region){
                        regionAldreadyInList = true
                    }
                })
                if (playerInside){
                    if (!regionAldreadyInList){
                        player.regionIn.push(region)
                    }
                }

                if (!playerInside){

                    if (regionAldreadyInList){
                        player.regionIn.splice(player.regionIn.indexOf(region), 1)
                    
                    }

                }


                bots.forEach(bot =>{
                    botInside = spinnerGameControler.isInsideRegion(region, bot, 'bot');
                    index = region.objectsInside.indexOf(bot);
                    if (botInside){
                        bot.regionIn = []
                        bot.regionIn.push(region)
                        if (index == -1) {

                            region.objectsInside.push(bot)
                        }
                    } else {
                        if (index != -1) {

                            region.objectsInside.splice(index, 1);
                        }
                    }
                    if (!bot.isMoving){
                        bot.destinationX = Math.random() * worldWidth
                        bot.destinationY = Math.random() * worldHeight
                    }
                    bot.move()
                    spinnerGameControler.getElementsInsideObjectRegion(bot)
                }) 
            })

            player.draw(ctx);
            player.update(input);

            displayText(ctx, player.score, player.x + (player.size / 2.5) - (0.05  * player.size), player.y + player.size + 25, "20px Arial", "white") 
            
            spinnerGameControler.getElementsInsideObjectRegion(player)
            
            minimap.render(ctx)
    
            viewPortWidth = (player.size / 2) + 30;
            viewPortHeight = (player.size / 2) + 30;   
            
            let movingEntities = bots.concat([player])
            movinEntities = movingEntities.sort(function(a, b){
                if (a.score > b.score){
                    return 1
                }
                if (b.score > a.score){
                    return - 1
                }
                return 0
            })

            movingEntities =  movingEntities.reverse()
            let endNum
            if (10 < movingEntities.length){
                endNum = 10
            } else {
                endNum = movingEntities.length
            }
            for (let i=0; i < endNum; i++){
                let font = '20px Arial'
                let fontColor = 'white'
                if (i == 0){
                    font = '25px Arial'
                    fontColor = 'red'
                }
                displayText(ctx, String((i + 1)) + ') ' + movingEntities[i].name + ' - ' + movingEntities[i].score, 25, 25 + (i * 25), font, fontColor)
            }
            displayText(ctx, 'Players : ' + String(Number(bots.length) + Number(1)) , 25, canvas.height - 25, '20px Arial', 'green')
            let rankLabelColor = 'white';
            if (movingEntities.indexOf(player) == 0){ rankLabelColor = 'red' }
            else if (movingEntities.indexOf(player) <=  endNum - 1) { rankLabelColor = 'green' }
            displayText(ctx, 'Rank : ' + (movingEntities.indexOf(player) + 1), canvas.width / 2, 50, '25px Arial', rankLabelColor)

            requestAnimationFrame(animate);
        }
        animate()

    }

    // websocketClient.onmessage = function(message){
    //     const newMessage = document.createElement('div')
    //     newMessage.innerHTML = message.data
    //     messageContainer.appendChild(newMessage)
        
    // }

}, false)
    