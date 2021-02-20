import React, { useEffect, useState } from "react"
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

const Editor = ({ data }) => {

  const { editor, canvas, onReady } = useFabricJSEditor();

  const onAddCircle = () => {

  }
  const onAddRectangle = () => {

  }

  const addGif = async (e) => {
    const gif = await fabricGif(`../assets/img/${e}`, 200,200);
    gif.set({ top: 50, left: 50 });
    editor.canvas.add(gif);

    fabric?.util.requestAnimFrame(function render() {
      editor?.canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  }

  const addImg = (e) => {
    fabric.Image.fromURL(`../assets/img/${e}`, (img) => {
      //const configuredImg = img.set({ left: 0, top: 0 ,width:150,height:150});
      editor.canvas.add(img);
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
          <FabricJSCanvas className="canvas" onReady={onReady} />
        </Canvas>
        <Sidebar isActive={true}>
          <Tab>
            <TabActions>
              <Button variant="light" onClick={onAddCircle}>
                <Icon variant="undo" />
              </Button>
              <Button variant="light" onClick={onAddRectangle}>
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
