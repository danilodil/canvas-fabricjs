import React,{Component} from "react";

import CanvasManager from "../components/canvas/CanvasManager";
class Editor extends Component{
    render() {
        return(
            <>
            <div>
                <CanvasManager />
            </div>
            </>
        )
    }
}

export default Editor