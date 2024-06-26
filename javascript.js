var rows=3,cols=3;
var loaded = false;
var tablecells ;
var values =[[1,2,3],[4,5,6],[7,8,9]];
var emptyX, emptyY;
var LEFT = {dx: -1, dy: 0};
var RIGHT = {dx: 1, dy: 0};
var UP = {dx: 0, dy: -1};
var DOWN = {dx: 0, dy: 1};
var movesCount;
var startTime;
var timerInterval;
var elapsedTime = 0;
var isTimerRunning = false;
var pauseButton;
var timerDisplay;
var MiddleBox;
var completedDiv;
var newGameBtn;
var iterations = 5;
var besttimesArray = new Array(5).fill("");
var best1time;
var best2time;
var best3time;
var best4time;
var best5time;


function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTimer, 1000);
  isTimerRunning = true;
  pauseButton.disabled = false;
}

function updateTimer() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  const seconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = String(seconds % 60).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function pauseTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  pauseButton.disabled = true;
}

function resetTimer() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  isTimerRunning = false;
  timerDisplay.textContent = "00:00";
  pauseButton.disabled = true;
  // newGameButton.disabled = true;
}

function resetMoveCount() {
  movesCount.textContent = "00";
}

function getdimensions() {
  // Get the selected value
  const selectedValue = this.value;
  
  // Split the value into an array
  [rows, cols] = selectedValue.split('x').map(Number);
  // console.log(rows); // Output: 3 or 4 depending on selection
  // console.log(cols); // Output: 3 or 4 depending on selection
}

function getdifficulty() {
  const selectedDifficulty = this.value;

  if(selectedDifficulty == 1) {
    iterations = 5;
  }

  else if(selectedDifficulty == 2) {
    iterations = 15;
  }

  else {
    iterations = 30;
  }

  console.log(iterations);
}

function isGameOver() {
  // console.log("inside");
  for(var i=0;i<rows;i++) {
    for(var j=0;j<cols;j++) {
      if(i == rows-1 && j == cols-1){
        if(values[i][j] != 0) return false;
      }
      else if(values[i][j] != (cols*i) + j + 1){
        return false;
      }
    }
  }

  return true;
}

function ConvertTOSeconds(time) {

  if(time == "") return 10e6;

  var [min , sec] = time.split(':').map(Number);

  return (min*60) + sec;
}

function compareBestTimes(time1,time2) {
  return ConvertTOSeconds(time1) - ConvertTOSeconds(time2);
}

function clickTile(x,y) {

  var delx = [-1,0,1,0];
  var dely = [0,1,0,-1];

  for(var i=0;i<4;i++) {
    var newX = x + delx[i];
    var newY = y + dely[i];

    if(newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
      if(values[newX][newY] == 0){
        //swapping innerHTMl
        var td1 = tablecells[x][y];
        var td2 = tablecells[newX][newY];
        
        td2.innerHTML = td1.innerHTML;
        td1.innerHTML = "";
        //swapping the values
        values[newX][newY] = values[x][y];
        values[x][y] = 0;

        //increasing moveCount
        // console.log(parseInt(movesCount.innerHTML, 10));
        movesCount.innerHTML = String((parseInt(movesCount.innerHTML, 10) + 1)).padStart(2, '0');

        //starting timer
        if((parseInt(movesCount.innerHTML, 10)) == 1) startTimer();
        else if(!isTimerRunning) startTimer();
        
        if(isGameOver()) {
          pauseTimer();
          console.log("Hurray");
          // alert("Hurray Completed the puzzle");
          completedDiv = document.createElement("div");
          completedDiv.setAttribute("class", "completeddiv");
          completedDiv.textContent = "Hurray! Puzzled Solved , Start New Game!!";
          MiddleBox.appendChild(completedDiv);

        // console.log(timerDisplay.textContent);
        if(besttimesArray[4] == "" || ConvertTOSeconds(besttimesArray[4]) > ConvertTOSeconds(timerDisplay.textContent)) {
          besttimesArray[4] = timerDisplay.textContent;
        }

        besttimesArray.sort(compareBestTimes);

        // console.log("hello ",besttimesArray);

        for(var i=1;i<6;i++) {
          localStorage.setItem("Time" + `${i}` , besttimesArray[i-1]);
          var elementId = "best" + i + "time";
          var element = document.getElementById(elementId);
          element.textContent = besttimesArray[i-1];
        }



        }
      }


    }
  }

}


document.addEventListener('DOMContentLoaded',nowload);

function initialise() {

  if(completedDiv && MiddleBox && MiddleBox.contains(completedDiv)) {
    MiddleBox.removeChild(completedDiv);
  }

  tablecells = resizeTable();
  values = createInitialValues();
  shuffle();
}

function initialise_localStorage() {

  if(localStorage.getItem("Time1") == null) {

    for(var i=1;i<6;i++) {
      localStorage.setItem("Time" + `${i}` , besttimesArray[i-1]);
    }
  }

  else {
    for(var i=1;i<6;i++) {
      besttimesArray[i-1] = localStorage.getItem("Time"+`${i}`);
      var elementId = "best" + i + "time";
      var element = document.getElementById(elementId);
      element.textContent = besttimesArray[i-1];
    }


  }

}

function nowload() {
    loaded = true;

    if (loaded) {

      movesCount = document.getElementById('count');
      timerDisplay = document.getElementById('timer');
      pauseButton = document.getElementById('pausebtn');
      pauseButton.addEventListener('click' , pauseTimer);

      MiddleBox = document.getElementById('middleBox');
      newGameBtn = document.getElementById('newGameBtn');
      newGameBtn.addEventListener('click' , initialise);

      // best1time = document.getElementById('best1time');
      // best2time = document.getElementById('best2time');
      // best3time = document.getElementById('best3time');
      // best4time = document.getElementById('best4time');
      // best5time = document.getElementById('best5time');

      initialise_localStorage();

      initialise();

      document.getElementById('tablesize').addEventListener('change', getdimensions);
      document.getElementById('tablesize').addEventListener('change',function(){

        if(completedDiv && MiddleBox && MiddleBox.contains(completedDiv)) {
          MiddleBox.removeChild(completedDiv);
        }      

        tablecells = resizeTable();
        values = createInitialValues();
        shuffle();
      } );

      document.getElementById('difficultyLevel').addEventListener('change', getdifficulty);
      document.getElementById('difficultyLevel').addEventListener('change',function(){

        if(completedDiv && MiddleBox && MiddleBox.contains(completedDiv)) {
          MiddleBox.removeChild(completedDiv);
        }      

        tablecells = resizeTable();
        values = createInitialValues();
        shuffle();
      } );
    }
}





function resizeTable() {

    var cells = [];

    document.getElementById("table").innerHTML = "";

    var table = document.getElementById("table");

    for (let i = 0; i < rows; i++) {
      var rowDiv = document.createElement("tr");
      // rowDiv.setAttribute("id", "row" + i);
      // rowDiv.setAttribute("class", "row");

      var rowCells = [];

      for (let j = 0; j < cols; j++) {
        var cellDiv = document.createElement("td");
        // cellDiv.setAttribute("id", "cell" + i + j);
        cellDiv.setAttribute("class", "cell");
        // cellDiv.setAttribute("class", "tile" + (rows * (i-1) + j));
        cellDiv.addEventListener('click', function() { clickTile(i, j); });
        rowDiv.appendChild(cellDiv);
        rowCells.push(cellDiv);
      }
      
      cells.push(rowCells);

      table.appendChild(rowDiv);
    }

    // Reset the timer, move count, and any other necessary game state
    resetTimer();
    resetMoveCount();
    // ... (other actions if needed) ...
    return cells;

  }

  function createInitialValues() {
    emptyX = rows-1;
    emptyY = cols-1;
    var v = [];
    var i = 1;
    for (var y = 0; y < rows; y++) {
      var rowValues = [];
      for (var x = 0; x < cols; x++) {
        rowValues.push(i);
        i++
        }
      v.push(rowValues);
    }
    v[emptyY][emptyX] = 0;
    return v;
  }

  function draw() {

    // console.log("Hello",tablecells);
    // console.log(values);
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var v = values[y][x];
        var td = tablecells[y][x];
        if(v == 0) td.innerHTML = '';
        else td.innerHTML = String(v);

        td.style.fontSize = '30px';
        td.style.fontFamily = 'Pacifico , cursive';
        td.style.color = 'white';
      }
    }

    // console.log("hmm");
  }

  function makeMove(move) {
    var newX = emptyX + move.dx , newY = emptyY + move.dy;

    if(newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
      //swapping the values only as i will call draw function
     //at the end of shuffle which takes care of innerHTML
     //changes in sync with values array changed here
      values[emptyX][emptyY] = values[newX][newY];
      values[newX][newY] = 0;
      //updating emptyX and emptyY
      emptyX = newX;
      emptyY = newY;

      return true;
    }

    return false;
  }

  function isOpposite(move1,move2) {
    return (move1.dx === -move2.dx && move1.dy === -move2.dy);
  }


  function shuffle() {

    var options = [LEFT , RIGHT , UP , DOWN];
    var prevMove = {dx: 0 , dy: 0};

    for(var i=0;i<iterations;i++) {
      var move = options[Math.floor(Math.random() * options.length)];
      if(!isOpposite(move,prevMove) && makeMove(move)) { 
        prevMove = move;
        // console.log(move);
        // console.log(i);
      }
      else {
        i--;
      }
    }

    // console.log(values);

    draw();

  }


