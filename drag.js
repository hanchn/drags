class DragDom {
  state = {
    root: null,
    dragInContainer: null,
    dragLis: null,
    liClassName: null,
    touchStatus: false,
    initX: 0,
    initY: 0,
    initW: 0,
    initH: 0,
    autoTest: false
  };

  constructor({ root, dragLis, dragInContainer, autoTest = false }) {
    let { setState, render, autoTestFun } = this;
    setState({
      root: document.querySelector(root),
      dragInContainer: document.querySelectorAll(dragInContainer),
      dragLis: document.querySelectorAll(dragLis),
      liClassName: null,
      initX: 0,
      initY: 0,
      autoTest
    });
    render();
    if (autoTest !== false) {
      autoTestFun();
    }
  }

  render = () => {
    let { state, initTouch, initContainerState, lazy } = this;
    let { root } = state;
    lazy({ res: initContainerState });
    initTouch();
    root.style = "display: block;";
  };

  initTouch = () => {
    let { state, setState, dealTouch, touchOut } = this;
    let { dragLis: lis } = state;
    if (lis === []) return;
    let li = lis[0];
    let liClassName = `${li.getAttribute("class")}`;
    setState({
      liClassName: liClassName
    });
    for (let key in Object.entries(lis)) {
      dealTouch({ target: lis[key] });
    }
  };

  dealTouch = ({ target }) => {
    let { state, setState, removeTouchEvent, mouseMoveEvent } = this;
    target.addEventListener("mousedown", e => {
      let { pageX, pageY } = e;
      setState({
        targetX: target.offsetLeft,
        targetY: target.offsetTop,
        initX: pageX - target.offsetLeft,
        initY: pageY - target.offsetTop,
        touchStatus: true,
        target
      });
    });

    mouseMoveEvent();
    removeTouchEvent();
  };

  mouseMoveEvent = () => {
    window.addEventListener("mousemove", eMouse => {
      let { impactTouch, state, removeTouchEvent, lazy } = this;
      let {
        touchStatus,
        initX,
        initY,
        target,
        liClassName,
        initW,
        initH,
        containerStore,
        dragInContainer
      } = state;
      if (touchStatus) {
        let { pageX: moveX, pageY: moveY } = eMouse;
        target.setAttribute("class", `${liClassName} fixed`);
        target.style = `left: ${moveX - initX}px; top: ${moveY - initY}px`;
        for (let i = 0; i < containerStore.length; i++) {
          let { x, y, w, h } = containerStore[i];
          let getImpact = impactTouch({
            x1: document.querySelector(".fixed").offsetLeft,
            y1: document.querySelector(".fixed").offsetTop,
            w1: initW,
            h1: initH,
            x2: x,
            y2: y,
            w2: w,
            h2: h
          });
          if (getImpact) {
            dragInContainer[i].appendChild(target);
            lazy({ res: removeTouchEvent });
            break;
          }
        }
      }
    });
  };

  removeTouchEvent = () => {
    let { setState, removeClass } = this;
    window.addEventListener("mouseup", eUp => {
      setState({ touchStatus: false, initX: 0, initY: 0 });
      removeClass();
    });
  };

  removeClass = () => {
    let { state } = this;
    let { dragLis: lis, liClassName } = state;
    for (let key in Object.entries(lis)) {
      lis[key].setAttribute("class", liClassName);
    }
  };

  // touch test
  impactTouch = ({ x1, y1, w1, h1, x2, y2, w2, h2 }) => {
    if (x1 > x2 + w2 || y1 > y2 + h2 || x2 > x1 + w1 || y2 > y1 + h1) {
      return false; // touch !!!
    } else {
      return true; // touch none
    }
  };

  initContainerState = () => {
    let { state, setState } = this;
    let { dragInContainer, dragLis: lis } = state;
    let containerStore = [];
    for (let i = 0; i < dragInContainer.length; i++) {
      let {
        offsetLeft,
        offsetTop,
        offsetWidth,
        offsetHeight
      } = dragInContainer[i];

      containerStore = [
        ...containerStore,
        {
          x: offsetLeft,
          y: offsetTop,
          w: offsetWidth,
          h: offsetHeight
        }
      ];
    }
    setState({
      containerStore,
      initW: lis.length > 0 ? lis[0].offsetWidth : 0,
      initH: lis.length > 0 ? lis[0].offsetHeight : 0
    });
  };

  autoTestFun = () => {
    let { state } = this;
    let { autoTest, dragLis: lis, dragInContainer } = state;
    const href = decodeURI(window.location.href);
    let testPath = href.split(`${autoTest}=`)[1];
    const AUTO_JSON = {
      target: parseInt(testPath.split("/")[0]) - 1,
      container: parseInt(testPath.split("/")[1]) - 1
    };
    let { target, container } = AUTO_JSON;
    if (dragInContainer[container] && lis[target]) {
      dragInContainer[container].appendChild(lis[target]);
    } else {
      console.err("Path error ! Target is not defind !");
    }
  };

  // async
  lazy = ({ lazyTime = 0, res }) => {
    setTimeout(() => {
      res();
    }, lazyTime);
  };

  // public tools
  setState = (state = {}) => {
    if (state === {}) return;
    let { getState } = this;
    const stateNow = getState();
    this.state = Object.assign(stateNow, state);
  };

  // public tools
  getState = () => this.state;
}
