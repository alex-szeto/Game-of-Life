let clicking = false

let grid = [...Array(20)].map(e => Array(20).fill(false))
let totalCells = 0
let activeCells = 0
let deadCells = 0
let started = false

let displayGrid = $("<div></div>")
displayGrid.attr("id", "grid")

for(let i = 0; 20 > i; i++){
    for(let j = 0; 20 > j; j++){
        let newGridElement = $("<div></div>")
        newGridElement.attr("class", "gridElement inactive")
        newGridElement.attr("id",`${i}_${j}`)
        displayGrid.append(newGridElement)
        totalCells++
    }
}
deadCells = totalCells


$("#root").append(displayGrid)

$("#onOff").on("click", (event) => {
    started = !started
    started ? $(event.target).text("Pause") : $(event.target).text("Resume Simulation")
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

    for(let i = 0; 20 > i; i++){
        for(let j = 0; 20 > j; j++){
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

    for(let i = 0; 20 > i; i++){
        for(let j = 0; 20 > j; j++){
            if(grid[i][j] == true){
                $("#"+i+"_"+j).attr("class", "gridElement active")
                newActiveCells++
            }else if(grid[i][j] == false){
                $("#"+i+"_"+j).attr("class", "gridElement inactive")
                newDeadCells++
            }

        }
    }

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

console.log(parseInt($("#genCount").text()) + 1)
setInterval(nextGeneration, 1000)