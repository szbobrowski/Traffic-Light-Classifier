// Define our labelmap
const labelMap = {
    green: 'green',
    red: 'red',
    yellow: 'yellow',
    unknown: 'black',
}

export const drawRect = (predictions, imgWidth, imgHeight, canvasWidth, canvasHeight, ctx)=>{
    predictions?.forEach(prediction => {

        const widthScale = canvasWidth/imgWidth;
        const heightScale = canvasHeight/imgHeight;
        // Extract variables
        const [ x, y, width, height ] = prediction.bbox;
        const classification_class = prediction.class;
        const classification_score = prediction.score;

        // Set styling
        ctx.strokeStyle = labelMap[classification_class]
        ctx.lineWidth = 3
        ctx.fillStyle = 'white'
        ctx.font = '13px Arial'         
        
        // DRAW!!
        ctx.beginPath()
        ctx.fillText(classification_class + ' - ' + Math.round(classification_score*100)/100, x*widthScale, y*heightScale-7)
        ctx.rect(x*widthScale, y*heightScale, width*widthScale, height*heightScale);
        ctx.stroke()
    })
}