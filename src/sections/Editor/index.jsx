import React, { useEffect, useState, useRef, useContext } from "react"
import { StyledEditor, StyledActiveDrop } from "./StyledEditor"
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
import { filterIt, capitalize, filterItIndex } from "../../utils";
import AWSService from "../../plugins/aws";
import { Context } from "../../context/context";

const Editor = ({ data }) => {

  const {state, dispatchNotification} = useContext(Context);
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
  const [defaultFilters] = useState(data.filters);
  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
  const filersRef = useRef(null);
  const delayAutosave = useRef(false);
  const [activeDrop, setActiveDrop] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState([]);

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

    AWSService.init(dispatchNotification);
    AWSService.getObjects((data)=>{
      setImages(data)
    })

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
      console.log(e.target);
      autoSave.save();
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

  const onUndo = () => canvas.undo()
  const onRedo = () => canvas.redo()
  const onAdded = () => autoSave.save()

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
    const gif = await fabricGif(drag ? e.src : `${e}`, appConfig.initialImageSize / 2, appConfig.initialImageSize / 2);
    gif.set({ top: drag ? drag.layerY - appConfig.initialImageSize / 4 : 50, left: drag ? drag.layerX - appConfig.initialImageSize / 4 : 50 });
    canvas.add(gif);
    onAdded();
  }

  const addImg = (e, drag) => {
    if (drag) {

      fabric.Image.fromURL(`${dragedImage.current.src}`, (img) => {
        img.scaleToWidth(appConfig.initialImageSize);
        img.set({left:drag.layerX - appConfig.initialImageSize / 2, top: drag.layerY - appConfig.initialImageSize / 2})
        canvas.add(img);
        onAdded();
      }, {crossOrigin: 'anonymous'});

    } else {
      fabric.Image.fromURL(`${e}`, (img) => {
        img.scaleToWidth(appConfig.initialImageSize);
        canvas.add(img);
        onAdded();
      }, {crossOrigin: 'anonymous'});
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
        addVideo(`${drag ? dragedImageName.current : e}`, drag ? dragedImage.current : elm, drag);
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

  const getFilter = (type) => {
    const obj = canvas.getActiveObject();
    return filterIt(obj.filters, type, "type")[0];
  }

  const applyFilter = (type, filter) => {
    const t = (type == "Sharpen" || type == "Emboss") ? "Convolute" : type;
    const obj = canvas.getActiveObject();
    const fl = filterIt(obj.filters, t, "type").length;
    const tfilters = [...obj.filters];

    if (fl == 0) {
      filter.type = t;
      tfilters.push(filter);
    } else {
      const index = filterItIndex(obj.filters, t, "type");
      tfilters.splice(index, 1);
    }

    obj.filters = tfilters;
    obj.applyFilters();
    canvas.getActiveObject().height;
    canvas.renderAll();
    autoSave.save();
  }

  const removeFilter = (type) => {
    const obj = canvas.getActiveObject();
    const tfilters = [...obj.filters];
    const index = filterItIndex(obj.filters, type, "type");
    tfilters.splice(index, 1);
    obj.filters = tfilters;
    obj.applyFilters();
    canvas.getActiveObject().height;
    canvas.renderAll();
  }

  const checkFilter = (type) => {
    const obj = canvas.getActiveObject();
    return filterIt(obj.filters, type, "type").length ? true : false;
  }

  const applyFilterValue = (type, prop, value) => {
    const obj = canvas.getActiveObject();
    const index = filterItIndex(obj.filters, type, "type");

    if (index != -1) {
      obj.filters[index][prop] = value;
      obj.applyFilters();
      canvas.getActiveObject().height;
      canvas.renderAll();
    }

    if (!delayAutosave.current) {
      autoSave.save();
      delayAutosave.current = true;

      setTimeout(() => {
        delayAutosave.current = false;
      }, [1000])
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
    const filt = filterIt(selectedFilters, name, "type")[0];

    switch (name) {
      case "RemoveColor":

        applyFilter(name, checked && getFilterByName(name, {
          distance: filt.distance,
          color: filt.color,
        }));

        break;

      case "BlendColor":

        applyFilter(name, checked && getFilterByName(name, {
          color: filt.color,
          mode: filt.mode.toLowerCase(),
          alpha: filt.alpha,
        }));

        break;

      case "BlendImage":

        applyFilter(name, checked && getFilterByName(name, {
          image: getImage(),
          mode: filt.mode,
          alpha: filt.alpha,
        }));

        break;

      case "Gamma":

        applyFilter(name, checked && getFilterByName(name, {
          gamma: [filt.red, filt.green, filt.blue]
        }));

        break;

      case "Sharpen":

        applyFilter(name, checked && getFilterByName(name, {
          matrix: [0, -1, 0,
            -1, 5, -1,
            0, -1, 0]
        }));

        break;

      case "Emboss":

        applyFilter(name, checked && getFilterByName(name, {
          matrix: [1, 1, 1,
            1, 0.7, -1,
            -1, -1, -1]
        }));

        break;

      default:
        applyFilter(name, checked && getFilterByName(name));
        break;
    }

    setSelectedFilters(selectedFilters.map((filter) => filter.type == name ? { ...filter, checked: checked } : filter));
  }

  const onChangeFilterValue = (e, typeF, key, type, typeV) => {
    let value = e.target.value.toLowerCase();
    let temp = [...selectedFilters];
    let current = null;
    const index = filterItIndex(selectedFilters, typeF, "type");

    temp[index] = { ...temp[index], checked: true }
    temp[index][key] = value;

    switch (type) {
      case "gamma":
        current = getFilter("Gamma").gamma;
        current[typeV] = parseFloat(value);
        value = current;
        break;
    }

    if (!checkFilter(typeF)) {
      switch (key) {
        case "contrast":
        case "saturation":
        case "rotation":
          applyFilter(typeF, getFilterByName(typeF, {}[key] = parseFloat(value)));
          break;
        case "noise":
          applyFilter(typeF, getFilterByName(typeF, {}[key] = parseInt(value, 10)));
          break;
        case "blocksize":
          applyFilter(typeF, getFilterByName(typeF, {}[key] = value));
          break;
        case "blur":
          applyFilter(typeF, getFilterByName(typeF, {}[key] = parseFloat(value)));
          break;
      }
    } else {
      switch (key) {
        case "noise":
          if (value == 0) { removeFilter(typeF) }
        case "blocksize":
          if (value == 0) { removeFilter(typeF) }
          break;
        case "blur":
          if (value == 0) { removeFilter(typeF) }
          break;

      }
    }

    if (checkFilter(typeF)) applyFilterValue(typeF, type ? type : key, value);
    setSelectedFilters(temp);
  };

  const getFilterByName = (name, options) => {
    switch (name) {
      case "Brownie":
        return new f.current.Brownie();
      case "Technicolor":
        return new f.current.Technicolor();
      case "Vintage":
        return new f.current.Vintage();
      case "Polaroid":
        return new f.current.Polaroid();
      case "Kodachrome":
        return new f.current.Kodachrome();
      case "BlackWhite":
        return new f.current.BlackWhite();
      case "Grayscale":
        return new f.current.Grayscale();
      case "Invert":
        return new f.current.Invert();
      case "Sepia":
        return new f.current.Sepia();
      case "RemoveColor":
        return new f.current.RemoveColor(options);
      case "Gamma":
        return new f.current.Gamma(options);
      case "Contrast":
        return new f.current.Contrast(options);
      case "Saturation":
        return new f.current.Saturation(options);
      case "HueRotation":
        return new f.current.HueRotation(options);
      case "Noise":
        return new f.current.Noise(options);
      case "Pixelate":
        return new f.current.Pixelate(options);
      case "Blur":
        return new f.current.Blur(options);
      case "Emboss":
        return new f.current.Convolute(options);
      case "Sharpen":
        return new f.current.Convolute(options);
      case "BlendColor":
        return new f.current.BlendColor(options);
      case "BlendImage":
        return new f.current.BlendImage(options);
    }
  }

  const isFilterChecked = (name) => {
    return filterIt(selectedFilters, name, "type")[0]?.checked;
  }

  const setFilterTab = (obj) => {
    let temp = [...selectedFilters];

    if (obj?.filters?.length) {
      obj.filters.map((elm, i) => {
        temp = temp.map((flt) => ({ ...flt, checked: elm.type == flt.type ? true : flt.checked }))
        const index = filterItIndex(selectedFilters, elm.type, "type");

        if (elm && elm.mode) {
          temp[index]["mode"] = elm.mode;
        }
        if (elm && elm.gamma) {
          temp[index]["red"] = elm.gamma[0];
          temp[index]["green"] = elm.gamma[1];
          temp[index]["blue"] = elm.gamma[2];
        }
        if (elm && elm.contrast) {
          temp[index]["contrast"] = elm.contrast;
        }
        if (elm && elm.saturation) {
          temp[index]["saturation"] = elm.saturation;
        }
        if (elm && elm.rotation) {
          temp[index]["rotation"] = elm.rotation;
        }
        if (elm && elm.noise) {
          temp[index]["noise"] = elm.noise;
        }
        if (elm && elm.blocksize) {
          temp[index]["blocksize"] = elm.blocksize;
        }
        if (elm && elm.blur) {
          temp[index]["blur"] = elm.blur;
        }
        if (elm && elm.alpha) {
          temp[index]["alpha"] = elm.alpha;
        }
        if (elm && elm.color) {
          temp[index]["color"] = elm.color;
        }
      })

      setSelectedFilters(temp);
    }
  }

  const getFilterValue = (type) => {
    return filterIt(selectedFilters, type, "type")[0];
  }

  const onDropFile = (e) => {
    e.preventDefault();
    setActiveDrop(false);
    setActiveTab(1);

    AWSService.addPhoto(e.dataTransfer.files).then(
      (data) => {
        console.log("Successfully uploaded photo.");
        AWSService.getObjects((data)=>{
          setImages(data)
        })
      },
      (err) => {
        return console.log("There was an error uploading your photo: ", err.message);
      })
  }

  return (
    <Layout>
      <StyledEditor  onDragOver={() => setActiveDrop(true)} onDragLeave={() => setActiveDrop(false)} onDrop={(e)=>!state.isDragFromSidebar ? onDropFile(e) : setActiveDrop(false)}>
        <StyledActiveDrop className={`${activeDrop && !state.isDragFromSidebar ? "active-drop" : ""}`}>
          <span>{lang.Dropfileshere}</span>
        </StyledActiveDrop>
        <Canvas className={`${isDragOverCanvas ? "over" : ""}`}>
          <canvas id="canvas" />
        </Canvas>
        <Sidebar isActive={true} disabled={activeDrop}>
          <Tabs activeTab={activeTab}>
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
              <ImagesSelector data={images} onSelect={(name, elm) => onSelect(name, false, elm)} onImageStartDrag={onImageStartDrag} onImageStopDrag={onImageStopDrag} />
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
                    <Check checked={isFilterChecked("Grayscale")} onChange={onChangeFilter} name="Grayscale" label={lang.Grayscale} />
                    <Container>
                      <Row>
                        <Col><RadioC disabled={!isFilterChecked("Grayscale")} checked={getFilterValue("Grayscale").mode == "average"} onChange={(e) => onChangeFilterValue(e, "Grayscale", "mode")} isRemoveSpace={true} value="average" label={lang.Avg} name="0" /></Col>
                        <Col><RadioC disabled={!isFilterChecked("Grayscale")} checked={getFilterValue("Grayscale").mode == "luminosity"} onChange={(e) => onChangeFilterValue(e, "Grayscale", "mode")} isRemoveSpace={true} value="luminosity" label={lang.Lum} name="0" /></Col>
                        <Col><RadioC disabled={!isFilterChecked("Grayscale")} checked={getFilterValue("Grayscale").mode == "lightness"} onChange={(e) => onChangeFilterValue(e, "Grayscale", "mode")} isRemoveSpace={true} value="lightness" label={lang.Light} name="0" /></Col>
                      </Row>
                    </Container>
                  </Block>
                  <Spacer />
                  <Label>{lang.Colormatrixfilters}:</Label>

                  <Block>
                    <Check checked={isFilterChecked("Invert")} onChange={onChangeFilter} name="Invert" label={`${lang.Invert}`} />
                    <Check checked={isFilterChecked("Sepia")} onChange={onChangeFilter} name="Sepia" label={lang.Sepia} />
                    <Check checked={isFilterChecked("BlackWhite")} onChange={onChangeFilter} name="BlackWhite" label={lang.BlackWhite} />
                    <Check checked={isFilterChecked("Brownie")} onChange={onChangeFilter} name="Brownie" label={lang.Brownie} />
                    <Check checked={isFilterChecked("Vintage")} onChange={onChangeFilter} name="Vintage" label={lang.Vintage} />
                    <Check checked={isFilterChecked("Kodachrome")} onChange={onChangeFilter} name="Kodachrome" label={lang.Kodachrome} />
                    <Check checked={isFilterChecked("Technicolor")} onChange={onChangeFilter} name="Technicolor" label={lang.Technicolor} />
                    <Check checked={isFilterChecked("Polaroid")} onChange={onChangeFilter} name="Polaroid" isRemoveSpace={true} label={lang.Polaroid} />
                  </Block>

                  <Spacer />

                  <Block>
                    <Check checked={isFilterChecked("RemoveColor")} onChange={onChangeFilter} name="RemoveColor" label={lang.Removecolor} />
                    <Color disabled={!isFilterChecked("RemoveColor")} onChange={(e) => onChangeFilterValue(e, "RemoveColor", "color")} value={getFilterValue("RemoveColor").color} name="remove-color-color" label={lang.Color} />
                    <Range disabled={!isFilterChecked("RemoveColor")} onChange={(e) => onChangeFilterValue(e, "RemoveColor", "distance")} value={getFilterValue("RemoveColor").distance} name="remove-color-distance" min="0" max="1" step="0.01" isRemoveSpace={true} label={lang.Distance} />
                  </Block>

                  <Spacer />

                  <Block>
                    <Check checked={isFilterChecked("Gamma")} onChange={onChangeFilter} name="Gamma" label={lang.Gamma} />
                    <Range disabled={!isFilterChecked("Gamma")} onChange={(e) => onChangeFilterValue(e, "Gamma", "red", "gamma", 0)} value={getFilterValue("Gamma").red} name="gamma-red" label={lang.Red} min="0.2" max="2.2" step="0.003921" />
                    <Range disabled={!isFilterChecked("Gamma")} onChange={(e) => onChangeFilterValue(e, "Gamma", "green", "gamma", 1)} value={getFilterValue("Gamma").green} name="gamma-green" label={lang.Green} min="0.2" max="2.2" step="0.003921" />
                    <Range disabled={!isFilterChecked("Gamma")} onChange={(e) => onChangeFilterValue(e, "Gamma", "blue", "gamma", 2)} value={getFilterValue("Gamma").blue} name="gamma-blue" isRemoveSpace={true} label={lang.Blue} min="0.2" max="2.2" step="0.003921" />
                  </Block>

                  <Spacer />

                  <Block>
                    <Range onChange={(e) => onChangeFilterValue(e, "Contrast", "contrast")} value={getFilterValue("Contrast").contrast} name="Contrast" label={lang.Contrast} min="-1" max="1" step="0.003921" />
                    <Range onChange={(e) => onChangeFilterValue(e, "Saturation", "saturation")} value={getFilterValue("Saturation").saturation} name="Saturation" label={lang.Saturation} min="-1" max="1" step="0.003921" />
                    <Range onChange={(e) => onChangeFilterValue(e, "HueRotation", "rotation")} value={getFilterValue("HueRotation").rotation} name="HueRotation" label={lang.Hue} min="-2" max="2" step="0.002" />
                    <Range onChange={(e) => onChangeFilterValue(e, "Noise", "noise")} name="Noise" label={lang.Noise} value={getFilterValue("Noise").noise} min="0" max="1000" step="1" />
                    <Range onChange={(e) => onChangeFilterValue(e, "Pixelate", "blocksize")} value={getFilterValue("Pixelate").blocksize} name="Pixelate" label={lang.Pixelate} min="0" max="20" step="1" />
                    <Range onChange={(e) => onChangeFilterValue(e, "Blur", "blur")} name="Blur" value={getFilterValue("Blur").blur} label={lang.Blur} min="0" max="1" step="0.01" />
                    <Check checked={isFilterChecked("Sharpen")} onChange={onChangeFilter} name="Sharpen" label={lang.Sharpen} />
                    <Check checked={isFilterChecked("Emboss")} onChange={onChangeFilter} name="Emboss" isRemoveSpace={true} label={lang.Emboss} />
                  </Block>

                  <Spacer />

                  <Block>
                    <Check checked={isFilterChecked("BlendColor")} onChange={onChangeFilter} name="BlendColor" label={lang.BlendColor} />
                    <Select disabled={!isFilterChecked("BlendColor")} onChange={(e) => onChangeFilterValue({ target: { value: e.value } }, "BlendColor", "mode")} name="blendcolor-mode" value={{ value: capitalize(getFilterValue("BlendColor").mode), label: capitalize(getFilterValue("BlendColor").mode) }} placeholder={lang.Mode} options={data.blendModes} />
                    <Spacer variant="input" />
                    <Color value={getFilterValue("BlendColor").color} onChange={(e) => onChangeFilterValue(e, "BlendColor", "color")} disabled={!isFilterChecked("blend-color")} name="blendcolor-color" label={lang.Color} />
                    <Range disabled={!isFilterChecked("BlendColor")} onChange={(e) => onChangeFilterValue(e, "BlendColor", "alpha")} name="blendcolor-alpha" value={getFilterValue("BlendColor").alpha} isRemoveSpace={true} label={lang.Alpha} min="0" max="1" step="0.01" />
                  </Block>

                  <Spacer />

                  <Block>
                    <Check checked={isFilterChecked("BlendImage")} onChange={onChangeFilter} name="BlendImage" label={lang.BlendImage} />
                    <Select disabled={!isFilterChecked("BlendImage")} onChange={(e) => onChangeFilterValue({ target: { value: e.value } }, "BlendImage", "mode")} name="blend-image-mode" value={{ value: capitalize(getFilterValue("BlendImage").mode), label: capitalize(getFilterValue("BlendImage").mode) }} placeholder={lang.Mode} options={data.maskModes} />
                    <Spacer variant="input" />
                    <Range disabled={!isFilterChecked("BlendImage")} onChange={(e) => onChangeFilterValue(e, "BlendImage", "alpha")} name="blend-image-alpha" value={getFilterValue("BlendImage").alpha} isRemoveSpace={true} label={lang.Alpha} min="0" max="1" step="0.01" />
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
