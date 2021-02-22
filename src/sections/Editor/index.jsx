import React, { useEffect, useState, useRef } from "react"
import { StyledEditor } from "./StyledEditor"
import Layout from "../../components/Layout"
import Sidebar from "../../components/Sidebar"
import Canvas from "../../components/Canvas"
import { Tab, TabActions } from "../../components/Tabs";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import ImagesSelector from "../../components/ImagesSelector";
import { getExt } from "../../utils";
import { fabricGif } from "../../utils/plugins/fabricGif";
import 'fabric-history';

const Editor = ({ data }) => {

  const currentCanvas = useRef([])
  const [canvas, setCanvas] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    setCanvas(initCanvas());
    window.addEventListener('resize', resizeCanvas, false);

    return () => window.removeEventListener('resize', resizeCanvas, false);
  }, []);

  const initCanvas = () => {
    canvasRef.current = new fabric.Canvas('canvas', {
      height: window.innerHeight,
      width: window.innerWidth,
    })

    return canvasRef.current;
  }

  const resizeCanvas = () => {
    canvasRef.current.setHeight(window.innerHeight);
    canvasRef.current.setWidth(window.innerWidth);
    canvasRef.current.renderAll();
  }

  const getData = (savehistory) => {
    if (savehistory === true) {
      const json = JSON.stringify(canvas);
      currentCanvas.current.push(json);
    }
  }

  const onUndo = () => {
    canvas.undo()
  }

  const onRedo = () => {
    canvas.redo()
  }

  const addGif = async (e) => {
    const gif = await fabricGif(`../assets/img/${e}`, 200, 200);
    gif.set({ top: 50, left: 50 });
    canvas.add(gif);

    fabric?.util.requestAnimFrame(render = () => {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  }

  const addImg = (e) => {
    fabric.Image.fromURL(`../assets/img/${e}`, (img) => {
      //const configuredImg = img.set({ left: 0, top: 0 ,width:150,height:150});
      canvas.add(img);
      updateModifications(true);
    });
  }

  const onSelect = (e) => {

    const ext = getExt(e);

    switch (ext) {
      case "gif":
        addGif(e);
        break;
      case "jpg":
      case "jpeg":
      default:
        addImg(e);
        break;
    }
  }

  return (
    <Layout>
      <StyledEditor>
        <Canvas>
          <canvas id="canvas" />
        </Canvas>
        <Sidebar isActive={true}>
          <Tab>
            <TabActions>
              <Button variant="light" onClick={onUndo}>
                <Icon variant="undo" />
              </Button>
              <Button variant="light" onClick={onRedo}>
                <Icon variant="redo" />
              </Button>
            </TabActions>
            <ImagesSelector data={data.images} onSelect={onSelect} />
          </Tab>
        </Sidebar>
      </StyledEditor>
    </Layout>
  );
}

export default Editor;
