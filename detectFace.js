
const video = document.getElementById('video');
const img = document.getElementById('input');
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')

]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        { video:{} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize);
    
    setInterval( async ()=> {
        // const detections = await  faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const landmarks = await faceapi.detectFaceLandmarks(video);
        const detectionResult = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        const faceBoundary = [detectionResult[0].detection]
        const resizedDetections = faceapi.resizeResults(faceBoundary, displaySize)
        // const landmarkPositions = landmarks.positions
        // console.log(landmarks.getNose())
        // const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);
        drawFace(resizedDetections[0]);       
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    },100)
});

function drawFace(detections){
    console.log(detections.box)
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0,canvas.width, canvas.height);
    const box = detections.box;
    ctx.strokeStyle = "blue";
    ctx.strokeWidth = "3";
    const height = box.height;
    const width = box.width;
    const x = box.x;
    const y = box.y - height/6;
    // ctx.strokeRect(x, y, width, height);
    const img = new Image();
    img.src = "https://www.pinclipart.com/picdir/big/337-3374775_spider-face-webbing-hero-comic-mask-super-hero.png"
    ctx.drawImage(img, x, y, width, height);
}