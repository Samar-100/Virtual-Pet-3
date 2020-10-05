var dog, happyDog, database, foodStock, foodS, feedDog, addFood, dogImg;
var fedTime, lastFed, readState, changeState, gameState;
var bedroomImg, washroomImg, gardenImg;
var sadDog, currentTime;
var backgroundImg = "green";
//Create variables here

function preload() {
  dogimg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroomImg = loadImage("images/Bed Room.png");
  washroomImg = loadImage("images/Wash Room.png");
  gardenImg = loadImage("images/Garden.png");
  sadDog = loadImage("images/Lazy.png");
  //load images here
}

function setup() {
  createCanvas(1000, 500);
  database = firebase.database();

  foodobject = new Food();
  dog = createSprite(800, 250, 10, 10);
  dog.scale = 0.2;

  foodStock = database.ref("Food");
  foodStock.on("value", readFood);

  fedTime = database.ref("FeedTime");
  fedTime.on("value", (data) => {
    lastFed = data.val();
  });
  readState = database.ref("gameState");
  readState.on("value", (data) => {
    gameState = data.val();
  });
  feedDog = createButton("FEED DOG");
  feedDog.position(500, 100);
  addFood = createButton("ADD FOOD");
  addFood.position(400, 100);
}

function draw() {
  background(backgroundImg);
  drawSprites();

  feedDog.mousePressed(FeedDog);
  addFood.mousePressed(AddFood);

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Fed : " + (lastFed % 12) + "PM", 350, 30);
  } else if (lastFed === 0) {
    text("Last Fed : " + (lastFed % 12) + "PM", 350, 30);
  } else {
    text("Last Fed : " + (lastFed % 12) + " AM", 350, 30);
  }

  if (gameState !== "Hungry") {
    feedDog.hide();
    addFood.hide();
    // dog.remove();
  } else {
    feedDog.show();
    addFood.show();
    dog.addImage("sadDog", sadDog);
  }

  currentTime = hour();
  if (currentTime === lastFed + 1) {
    update("Playing");
    foodobject.garden();
    dog.remove();
  } else if (currentTime === lastFed + 2) {
    update("Sleeping");
    foodobject.bedroom();
    dog.remove();
  } else if (currentTime > lastFed + 2 && currentTime <= lastFed + 4) {
    update("Bathing");
    foodobject.washroom();
    dog.remove();
  } else {
    update("Hungry");
    foodobject.display();
  }
}

function readFood(data) {
  foodS = data.val();
  foodobject.updateFoodStock(foodS);
}

function AddFood() {
  foodS++;
  database.ref("/").update({
    Food: foodS,
  });
}

function FeedDog() {
  dog.addImage(happyDog);
  foodobject.updateFoodStock(foodobject.getFoodStock() - 1);
  database.ref("/").update({
    Food: foodobject.getFoodStock(),
    FeedTime: hour(),
  });
}

function update(state) {
  database.ref("/").update({
    gameState: state,
  });
}
