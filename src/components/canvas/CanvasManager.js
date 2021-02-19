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

class CanvasManager extends Component{

    static defaultProps = {
        width: 1000,
        height: 1000,
    }

    constructor() {
        super();
        this.state = {
            canvas: null,
            canvas_width: 1000,
            canvas_height: 1000,
        }
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
    }

    render() {
        return(
            <Fragment>
                <canvas ref={c => (this.c = c)} width={400} height={400} />
            </Fragment>
        )
    }
}