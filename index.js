let clicking = false

let grid = [...Array(25)].map(e => Array(25).fill(false))
let totalCells = 0
let activeCells = 0
let deadCells = 0
let started = false
let cache
let game //used to set interval

let displayGrid = $("<div></div>")
displayGrid.attr("id", "grid")

for(let i = 0; 25 > i; i++){
    for(let j = 0; 25 > j; j++){
        let newGridElement = $("<div></div>")
        newGridElement.attr("class", "gridElement inactive")
        newGridElement.attr("id",`${i}_${j}`)
        displayGrid.append(newGridElement)
        totalCells++
    }
}
deadCells = totalCells


$("#main").append(displayGrid)



$("#onOff").on("click", (event) => {
    started = !started
    let log = $("<div></div>")
    log.attr("class", "outputElement")

    if(cache == undefined){
        log.html("<strong>Simulation Started</strong>")
    }
    else if(started && cache != activeCells){
        log.html(`<strong>Game Unpaused</strong> | <span class="positive"> +${activeCells-cache}</span>`)
    }else if(started){
        log.html(`<strong>Game Unpaused</strong> | 0`)
    }else{
        log.html(`<strong>Game Paused</strong>`)
    }

    cache = activeCells

    $("#output").prepend(log)

    started ? $(event.target).text("Pause") && onInterval() : $(event.target).text("Resume Simulation") && offInterval()
})


$(".gridElement").on("mousedown", (event) => {
    clicking = true

    if($(event.target).attr("class") === "gridElement inactive"){
        $(event.target).attr("class", "gridElement active")
        activeCells++
        deadCells--

        updateCounter(activeCells, deadCells)
        newActiveElement(event.target.id)
    }
})

$(".gridElement").on("mouseup", () => { 
    clicking = false
})

$(".gridElement").on("mouseover", (event) => {
    if(!clicking) return

    if($(event.target).attr("class") === "gridElement inactive"){
        $(event.target).attr("class", "gridElement active")
        activeCells++
        deadCells--

        updateCounter(activeCells, deadCells)
        newActiveElement(event.target.id)
    }
})

function newActiveElement(id){
    const coords = [id.match(/^\d+/)[0], id.match(/\d+$/)[0]]
    grid[coords[0]][coords[1]] = true
}

function nextGeneration(){
    if(!started) return
    let newGrid = JSON.parse(JSON.stringify(grid))
    let log = $("<div></div>")
    log.attr("class", "outputElement")
    //log.text
    
    //.text(`Change in alive cells: ${activeCells - newActiveCells}`)
    
    for(let i = 0; 25 > i; i++){
        for(let j = 0; 25 > j; j++){
            let neighbors = 0
            
            if(i-1 >= 0 && grid[i-1][j] == true) neighbors++
            if(i+1 != grid.length && grid[i+1][j] == true) neighbors++
            if(j-1 >= 0 && grid[i][j-1] == true) neighbors++
            if(j+1 != grid[i].length && grid[i][j+1] == true ) neighbors++
            
            if(i-1 >= 0 && j-1 >=0 && grid[i-1][j-1] == true) neighbors++
            if(i+1 != grid.length && j+1 != grid.length && grid[i+1][j+1] == true) neighbors++
            if(i+1 != grid.length && j-1 >= 0 && grid[i+1][j-1] == true) neighbors++
            if(i-1 >= 0 && j+1 != grid.length && grid[i-1][j+1] == true ) neighbors++
            
            if(neighbors === 3 && grid[i][j] === false){ //Any dead cell with 3 neighbors comes alive
                newGrid[i][j] = true 
            } else if(grid[i][j] == true && 4 > neighbors && neighbors >= 2){
                newGrid[i][j] = true
            } else { //All other cases result in false
                newGrid[i][j] = false
            }
            
        }
    }
    
    grid = newGrid
    
    let newActiveCells = 0
    let newDeadCells = 0
    
    for(let i = 0; 25 > i; i++){
        for(let j = 0; 25 > j; j++){
            if(grid[i][j] == true){
                $("#"+i+"_"+j).attr("class", "gridElement active")
                newActiveCells++
            }else if(grid[i][j] == false){
                $("#"+i+"_"+j).attr("class", "gridElement inactive")
                newDeadCells++
            }
            
        }
    }
    
    if(deadCells-newDeadCells > 0){
        log.html(`Generation ${$("#genCount").text()} | <span class="positive"> +${deadCells-newDeadCells}</span>`)
    }else if(deadCells-newDeadCells == 0){
        log.html(`Generation ${$("#genCount").text()} | ${activeCells-newActiveCells}`)
    }
    else{
        log.html(`Generation ${$("#genCount").text()} | <span class="negative"> -${activeCells-newActiveCells}</span>`)
    }

    /*let aliveCount = $("<li><li>")
    aliveCount.text(`Change in alive cells: ${activeCells - newActiveCells}`)
    log.append(aliveCount)
    
    let deathCount = $("<li><li>")
    deathCount.text(`Change in dead cells: ${deadCells - newDeadCells}`)
    log.append(deathCount)*/
    
    
    $("#output").prepend(log)
    
    activeCells = newActiveCells
    deadCells = newDeadCells
    updateCounter(newActiveCells, newDeadCells, true)
}

function updateCounter(newActive, newDead, updateGen=false){
    $("#activeCount").text(newActive)
    $("#deadCount").text(newDead)

    if(!updateGen) return

    const newGen = parseInt($("#genCount").text()) + 1
    $("#genCount").text(newGen)
}

function onInterval() {
    game = setInterval(nextGeneration, 1500)
}

function offInterval() {
    clearInterval(game)
}

