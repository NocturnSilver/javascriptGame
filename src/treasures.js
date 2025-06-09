/*
    Sources: mdn web docs
    [1] MDN web docs
    [2] 

    All gifs and images used for the game were made by the creator of this file, Nathan Vance See.

*/


// Accessing HTML elements

var map = document.getElementById('map');
var endButton = document.getElementById('endsetup');

/*
---------------------------------------------------------------------------------------------------

                                            Model 

                        Probably the most lovable section for this

----------------------------------------------------------------------------------------------------
*/ 
var board = [['2','1','1','1','1','1','2'],
             ['2','0','0','0','0','0','2'],
             ['2','0','0','0','0','0','2'],
             ['2','0','0','0','0','0','2'],
             ['2','0','0','0','0','0','2'],
             ['2','0','0','0','0','0','2'],
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
var treasure_list = ['5','6','7','8'];

// add counter for differe stage values: 0 - setup; 1 - play; 2 - end.
var stage_counter = 0;


/*
---------------------------------------------------------------------------------------------

                                            VIEW 

                      Show input to user and handle user events

---------------------------------------------------------------------------------------------
*/ 


let set_height = "100%";
let set_width = "100%";
endButton.addEventListener("click", endHandler);

// Converts board string to images based on value
function str_to_img(val) {
    const img = document.createElement('img')
    if (val === '1') {
        img.src = "wall.png";
    } else if (val === '2') {
        img.src = "wall2.png";
    }else if (val === '0') {
        img.src = "tile1.gif";
    } else if (val === "o" || val === "O"){
        img.src = "obstacle.gif";
    } else if (val === "h" || val === "H"){
        img.src = "hunter.gif";
    } else if (val === "5"){
        img.src = "treasure1.png";
    } else if (val === "6"){
        img.src = "treasure2.png";
    } else if (val === "7"){
        img.src = "treasure3.gif";
    } else if (val === "8"){
        img.src = "treasure4.gif";
    }  

    // Set dimensions of the image based on variable
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
    stats.innerHTML = `<div id="score">
                       <h2>Score:  ${score}</h2>  
                       <h2>Rounds: ${rounds_completed}</h2>
                       </div>  
                       <div id="trs1"><img src="treasure1_icon.png" alt="picture of treasure 1">: ${treasure5}</div>  
                       <div id="trs2"><img src="treasure2_icon.png" alt="picture of treasure 2">: ${treasure6}</div>  
                       <div id="trs3"><img src="treasure3_icon.gif" alt="picture of treasure 3">: ${treasure7}</div>  
                       <div id="trs4"><img src="treasure4_icon.gif" alt="picture of treasure 4">: ${treasure8}</div>  
                        `;
    stats.style.display = "grid";
    ;
}

// Create a table base on the board elements
function drawMap(element) {
    for (let row of board) {
        element.insertRow();
        for (let cell of row) {
            let newCell = element.rows[element.rows.length - 1].insertCell();
            newCell.textContent = cell;
            if (newCell.textContent == "0") {
                // dynamically add eventListeners 
                newCell.addEventListener("click", clickHandler);
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
            row.cells[j].removeEventListener("click", clickHandler)
            }
        }
    }

function endHandler(e) {

        // increment ounter for differe stage values: 0 - setup; 1 - play; 2 - end.
        let pressed_button = this;
              
        // In the case no hunter was put on board
        hunter_num = count_hunter(board);
        if (hunter_num == 0) {
            displayMsg("Please Place a hunter", "warning")
        } else if (stage_counter == 0) {
            // Transition to play stage
            displayMsg(
                "Beginning Play Stage" + "<br><br>" +
                "To move use WASD keys"+ "<br><br>" +
                "Goal: Collect Treasures." + "<br>" +
                "If no path to collect treasure" + "<br>"+
                "you can end the game with button" 
                ,"None");
            pressed_button.value = "End Game";

            // increment counter to signify start of play stage
            console.log("stage_counter = "+ stage_counter)
            stage_counter += 1;
            //removing the event listener for every table element
            disableMap(map);

            // if there is no available moves end the game
            update_neighbor();
            check_available_moves();

            // If there are not treasures instantly end without going to play 
            if (total_treasures == 0) {endHandler();} 
            else {play();} 
        } else if (stage_counter == 1) {
            // Transition to end stage 
            // add delay then put beginning play stage
            displayMsg("The End", "None");
            pressed_button.value = "The End?";
            stage_counter += 1;
            console.log("stage_counter = "+ stage_counter)

            // Remove event listener and button??
            document.removeEventListener("keydown", moveHandler);
            document.getElementById("endsetup").disabled = true;
            end();
        } else if (stage_counter == 2) {
            // add delay then put beginning play stage
            console.log("stage_counter = "+ stage_counter)
            pressed_button.value = "Reload Page to Play again";
            displayMsg("It is the end already!"
                +"If you want to play another round refresh the page", "None");
            end();
        }
    }

function clickHandler(e) {
    // allow for the change of text when mouseover
    let tile = this;
    let rowIndex = tile.parentElement.rowIndex;  
    let colIndex = tile.cellIndex;

    //display message - Help Player understand what to do 
    displayMsg(
        "You may select multiple cells" + "<br>"+
        "To Deselect cell, type values not listed here" + "<br><br>" +
        "Assign cell by typing:"+ "<br>"+
        "o - obstacle, h = hunter,<br> "+
        "5-8 = different treasures <br> "
        , "wrapper")

    // changes background color while selecting tile
    tile.style.backgroundColor = 'yellow';

    if (board[rowIndex][colIndex] !== '0') {
        displayMsg("Cannot change what is already placed","warning");
        tile.style.backgroundColor = 'transparent';
    } else {

    // dynamically add event listener based on click
    document.addEventListener("keydown", function(e){

        // check if value is part of allowed values if not deselect
        if (allowed_setup_val.includes(e.key)) {

            // Check to see number of hunters
            hunter_num = count_hunter(board);

            if (e.key === 'h'|| e.key === 'H') {
                // HUNTER HANDLING SECTION
                if (hunter_num < 1) {
                    // Update borad and hpos ----------------------------------------------
                    board[rowIndex][colIndex] = e.key;
                    hpos = [rowIndex,colIndex] 
                    displayMsg("Hunter Placed!", "None")
                    updateMap(map); 
                } else {
                    displayMsg("Only one hunter can exist per dungeon", "warning");
                }
            } else { 
                // ALL OTHER ALLOWED VALUES EXCEPT HUNTER
                board[rowIndex][colIndex] = e.key; 
                displayMsg("Allowed Value", "None")
                updateMap(map); 
            }
       
            
        // Invalid values are handled here
        } else {
            // change style to warning style
            displayMsg("Not an allowed value", "warning")
        }
        // update values and visuals
        updateMap(map);
        update_treasure();
        // displayStats();
        // change on final -- to draw based in image
        tile.style.backgroundColor = 'transparent';

        }, { once: true });
    }
    document.removeEventListener("keydown", function(e){});
  }


function moveHandler(e) {

    // make a copy of the previous position
    last_position = hpos.slice();
    
    // allow move based on key and update round value
    allow_move(e.key); // round update inside

    // update values and check conditions
    update_treasure();
    update_neighbor();
    check_total_treasure();
    check_available_moves();

    // display stats 
    displayStats();

    // display Stats based on updated treasure values
    updateMap(map);
}

/*
--------------------------------------------------------------------------------------------------------------

                                                Controller Section 
     
                                Section Where you wrangle with your inner demons.

---------------------------------------------------------------------------------------------------------------
*/ 

function count_hunter(list) {
    // Counter number of hunters
    let counter = 0;
    for (let row of list) {
        for (let col of row) {
            if (col == 'H' || col == 'h') {
                counter += 1;
            } 
        }
    } return counter;
}

function update_treasure() {
    // heavier but more general treasure update function that can be used in setup and play
    treasure5 = 0;
    treasure6 = 0;
    treasure7 = 0;
    treasure8 = 0;
    
    for (let row of board) {
        for (let col of row) {
            if (col == '5') {treasure5 += 1;} 
            else if (col == '6') {treasure6 += 1;} 
            else if (col == '7') {treasure7 += 1;} 
            else if (col == '8') {treasure8 += 1;}
        }
    }
    total_treasures = treasure5 + treasure6 + treasure7 + treasure8;
}

function check_available_moves() { 
    // check using the board representation of neighbors if there are allowed moves
    flag = false;
    for(element in allowed_move_val) {
        if (nboard.includes(allowed_move_val[element])) {
            flag = true;
            break;
        } 
    }
    // if the flag doesn't change into true after all iteration end game
    if (flag === false) {
        end();
    }

}

function check_total_treasure() {
    // if the total treasure equals 0 then end game
    update_treasure();
    if (total_treasures === 0) {
        end();
        return 0;
    }; return 1;
}


function update_neighbor() {

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
}

function updateBasedonValue() {
    // update the previous hunter position into a free cell
    rounds_completed += 1;
    board[last_position[0]][last_position[1]] = '0'

    if (treasure_list.includes(board[hpos[0]][hpos[1]])) {
        score += parseInt(board[hpos[0]][hpos[1]]);
        random_obstacle();
    }
    board[hpos[0]][hpos[1]] = 'h'
}

function allow_move(pressed_key) {
    // process moves based on WASD and check if cell hunter will move into is allowed
    switch (pressed_key) {
        case 'W':
            if (allowed_move_val.includes(nboard[0])) {
                displayMsg("moving up", "None");
                hpos[0] -=1;
                updateBasedonValue();  
            } else {displayMsg("I can't move there", "warning");};
            break;
        case 'w':
            if (allowed_move_val.includes(nboard[0])) {
                displayMsg("moving up", "None");
                hpos[0] -=1;
                updateBasedonValue();
            } else {displayMsg("I can't move there", "warning");}; 
            break;
        case 'S':
            if (allowed_move_val.includes(nboard[1])) {
                displayMsg("moving down", "None");
                hpos[0] +=1;
                updateBasedonValue();
            } else {displayMsg("I can't move there", "warning");}; 
            break;
        case 's':
            if (allowed_move_val.includes(nboard[1])) {
                displayMsg("moving down", "None");
                hpos[0] +=1;
                updateBasedonValue();
            } else {displayMsg("I can't move there", "warning");}; 
            break;
        case 'A':
            if (allowed_move_val.includes(nboard[2])) {
                displayMsg("moving left", "None");
                hpos[1] -=1;
                updateBasedonValue();
            } else {displayMsg("I can't move there", "warning");};
            break;
        case 'a':
            if (allowed_move_val.includes(nboard[2])) {
                displayMsg("moving left", "None");
                hpos[1] -=1;
                updateBasedonValue();
            } else {displayMsg("I can't move there", "warning");};
            break;
        case 'D':
            if (allowed_move_val.includes(nboard[3])) {
                displayMsg("moving right", "None");
                hpos[1] +=1;
                updateBasedonValue();
            } else {displayMsg("I can't move there", "warning");};
            break;
        case 'd':
            if (allowed_move_val.includes(nboard[3])) {
                displayMsg("moving right", "None");
                hpos[1] +=1;
                updateBasedonValue();
            } else {displayMsg("I can't move there", "warning");};
            break;
        default:
            displayMsg("I don't know where to go?"+ "<br><br>"+
                       "(only use WASD keys to move)"
                      ,"warning");
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
    }

    let minCeiled = Math.ceil(0);
    let maxFloored = Math.floor(posssible_obstacle.length);
    let randnum =  Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    board[posssible_obstacle[randnum][0]][posssible_obstacle[randnum][1]] = "o";
  }





// Main calls --------------------------------------------------------

function setup() {
    drawMap(map);
    updateMap(map);
    //displayStats();
    displayMsg(
    "Game Setup Stage"+ "<br><br>"+
    "Begin by Clicking on any tile" + "<br><br>"+
    "If you're done setting up" + "<br>"+
    "Press the end setup button"
    , "None");
}

function play() {

    update_neighbor();
    update_treasure();
    check_total_treasure();
    check_available_moves();
    // if no conditions are triggered - display and run game
    displayStats();
    // start listening for button presses
    document.addEventListener("keydown", moveHandler);

    
}

function end() {
    displayStats();
    document.removeEventListener("keydown", moveHandler);
    if (rounds_completed > 0) {
        var performance_index = Math.round(score/rounds_completed * 100)/100;
    } else {
        var performance_index = 0;
    }
    displayMsg("Game has ended " + "<br><br>"+
        "Performance Index = "+ performance_index +"<br><br>"+
        "Thanks for Playing!"
        , "None");
    
}

setup();