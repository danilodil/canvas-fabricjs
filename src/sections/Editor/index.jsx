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
import languages from "../../configs/languages";
import appConfig from "../../configs/appConfig";
import { Separator } from "../../components/Ui";

const Editor = ({ data }) => {

  const [canvas, setCanvas] = useState('');
  const canvasRef = useRef(null);
  const lang = languages[appConfig.lang];
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const dragedImage = useRef(null);

  useEffect(() => {
    setCanvas(initCanvas());
    window.addEventListener('resize', resizeCanvas, false);
    document.addEventListener('keyup', onKeyUp, false);

    return () => {
      window.removeEventListener('resize', resizeCanvas, false);
      document.removeEventListener('keyup', onKeyUp, false);
    }
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

    canvas.on('drop', onDrop);
    canvas.on('dragenter', () => setIsDragOverCanvas(true))
    canvas.on('dragleave', () => setIsDragOverCanvas(false));

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

  const onKeyUp = (e) => {
    if (e.keyCode == 46) deleteObject();
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

  const onDrop = (e) => {

    setIsDragOverCanvas(false);

    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (dragedImage.current) {

      const newImage = new fabric.Image(dragedImage.current, {
        left: e.e.layerX,
        top: e.e.layerY
      });

      newImage.scaleToWidth(400);

      canvas.add(newImage);
    }

    return false;
  }

  const addGif = async (e) => {
    const gif = await fabricGif(`../assets/img/${e}`, 200, 200);
    gif.set({ top: 50, left: 50 });
    canvas.add(gif);
    onAdded();

    fabric?.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  }

  const addImg = (e) => {
    fabric.Image.fromURL(`../assets/img/${e}`, (img) => {
      img.scaleToWidth(400);
      canvas.add(img);
      onAdded();
    });
  }

  const onClear = () => {
    canvas.clear().renderAll()
  }

  const getSelection = () => {
    const active = canvasRef.current.getActiveObjects();
    if (active.length) {
      return canvasRef.current.getActiveObject() == null ? canvasRef.current.getActiveGroup() : canvasRef.current.getActiveObject()
    }
  }

  const deleteObject = () => {
    const activeObject = getSelection();

    if (activeObject) {
      if (activeObject._objects) {
        if (activeObject.type == "group") {
          const objectsInGroup = canvasRef.current.getActiveObjects();
          canvasRef.current.discardActiveObject();
          canvasRef.current.remove(...objectsInGroup);
        } else {
          const objectsInGroup = activeObject.getObjects();
          canvasRef.current.discardActiveObject();
          objectsInGroup.forEach((object) => {
            canvasRef.current.remove(object);
          });
        }
      } else {
        canvasRef.current.remove(activeObject);
      }
    }

    autoSave.save();
  }

  const onHorizontalFlip = () => {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      activeObject.toggle("flipY");
    }

    canvas.fire('object:modified');
    canvas.renderAll();
  }

  const onVerticalFlip = () => {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      activeObject.toggle("flipX");
    }

    canvas.fire('object:modified');

    canvas.renderAll();
  }

  const onChangeMode = () => {
    canvas.isDrawingMode = !isDrawing;
    setIsDrawing(!isDrawing);
  }

  const onGroup = () => {
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== 'activeSelection') {
      return;
    }
    canvas.getActiveObject().toGroup();
    canvas.requestRenderAll();
  }

  const onUnGroup = () => {
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== 'group') {
      return;
    }
    canvas.getActiveObject().toActiveSelection();
    canvas.requestRenderAll();
  }

  const onSelectAll = () => {
    canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
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

  const onImageStartDrag = (img) => {
    dragedImage.current = img;
  }

  const onImageStopDrag = () => {
    dragedImage.current = null;
  }

  return (
    <Layout>
      <StyledEditor>
        <Canvas className={`${isDragOverCanvas ? "over" : ""}`}>
          <canvas id="canvas" />
        </Canvas>
        <Sidebar isActive={true}>
          <Tab>
            <TabActions>
              <Button title={lang.Changemode} variant={`${!isDrawing ? "success-light" : "light"}`} onClick={onChangeMode}>
                <Icon variant="cursor" />
              </Button>
            </TabActions>
            <TabActions>
              <Button title={lang.Undo} variant="light" onClick={onUndo}>
                <Icon variant="undo" />
              </Button>
              <Button title={lang.Redo} variant="light" onClick={onRedo}>
                <Icon variant="redo" />
              </Button>
              <Button title={lang.Clear} variant="light" onClick={onClear}>
                <Icon variant="close-radial" />
              </Button>
              <Button title={lang.Verticalflip} variant="light" onClick={onVerticalFlip}>
                <Icon variant="horizontal" />
              </Button>
              <Button title={lang.Horizontalflip} variant="light" onClick={onHorizontalFlip}>
                <Icon variant="vertical" />
              </Button>
              <Button title={lang.Group} variant="light" onClick={onGroup}>
                <Icon variant="group" />
              </Button>
              <Button title={lang.Ungroup} variant="light" onClick={onUnGroup}>
                <Icon variant="ungroup" />
              </Button>
              <Button title={lang.SelectAll} variant="light" onClick={onSelectAll}>
                <Icon variant="select-all" />
              </Button>
            </TabActions>
            <ImagesSelector data={data.images} onSelect={onSelect} onImageStartDrag={onImageStartDrag} onImageStopDrag={onImageStopDrag} />
          </Tab>
        </Sidebar>
      </StyledEditor>
    </Layout>
  );
}

export default Editor;
