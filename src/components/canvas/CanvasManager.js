import React, { Component } from 'react'
import { fabric } from "fabric";

// bounding styles
fabric.Object.prototype.cornerStyle = "circle";
fabric.Object.prototype.cornerSize = 10;
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.borderColor = "#3f73c6";
fabric.Object.prototype.cornerColor = "#3f73c6";
fabric.Object.prototype.cornerStrokeColor = "#3f73c6";
fabric.Object.prototype.selectionDashArray = [5, 5];
fabric.Object.prototype.borderDashArray = [5, 5];
fabric.Object.prototype.padding = 0;
const STEP = 10;
const Direction = {
    LEFT : "LEFT",
    RIGHT: "RIGHT",
    UP   : "UP",
    DOWN : "DOWN",
};
class CanvasManager extends Component{

    static defaultProps = {
        width: 1000,
        height: 1000,
    }

    constructor() {
        super();
        this.state = {
            id             : "uf",
            editable       : true,
            zoom           : 1,
            backgroundImage: "",
            isImage        : true,
            zoomValue      : null,
            canvas: null,
            canvas_width: 1000,
            canvas_height: 1000,
        }
    }
    getCanvasSize = () =>
    {
        let obj = {height: this.props.canvasHeight, width: this.props.canvasWidth};
        if (this.smallDevice)
        {
            obj.height = this.cavasSmallSize;
            obj.width = this.cavasSmallSize;
        }
        return obj;
    }

    moveSelected = (direction) =>
    {
        let activeObject = this.props.canvas.getActiveObject();

        if (activeObject)
        {
            switch (direction)
            {
                case Direction.LEFT:
                    activeObject.set({left: activeObject.left - STEP});
                    break;
                case Direction.UP:
                    activeObject.set({top: activeObject.top - STEP});
                    break;
                case Direction.RIGHT:
                    activeObject.set({left: activeObject.left + STEP});
                    break;
                case Direction.DOWN:
                    activeObject.set({top: activeObject.top + STEP});
                    break;

                default:
                    break;
            }
            activeObject.setCoords();
            this.props.canvas.renderAll();
        }
    };

    runTests=()=>{
        let canvas = this.canvas;
        // add image
        let src  = './user_uploads/images/eutouristique-asia-holiday-lahore11-sghd.jpg';
        this.addImage(src)

        // add video
        this.addVideo('./user_uploads/videos/Big_Buck_Bunny.mp4');
        this.addGif();
    }
    addImage=(src)=>{
        let canvas = this.canvas;
        let Img = new Image();
        Img.onload = () =>{
            let wrapImage = new fabric.Image(Img,{
                top:10,left:10,name:'image'
            });
            let scale = canvas.height <= canvas.width ? canvas.height:canvas.width;
            scale *= 0.9;
            let imageRatio = wrapImage.width >= wrapImage.height ? 'width':'height';
            if(imageRatio === 'width') wrapImage.scaleToWidth(scale);
            else wrapImage.scaleToHeight(scale);

            canvas.add(wrapImage);
            canvas.renderAll();
        }
        Img.src =src;
    }
    addGif=()=>{
        let src  = './user_uploads/images/9080607321ab98fa3e70dd24b2513a20.gif';
        let canvas = this.canvas;
        let Img = new Image();
        Img.onload = () =>{
            let wrapImage = new fabric.Image(Img,{
                top:10,left:10,name:'image'
            });
            let scale = canvas.height <= canvas.width ? canvas.height:canvas.width;
            scale *= 0.9;
            let imageRatio = wrapImage.width >= wrapImage.height ? 'width':'height';
            if(imageRatio === 'width') wrapImage.scaleToWidth(scale);
            else wrapImage.scaleToHeight(scale);

            canvas.add(wrapImage);
            canvas.renderAll();
        }
        Img.src =src;

    }

    addVideo=(url_mp4)=>{
        function getVideoElement(url) {
            var videoE = document.createElement('video');
            videoE.loop = true;
            videoE.width = 530;
            videoE.height = 298;
            videoE.muted = false;
            videoE.crossOrigin = "anonymous";
            var source = document.createElement('source');
            source.src = url;
            source.type = 'video/mp4';
            videoE.appendChild(source);
            return videoE;
        }
        let canvas = this.canvas;
        var videoE = getVideoElement(url_mp4);
        var fab_video = new fabric.Image(videoE, {left: 0,   top: 0 ,name:'video'});
        fab_video.set('video_src', url_mp4);
        canvas.add(fab_video);
        fab_video.getElement().play();
        fabric.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
        });
    }

    componentDidMount() {
        let {canvas_width,canvas_height} = this.state;

        const canvas = new fabric.Canvas(this.c,{
            preserveObjectStacking:true,
            backgroundColor:'#fff',
            width:canvas_width,
            height:canvas_height
        })
        this.canvas = canvas;

        canvas.on({
            "selection:created": this.canvasEvents.selectionCreated,
            "selection:updated": this.canvasEvents.selectionUpdated,
            "selection:cleared": this.canvasEvents.selectionCleared,
            "object:added"     : this.canvasEvents.objectAdded,
            "object:removed"   : this.objectRemoved,
        });
        this.runTests();
        window.addEventListener('paste', this.handlePasteEvent);
    }
    handlePasteEvent(e) {
        console.log(e)
        let canvas = this.canvas;
        navigator.clipboard.read().then(items=>{
            let files = [];
            let allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
            for (let i = 0; i < items.length; i++){
                if (items[i].types.find(fileType => allowedFileTypes.includes(fileType))) {
                    items[i].getType("image/png").then(file => {

                        console.log(items[i])
                    });
                }
            }
        })
    }

    retrieveImageFromClipboardAsBlob(pasteEvent, callback){
        console.log(pasteEvent.clipboardData)
        if(pasteEvent.clipboardData == false){
            if(typeof(callback) == "function"){
                callback(undefined);
            }
        };

        let items = pasteEvent.clipboardData.items;
        if(items == undefined){
            if(typeof(callback) == "function"){
                callback(undefined);
            }
        };
        for (let i = 0; i < items.length; i++) {
            // Skip content if not image
            if (items[i].type.indexOf("image") == -1) continue;
            // Retrieve image on clipboard as blob
            let blob = items[i].getAsFile();

            if(typeof(callback) == "function"){
                callback(blob);
            }
        }
    }

    canvasEvents = {
        selectionCreated:()=>{

        },
        selectionUpdated:()=>{

        },
        selectionCleared:()=>{

        },
        objectAdded:()=>{},
        objectRemoved:()=>{},
    }



    render() {
        return(
            <>
                <canvas ref={c => (this.c = c)} width={400} height={400} />
            </>
        )
    }
}

export default CanvasManager;