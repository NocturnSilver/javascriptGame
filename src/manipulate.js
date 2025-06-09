/*
    Sources: mdn web docs


*/


// Accessing HTML elements

var map = document.getElementById('map');
var endButton = document.getElementById('endsetup');
endButton.addEventListener("click", endHandler);


// MODEL ------------------------------------------------------------------
var board = [['1','1','1','1','1','1','1'],
             ['1','0','0','0','0','0','1'],
             ['1','0','0','0','0','0','1'],
             ['1','0','0','0','0','0','1'],
             ['1','0','0','0','0','0','1'],
             ['1','0','0','0','0','0','1'],
             ['1','1','1','1','1','1','1']];

var prevboard = board.slice()

// cell values
free_cells = 25;

// scoreboard values
var score = 0;
var performance_index = 0;
var rounds_completed = 0;

// treasure values
var treasure5 = 0;
var treasure6 = 0;
var treasure7 = 0;
var treasure8 = 0;
var total_treasures = 0;


// hunger and neighbor
var hpos = [0,0] 
var neighbor = []

// allowed values for different stages of the game
var allowed_setup_val = ["O","o","H","h","5","6","7","8"]
var allowed_move_val = ['0','5','6','7','8'];

// add counter for differe stage values: 0 - setup; 1 - play; 2 - end.
var stage_counter = 0;


// VIEW ---------------------------------------------------------------------


let set_height = "4.5vw";
let set_width = "4.5vw";
function str_to_img(val) {
    const img = document.createElement('img')
    if (val === '1') {
        img.src = "wall.png";
    } else if (val === '0') {
        img.src = "tile1.png";
    } else if (val === "o" || val === "O"){
        img.src = "obstacle.png";
    } else if (val === "h" || val === "H"){
        img.src = "hunter.png";
    } else if (val === "5"){
        img.src = "treasure1.png";
    } else if (val === "6"){
        img.src = "treasure2.png";
    } else if (val === "7"){
        img.src = "treasure3.png";
    } else if (val === "8"){
        img.src = "treasure1.png";
    }  

    img.style.height = set_height;
    img.style.width = set_width;
    return img;
}

// Displays Messsage in the message box  
function displayMsg(message, style) {
    msgbox = document.getElementById("msgbox");
    msgbox.innerHTML = message;
    msgbox.style.display = "block";
    msgbox.className = style;
} 

// messages
function clearMessage() {
    msgbox = document.getElementById("msgbox");
    msgbox.style.display = "none";
}

function displayStats() {
    stats = document.getElementById("stats");
    stats.innerHTML = `<h2>Score:     ${score}   </h2>  
                       <h2>Rounds:    ${rounds_completed}</h2>  
                       <h2>treasure5: ${treasure5}</h2>  
                       <h2>treasure6: ${treasure6}</h2>  
                       <h2>treasure7: ${treasure7}</h2>  
                       <h2>treasure8: ${treasure8}</h2>  
                        `;
    stats.style.display = "block";
}

// ------------------------- Wrangling inner demons ------------------




function count_hunter(list) {
    let counter = 0;
    for (let row of list) {
        for (let col of row) {
            if (col == 'H' || col == 'h') {
                counter += 1;
            } 
        }
    } return counter;
}

function clickreact(e) {
    // allow for the change of text when mouseover
    let tile = this;
    let rowIndex = tile.parentElement.rowIndex;  
    let colIndex = tile.cellIndex;

    //display message - Help Player understand what to do 
    displayMsg("o - obstacle, h = hunter,<br> "+
        "5-8 = different treasures <br> "
        +"To Deselect cell type value not listed here", "None")

    // changes background color while selecting tile
    tile.style.backgroundColor = 'yellow';

    // dynamically add event listener based on click
    document.addEventListener("keydown", function(e){

        // check if value is part of allowed values if not deselect
        if (allowed_setup_val.includes(e.key)) {

            // Check to see number of hunters
            hunter_num = count_hunter(board);
            console.log("Number of hunters: "+ hunter_num);

            if (e.key === 'h'|| e.key === 'H') {
                // HUNTER HANDLING SECTION
                if (hunter_num < 1) {
                    // Update borad and hpos ----------------------------------------------
                    board[rowIndex][colIndex] = e.key;
                    hpos = [rowIndex,colIndex] 
                    displayMsg("Hunter Placed!", "None")
                    console.log("allowed value: "+e.key)
                    updateMap(map); 
                } else {
                    displayMsg("Only one hunter can exist per dungeon", "warning");
                }
            } else { 
                // ALL OTHER ALLOWED VALUES EXCEPT HUNTER
                board[rowIndex][colIndex] = e.key; 
                displayMsg("Allowed Value", "None")
                console.log("allowed value: "+e.key)
                updateMap(map); 
            }
       
            
        // Invalid values are handled here
        } else {
            // change style to warning style
            displayMsg("Not an allowed value", "None")
        }
        // update values and visuals
        updateMap(map);
        update_treasure();
        displayStats();
        // change on final -- to draw based in image
        tile.style.backgroundColor = 'transparent';

        }, { once: true });

    document.removeEventListener("keydown", function(e){});
  }

// this should be the setup draw
function drawMap(element) {
    for (let row of board) {
        element.insertRow();
        for (let cell of row) {
            let newCell = element.rows[element.rows.length - 1].insertCell();
            newCell.textContent = cell;
            if (newCell.textContent == "0") {
                // dynamically add eventListeners 
                newCell.addEventListener("click", clickreact);
            }  
        }
    }
}

// update map draw
function updateMap(element) {
    // correct map update function
    for (let i = 0; i < element.rows.length; i++) { 
         let row = element.rows[i];
         for (let j = 0; j < row.cells.length; j++) { 
            row.cells[j].textContent = board[i][j];
            if (row.cells[j].textContent != 0) {
                row.cells[j].removeEventListener("click", clickreact)
            }
            let image = str_to_img(board[i][j]);
            row.cells[j].innerHTML = '';
            row.cells[j].appendChild(image);

            }
        }
    }

// disable map
function disableMap(element) {
    for (let i = 0; i < element.rows.length; i++) { 
        let row = element.rows[i];
        for (let j = 0; j < row.cells.length; j++) {   
            row.cells[j].removeEventListener("click", clickreact)
        }
    }
}

function endHandler(e) {

        // increment ounter for differe stage values: 0 - setup; 1 - play; 2 - end.
        let pressed_button = this;

        // Transition to play stage
        if (stage_counter === 0) {
            // add delay then put beginning play stage
            displayMsg("Beginning Play Stage");
            pressed_button.value = "End Game";

            // increment counter to signify start of play stage
            stage_counter += 1;

            //removing the event listener for every table element
            disableMap(map);
            // updateMap(map);
            play();
        }

        // Transition to end stage 
        else if (stage_counter === 1) {
            // add delay then put beginning play stage
            displayMsg("The End?", "None");
            pressed_button.value = "The End?";
            stage_counter += 1;
            console.log("STAGE COUNTER = " + stage_counter);

            // Remove event listener and button??
            document.removeEventListener("keydown", moveHandler);
            end();
        }

        else if (stage_counter === 2) {
            // add delay then put beginning play stage
            pressed_button.value = "Play again?";
            displayMsg("The End?", "None");
            end();
        }


        // set map to unhighlighted versions of themselves - only 0 can be highlighted

        
        
        

        
        
    }


// ----------------------------------------------------------Play Stage temporary separator ---------------------------------------------------

// Only allowed to move to empty and treasure tiles
//allowed_move_val = ['0','5','6','7','8'];

function update_treasure() {
    // heavier but more general treasure update function that can be used in setup and play
    treasure5 = 0;
    treasure6 = 0;
    treasure7 = 0;
    treasure8 = 0;
    
    for (let row of board) {
        for (let col of row) {
            if (col == '5') {
                treasure5 += 1;
            } else if (col == '6') {
                treasure6 += 1;
            } else if (col == '7') {
                treasure7 += 1;
            } else if (col == '8') {
                treasure8 += 1;
            }
        }
    }
    total_treasures = treasure5 + treasure6 + treasure7 + treasure8;
}


function print_console_neighbors() {
    console.log(
        " up    - nboard[0] = "+nboard[0]+"; allowed_move_val.includes(nboard[0]) = "+allowed_move_val.includes(nboard[0])+"\n"+
        " down  - nboard[1] = "+nboard[1]+"; allowed_move_val.includes(nboard[1]) = "+allowed_move_val.includes(nboard[1])+"\n"+
        " left  - nboard[2] = "+nboard[2]+"; allowed_move_val.includes(nboard[2]) = "+allowed_move_val.includes(nboard[2])+"\n"+
        " right - nboard[3] = "+nboard[3]+"; allowed_move_val.includes(nboard[3]) = "+allowed_move_val.includes(nboard[3])
    )        
}

function check_available_moves() { 
    // check using the board representation of neighbors if there are allowed moves
    flag = false;
    for(element in allowed_move_val) {
        if (nboard.includes(allowed_move_val[element])) {
            console.log("THERE ARE ALLOWABLE MOVES!");
            flag = true;
            break;
        } 
    }

    // if the flag doesn't change into true after all iteration end game
    if (flag === false) {
        console.log("NO ALLOWABLE MOVES!!!");
        endHandler();
    }

}

function check_total_treasure() {
    // if the total treasure equals 0 then end game
    if (total_treasures === 0) {
        console.log("NO MORE TREASURES AVAILABLE")
        displayMsg("I'm afraid this dungeon has no more treasures left","None")
        endHandler();
    };
}


function update_neighbor() {

    /*
        Update the following things:
        1. neighbor - update the coordinates of the neighbor values
        2. nboard - update the board representation of the neighbor values based on neighbor coordinates
    */

    // coordinates   Y            X 
    neighbor =   [[hpos[0]-1, hpos[1]  ]   // up neighbor
                 ,[hpos[0]+1, hpos[1]  ]   // down neighbor
                 ,[hpos[0]  , hpos[1]-1]   // left neighbor
                 ,[hpos[0]  , hpos[1]+1]]; // right neighbor

    // translates the neighbor coordinates to the specific board value
    nboard = [board[neighbor[0][0]][neighbor[0][1]],  // 
              board[neighbor[1][0]][neighbor[1][1]],  //
              board[neighbor[2][0]][neighbor[2][1]],  //
              board[neighbor[3][0]][neighbor[3][1]]]; //
    
    console.log("Neighbors are updated")
}





// allowed_moveset = ['W','A','S','D','w','a','s','d']


treasure_list = ['5','6','7','8']
function allow_move(pressed_key) {

    switch (pressed_key) {
        case 'W':
            if (allowed_move_val.includes(nboard[0])) {
                console.log("moving up");
                displayMsg("moving up", "None");
                hpos[0] -=1; 
                rounds_completed += 1;

                // update the previous hunter position into a free cell
                board[last_position[0]][last_position[1]] = '0'
                
                // update score and obstacle if treasure was taken
                if (treasure_list.includes(board[hpos[0]][hpos[1]])) {
                    console.log("Treasure was taken! OBSTACLE PLACED")
                    score += parseInt(board[hpos[0]][hpos[1]]);
                    random_obstacle();
                }

                board[hpos[0]][hpos[1]] = 'h'

                
            } else {
                displayMsg("I can't move there", "None");
            };
            break;
        case 'w':
            if (allowed_move_val.includes(nboard[0])) {
                console.log("moving up");
                displayMsg("moving up", "None");
                hpos[0] -=1;
                rounds_completed += 1;
                                
                // update the previous hunter position into a free cell
                board[last_position[0]][last_position[1]] = '0'
         
                // update score and place obstacle if treasure taken
                if (treasure_list.includes(board[hpos[0]][hpos[1]])) {
                    score += parseInt(board[hpos[0]][hpos[1]]);
                    console.log("Treasure was taken! OBSTACLE PLACED")
                    random_obstacle();
                }

                board[hpos[0]][hpos[1]] = 'h'
            } else {
                displayMsg("I can't move there", "None");
            }; 
            break;
        case 'S':
            if (allowed_move_val.includes(nboard[1])) {
                console.log("moving down");
                displayMsg("moving down", "None")
                hpos[0] +=1;
                rounds_completed += 1;
                                
                // update the previous hunter position into a free cell
                board[last_position[0]][last_position[1]] = '0'

                // update the score and place obstacle if treasure taken
                if (treasure_list.includes(board[hpos[0]][hpos[1]])) {
                    score += parseInt(board[hpos[0]][hpos[1]]);
                    console.log("Treasure was taken! OBSTACLE PLACED")
                    random_obstacle();
                }
                board[hpos[0]][hpos[1]] = 'h'
            } else {
                displayMsg("I can't move there", "None");
            }; 
            break;
        case 's':
            if (allowed_move_val.includes(nboard[1])) {
                console.log("moving down");
                displayMsg("moving down", "None");
                hpos[0] +=1;
                rounds_completed += 1;
                                
                // update the previous hunter position into a free cell
                board[last_position[0]][last_position[1]] = '0'

                // update the score and place obstacle if treasure
                if (treasure_list.includes(board[hpos[0]][hpos[1]])) {
                    score += parseInt(board[hpos[0]][hpos[1]]);
                    console.log("Treasure was taken! OBSTACLE PLACED")
                    random_obstacle();
                }
                board[hpos[0]][hpos[1]] = 'h'

            } else {
                displayMsg("I can't move there", "None");
            }; 
            break;
        case 'A':
            if (allowed_move_val.includes(nboard[2])) {
                console.log("moving left");
                displayMsg("moving left", "None")
                hpos[1] -=1;
                rounds_completed += 1;
                                
                // update the previous hunter position into a free cell
                board[last_position[0]][last_position[1]] = '0'

                // update the score and place obstacle if treasure is taken
                if (treasure_list.includes(board[hpos[0]][hpos[1]])) {
                    score += parseInt(board[hpos[0]][hpos[1]]);
                    console.log("Treasure was taken! OBSTACLE PLACED")
                    random_obstacle();
                }
                board[hpos[0]][hpos[1]] = 'h'

            } else {
                displayMsg("I can't move there", "None");
            };
            break;
        case 'a':
            if (allowed_move_val.includes(nboard[2])) {
                console.log("moving left");
                displayMsg("moving left", "None")
                hpos[1] -=1;
                rounds_completed += 1;
                                
                // update the previous hunter position into a free cell
                board[last_position[0]][last_position[1]] = '0'

                // update the score and add obstacle if treasure is taken
                if (treasure_list.includes(board[hpos[0]][hpos[1]])) {
                    score += parseInt(board[hpos[0]][hpos[1]]);
                    console.log("Treasure was taken! OBSTACLE PLACED")
                    random_obstacle();
                }
                board[hpos[0]][hpos[1]] = 'h'

            } else {
                displayMsg("I can't move there", "None");
            };
            break;
        case 'D':
            if (allowed_move_val.includes(nboard[3])) {
                console.log("moving right");
                displayMsg("moving right", "None")
                hpos[1] +=1;
                rounds_completed += 1;
                                
                // update the previous hunter position into a free cell
                board[last_position[0]][last_position[1]] = '0'

                // update the score and place obstacle if treasure taken
                if (treasure_list.includes(board[hpos[0]][hpos[1]])) {
                    score += parseInt(board[hpos[0]][hpos[1]]);
                    console.log("Treasure was taken! OBSTACLE PLACED")
                    random_obstacle();
                }
                board[hpos[0]][hpos[1]] = 'h'

            } else {
                displayMsg("I can't move there", "None");
            };
            break;
        case 'd':
            if (allowed_move_val.includes(nboard[3])) {
                console.log("moving right");
                displayMsg("moving right", "None")
                hpos[1] +=1;
                rounds_completed += 1;
                                
                // update the previous hunter position into a free cell
                board[last_position[0]][last_position[1]] = '0'
                // update the score and place obstacle if treasure taken
                if (treasure_list.includes(board[hpos[0]][hpos[1]])) {
                    score += parseInt(board[hpos[0]][hpos[1]]);
                    console.log("Treasure was taken! OBSTACLE PLACED")
                    random_obstacle();
                }

                board[hpos[0]][hpos[1]] = 'h'

            } else {
                displayMsg("I can't move there", "None");
            };
            break;
        default:
            displayMsg("I don't know where to go?"+
                       "(only use WASD keys to move)"
                      ,"None");
      }
}

function random_obstacle() {
    // find free all possible free cells then randomly pick one and turn into an obstacle

    var posssible_obstacle = [];

    // check to see board values that are free
    for (let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '0') {
                posssible_obstacle = posssible_obstacle.concat([[i,j]])
            }
        }
    };

    let minCeiled = Math.ceil(0);
    let maxFloored = Math.floor(posssible_obstacle.length);
    let randnum =  Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    board[posssible_obstacle[randnum][0]][posssible_obstacle[randnum][1]] = "o";
    //console.log("check board val for obs = "+board[posssible_obstacle[randnum][0]][posssible_obstacle[randnum][1]]) 
    // console.log("posssible_obstacle = " + posssible_obstacle + " type of item = " + posssible_obstacle[0]);
    // console.log("random element picked: " + randnum + "; obstacle pos = "+ posssible_obstacle[randnum])
    // console.log("check components: "+ typeof posssible_obstacle[randnum][0] + typeof posssible_obstacle[randnum][1])
    // add obstacle based on randum 
    

  }


function moveHandler(e) {

    // Troubleshoot portion - erase on final
    console.log("movekey: " + e.key);
    last_position = hpos.slice();
    
    // allow move based on key and update round value
    allow_move(e.key); // round update inside

    // update the amount of treasures left and check if there are any left
    // bug appeared and the game doesn't end for some weird reason
    update_treasure();
    update_neighbor();
    check_total_treasure();
    check_available_moves();

    // display stats 
    displayStats();

    

    // display Stats based on updated treasure values
    updateMap(map);
}


// CONTROLLER -------------------------------------------------------------


setup();

function setup() {
    drawMap(map);
    updateMap(map);
    displayStats();
}

function play() {
    // add listener for wasd keys
    // Check conditions first 
    update_neighbor();
    check_total_treasure();
    check_available_moves();

    // if no conditions are triggered - display and run game
    displayStats();

    // start listening for button presses
    document.addEventListener("keydown", moveHandler);
}

function end() {
    if (rounds_completed > 0) {
        var performance_index = Math.round(score/rounds_completed * 100)/100;
        console.log("Performance Index = "+ performance_index);
    } else {
        var performance_index = 0;
    } 
    displayMsg("Performance Index = "+ performance_index,"None");
    console.log("THE END IS HERE!");
}