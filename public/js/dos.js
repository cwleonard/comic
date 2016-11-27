//consle.js

var ctx = null;
var theCanvas = null;
var lineHeight = 20;

var widthOffset = 2;
var cursorWidth = 8;
var cursorHeight = 3;
var fontColor = "#C0C0C0";
var outputFont = '12pt Consolas';
//var outputFont = '12pt Tahoma';
//var outputFont = '9pt Courier New';
var charWidth;

var allUserCmds = [ ]; // array of strings to hold the commands user types
var currentCmd = ""; // string to hold current cmd user is typing

var PROMPT = "c:\\>";
var promptWidth = null;
var promptPad = 2;
var leftWindowMargin = 2;
var cursor = null;
var flashCounter = 1;
var maxHeight = null;

function initDos(elemId, w, h)
{
    maxHeight = h;
	theCanvas = document.getElementById(elemId);
	ctx = theCanvas.getContext("2d");
	ctx.font = outputFont;
	var metrics = ctx.measureText("W");
	// rounded to nearest int
	charWidth = Math.ceil(metrics.width);
	promptWidth = charWidth * PROMPT.length + promptPad;
	cursor = new appCursor({x:promptWidth,y:lineHeight,width:cursorWidth,height:cursorHeight});

	window.addEventListener("resize", draw);
	window.addEventListener("keydown",keyDownHandler);
	window.addEventListener("keypress",showKey);
	initViewArea(w, h);
	setInterval(flashCursor,300);
	function appCursor (cursor){
		this.x = cursor.x;
		this.y = cursor.y;
		this.width = cursor.width;
		this.height = cursor.height;
	}
}

function drawNewLine(){
	ctx.font = outputFont;
	ctx.fillStyle = fontColor;
	var textOut = PROMPT;

    var xVal = leftWindowMargin;
    for (var letterCount = 0; letterCount < textOut.length;letterCount++) {
        ctx.fillText(textOut[letterCount], xVal, cursor.y + lineHeight);
        xVal+=charWidth;
    }
	
    //ctx.fillText  (textOut,leftWindowMargin, cursor.y + lineHeight);
}

function drawCommandOutput(lines) {

    ctx.font = outputFont;
    ctx.fillStyle = fontColor;

    for (var i = 0; i < lines.length; i++) {
        
//        var textOut = lines[i];
//        var xVal = leftWindowMargin;
//        for (var letterCount = 0; letterCount < textOut.length;letterCount++) {
//            ctx.fillText(textOut[letterCount], xVal, cursor.y + lineHeight);
//            xVal+=charWidth;
//        }

        allUserCmds.push(lines[i]);
        
        cursor.y += lineHeight;
        
        if (cursor.y > maxHeight) {
            allUserCmds.splice(0, 1);
            cursor.y -= lineHeight;
//            draw();
        }
        
    }
    
    
    draw();
    
}

function drawPrompt(Yoffset)
{
	ctx.font = outputFont;
	ctx.fillStyle = fontColor;
	var textOut = PROMPT;
	
	var xVal = leftWindowMargin;
    for (var letterCount = 0; letterCount < textOut.length;letterCount++) {
        ctx.fillText(textOut[letterCount], xVal, Yoffset * lineHeight);
        xVal+=charWidth;
    }

}

function blotPrevChar(){
	blotOutCursor();
	ctx.fillStyle = "#000000";
	cursor.x-=charWidth;
	ctx.fillRect(cursor.x,cursor.y-(charWidth + widthOffset),cursor.width+3,15);
}

function blotOutCursor(){
	ctx.fillStyle = "#000000";
	ctx.fillRect(cursor.x,cursor.y,cursor.width,cursor.height);
}

function keyDownHandler(e){
	
	var currentKey = null;
	if (e.code !== undefined)
	{
		currentKey = e.code;
		//console.log("e.code : " + e.code);
	}
	else
	{
		currentKey = e.keyCode;
		//console.log("e.keyCode : " + e.keyCode);
	}
	//console.log(currentKey);
	// handle backspace key
	if((currentKey === 8 || currentKey === 'Backspace') && document.activeElement !== 'text') {
			e.preventDefault();
			// promptWidth is the beginning of the line with the c:\>
			if (cursor.x > promptWidth)
			{
				blotPrevChar();
				if (currentCmd.length > 0)
				{
					currentCmd = currentCmd.slice(0,-1);
				}
			}
	}
	if((currentKey == 31 || currentKey == 'Space') && document.activeElement !== 'text') {
	    e.preventDefault();
	    showKey({charCode: 32});
	}
	// handle <ENTER> key
	if (currentKey == 13 || currentKey == 'Enter')
	{
	    var lastCommand = currentCmd.toLowerCase();
	    
	    e.preventDefault();
		blotOutCursor();

		drawNewLine();
		cursor.x=promptWidth;
		cursor.y+=lineHeight;
		allUserCmds.push(PROMPT + currentCmd);
		currentCmd = "";

		if (cursor.y > maxHeight) {
            allUserCmds.splice(0, 1);
            cursor.y -= lineHeight;
            draw();
        }

		if (lastCommand === "dir") {
       		    drawCommandOutput([ " Directory of C:\\", "",
                    "11/22/2016  08:25 PM    246 frogs.txt",
                    "11/22/2016  08:26 PM   1244  bugs.txt", "" ]);
		} else if (lastCommand === "format c:") {
            drawCommandOutput(["", "Format complete.", ""]);
            setTimeout(function() {
                $("body").html("");
            }, 2000);
        } else if (lastCommand === "chkdsk") {
            drawCommandOutput([" Checking C:", "...it's full of syrup!", ""]);
        } else if (lastCommand.startsWith("edlin") && lastCommand.startsWith("edlin ")) {
            if (lastCommand.length === 5) {
                drawCommandOutput([" no file name specified"]);
            } else {
                drawCommandOutput([" Have you gone mad?", ""]);
            }
        } else if (lastCommand.startsWith("echo") && lastCommand.startsWith("echo ")) {
            if (lastCommand.length > 4 && lastCommand.indexOf(">") == -1) {
                var toEcho = lastCommand.substring(5) + " and a bag of chips";
                drawCommandOutput([toEcho, ""]);
            }
        } else if (lastCommand === "qbasic") {
            drawCommandOutput([" Sorry, can't play Gorillas right now.", ""]);
		} else if (lastCommand !== "") {
		    drawCommandOutput(["Bad command or file name"]);
		}

	}
}

function showKey(e){
	blotOutCursor();

	ctx.font = outputFont;
	ctx.fillStyle = fontColor;

	ctx.fillText  (String.fromCharCode(e.charCode),cursor.x, cursor.y);
	cursor.x += charWidth;
	currentCmd += String.fromCharCode(e.charCode);
}

function flashCursor(){
	
	var flag = flashCounter % 3;

	switch (flag)
	{
		case 1 :
		case 2 :
		{
			ctx.fillStyle = fontColor;
			ctx.fillRect(cursor.x,cursor.y,cursor.width, cursor.height);
			flashCounter++;
			break;
		}
		default:
		{
			ctx.fillStyle = "#000000";
			ctx.fillRect(cursor.x,cursor.y,cursor.width, cursor.height);
			flashCounter= 1;
		}
	}
}
function cursor (cursor){
	this.x = cursor.x;
	this.y = cursor.y;
	this.width = cursor.width;
	this.height = cursor.height;
}

function initViewArea(w, h) {
	
	
	// the -5 in the two following lines makes the canvas area, just slightly smaller
	// than the entire window.  this helps so the scrollbars do not appear.
	ctx.canvas.width  =  w-5;
	ctx.canvas.height = h-5;
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
	
	ctx.font = outputFont;
	ctx.fillStyle = fontColor;
	var textOut = PROMPT;

	ctx.fillText  (textOut,leftWindowMargin, cursor.y);
	draw();
}

function draw()
{
	//ctx.canvas.width  = window.innerWidth-5;
	//ctx.canvas.height = window.innerHeight-5;
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
	ctx.font = outputFont;
	ctx.fillStyle = fontColor;
	
	for (var i=0;i<allUserCmds.length;i++)
	{
		//drawPrompt(i+1);
		xVal = leftWindowMargin; //promptWidth-charWidth;
			
		ctx.font = outputFont;
		ctx.fillStyle = fontColor;
		for (var letterCount = 0; letterCount < allUserCmds[i].length;letterCount++)
		{
		    ctx.fillText(allUserCmds[i][letterCount], xVal, lineHeight * (i+1));
		    xVal+=charWidth;
		}
	}
	if (currentCmd != "")
	{
		drawPrompt(Math.ceil(cursor.y/lineHeight));
		ctx.font = outputFont;
		ctx.fillStyle = fontColor;
		xVal = promptWidth-charWidth;
		for (var letterCount = 0; letterCount < currentCmd.length;letterCount++)
		{
			ctx.fillText(currentCmd[letterCount], xVal, cursor.y);
			xVal += charWidth;
		}
	}
	else
	{
		drawPrompt(Math.ceil(cursor.y/lineHeight));
	}
}