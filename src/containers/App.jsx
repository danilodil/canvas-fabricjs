import React, { useReducer, useState, useRef, useEffect, Suspense } from "react";
import { Context } from "../context/context";
import reducerState from "../context/reducerState";
import Pseudorouter from "../components/pseudorouter";
import SmoothScrollbar from 'smooth-scrollbar';
import StopScrollPlugin from "../utils/plugins/ScrollStop";
import navigation from "../configs/navigation";
import { ThemeProvider } from 'styled-components';
import theme from "../theme/light";

SmoothScrollbar.use(StopScrollPlugin);

import "../styles/style.scss";
import reducerNotification from "../context/reducerNotification";

const App = () => {

  const [state, dispatchState] = useReducer(reducerState, {
    loadderState: "load",
    isShowContent: true,
    preloadStatus: "loading",
    headerState: "",
    isPause: false,
    isDisabledPreloader: false,
    position: { x: 3, y: 2 },
    isDragFromSidebar: false,
  });

  const [notification, dispatchNotification] = useReducer(reducerNotification, {
    uploadImageProgress: 0,
  });

  const [components, setComponents] = useState([]);

  useEffect(() => {
    importComponents();
  }, [])

  const importComponent = (name, link, data, i) => {
    const Component = React.lazy(() => import(`../pages/${name}`));
    return <Component key={`r-${i}`} path={link} data={data} />
  }

  const importComponents = () => {
    const comps = [];

    navigation.map((nav, i) => {
      if (nav.component) {
        comps.push(importComponent(nav.component, nav.link, nav.data, i));
      }

      if (nav.sub) {
        nav.sub.columns.forEach((column) => {
          column.links.forEach((link, z) => {
            link.component && comps.push(importComponent(link.component, link.link, link.data, i + z));
          });
        })
      }
    })

    setComponents(comps);

    return comps;
  }

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={{ state, notification, dispatchNotification, dispatchState }}>
        <Suspense fallback={<>Loading</>}>
          <Pseudorouter isPause={state.isPause} isDisabledPreloader={state.isDisabledPreloader}>
            {state.isShowContent && components}
          </Pseudorouter>
        </Suspense>
      </Context.Provider>
    </ThemeProvider>
  );
}

export default App;
