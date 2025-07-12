var imgIn;
var imgHeight = 120;
var imgWidth = 160;
var spacing = 20;
var classifier = objectdetect.frontalface;
var greyScaleImg;
var labImg;
var blurImg;
var pixelImg;
var counter = 0;

var video;
var imgLoaded = false;
var slidersDrawn = false;

function setup() {
    createCanvas(1000,680);
    video = createCapture(VIDEO);
    video.hide();
}

function draw (){
        if(!imgLoaded){
        background(255);
        image(video,0,0,320,240);

        fill(0);
        textSize(50);
        textAlign(CENTER);
        text("Take Photo",130,300);
        textSize(50);
        textAlign(CENTER);
        text("Press 'Enter' ",150,350);

    }
    if(imgLoaded){
        // draw background first to hide the webcam
        background(255);
        image(imgIn,0,0,160,120);
        imgIn.resize(imgWidth,imgHeight);
        
        //so that silders will only be drawn once 
        if(!slidersDrawn){
            //sliders setup
            redSlider = createSlider(0,256,0);
            redSlider.position(spacing,(imgHeight*3 +spacing*2));
            greenSlider = createSlider(0,256,0);

            greenSlider.position(imgWidth+spacing*2,(imgHeight*3 +spacing*2));
            blueSlider = createSlider(0,256,0);
            blueSlider.position((imgWidth*2+spacing*3),(imgHeight*3 +spacing*2));
            XYZSlider = createSlider(0,256,0);
            XYZSlider.position(imgWidth+spacing*2,(imgHeight*5 +spacing*4));
            LABSlider = createSlider(0,256,0,0.1);
            LABSlider.position(imgWidth*2+spacing*3,(imgHeight*5 +spacing*4));
            slidersDrawn = true;
        }
        greyScaleImg = createImage(imgIn.width,imgIn.height);
        var saclefactor = 1.2 ;
        detector = new objectdetect.detector(160,120,saclefactor,classifier);

        //first webcam img 
        image(imgIn,0,0,imgWidth,imgHeight);
        //second webcam img
        image(imgIn,0,(imgHeight+spacing)*3,imgWidth,imgHeight);

        greyScale();
        channelRGB();
        convertToXYZ();
        convertToLab();
        faceDetector();
        blurFace();
        segmentedRGB();
        segmentedXYZ();
        segmentedLAB();
    }
}

function greyScale(){
    //load image pixel values into array pixels
    greyScaleImg.loadPixels();
    imgIn.loadPixels();
    
    for(var y=0;y<imgIn.height;y++){
        for(var x=0;x<imgIn.width;x++){

            var pixelIndex = ((imgIn.width * y) + x)*4;
            var pixelRed = imgIn.pixels[pixelIndex + 0];
            var pixelGreen = imgIn.pixels[pixelIndex + 1];
            var pixelBlue = imgIn.pixels[pixelIndex + 2];
            var pixelAlpha = imgIn.pixels[pixelIndex + 3];
            
            var ave = ((pixelRed + pixelGreen + pixelBlue)/3)*1.2;
            //set RGB to ave value
            greyScaleImg.pixels[pixelIndex+0] = ave;
            greyScaleImg.pixels[pixelIndex+1] = ave;
            greyScaleImg.pixels[pixelIndex+2] = ave;
            greyScaleImg.pixels[pixelIndex+3] = 255;
        }
    }
    greyScaleImg.updatePixels();
    image(greyScaleImg,imgWidth+spacing,0,imgWidth,imgHeight);
}
function channelRGB(){
    
    var redImg = createImage(imgIn.width, imgIn.height);
    redImg.loadPixels();
    var greenImg = createImage(imgIn.width, imgIn.height);
    greenImg.loadPixels();
    var blueImg = createImage(imgIn.width, imgIn.height);
    blueImg.loadPixels();
    
    //load image pixel values into array pixels
    imgIn.loadPixels();
    
    for(var y=0;y<imgIn.height;y++){
        for(var x=0;x<imgIn.width;x++){
            
            var pixelIndex = ((imgIn.width * y) + x)*4;
            var pixelRed = imgIn.pixels[pixelIndex + 0];
            var pixelGreen = imgIn.pixels[pixelIndex + 1];
            var pixelBlue = imgIn.pixels[pixelIndex + 2];
       
            pixelRed = constrain(pixelRed,0,255);
            pixelGreen = constrain(pixelGreen,0,255);
            pixelBlue = constrain(pixelBlue,0,255);
            
            //red channel
            redImg.pixels[pixelIndex+0] = pixelRed;
            redImg.pixels[pixelIndex+1] = 0;
            redImg.pixels[pixelIndex+2] = 0;
            redImg.pixels[pixelIndex+3] = 255;
            
            //green channel
            greenImg.pixels[pixelIndex+0] = 0;
            greenImg.pixels[pixelIndex+1] = pixelGreen;
            greenImg.pixels[pixelIndex+2] = 0;
            greenImg.pixels[pixelIndex+3] = 255;
            
            //blue channel
            blueImg.pixels[pixelIndex+0] = 0;
            blueImg.pixels[pixelIndex+1] = 0;
            blueImg.pixels[pixelIndex+2] = pixelBlue;
            blueImg.pixels[pixelIndex+3] = 255;
            
        }
    }
    redImg.updatePixels();
    greenImg.updatePixels();
    blueImg.updatePixels();
    
    image(redImg,0,(imgHeight+spacing),imgWidth,imgHeight);
    image(greenImg,imgWidth+spacing,(imgHeight+spacing),imgWidth,imgHeight);
    image(blueImg,(imgWidth+spacing)*2,(imgHeight+spacing),imgWidth,imgHeight);
}

function segmentedRGB(){
    
    var redImg = createImage(imgIn.width, imgIn.height);
    redImg.loadPixels();
    var greenImg = createImage(imgIn.width, imgIn.height);
    greenImg.loadPixels();
    var blueImg = createImage(imgIn.width, imgIn.height);
    blueImg.loadPixels();
    
    //load image pixel values into array pixels
    imgIn.loadPixels();
    
    for(var y=0;y<imgIn.height;y++){
        for(var x=0;x<imgIn.width;x++){
            
            var pixelIndex = ((imgIn.width * y) + x)*4;
            var pixelRed = imgIn.pixels[pixelIndex + 0];
            var pixelGreen = imgIn.pixels[pixelIndex + 1];
            var pixelBlue = imgIn.pixels[pixelIndex + 2];
       
            pixelRed = constrain(pixelRed,0,255);
            pixelGreen = constrain(pixelGreen,0,255);
            pixelBlue = constrain(pixelBlue,0,255);
            
            //red channel
            if(redSlider.value()>pixelRed){
                pixelRed = 0;
            }
            redImg.pixels[pixelIndex+0] = pixelRed;
            redImg.pixels[pixelIndex+1] = 0;
            redImg.pixels[pixelIndex+2] = 0;
            redImg.pixels[pixelIndex+3] = 255;
            
            //green channel
            if(greenSlider.value()>pixelGreen){
                pixelGreen = 0;
            }
            greenImg.pixels[pixelIndex+0] = 0;
            greenImg.pixels[pixelIndex+1] = pixelGreen;
            greenImg.pixels[pixelIndex+2] = 0;
            greenImg.pixels[pixelIndex+3] = 255;
            
            //blue channel
            if(blueSlider.value()>pixelBlue){
                pixelBlue = 0;
            }
            blueImg.pixels[pixelIndex+0] = 0;
            blueImg.pixels[pixelIndex+1] = 0;
            blueImg.pixels[pixelIndex+2] = pixelBlue;
            blueImg.pixels[pixelIndex+3] = 255;
            
        }
    }
    redImg.updatePixels();
    greenImg.updatePixels();
    blueImg.updatePixels();
    
    image(redImg,0,(imgHeight+spacing)*2,imgWidth,imgHeight);
    image(greenImg,imgWidth+spacing,(imgHeight+spacing)*2,imgWidth,imgHeight);
    image(blueImg,(imgWidth+spacing)*2,(imgHeight+spacing)*2,imgWidth,imgHeight);
}

function convertToXYZ() {
    // Load image pixel values into array pixels
    var XYZImg = createImage(imgIn.width,imgIn.height);
    XYZImg.loadPixels();
    imgIn.loadPixels();

    for (var y = 0; y < imgIn.height; y++) {
        for (var x = 0; x < imgIn.width; x++) {
            var pixelIndex = (imgIn.width * y + x) * 4;

            // Extract RGB values
            var pixelRed = imgIn.pixels[pixelIndex + 0] / 255.0;
            var pixelGreen = imgIn.pixels[pixelIndex + 1] / 255.0;
            var pixelBlue = imgIn.pixels[pixelIndex + 2] / 255.0;

            // Apply gamma correction
            pixelRed = (pixelRed > 0.04045) ? Math.pow((pixelRed + 0.055) / 1.055, 2.4) : pixelRed / 12.92;
            pixelGreen = (pixelGreen > 0.04045) ? Math.pow((pixelGreen + 0.055) / 1.055, 2.4) : pixelGreen / 12.92;
            pixelBlue = (pixelBlue > 0.04045) ? Math.pow((pixelBlue + 0.055) / 1.055, 2.4) : pixelBlue / 12.92;

            // Convert RGB to XYZ
            var X = pixelRed * 0.4124564 + pixelGreen * 0.3575761 + pixelBlue * 0.1804375;
            var Y = pixelRed * 0.2126729 + pixelGreen * 0.7151522 + pixelBlue * 0.0721750;
            var Z = pixelRed * 0.0193339 + pixelGreen * 0.1191920 + pixelBlue * 0.9503041;

            // Normalize XYZ to D65 illuminant
            X /= 0.95047;
            Y /= 1.00000;
            Z /= 1.08883;

            // Update image pixel values with XYZ values
            XYZImg.pixels[pixelIndex + 0] = X * 255;
            XYZImg.pixels[pixelIndex + 1] = Y * 255;
            XYZImg.pixels[pixelIndex + 2] = Z * 255;
            XYZImg.pixels[pixelIndex + 3] = 255;
        }
    }

    // Update pixels and display the converted image
    XYZImg.updatePixels();
    image(XYZImg,imgWidth + spacing,(imgHeight+spacing)*3,imgWidth,imgHeight);
}

function segmentedXYZ(){
    var segmentedXYZImg = createImage(imgIn.width,imgIn.height)
    segmentedXYZImg.loadPixels();
    imgIn.loadPixels();
    
    var thresholdValue = XYZSlider.value() / 256;
    for (var y = 0; y < imgIn.height; y++) {
        for (var x = 0; x < imgIn.width; x++) {
            var pixelIndex = (imgIn.width * y + x) * 4;

            // Extract RGB values
            var pixelRed = imgIn.pixels[pixelIndex + 0] / 255.0;
            var pixelGreen = imgIn.pixels[pixelIndex + 1] / 255.0;
            var pixelBlue = imgIn.pixels[pixelIndex + 2] / 255.0;

            // Apply gamma correction
            pixelRed = (pixelRed > 0.04045) ? Math.pow((pixelRed + 0.055) / 1.055, 2.4) : pixelRed / 12.92;
            pixelGreen = (pixelGreen > 0.04045) ? Math.pow((pixelGreen + 0.055) / 1.055, 2.4) : pixelGreen / 12.92;
            pixelBlue = (pixelBlue > 0.04045) ? Math.pow((pixelBlue + 0.055) / 1.055, 2.4) : pixelBlue / 12.92;

            // Convert RGB to XYZ
            var X = pixelRed * 0.4124564 + pixelGreen * 0.3575761 + pixelBlue * 0.1804375;
            var Y = pixelRed * 0.2126729 + pixelGreen * 0.7151522 + pixelBlue * 0.0721750;
            var Z = pixelRed * 0.0193339 + pixelGreen * 0.1191920 + pixelBlue * 0.9503041;

            // Normalize XYZ to D65 illuminant
            X /= 0.95047;
            Y /= 1.00000;
            Z /= 1.08883;
            
            var segmentedX = (X > thresholdValue) ? X : 0;
            
            // Update image pixel values with XYZ values
            segmentedXYZImg.pixels[pixelIndex + 0] = segmentedX * 255;
            segmentedXYZImg.pixels[pixelIndex + 1] = Y * 255;
            segmentedXYZImg.pixels[pixelIndex + 2] = Z * 255;
            segmentedXYZImg.pixels[pixelIndex + 3] = 255;
        }
    }
    segmentedXYZImg.updatePixels();
    image(segmentedXYZImg,imgWidth + spacing,(imgHeight+spacing)*4,imgWidth,imgHeight);
}

function convertToLab() {
    // Load image pixel values into array pixels
    labImg = createImage(imgIn.width,imgIn.height);
    labImg.loadPixels();
    imgIn.loadPixels();

    for (var y = 0; y < imgIn.height; y++) {
        for (var x = 0; x < imgIn.width; x++) {
            var pixelIndex = (imgIn.width * y + x) * 4;
            // Extract RGB values
            var pixelRed = imgIn.pixels[pixelIndex + 0];
            var pixelGreen = imgIn.pixels[pixelIndex + 1];
            var pixelBlue = imgIn.pixels[pixelIndex + 2];

            // Normalize RGB values to the range [0, 1]
            var normalizedR = pixelRed / 255.0;
            var normalizedG = pixelGreen / 255.0;
            var normalizedB = pixelBlue / 255.0;

            // Apply gamma correction
            normalizedR = (normalizedR > 0.04045) ? Math.pow((normalizedR + 0.055) / 1.055, 2.4) : normalizedR / 12.92;
            normalizedG = (normalizedG > 0.04045) ? Math.pow((normalizedG + 0.055) / 1.055, 2.4) : normalizedG / 12.92;
            normalizedB = (normalizedB > 0.04045) ? Math.pow((normalizedB + 0.055) / 1.055, 2.4) : normalizedB / 12.92;

            // Convert RGB to XYZ
            var X = normalizedR * 0.4124564 + normalizedG * 0.3575761 + normalizedB * 0.1804375;
            var Y = normalizedR * 0.2126729 + normalizedG * 0.7151522 + normalizedB * 0.0721750;
            var Z = normalizedR * 0.0193339 + normalizedG * 0.1191920 + normalizedB * 0.9503041;

            // Normalize XYZ to D65 illuminant
            X /= 0.95047;
            Y /= 1.00000;
            Z /= 1.08883;

            // Convert XYZ to L*a*b*
            X = (X > 0.008856) ? Math.pow(X, 1 / 3) : (903.3 * X + 16) / 116;
            Y = (Y > 0.008856) ? Math.pow(Y, 1 / 3) : (903.3 * Y + 16) / 116;
            Z = (Z > 0.008856) ? Math.pow(Z, 1 / 3) : (903.3 * Z + 16) / 116;

            var L = Math.max(0, 116 * Y - 16);
            var a = (X - Y) * 500;
            var b = (Y - Z) * 200;

            // Update image pixel values with Lab values
            labImg.pixels[pixelIndex + 0] = L;
            labImg.pixels[pixelIndex + 1] = a + 128; // Adjust for Lab pixel range
            labImg.pixels[pixelIndex + 2] = b + 128; // Adjust for Lab pixel range
            labImg.pixels[pixelIndex + 3] = 255;
        }
    }
    // Update pixels and display the converted image
    labImg.updatePixels();
    image(labImg,(imgWidth+spacing)*2,(imgHeight+spacing)*3,imgWidth,imgHeight);
}

function segmentedLAB() {
    // Load image pixel values into array pixels
    var segmentedlabImg = createImage(imgIn.width,imgIn.height);
    segmentedlabImg.loadPixels();
    imgIn.loadPixels();
    
    var thresholdValue = LABSlider.value()-128;
    
    for (var y = 0; y < imgIn.height; y++) {
        for (var x = 0; x < imgIn.width; x++) {
            var pixelIndex = (imgIn.width * y + x) * 4;
            // Extract RGB values
            var pixelRed = imgIn.pixels[pixelIndex + 0];
            var pixelGreen = imgIn.pixels[pixelIndex + 1];
            var pixelBlue = imgIn.pixels[pixelIndex + 2];

            // Normalize RGB values to the range [0, 1]
            var normalizedR = pixelRed / 255.0;
            var normalizedG = pixelGreen / 255.0;
            var normalizedB = pixelBlue / 255.0;

            // Apply gamma correction
            normalizedR = (normalizedR > 0.04045) ? Math.pow((normalizedR + 0.055) / 1.055, 2.4) : normalizedR / 12.92;
            normalizedG = (normalizedG > 0.04045) ? Math.pow((normalizedG + 0.055) / 1.055, 2.4) : normalizedG / 12.92;
            normalizedB = (normalizedB > 0.04045) ? Math.pow((normalizedB + 0.055) / 1.055, 2.4) : normalizedB / 12.92;

            // Convert RGB to XYZ
            var X = normalizedR * 0.4124564 + normalizedG * 0.3575761 + normalizedB * 0.1804375;
            var Y = normalizedR * 0.2126729 + normalizedG * 0.7151522 + normalizedB * 0.0721750;
            var Z = normalizedR * 0.0193339 + normalizedG * 0.1191920 + normalizedB * 0.9503041;

            // Normalize XYZ to D65 illuminant
            X /= 0.95047;
            Y /= 1.00000;
            Z /= 1.08883;

            // Convert XYZ to L*a*b*
            X = (X > 0.008856) ? Math.pow(X, 1 / 3) : (903.3 * X + 16) / 116;
            Y = (Y > 0.008856) ? Math.pow(Y, 1 / 3) : (903.3 * Y + 16) / 116;
            Z = (Z > 0.008856) ? Math.pow(Z, 1 / 3) : (903.3 * Z + 16) / 116;

            var L = Math.max(0, 116 * Y - 16);
            var a = (X - Y) * 500;
            var b = (Y - Z) * 200;
            
            var segmentedA = (a > thresholdValue) ? a : 0;
            
            
            
            // Update image pixel values with Lab values
            segmentedlabImg.pixels[pixelIndex + 0] = L;
            segmentedlabImg.pixels[pixelIndex + 1] = segmentedA + 128; // Adjust for Lab pixel range
            segmentedlabImg.pixels[pixelIndex + 2] = b + 128; // Adjust for Lab pixel range
            segmentedlabImg.pixels[pixelIndex + 3] = 255;
        }
    }
    // Update pixels and display the converted image
    segmentedlabImg.updatePixels();
    image(segmentedlabImg,(imgWidth + spacing)*2,(imgHeight+spacing)*4,imgWidth,imgHeight);
}

function blurFace(){
    var matrix = SimpleBlurKernel(20);
    blurImg = createImage(imgIn.width,imgIn.height);
    blurImg.loadPixels();
    imgIn.loadPixels();
    
    for(var x=0;x<imgIn.width;x++){
        for(var y=0;y<imgIn.height;y++){     
            var pixelIndex = ((imgIn.width * y) + x)*4;
            var r = imgIn.pixels[pixelIndex+0];
            //calculate the convolution value for that pixel
            var c = convolution(x,y,matrix,imgIn);
            //update each pixel with new RGB value
            blurImg.pixels[pixelIndex+0] = c[0];
            blurImg.pixels[pixelIndex+1] = c[1];
            blurImg.pixels[pixelIndex+2] = c[2];
            blurImg.pixels[pixelIndex+3] = 255;
            
        }
    }
    blurImg.updatePixels();
    image(blurImg,1000,1000,160,120);
}


function SimpleBlurKernel(size){
    var m = [];
    for(var i=0;i<size;i++){
        var n = [];
        for(var j=0;j<size;j++){
            n.push(1/(size*size));
        }
        m.push(n);
    }
    return m;
}

function convolution(x, y, matrix, img) {
    var matrixSize = matrix.length;
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color as an array
    return [totalRed, totalGreen, totalBlue];
}

function faceDetector(){
    image(imgIn,0,(imgHeight + spacing)*4,160,120);
    faces = detector.detect(imgIn.canvas);   
    strokeWeight(2);
    stroke(0);
    noFill();
    //draw the rect
    for (var i=0; i<faces.length; i++){
        var face=faces[i];
        if (face[4] > 4){
            rect(face[0], face[1]+(imgHeight+spacing)*4, face[2], face[3]);
        }
    }
    
    if(counter == 1){
        greyScaleImg.updatePixels();
        crop = greyScaleImg.get(face[0]+1,face[1],face[2],face[3]);
        image(crop,face[0],face[1]+(imgHeight+spacing)*4);
        rect(face[0], face[1]+(imgHeight+spacing)*4, face[2], face[3]);
    }
    if(counter == 2){
        blurImg.updatePixels();
        crop = blurImg.get(face[0]+1,face[1],face[2],face[3]);
        image(crop,face[0],face[1]+(imgHeight+spacing)*4);
        rect(face[0], face[1]+(imgHeight+spacing)*4, face[2], face[3]);
    }
    if(counter == 3){
        labImg.updatePixels();
        crop = labImg.get(face[0]+1,face[1],face[2],face[3]);
        image(crop,face[0],face[1]+(imgHeight+spacing)*4);
        rect(face[0], face[1]+(imgHeight+spacing)*4, face[2], face[3]);
    }
    if(counter == 4){
        var pixelatedSize = 11;
        //process block by block
        pixelImg = createImage(imgIn.width,imgIn.height);
        pixelImg.loadPixels();
        imgIn.loadPixels();

        for(var y=round(face[1]);y<round(face[1]+face[3]);y+=pixelatedSize){
            for(var x=round(face[0]);x<round(face[0]+face[2]);x+=pixelatedSize){

                var sumRed = 0;
                var sumGreen = 0;
                var sumBlue = 0;

                //get the sum of RGB of that block
                for(var i=0;i<pixelatedSize;i++){
                    for(var j=0;j<pixelatedSize;j++){
                        var pixelIndex = ((imgIn.width * (y+j)) + (x+i))*4;
                        var pixelRed = imgIn.pixels[pixelIndex + 0];
                        var pixelGreen = imgIn.pixels[pixelIndex + 1];
                        var pixelBlue = imgIn.pixels[pixelIndex + 2];
                        sumRed+=pixelRed;
                        sumGreen+=pixelGreen;
                        sumBlue+=pixelBlue;
                    }
                }
                //calcualte the ave of RGB of that block
                var aveRed = sumRed/(pixelatedSize*pixelatedSize);
                var aveGreen = sumGreen/(pixelatedSize*pixelatedSize);
                var aveBlue = sumBlue/(pixelatedSize*pixelatedSize);

                //paint the block with the ave RGB value
                for(var i=0;i<pixelatedSize;i++){
                    for(var j=0;j<pixelatedSize;j++){
                        var pixelIndex = ((imgIn.width * (y+j)) + (x+i))*4;
                        pixelImg.pixels[pixelIndex + 0] = aveRed;
                        pixelImg.pixels[pixelIndex + 1] = aveGreen;
                        pixelImg.pixels[pixelIndex + 2] = aveBlue;
                        pixelImg.pixels[pixelIndex + 3] = 255;
                    }
                }
            }
        }
        pixelImg.updatePixels();
        image(pixelImg,0,(imgHeight+spacing)*4,160,120);
        rect(face[0], face[1]+(imgHeight+spacing)*4, face[2], face[3]);
    }
    if(counter == 5){
        //this resets the loop
        counter = 0;
    }
}

function keyPressed(){
    //press space to change face in face detect
    if(keyCode == 32){
        counter ++;
        faceDetector();
    }
    //press enter to take picture
    if(keyCode == 13){
        print("take picture!");
        if(!imgIn|| imgIn.width !== video.width){
            imgIn = video.get();
            imgLoaded = true;
            imgIn.loadPixels();

        }
    }
}
/*
Commentary

My research revealed that each channel can respond differently to different light conditions. For instance, photos shot outside in natural light from the sun typically have the brightest channel being red, but photos taken indoors can have a greener channel that is brighter.

One of the issues I couldn't resolve in the programme was face detect; the face detect that was used didn't handle uneven lighting well and wouldn't detect a face if the light source from one direction was too strong, for example (face light on the left creating shadows on the right). The way I resolve this issue is to use the application in an environment with better lighting.

Another issue I have encountered was converting RGB to LAB*. This conversion requires me to convert RGB to XYZ colour space first then I'll be able to convert XYZ to LAB*. I have overcome this problem by researching efficient methods to convert from RGB to XYZ to LAB* on the web.

Comparing the segmentation results from step 7 and step 10, in the case of the RGB segmentation, they have already split up the 3 channels and the segmentation will slowly remove the remaining colour. But in the case of the algorithm segmentation, because I only segment out one of the channels, the image won't turn completely black as only one channel will be removed essentially. 

For this project, I feel that I have made proper use of my time and managed to complete every task required. One thing I would do differently is make my code more condensed and make more modular functions to be more efficient.

For extension, I have implemented a way that the user can retake their webcam image if they press the enter button again. This extension is useful because users can change their facial expressions without needing to refresh the application, this also helps rectify the face detection problem if the user is in a bad lighting position.


*/