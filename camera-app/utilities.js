// Define our labelmap
const labelMap = {
    green: 'green',
    red: 'red',
    yellow: 'yellow',
    unknown: 'black',
}

export const drawRect = (predictions, ctx)=>{
    predictions?.forEach(prediction => {
        // Extract variables
        const [x,y,width,height] = prediction.bbox;
        const classification_class = prediction.class;
        const classification_score = prediction.score;
        
        // Set styling
        ctx.strokeStyle = labelMap[classification_class]
        ctx.lineWidth = 10
        ctx.fillStyle = 'white'
        ctx.font = '30px Arial'         
        
        // DRAW!!
        ctx.beginPath()
        ctx.fillText(classification_class + ' - ' + Math.round(classification_score*100)/100, x, y-10)
        ctx.rect(x, y, width, height);
        ctx.stroke()
    })
}