let btnHolder = document.createElement("div");
btnHolder.id = "btns";
document.body.appendChild(btnHolder);

let arrBtns = [];
let numBtns = 9;
// create 9 btns and add them to the btn div
for(let i = 0; i < numBtns;i++) {
    arrBtns.push(document.createElement('button'));
    arrBtns[i].id = `btn${i+1}`;
    arrBtns[i].className = "btn";
    arrBtns[i].innerHTML = `${i+1}`;
    btnHolder.appendChild(arrBtns[i]);
}


let btnClickIndex = 4;
let gridWidth = 3;

// rotate button clockwise on click
arrBtns[btnClickIndex].onclick = function() {
    let tempArr = arrBtns.map(elem => parseInt(elem.innerHTML)); // temp array to access the values as they update
    for(let i=0;i<arrBtns.length;i++) {
        // rules for rotating clockwise
        // move values less than 2 to the right
        if(i < 2) {
            arrBtns[i+1].innerHTML = tempArr[i];
        }

        // move values greater than 6 to the left
        else if (i > 6) {
            arrBtns[i-1].innerHTML = tempArr[i];
        } 

        // move values at the right edge down
        else if ((i + 1) % gridWidth === 0) {
            let downSlot = i + gridWidth;
            arrBtns[downSlot].innerHTML = tempArr[i];
        }

        // move values at left edge up
        else if(i % gridWidth === 0) {
            let upSlot = i - gridWidth;
            arrBtns[upSlot].innerHTML = tempArr[i];
        }
    }
}