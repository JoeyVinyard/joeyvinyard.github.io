const dayInMili = 86400000;

let breakfastMenu = document.getElementById("breakfast");
let lunchMenu = document.getElementById("lunch");
let target = new Date();
let now = new Date();


target.setHours(10,30,00);
let diff = target.getTime() - now.getTime();
if(diff < 0){
    breakfastMenu.style.display="none";
    lunchMenu.style.display="block";
    diff += dayInMili;
} else {
    breakfastMenu.style.display="block";
    lunchMenu.style.display="none";
}
setTimeout(showLunch, diff);
target.setHours(22,30,00);
diff = target.getTime() - now.getTime();
if(diff < 0){
    diff += dayInMili;
}
setTimeout(showBreakfast, diff);

function showBreakfast(){
    breakfastMenu.style.display="block";
    lunchMenu.style.display="none";
    setTimeout(showBreakfast, dayInMili);
}

function showLunch(){
    breakfastMenu.style.display="none";
    lunchMenu.style.display="block";
    setTimeout(showLunch, dayInMili);
}