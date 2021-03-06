var divTop = 50;
var divLeft = 0;
var k = 0;
var textInputFlag = false;

// Add sticky note
function addNote(key = 0, values = []) {
    var id;
    if (key != 0) {
        id = key;
    }
    else {
        // ID using time
        id = new Date().getTime();
    }
    // Location when "add" was hit
    if (divLeft != 0) {
        divLeft += 200; 
        if (divLeft >= 1200) {
            divTop += 200;
            divLeft = 50;
        }
    }
    else {
        divLeft = 50;
    }

    if (values.length == 0) {
        //for svg initial
        // let textInitial = [];
        // let text = [];
        //
        // textInitial.push(0);
        // textInitial.push(0);
        // textInitial.push(" ");
        //
        // text.push(textInitial);
        var values = [];
        var initValue = {};
        initValue['text'] = " ";
        initValue['color'] = 'green';
        initValue['notePositionLeft'] = divLeft;
        initValue['notePositionTop'] = divTop;
        values.push(initValue);
    }

    // Add the note Main content
    var mainDiv = document.createElement("div");
    mainDiv.setAttribute("class", "note");
    mainDiv.setAttribute("id", id);
    mainDiv.setAttribute("style", "top:" + values[0]['notePositionTop'] + "px;left:" + values[0]['notePositionLeft'] + "px");

    // Title Div
    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "noteTitle");


    // Operations supported on sticky note
// ==============================================================================================
    // Add note img
    var addImg = document.createElement("img");
    addImg.setAttribute("src", "images/icon-add.png");
    addImg.setAttribute("class", "addIcon");
    // Add note
    addImg.setAttribute("onclick", "addNote()");

    titleDiv.appendChild(addImg);

    // Add deletenote image
    var delImg = document.createElement("img");
    delImg.setAttribute("src", "images/icon-delete.png");
    delImg.setAttribute("class", "delIcon");
    // Delete
    delImg.setAttribute("onclick", "deleteNote('" + id + "')");
    titleDiv.appendChild(delImg);

// ==============================================================================================
        // Set color of the background
        var colorBg = document.createElement("select");

        colorBg.setAttribute("class", "colorBg");
        colorBg.options.add(new Option("", "#CCFFCC"));
        colorBg.options.add(new Option("", "#FFCCCC"));
        colorBg.options.add(new Option("", "#99CCFF"));
        colorBg.options.add(new Option("", "#FFFFCC"));
        colorBg.setAttribute("onclick", "changeColor('" + id + "')");
        if(values[0]['color']){
            mainDiv.style.backgroundColor = values[0]['color'];
        }
        titleDiv.appendChild(colorBg);
    
        // Save button
        var saveImg = document.createElement("img");
        saveImg.setAttribute("src", "images/icon-save.png");
        saveImg.setAttribute("class", "save");
        // Add note
        saveImg.setAttribute("onclick", "saveNote('" + id + "')");
        titleDiv.appendChild(saveImg);

    //second only text input editable
    var contentDiv = document.createElement("div");
    if (values[0]['text']) {
        var txtDiv = document.createTextNode(values[0]['text']);
        contentDiv.appendChild(txtDiv);
    }
    contentDiv.setAttribute("class", "noteContent");
    contentDiv.setAttribute("contenteditable", "true");

    contentDiv.setAttribute("onblur", "saveNote('" + id + "')");

    mainDiv.appendChild(titleDiv);
    mainDiv.appendChild(contentDiv);
    document.body.appendChild(mainDiv);
}

// Move the note
var dragObj;
var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var z = 0;
var noteLocation;

function mousedownHandler(e) {

    //console.log(e.target);
    if (e.target.className == 'noteTitle') {
        //locate the note
        dragObj = e.target.parentNode;


        var t = dragObj.style.top;
        var l = dragObj.style.left;
        z += 1;
        dragObj.setAttribute("style", "top:" + t + ";left:" + l + ";z-index:" + z);

        _startX = e.clientX;
        _startY = e.clientY;
        _offsetX = dragObj.offsetLeft;
        _offsetY = dragObj.offsetTop;

        document.addEventListener("mousemove", mousemoveHandler, false);
        console.log("title---------------");
        console.log(e.clientX);
        console.log(e.clientY);
        console.log(_offsetX);
        console.log(_offsetY);
        console.log(dragObj.style.left);
        console.log(dragObj.style.top);

    }
    if (e.target.className == "noteContent") {
        console.log("notecontent touched");
        textObj = e.target;
    }
}

// Anke lehmann's code
function addTextInput(svgTxtElement, svgContent, x, y) {
    // when text input flag triggered
    console.log(x);
    console.log(y);
    var input = document.createElement("input");
    input.setAttribute("id", "tbInputText");

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + "px";
    input.style.top = (y - 4) + "px";
    input.style.width = 100 + "px";
    input.style.height = 20 + "px";
    input.style.backgroundColor = "blue";
    input.style.zIndex = "10";
    input.setAttribute("onblur", "removeInput()");
    input.setAttribute("onmousemove", "this.focus()");

    var textFlag = false;
    if (svgTxtElement.textContent != '') {
        input.value = svgTxtElement.textContent;
        textFlag = true;
    }
    if (textInputFlag == false) {
        textInputFlag = true;
        document.body.appendChild(input);
        input.addEventListener('keydown', function (event) {
            if (event.keyCode == 13) {
                console.log("keydown");
                svgTxtElement.textContent = document.getElementById('tbInputText').value;
                if (!textFlag) {
                    svgContent.appendChild(svgTxtElement);
                } else {
                    svgText.textContent = document.getElementById('tbInputText').value;
                }
                svgTxtElement = '';
                document.getElementById("tbInputText").remove();
                textInputFlag = false;
                //init();
            }

            if (event.keyCode == 27) {
                //init();
                svgTxtElement = '';
                document.getElementById("tbInputText").remove();
                textInputFlag = false;
            }

        });

    }


}

function removeInput() {
    if (!(document.getElementById("tbInputText").value)) {
        document.getElementById("tbInputText").remove();
        textInputFlag = false;
    }

}

//store note
function saveNote(key) {

    //locate mainDiv
    var obj = document.getElementById(key);

    //parent
    var values = [];
    //record each node's value
    var value = {};
    //array for text input lists
    var textValueList = [];
    //array for text svg as x,y,and textcontent

    console.log(obj.childNodes[1].firstChild);
    console.log(obj.childNodes[1].firstChild.textContent);
    if (obj.childNodes[1].firstChild == null) {
        var text = document.createTextNode(" ");
        text.textContent = " ";
        obj.childNodes[1].appendChild(text);
    }
    value['text'] = obj.childNodes[1].firstChild.textContent;

    var color = obj.firstElementChild.childNodes[2];
    var selectedColor = color.options[color.options.selectedIndex].value;
    value['color'] = selectedColor;

    var notePositionLeft = obj.style.left;
    var notePositionTop = obj.style.top;
    console.log("notePosition " + notePositionLeft, notePositionTop);
    value['notePositionLeft'] = notePositionLeft.replace("px", "");
    value['notePositionTop'] = notePositionTop.replace("px", "");
    values.push(value);
    values = JSON.stringify(values);

    if (values.length > 0) {
        //save to storage
        localStorage.setItem(key, values);

    }
}

//reload from local
function loadData() {
    //key,value as json，passed to addNote
    var idLength = 0;
    var idArray = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);
        idLength++;
        idArray.push(key);
        addNote(key, value);
    }

    //test line link when note num is 2
    if (idLength == 2) {
        //link(idArray);
    }


}
//delete note
function deleteNote(key) {
    var obj = document.getElementById(key);
    obj.parentNode.removeChild(obj);
    //当点击X按钮时，删除该便利贴及localStorage的内容
    localStorage.removeItem(key);
}
//clear all
function deleteNotesAll() {
    localStorage.clear();
    //refresh
    location.reload();
}

function changeColor(id) {
    var obj = document.getElementById(id);
    var color = obj.firstElementChild.lastElementChild;
    //just a guessing
    var selectedColor = color.options[color.options.selectedIndex].value;

    obj.style.backgroundColor = selectedColor;
    saveNote(id);


}

function link(idArray) {
    jsPlumb.ready(function () {
        jsPlumb.connect({
            source: document.getElementById(idArray[0]),
            target: document.getElementById(idArray[1]),
            endpoint: 'Rectangle'
        })

        jsPlumb.draggable(document.getElementById(idArray[0]));
        jsPlumb.draggable(document.getElementById(idArray[1]));
    })

}
function mouseupHandler(e) {
    document.removeEventListener("mousemove", mousemoveHandler, false);
}
function mousemoveHandler(e) {
    dragObj.style.left = (_offsetX + e.clientX - _startX) + 'px';
    dragObj.style.top = (_offsetY + e.clientY - _startY) + 'px';

}

function getMousePos(event) {
    var e = event || window.event;
    return { 'x': e.clientX, 'y': clientY }
}

window.addEventListener("load", init, false);


function init() {
    // Adding event listener for adding note
    var btnNote = document.getElementById("addNote");
    btnNote.addEventListener("click", function () { addNote(); }, false);

    // Adding event listener for deleting stickies
    var btnRemove = document.getElementById("removeAllNote");
    btnRemove.addEventListener("click", function () { deleteNotesAll(); }, false);

    // Adding event listener for clustering stickies based on color
    var btnColor = document.getElementById("clusterColorStickies");
    btnColor.addEventListener("click", function () { clusterColorStickies(); }, false);

    
    // Adding event listener for searching sticky based on color
    var btnSearchNote = document.getElementById("searchNote");
    btnSearchNote.addEventListener("click", function () { searchSticky(document.querySelector("input").value); }, false);

    loadData();
    // Add event listeners
    document.addEventListener("mousedown", mousedownHandler, false);
    document.addEventListener("mouseup", mouseupHandler, false);
}


function clusterColorStickies() {
    
    // We initially support 2 clusters
    // Cluster 1: Red
    // Cluster 2: Green
    // Cluster 3: Blue
    // Cluster 4: Yellow

    // Get the dimensions of the screen
    var height = window.screen.height;
    var width = window.screen.width;


    var c1_x1 = 0, c1_y1 = 0;
    var c1_xstart = 0, c1_ystart = 0;
    var c2_x1 = width/2, c2_y1 = 0;
    var c3_x1 = 0, c3_y1 = height/2; 
    var c4_x1 = width/2, c4_y1 = height/2;

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);
        
        if(value[0].color == "#FFCCCC"){
            document.getElementById(key).style.left = c1_x1 + "px";
            document.getElementById(key).style.top = c1_y1 + "px";
            
            if((c1_y1+180) < (height/2)){
                c1_y1+=180;
            }
            else{
                c1_x1+=180;
                c1_y1 = 0;
            }
            if((c1_x1+180) > width/2){
                c1_xstart += 20;
                c1_ystart += 20;
                c1_x1 = c1_xstart;
                c1_y1 = c1_ystart;

            }
            
        }
        if(value[0].color == "#CCFFCC"){
            document.getElementById(key).style.left = c2_x1 + "px";
            document.getElementById(key).style.top = c2_y1 + "px";
            
            if((c2_y1+180) < (height/2)){
                c2_y1+=180;
            }
            else{
                c2_x1+=180;
                c2_y1 = 0;
            }
        }
        if(value[0].color == "#99CCFF"){
            document.getElementById(key).style.left = c3_x1 + "px";
            document.getElementById(key).style.top = c3_y1 + "px";
            
            if((c3_y1+180) < height){
                c3_y1+=180;
            }
            else{
                c3_x1+=180;
                c3_y1 = height/2;
            }
        }
        if(value[0].color == "#FFFFCC"){
            document.getElementById(key).style.left = c4_x1 + "px";
            document.getElementById(key).style.top = c4_y1 + "px";
            
            if((c4_y1+180) < height){
                c4_y1+=180;
            }
            else{
                c4_x1+=180;
                c4_y1 = height/2;
            }
        }
    
    }
}


function searchSticky(search_text){

    var count = 0;
    var sticky_key = 0;

    // console.log(search_text);
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);


        var str1 = value[0].text; // Text in stickies
        var n = str1.search(new RegExp(search_text, "i"));
        if( n!= -1)break;
        // console.log(str1);
        // console.log(n);
        // if(n>count){
        //     count = n;
        //     sticky_key = key;
        // }
    }
    var height = window.screen.height/2;
    var width = window.screen.width/2;
    document.getElementById(key).style.left = height + "px";
    document.getElementById(key).style.top = width + "px";
    

}