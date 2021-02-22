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
import autoSave from "../../plugins/autosave";

const Editor = ({ data }) => {

  const [canvas, setCanvas] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    setCanvas(initCanvas());
    window.addEventListener('resize', resizeCanvas, false);

    return () => window.removeEventListener('resize', resizeCanvas, false);
  }, []);

  useEffect(() => {
    if (canvas) init();
  }, [canvas]);

  const init = () => {
    autoSave.init(canvas);
    autoSave.getData();

    canvas.on('object:modified', () => {
      autoSave.save();
    });

  }

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

  const onUndo = () => {
    canvas.undo()
  }

  const onRedo = () => {
    canvas.redo()
  }

  const onAdded = () => {
    autoSave.save();
  }

  const addGif = async (e) => {
    const gif = await fabricGif(`../assets/img/${e}`, 200, 200);
    gif.set({ top: 50, left: 50 });
    canvas.add(gif);
    onAdded();

    fabric?.util.requestAnimFrame(render = () => {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  }

  const addImg = (e) => {
    fabric.Image.fromURL(`../assets/img/${e}`, (img) => {
      //const configuredImg = img.set({ left: 0, top: 0 ,width:150,height:150});
      canvas.add(img);
      onAdded();
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
