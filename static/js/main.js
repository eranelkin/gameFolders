var gameBoardElem;

var playerInfo = {
  state: undefined,
  elem: undefined,
};

function deepCopy(source) {
  if (typeof source !== "object" || source === null) throw "illegal value";
  let copy = Array.isArray(source) ? [] : {};

  for (let key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      copy[key] = deepCopy(source[key]);
    } else {
      copy[key] = source[key];
    }
  }
  return copy;
}

function parsedGameState(state) {
  let tiles = {};
  state.tiles.forEach(({ x, y, type }) => {
    tiles = { ...tiles, [`${x}-${y}`]: { type, x, y } };
  });
  return {
    ...state,
    tiles,
  };
}

var formInfos = [];
var gameState = {};

window.onload = function () {
  gameState = parsedGameState(deepCopy(gameStateInit));
  console.log("XXX: ", gameState);
  initBoard();
  initEventListeners();
};

function newGameOnClick() {
  gameState = parsedGameState(deepCopy(gameStateInit));
  initBoard();
}
function initBoard() {
  resetBoardState();
}

function resetBoardState() {
  setBoardSize();
  createBoardTiles();
  updateUi();
}

function movePlayerInDirection({ x, y }) {
  let newPos = {
    x: playerInfo.state.x + x,
    y: playerInfo.state.y + y,
  };

  if (isWallAt(newPos)) {
    return false;
  }

  let formInfo = getFormInfoAt(newPos);
  if (formInfo !== undefined) {
    let newFormPos = {
      x: formInfo.state.x + x,
      y: formInfo.state.y + y,
    };

    if (isWallOrFormAt(newFormPos)) {
      return false;
    }

    moveTile(formInfo, { x, y });
  }

  moveTile(playerInfo, { x, y });

  gameState.moves++;

  updateUi();
  checkGameWon();
  return true;
}

function onKeyDown(e) {
  let keyCode = e.keyCode;

  if (
    keyCode === KEY_LEFT ||
    keyCode === KEY_UP ||
    keyCode === KEY_RIGHT ||
    keyCode === KEY_DOWN
  ) {
    let direction;

    switch (e.keyCode) {
      case KEY_LEFT:
        direction = { x: -1, y: 0 };
        break;
      case KEY_RIGHT:
        direction = { x: 1, y: 0 };
        break;
      case KEY_UP:
        direction = { x: 0, y: -1 };
        break;
      case KEY_DOWN:
        direction = { x: 0, y: 1 };
        break;
    }
    movePlayerInDirection(direction);
  }
}

function initEventListeners() {
  document.onkeydown = onKeyDown;
}

function setBoardSize() {
  gameBoardElem = document.getElementById("game-board");
  gameBoardElem.style.width = `${gameState.width * tileSize}px`;
  gameBoardElem.style.height = `${gameState.height * tileSize}px`;
}

function createBoardTiles() {
  playerInfo = undefined;
  formInfos = [];

  gameBoardElem.innerHTML = "";
  for (let tileState of Object.values(gameState.tiles)) {
    var tileElem = document.createElement("div");
    tileElem.style.width = `${tileSize}px`;
    tileElem.style.height = `${tileSize}px`;
    tileElem.style.left = `${tileState.x * tileSize}px`;
    tileElem.style.top = `${tileState.y * tileSize}px`;
    tileElem.className = `tile tile-${tileState.type}`;
    gameBoardElem.appendChild(tileElem);

    let tileInfo = {
      state: tileState,
      elem: tileElem,
    };

    if (tileState.type === tileTypes.player) {
      playerInfo = tileInfo;
    }

    if (tileState.type === tileTypes.form) {
      formInfos.push(tileInfo);
    }
  }
}

function animatePlayer(tileInfo) {
  tileInfo.elem.classList.add("player-active");
  setTimeout(() => {
    tileInfo.elem.classList.remove("player-active");
  }, 300);
}

function moveTile(tileInfo, { x, y }) {
  const { elem } = tileInfo;
  if (elem.classList.contains("tile-player")) animatePlayer(tileInfo);
  tileInfo.state.x += x;
  tileInfo.state.y += y;
}

function repositionTileUi(tileInfo) {
  tileInfo.elem.style.left = `${tileInfo.state.x * tileSize}px`;
  tileInfo.elem.style.top = `${tileInfo.state.y * tileSize}px`;
}

function updateUi() {
  console.log("XXX: reset");
  repositionTileUi(playerInfo);
  for (let formInfo of formInfos) {
    repositionTileUi(formInfo);
  }

  document.getElementById("game-info-moves").innerText = gameState.moves;
}

function isWallAt(pos) {
  return isTileTypeAt(pos, tileTypes.wall);
}

function isWallOrFormAt(pos) {
  return isWallAt(pos) || getFormInfoAt(pos) !== undefined;
}

function isFinishAt(pos) {
  return isTileTypeAt(pos, tileTypes.finish);
}

function isTileTypeAt({ x, y }, tileType) {
  if (
    gameState.tiles[`${x}-${y}`] &&
    gameState.tiles[`${x}-${y}`].x === x &&
    gameState.tiles[`${x}-${y}`].y === y &&
    gameState.tiles[`${x}-${y}`].type === tileType
  ) {
    return true;
  }
  return false;
}

function getFormInfoAt({ x, y }) {
  for (let formInfo of formInfos) {
    if (x === formInfo.state.x && y === formInfo.state.y) {
      return formInfo;
    }
  }

  return undefined;
}

function isGameWon() {
  for (let formInfo of formInfos) {
    if (!isFinishAt(formInfo.state)) {
      return false;
    }
  }
  return true;
}

function checkGameWon() {
  if (isGameWon()) {
    window.location.href = "/static/win.html";
  }
}
