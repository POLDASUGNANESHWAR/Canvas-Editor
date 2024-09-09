const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('textInput'); 
const addTextButton = document.getElementById('addText');
const fontSizeSelect = document.getElementById('fontSize');
const fontStyleSelect = document.getElementById('fontStyle');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');

let textArray = [];
let undoStack = [];
let redoStack = [];
let draggingText = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Add Text


addTextButton.addEventListener('click', () => {
    const text = textInput.value;
    if (text) {
        const fontSize = fontSizeSelect.value + 'px';
        const fontStyle = fontStyleSelect.value;

        const textObject = {
            text: text,
            x: 100,
            y: 100,
            fontSize: fontSize,
            fontStyle: fontStyle,
        };

        textArray.push(textObject);
        undoStack.push([...textArray]);
        redrawCanvas();
    }
});

// Undo


undoButton.addEventListener('click', () => {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        textArray = undoStack[undoStack.length - 1];
        redrawCanvas();
    }
});

// Redo
redoButton.addEventListener('click', () => {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        textArray = undoStack[undoStack.length - 1];
        redrawCanvas();
    }
});

// Redraw Canvas


function redrawCanvas() {
    ctx.clearRect(50, 10, canvas.width, canvas.height);
    textArray.forEach((textObj) => {
        ctx.font = `${textObj.fontSize} ${textObj.fontStyle}`;
        ctx.fillText(textObj.text, textObj.x, textObj.y);
    });
}   

// Check if text is clicked for dragging


canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    for (let i = 0; i < textArray.length; i++) {
        const textObj = textArray[i];
        ctx.font = `${textObj.fontSize} ${textObj.fontStyle}`;
        const textWidth = ctx.measureText(textObj.text).width;
        const textHeight = parseInt(textObj.fontSize, 20);

        if (
            mouseX >= textObj.x && mouseX <= textObj.x + textWidth &&
            mouseY <= textObj.y && mouseY >= textObj.y - textHeight
        ) {
            draggingText = textObj;
            dragOffsetX = mouseX - textObj.x;
            dragOffsetY = mouseY - textObj.y;
            canvas.style.cursor = 'move';
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (draggingText) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        draggingText.x = mouseX - dragOffsetX;
        draggingText.y = mouseY - dragOffsetY;
        redrawCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    if (draggingText) {
        undoStack.push([...textArray]);
        draggingText = null;
        canvas.style.cursor = 'default';
    }
});