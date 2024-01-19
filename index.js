var videoelement = document.getElementById("videoelement");
var localStreamConstraints = {
    audio: true,
    video: { width: 1920, height: 1080 },
};

var mediarecorder
var options = { mimeType: "video/webm; codecs=vp9" };
var recordedChunks=[]

if (videoelement) {
    console.log("we have the video")
    navigator.mediaDevices
    .getUserMedia(localStreamConstraints)
    .then(gotStream)
    .catch(function (e) {
        if (confirm("An error with camera occured:(" + e.name + ") Do you want to reload?")) {
            location.reload();
        }
    });
}
//if found stream found 
function gotStream(stream) {
    console.log("Adding local stream.");
    videoelement.srcObject = stream 
    mediarecorder=new MediaRecorder(stream,options)
    mediarecorder.ondataavailable = handleDataAvailable;
    mediarecorder.onstop = download
}

var recbtn=document.getElementById("recbutton")
if(recbtn){
    recbtn.addEventListener('click',()=>{
        mediarecorder.start()
    })
}

var stopbtn=document.getElementById("stopbutton")
if(stopbtn){
    stopbtn.addEventListener('click',()=>{
        mediarecorder.stop()
    })
}

function handleDataAvailable(event) {

    if (event.data.size > 0) {
        recordedChunks.push(event.data);
        console.log(event.data)
    }
}
function download() {
    var blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'test.webm';
    a.click();
    window.URL.revokeObjectURL(url);
}