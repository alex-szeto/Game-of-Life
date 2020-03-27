let clicking = false

let totalCells = 0
let activeCells = 0
let deadCells = 0

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


$("#root").append(displayGrid)


$(".gridElement").on("mousedown", (event) => {
    clicking = true
    $(event.target).attr("class", "gridElement active")
})

$(".gridElement").on("mouseup", (event) => { 
    clicking = false
})

$(".gridElement").on("mouseover", (event) => {
    if(!clicking) return

    $(event.target).attr("class", "gridElement active")
    console.log(event.target.id)
})