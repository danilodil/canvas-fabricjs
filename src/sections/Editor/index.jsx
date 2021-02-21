import React, { useEffect, useState, useRef } from "react"
import { StyledEditor } from "./StyledEditor"
import Layout from "../../components/Layout"
import Sidebar from "../../components/Sidebar"
import Canvas from "../../components/Canvas"
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { Tab, TabActions } from "../../components/Tabs";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import ImagesSelector from "../../components/ImagesSelector";
import { getExt } from "../../utils";
import { fabricGif } from "../../utils/plugins/fabricGif";
import 'fabric-history';

const Editor = ({ data }) => {

  const { editor, onReady } = useFabricJSEditor();
  const initialized = useRef(false)
  const history = useRef([])
  const mods = useRef(0)

  useEffect(() => {
    if (editor && !initialized.current) {
      editor.canvas.on(
        'object:modified', () => {
          updateModifications(true);
        });

      initialized.current = true;
    }
  }, [editor])

  const updateModifications = (savehistory) => {
    if (savehistory === true) {
      const json = JSON.stringify(editor.canvas);
      history.current.push(json);
    }
  }

  const onUndo = () => {
    console.log(history.current)
    if (mods.current < history.current.length) {
      editor.canvas.clear().renderAll();
      editor.canvas.loadFromJSON(history.current[history.current.length - 1 - mods.current - 1], () => {
        editor.canvas.renderAll();
        mods.current += 1;
      });
    }
  }
  const onRedo = () => {
    if (mods.current > 0) {
      editor.canvas.clear().renderAll();
      editor.canvas.loadFromJSON(history.current[history.current.length - 1 - mods.current + 1], ()=>{
        editor.canvas.renderAll();
      });
      
      mods.current -= 1;
    }
  }

  const addGif = async (e) => {
    const gif = await fabricGif(`../assets/img/${e}`, 200, 200);
    gif.set({ top: 50, left: 50 });
    editor.canvas.add(gif);
    updateModifications(true);

    fabric?.util.requestAnimFrame(render = () => {
      editor?.canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  }

  const addImg = (e) => {
    fabric.Image.fromURL(`../assets/img/${e}`, (img) => {
      //const configuredImg = img.set({ left: 0, top: 0 ,width:150,height:150});
      editor.canvas.add(img);
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
          <FabricJSCanvas className="canvas" isDrawingMode onReady={onReady} />
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
