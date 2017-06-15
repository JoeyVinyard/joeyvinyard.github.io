var numOne;
var numTwo;
var numThree;
var ansOne = genRandom();
var ansTwo;
var ansThree;
var tries = 10;
do {
  ansTwo = genRandom();
} while (ansTwo === ansOne);

do {
  ansThree = genRandom();
} while (ansThree === ansOne || ansThree === ansTwo);

function genRandom() {
  return (Math.floor(Math.random() * (10)));
}
$(document).ready(function() {
  $("#check").click(function() {
    numOne = ($("#num1").val());
    numTwo = ($("#num2").val());
    numThree = ($("#num3").val());

    if (numOne == ansOne) {
      $("#num1").css("background-color", "green");
    } else if (numOne == ansTwo || numOne == ansThree) {
      $("#num1").css("background-color", "yellow");
    } else {
      $("#num1").css("background-color", "red");
    }
    if (numTwo == ansTwo) {
      $("#num2").css("background-color", "green");
    } else if (numTwo == ansOne || numTwo == ansThree) {
      $("#num2").css("background-color", "yellow");
    } else {
      $("#num2").css("background-color", "red");
    }
    if (numThree == ansThree) {
      $("#num3").css("background-color", "green");
    } else if (numThree == ansOne || numThree == ansTwo) {
      $("#num3").css("background-color", "yellow");
    } else {
      $("#num3").css("background-color", "red");
    }
    if (numOne == ansOne && numTwo == ansTwo && numThree == ansThree) {
      $("#win").text("YOU WIN!");
    }
    tries--;
    $("#tries").text("You have " + tries + " tries left");
    if (tries <= 0) {
      $("#win").text("YOU LOSE!");
      $("#win").css("color", "red");
    }
  });
});