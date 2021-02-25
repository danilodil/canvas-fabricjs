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
import { Check, Radio, Range, Color, RadioC } from "../../components/Inputs";
import { Block } from "../../components/Block";
import ScrollBarWrapper from "../../components/ScrollBarWrapper";
import { filterIt, capitalize } from "../../utils";

const Editor = ({ data }) => {

  const [canvas, setCanvas] = useState('');
  const canvasRef = useRef(null);
  const f = useRef(null);
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
  const [filters] = useState([
    'grayscale', 'invert', 'remove-color', 'sepia', 'brownie',
    'brightness', 'contrast', 'saturation', 'noise', 'vintage',
    'pixelate', 'blur', 'sharpen', 'emboss', 'technicolor',
    'polaroid', 'blend-color', 'gamma', 'kodachrome',
    'blackwhite', 'blend-image', 'hue', 'resize'
  ])
  const [defaultFilters] = useState([
    { name: "grayscale", checked: false, mode: "average" },
    { name: 'invert', checked: false },
    { name: 'remove-color', checked: false, color: "#fc1d1d", distance: 0.5 },
    { name: 'sepia', checked: false },
    { name: 'brownie', checked: false },
    { name: 'brightness', checked: false },
    { name: 'contrast', checked: false, contrast: 0 },
    { name: 'saturation', checked: false, saturation: 0 },
    { name: 'noise', checked: false, noise: 0 },
    { name: 'vintage', checked: false },
    { name: 'pixelate', checked: false, blocksize: 0 },
    { name: 'blur', checked: false, blur: 0 },
    { name: 'sharpen', checked: false },
    { name: 'emboss', checked: false },
    { name: 'technicolor', checked: false },
    { name: 'polaroid', checked: false },
    { name: 'blend-color', checked: false, color: "#fc1d1d", mode: "add", alpha: 1 },
    { name: 'gamma', checked: false, red: 1, green: 1, blue: 1 },
    { name: 'kodachrome', checked: false },
    { name: 'blackwhite', checked: false },
    { name: 'blend-image', checked: false, color: "#fc1d1d", mode: "mask", alpha: 1 },
    { name: 'hue', checked: false, rotation: 0 },
    { name: 'resize', checked: false },
  ]
  );
  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
  const filersRef = useRef(null);

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

    canvas.on('object:modified', () => { autoSave.save() });
    canvas.on('drop', onDrop);
    canvas.on('dragenter', () => setIsDragOverCanvas(true))
    canvas.on('dragleave', () => setIsDragOverCanvas(false));
    canvas.on('mouse:up', (e) => {
      setSelectedFilters(defaultFilters);
      setSelected(e.target)
      setFilterTab(e.target);
      console.log(e.target)
    }
    );

    canvas.on({
      'selection:cleared': () => {
        setSelected(null);
        setSelectedFilters(defaultFilters);
      }
    });

    fabric.filterBackend = fabric.initFilterBackend();
    fabric.Object.prototype.transparentCorners = false;

    f.current = fabric.Image.filters;

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
      .then(() => {
        canvas.getActiveObject().set("fontFamily", fontName);
        canvas.requestRenderAll();
      }).catch((e) => {
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

  const getFilter = (index) => {
    const obj = canvas.getActiveObject();
    return obj.filters[index];
  }

  const applyFilter = (index, filter) => {
    const obj = canvas.getActiveObject();
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.getActiveObject().height;
    canvas.renderAll();
  }

  const removeFilter = (index) => {
    const obj = canvas.getActiveObject();
    obj.filters[index] = false;
    obj.applyFilters();
    canvas.getActiveObject().height;
    canvas.renderAll();
  }

  const checkFilter = (index) => {
    const obj = canvas.getActiveObject();
    return obj.filters[index];
  }

  const applyFilterValue = (index, prop, value) => {
    const obj = canvas.getActiveObject();
    if (obj.filters[index]) {
      obj.filters[index][prop] = value;
      obj.applyFilters();
      canvas.getActiveObject().height;
      canvas.renderAll();
    }
  }

  const getImage = () => {

    const imageElement = document.createElement('img');
    imageElement.src = `../assets/img/splash.png`;
    const fImage = new fabric.Image(imageElement);
    fImage.scaleX = 1;
    fImage.scaleY = 1;
    fImage.top = 15;
    fImage.left = 15;

    return fImage;
  }

  const onChangeFilter = (e) => {
    const name = e.target.name;
    const checked = e.target.checked;
    const index = filters.indexOf(name);
    const filt = filterIt(selectedFilters, name, "name")[0];

    switch (name) {
      case "remove-color":

        applyFilter(index, checked && getFilterByName(name, {
          distance: filt.distance,
          color: filt.color,
        }));

        break;

      case "blend-color":

        applyFilter(index, checked && getFilterByName(name, {
          color: filt.color,
          mode: filt.mode.toLowerCase(),
          alpha: filt.alpha,
        }));

        break;

      case "blend-image":

        applyFilter(index, checked && getFilterByName(name, {
          image: getImage(),
          mode: filt.mode,
          alpha: filt.alpha,
        }));

        break;

      case "gamma":

        applyFilter(index, checked && getFilterByName(name, {
          gamma: [filt.red, filt.green, filt.blue]
        }));

        break;

      case "sharpen":

        applyFilter(index, checked && getFilterByName(name, {
          matrix: [0, -1, 0,
            -1, 5, -1,
            0, -1, 0]
        }));

        break;

      case "emboss":

        applyFilter(index, checked && getFilterByName(name, {
          matrix: [1, 1, 1,
            1, 0.7, -1,
            -1, -1, -1]
        }));

        break;

      default:
        applyFilter(index, checked && getFilterByName(name));
        break;
    }

    setSelectedFilters(selectedFilters.map((filter, i) => i == index ? { ...filter, checked: checked } : filter));
  }

  const onChangeFilterValue = (e, i, key, type, typeV) => {
    let value = e.target.value.toLowerCase();
    let temp = selectedFilters.map((filter) => filter);
    let current = null;

    temp[i] = { ...temp[i], checked: true }
    temp[i][key] = value;

    switch (type) {
      case "gamma":
        current = getFilter(17).gamma;
        current[typeV] = parseFloat(value);
        value = current;
        break;
    }

    if (!checkFilter(i)) {
      switch (key) {
        case "contrast":
        case "saturation":
        case "rotation":
          applyFilter(i, getFilterByName(key, {}[key] = parseFloat(value)));
          break;
        case "noise":
          if (value == 0) {
            removeFilter(i);
          } else {
            applyFilter(i, getFilterByName(key, {}[key] = parseInt(value, 10)));
          }
        case "blocksize":
          applyFilter(i, getFilterByName(key, {}[key] = value));
          break;
        case "blur":
          applyFilter(i, getFilterByName(key, {}[key] = parseFloat(value)));
          break;
      }
    } else {
      switch (key) {
        case "noise":
          if (value == 0) { removeFilter(i) }
        case "blocksize":
          if (value == 0) { removeFilter(i) }
          break;
        case "blur":
          if (value == 0) { removeFilter(i) }
          break;

      }
    }

    if (checkFilter(i)) applyFilterValue(i, type ? type : key, value);
    setSelectedFilters(temp);
  };

  const getFilterByName = (name, options) => {
    switch (name) {
      case "brownie":
        return new f.current.Brownie();
      case "technicolor":
        return new f.current.Technicolor();
      case "vintage":
        return new f.current.Vintage();
      case "polaroid":
        return new f.current.Polaroid();
      case "kodachrome":
        return new f.current.Kodachrome();
      case "blackwhite":
        return new f.current.BlackWhite();
      case "grayscale":
        return new f.current.Grayscale();
      case "invert":
        return new f.current.Invert();
      case "sepia":
        return new f.current.Sepia();
      case "remove-color":
        return new f.current.RemoveColor(options);
      case "gamma":
        return new f.current.Gamma(options);
      case "contrast":
        return new f.current.Contrast(options);
      case "saturation":
        return new f.current.Saturation(options);
      case "rotation":
        return new f.current.HueRotation(options);
      case "noise":
        return new f.current.Noise(options);
      case "blocksize":
        return new f.current.Pixelate(options);
      case "blur":
        return new f.current.Blur(options);
      case "emboss":
        return new f.current.Convolute(options);
      case "sharpen":
        return new f.current.Convolute(options);
      case "blend-color":
        return new f.current.BlendColor(options);
      case "blend-image":
        return new f.current.BlendImage(options);
    }
  }

  const isFilterChecked = (name) => {
    return filterIt(selectedFilters, name, "name")[0]?.checked;
  }

  const setFilterTab = (obj) => {
    let temp = selectedFilters.map((filter, z) => filter);

    if (obj?.filters?.length) {
      obj.filters.map((elm, i) => {
        temp[i] = { ...temp[i], checked: elm ? true : false };
        if (elm && elm.mode) {
          temp[i]["mode"] = elm.mode;
        }
        if (elm && elm.gamma) {
          temp[i]["red"] = elm.gamma[0];
          temp[i]["green"] = elm.gamma[1];
          temp[i]["blue"] = elm.gamma[2];
        }
        if (elm && elm.contrast) {
          temp[i]["contrast"] = elm.contrast;
        }
        if (elm && elm.saturation) {
          temp[i]["saturation"] = elm.saturation;
        }
        if (elm && elm.rotation) {
          temp[i]["rotation"] = elm.rotation;
        }
        if (elm && elm.noise) {
          temp[i]["noise"] = elm.noise;
        }
        if (elm && elm.blocksize) {
          temp[i]["blocksize"] = elm.blocksize;
        }
        if (elm && elm.blur) {
          temp[i]["blur"] = elm.blur;
        }
        if (elm && elm.alpha) {
          temp[i]["alpha"] = elm.alpha;
        }
        if (elm && elm.color) {
          temp[i]["color"] = elm.color;
        }
      })

      setSelectedFilters(temp);
    }
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
            <Tab isDisabled={!selected ? true : false} name={lang.Effects}>
              <ScrollBarWrapper>
                <form ref={filersRef}>
                  <Block>
                    <Check checked={isFilterChecked("grayscale")} onChange={onChangeFilter} name="grayscale" label={lang.Grayscale} />
                    <Container>
                      <Row>
                        <Col><RadioC disabled={!isFilterChecked("grayscale")} checked={selectedFilters[0].mode == "average"} onChange={(e) => onChangeFilterValue(e, 0, "mode")} isRemoveSpace={true} value="average" label={lang.Avg} name="0" /></Col>
                        <Col><RadioC disabled={!isFilterChecked("grayscale")} checked={selectedFilters[0].mode == "luminosity"} onChange={(e) => onChangeFilterValue(e, 0, "mode")} isRemoveSpace={true} value="luminosity" label={lang.Lum} name="0" /></Col>
                        <Col><RadioC disabled={!isFilterChecked("grayscale")} checked={selectedFilters[0].mode == "lightness"} onChange={(e) => onChangeFilterValue(e, 0, "mode")} isRemoveSpace={true} value="lightness" label={lang.Light} name="0" /></Col>
                      </Row>
                    </Container>
                  </Block>
                  <Spacer />
                  <Label>{lang.Colormatrixfilters}:</Label>

                  <Block>
                    <Check checked={isFilterChecked("invert")} onChange={onChangeFilter} name="invert" label={`${lang.Invert}`} />
                    <Check checked={isFilterChecked("sepia")} onChange={onChangeFilter} name="sepia" label={lang.Sepia} />
                    <Check checked={isFilterChecked("blackwhite")} onChange={onChangeFilter} name="blackwhite" label={lang.BlackWhite} />
                    <Check checked={isFilterChecked("brownie")} onChange={onChangeFilter} name="brownie" label={lang.Brownie} />
                    <Check checked={isFilterChecked("vintage")} onChange={onChangeFilter} name="vintage" label={lang.Vintage} />
                    <Check checked={isFilterChecked("kodachrome")} onChange={onChangeFilter} name="kodachrome" label={lang.Kodachrome} />
                    <Check checked={isFilterChecked("technicolor")} onChange={onChangeFilter} name="technicolor" label={lang.Technicolor} />
                    <Check checked={isFilterChecked("polaroid")} onChange={onChangeFilter} name="polaroid" isRemoveSpace={true} label={lang.Polaroid} />
                  </Block>

                  <Spacer />

                  <Block>
                    <Check checked={isFilterChecked("remove-color")} onChange={onChangeFilter} name="remove-color" label={lang.Removecolor} />
                    <Color disabled={!isFilterChecked("remove-color")} onChange={(e) => onChangeFilterValue(e, 2, "color")} value={selectedFilters[2].color} name="remove-color-color" label={lang.Color} />
                    <Range disabled={!isFilterChecked("remove-color")} onChange={(e) => onChangeFilterValue(e, 2, "distance")} value={selectedFilters[2].distance} name="remove-color-distance" min="0" max="1" step="0.01" isRemoveSpace={true} label={lang.Distance} />
                  </Block>

                  <Spacer />

                  <Block>
                    <Check checked={isFilterChecked("gamma")} onChange={onChangeFilter} name="gamma" label={lang.Gamma} />
                    <Range disabled={!isFilterChecked("gamma")} onChange={(e) => onChangeFilterValue(e, 17, "red", "gamma", 0)} value={selectedFilters[17].red} name="gamma-red" label={lang.Red} min="0.2" max="2.2" step="0.003921" />
                    <Range disabled={!isFilterChecked("gamma")} onChange={(e) => onChangeFilterValue(e, 17, "green", "gamma", 1)} value={selectedFilters[17].green} name="gamma-green" label={lang.Green} min="0.2" max="2.2" step="0.003921" />
                    <Range disabled={!isFilterChecked("gamma")} onChange={(e) => onChangeFilterValue(e, 17, "blue", "gamma", 2)} value={selectedFilters[17].blue} name="gamma-blue" isRemoveSpace={true} label={lang.Blue} min="0.2" max="2.2" step="0.003921" />
                  </Block>

                  <Spacer />

                  <Block>
                    <Range onChange={(e) => onChangeFilterValue(e, 6, "contrast")} value={selectedFilters[6].contrast} name="contrast" label={lang.Contrast} min="-1" max="1" step="0.003921" />
                    <Range onChange={(e) => onChangeFilterValue(e, 7, "saturation")} value={selectedFilters[7].saturation} name="saturation" label={lang.Saturation} min="-1" max="1" step="0.003921" />
                    <Range onChange={(e) => onChangeFilterValue(e, 21, "rotation")} value={selectedFilters[21].rotation} name="hue" label={lang.Hue} min="-2" max="2" step="0.002" />
                    <Range onChange={(e) => onChangeFilterValue(e, 8, "noise")} name="noise" label={lang.Noise} value={selectedFilters[8].noise} min="0" max="1000" step="1" />
                    <Range onChange={(e) => onChangeFilterValue(e, 10, "blocksize")} value={selectedFilters[10].blocksize} name="pixelate" label={lang.Pixelate} min="0" max="20" step="1" />
                    <Range onChange={(e) => onChangeFilterValue(e, 11, "blur")} name="blur" value={selectedFilters[11].blur} label={lang.Blur} min="0" max="1" step="0.01" />
                    <Check checked={isFilterChecked("sharpen")} onChange={onChangeFilter} name="sharpen" label={lang.Sharpen} />
                    <Check checked={isFilterChecked("emboss")} onChange={onChangeFilter} name="emboss" isRemoveSpace={true} label={lang.Emboss} />
                  </Block>

                  <Spacer />

                  <Block>
                    <Check checked={isFilterChecked("blend-color")} onChange={onChangeFilter} name="blend-color" label={lang.BlendColor} />
                    <Select disabled={!isFilterChecked("blend-color")} onChange={(e) => onChangeFilterValue({ target: { value: e.value } }, 16, "mode")} name="blendcolor-mode" value={{ value: capitalize(selectedFilters[16].mode), label: capitalize(selectedFilters[16].mode) }} placeholder={lang.Mode} options={data.blendModes} />
                    <Spacer variant="input" />
                    <Color value={selectedFilters[16].color} onChange={(e) => onChangeFilterValue(e, 16, "color")} disabled={!isFilterChecked("blend-color")} name="blendcolor-color" label={lang.Color} />
                    <Range disabled={!isFilterChecked("blend-color")} onChange={(e) => onChangeFilterValue(e, 16, "alpha")} name="blendcolor-alpha" value={selectedFilters[16].alpha} isRemoveSpace={true} label={lang.Alpha} min="0" max="1" step="0.01" />
                  </Block>

                  <Spacer />

                  <Block>
                    <Check checked={isFilterChecked("blend-image")} onChange={onChangeFilter} name="blend-image" label={lang.BlendImage} />
                    <Select disabled={!isFilterChecked("blend-image")} onChange={(e) => onChangeFilterValue({ target: { value: e.value } }, 20, "mode")} name="blend-image-mode" value={{ value: capitalize(selectedFilters[20].mode), label: capitalize(selectedFilters[20].mode) }} placeholder={lang.Mode} options={data.maskModes} />
                    <Spacer variant="input" />
                    <Range disabled={!isFilterChecked("blend-image")} onChange={(e) => onChangeFilterValue(e, 20, "alpha")} name="blend-image-alpha" value={selectedFilters[20].alpha} isRemoveSpace={true} label={lang.Alpha} min="0" max="1" step="0.01" />
                  </Block>
                </form>
              </ScrollBarWrapper>
            </Tab>
          </Tabs>
        </Sidebar>
      </StyledEditor>
    </Layout>
  );
}

export default Editor;
