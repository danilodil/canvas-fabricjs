import React, { useEffect, useState, useRef } from "react"
import { StyledEditor } from "./StyledEditor"
import { Layout, Container, Row, Col } from "../../components/Layout"
import Sidebar from "../../components/Sidebar"
import Canvas from "../../components/Canvas"
import { Tabs, Tab, TabActions } from "../../components/Tabs";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import ImagesSelector from "../../components/ImagesSelector";
import { getExt } from "../../utils";
import { fabricGif } from "../../utils/plugins/fabricGif";
import 'fabric-history';
import autoSave from "../../plugins/autosave";
import languages from "../../configs/languages";
import appConfig from "../../configs/appConfig";
import Select from 'react-select';
import { Label, TextArea, Spacer } from "../../components/Ui";
import FontFaceObserver from "fontfaceobserver";
import { jsPDF } from "jspdf";
import { Check, Radio, Range, Color } from "../../components/Inputs";
import { Block } from "../../components/Block";
import ScrollBarWrapper from "../../components/ScrollBarWrapper";

const Editor = ({ data }) => {

  const [canvas, setCanvas] = useState('');
  const canvasRef = useRef(null);
  const lang = languages[appConfig.lang];
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const dragedImage = useRef(null);
  const dragedImageName = useRef(null);
  const clone = useRef(null);
  const [font, setFont] = useState(data.fonts[0]);
  const [text, setText] = useState("Lorem ipsum, or lipsum as it is sometimes known");
  const [selected, setSelected] = useState(null);
  const [exportFormat, setExportFormat] = useState(data.exports[0]);

  useEffect(() => {

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(
          ['video_src']
        );
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    setCanvas(initCanvas());
    window.addEventListener('resize', resizeCanvas, false);
    document.addEventListener('keyup', onKeyUp, false);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);

    //buildFonts();

    return () => {
      window.removeEventListener('resize', resizeCanvas, false);
      document.removeEventListener('keyup', onKeyUp, false);
      document.removeEventListener('copy', onCopy, false);
      document.removeEventListener('paste', onPaste, false);
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

    canvas.on({
      'selection:created': (e) => {
        setSelected(e.target)


        const filters = ['grayscale', 'invert', 'remove-color', 'sepia', 'brownie',
          'brightness', 'contrast', 'saturation', 'noise', 'vintage',
          'pixelate', 'blur', 'sharpen', 'emboss', 'technicolor',
          'polaroid', 'blend-color', 'gamma', 'kodachrome',
          'blackwhite', 'blend-image', 'hue', 'resize'];

        // for (var i = 0; i < filters.length; i++) {
        //   if(filters[i]) {
        //     console.log(filters[i])
        //     filters[i].checked = !!canvas.getActiveObject().filters[i];
        //   }
        // }
      },
      'selection:cleared': () => {
        setSelected(null)
      }
    });

    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
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

      onSelect(dragedImage.current, e.e)

    }

    return false;
  }

  const addGif = async (e, drag) => {
    const gif = await fabricGif(drag ? e.src : `../assets/img/${e}`, appConfig.initialImageSize / 2, appConfig.initialImageSize / 2);
    gif.set({ top: drag ? drag.layerY - appConfig.initialImageSize / 4 : 50, left: drag ? drag.layerX - appConfig.initialImageSize / 4 : 50 });
    canvas.add(gif);
    onAdded();
  }

  const addImg = (e, drag) => {
    if (drag) {
      const newImage = new fabric.Image(dragedImage.current, {
        left: drag.layerX - appConfig.initialImageSize / 2,
        top: drag.layerY - appConfig.initialImageSize / 2
      });

      newImage.scaleToWidth(appConfig.initialImageSize);
      canvas.add(newImage);
      onAdded();

    } else {
      fabric.Image.fromURL(`../assets/img/${e}`, (img) => {
        img.scaleToWidth(appConfig.initialImageSize);
        canvas.add(img);
        onAdded();
      });
    }
  }

  const addVideo = (url_mp4, elm, drag) => {

    function getVideoElement(url) {
      var videoE = document.createElement('video');
      videoE.loop = true;
      videoE.width = elm.videoWidth;
      videoE.height = elm.videoHeight;
      videoE.muted = false;
      videoE.crossOrigin = "anonymous";
      var source = document.createElement('source');
      source.src = url;
      source.type = 'video/mp4';
      videoE.appendChild(source);
      return videoE;
    }
    var videoE = getVideoElement(url_mp4);
    var fab_video = new fabric.Image(videoE, { left: drag ? drag.layerX - appConfig.initialImageSize / 2 : 0, top: drag ? drag.layerY - appConfig.initialImageSize / 2 : 0, name: 'video' });
    fab_video.set('video_src', url_mp4);
    fab_video.scaleToWidth(appConfig.initialImageSize);
    canvas.add(fab_video);
    fab_video.getElement().play();
    onAdded();
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

  const onSelect = (e, drag, elm) => {

    const ext = drag ? getExt(dragedImageName.current) : getExt(e);

    switch (ext) {
      case "gif":
        addGif(e, drag);
        break;
      case "mp4":
        addVideo(`../assets/img/${drag ? dragedImageName.current : e}`, drag ? dragedImage.current : elm, drag);
        break;
      case "jpg":
      case "jpeg":
      default:
        addImg(e, drag);
        break;
    }
  }

  const onImageStartDrag = (img, name) => {
    dragedImage.current = img;
    dragedImageName.current = name;
  }

  const onImageStopDrag = () => {
    dragedImage.current = null;
    dragedImageName.current = null;
  }

  const onCopy = () => {
    canvasRef.current.getActiveObject().clone((cloned) => {
      clone.current = cloned;
    });
  }

  const onPaste = () => {
    clone.current.clone(function (clonedObj) {
      canvasRef.current.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        clonedObj.canvas = canvasRef.current;
        clonedObj.forEachObject(function (obj) {
          canvasRef.current.add(obj);
        });
        clonedObj.setCoords();
      } else {
        canvasRef.current.add(clonedObj);
      }
      clone.current.top += 10;
      clone.current.left += 10;
      canvasRef.current.setActiveObject(clonedObj);
      canvasRef.current.requestRenderAll();
    });
  }

  const onAddText = () => {
    var textbox = new fabric.Textbox(text, {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
    });

    canvas.add(textbox).setActiveObject(textbox);
    if (font.value !== 'Times New Roman') {
      loadAndUse(font.value);
    } else {
      canvas.getActiveObject().set("fontFamily", font.value);
      canvas.requestRenderAll();
      canvas.fire('object:modified');
    }
  }

  const onAddTextToPath = () => {
    const path = selected;
    const pathInfo = fabric.util.getPathSegmentsInfo(path.path);
    path.segmentsInfo = pathInfo;
    const pathLength = pathInfo[pathInfo.length - 1].length;
    const fontSize = 2.5 * pathLength / text.length;
    const textObj = new fabric.Text(text, { fontSize: fontSize, path: path, top: path.top, left: path.left });
    canvas.add(textObj);
    canvas.remove(path);
  }

  const loadAndUse = (fontName) => {
    var myfont = new FontFaceObserver(fontName)
    myfont.load()
      .then(function () {
        canvas.getActiveObject().set("fontFamily", fontName);
        canvas.requestRenderAll();
      }).catch(function (e) {
        alert('font loading failed ' + fontName);
      });
  }

  const onChangeFont = (e) => {
    setFont(e);

    if (canvas.getActiveObject()) {
      if (e.value !== 'Times New Roman') {
        loadAndUse(e.value);
      } else {
        canvas.getActiveObject().set("fontFamily", e.value);
        canvas.getActiveObject().set("width", 500)
        canvas.requestRenderAll();
        canvas.fire('object:modified');
      }
    }
  }

  const onExport = () => {

    const dataURL = canvas.toDataURL({
      width: canvas.width,
      height: canvas.height,
      left: 0,
      top: 0,
      format: exportFormat.value == "pdf" ? "jpg" : exportFormat.value,
    });

    if (exportFormat.value == "pdf") {
      const pdf = new jsPDF({
        orientation: 'landscape',
      });
      const imgProps = pdf.getImageProperties(dataURL);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(dataURL, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("export.pdf");

    } else {
      const link = document.createElement('a');
      link.download = `export.${exportFormat.value}`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const applyFilter = (index, filter) => {
    const obj = canvas.getActiveObject();
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.getActiveObject().height;
    canvas.renderAll();
  }

  return (
    <Layout>
      <StyledEditor>
        <Canvas className={`${isDragOverCanvas ? "over" : ""}`}>
          <canvas id="canvas" />
        </Canvas>
        <Sidebar isActive={true}>
          <Tabs>
            <Tab name={lang.Controls}>
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
              <Spacer />
              <Label>{lang.Export}</Label>
              <Select defaultValue={exportFormat} onChange={setExportFormat} placeholder={lang.SelectFormat} options={data.exports} />
              <Spacer />
              <Button className="w-100" variant="light" onClick={onExport}>{lang.Export}</Button>
            </Tab>
            <Tab name={lang.Assets}>
              <ImagesSelector data={data.images} onSelect={(name, elm) => onSelect(name, false, elm)} onImageStartDrag={onImageStartDrag} onImageStopDrag={onImageStopDrag} />
            </Tab>
            <Tab name={lang.Text}>
              <Label>{lang.FontFace}</Label>
              <Select defaultValue={font} onChange={onChangeFont} placeholder={lang.SelectFont} options={data.fonts} />
              <Spacer />
              <Label>{lang.Text}</Label>
              <TextArea defaultValue={text} rows={5} onChange={(e) => setText(e.target.value)} />
              <Spacer />
              <Container>
                <Row>
                  <Col><Button className="w-100" variant="light" onClick={onAddText}>{lang.AddToCanvas}</Button></Col>
                  <Col><Button disabled={!selected?.path} onClick={onAddTextToPath} className="w-100" variant="light">{lang.AddToPath}</Button></Col>
                </Row>
              </Container>
            </Tab>
            <Tab name={lang.Effects}>
              <ScrollBarWrapper>
                <Block>
                  <Check label={lang.Grayscale} />
                  <Container>
                    <Row>
                      <Col><Radio isRemoveSpace={true} label={lang.Avg} name="grayscale" defaultChecked="checked" /></Col>
                      <Col><Radio isRemoveSpace={true} label={lang.Lum} name="grayscale" /></Col>
                      <Col><Radio isRemoveSpace={true} label={lang.Light} name="grayscale" /></Col>
                    </Row>
                  </Container>
                </Block>
                <Spacer />
                <Label>{lang.Colormatrixfilters}:</Label>

                <Block>
                  <Check label={`${lang.Invert}`} />
                  <Check label={lang.Sepia} />
                  <Check label={lang.BlackWhite} />
                  <Check label={lang.Brownie} />
                  <Check label={lang.Vintage} />
                  <Check label={lang.Kodachrome} />
                  <Check label={lang.Technicolor} />
                  <Check label={lang.Polaroid} />
                </Block>

                <Spacer />

                <Block>
                  <Check label={lang.Removecolor} />
                  <Color label={lang.Color} />
                  <Range isRemoveSpace={true} label={lang.Distance} />
                </Block>

                <Spacer />

                <Block>
                  <Check label={lang.Gamma} />
                  <Range label={lang.Red} />
                  <Range label={lang.Green} />
                  <Range isRemoveSpace={true} label={lang.Blue} />
                </Block>

                <Spacer />

                <Block>
                  <Range label={lang.Contrast} />
                  <Range label={lang.Saturation} />
                  <Range label={lang.Hue} />
                  <Range label={lang.Noise} />
                  <Range label={lang.Pixelate} />
                  <Range label={lang.Blur} />
                  <Check label={lang.Sharpen} />
                  <Check isRemoveSpace={true} label={lang.Emboss} />
                </Block>

                <Spacer />

                <Block>
                  <Check label={lang.BlendColor} />
                  <Select defaultValue={data.blendModes[0]} placeholder={lang.Mode} options={data.blendModes} />
                  <Spacer variant="input"/>
                  <Color label={lang.Color} />
                  <Range isRemoveSpace={true} label={lang.Alpha} />
                </Block>

                <Spacer />

                <Block>
                  <Check label={lang.BlendImage} />
                  <Select defaultValue={data.maskModes[0]} placeholder={lang.Mode} options={data.maskModes} />
                  <Spacer variant="input"/>
                  <Range isRemoveSpace={true} label={lang.Alpha} />
                </Block>

              </ScrollBarWrapper>
            </Tab>
          </Tabs>
        </Sidebar>
      </StyledEditor>
    </Layout>
  );
}

export default Editor;
