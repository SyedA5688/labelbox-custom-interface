import React from 'react';
import PinchZoomPan from "react-responsive-pinch-zoom-pan";

export class LabelingUI extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      ImageWidth: 0,
      ImageHeight: 0,
      cursorMoved: false,
      "TA+IF+Infl+-": [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      "TA+IF-Infl+-": [[0,0,0], [0,0,0], [0,0,0]],
      "TA-IF+Infl+-": [[0,0,0], [0,0,0], [0,0,0]],
      "TA-IF-Infl+": [[0,0,0], [0,0,0], [0,0,0]],
      "TA-IF-Infl-": [[0,0,0], [0,0,0], [0,0,0]],
    };
  }

  componentDidMount() {
    // Function runs whenever update happens to label in App.js
    let keyArr = Object.keys(this.props.label);
    for (let i = 0; i < keyArr.length; i++) {
      let newArr = [[0,0,0], [0,0,0], [0,0,0]];
      let str = this.props.label[keyArr[i]];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          newArr[r][c] = parseInt( str.charAt(3*r + c) );
        }
      }
      this.setState({ [keyArr[i]]: newArr });
    }
    
  }

  onImageClick = () => {
    let row = -1;
    let col = -1;
    // Boundaries to compare coords to in choosing a tile to select
    let bound1 = this.state.ImageHeight / 3;
    let bound2 = bound1 * 2;
        
    // Calculate what row to update
    if (this.state.y > bound2)
      row = 2
    else if (this.state.y > bound1)
      row = 1
    else
      row = 0

    // Calculate what column to update
    if (this.state.x > bound2)
      col = 2
    else if (this.state.x > bound1)
      col = 1
    else
      col = 0

    // Update state if they have double clicked
    if (!this.state.cursorMoved)
    {
      //console.log("Click: ", this.state.click, " Cursor moved: ", this.state.cursorMoved, " Coords moved: ", this.state.coordsMoved);
      let cond = this.props.selectedCondition;
      if (cond === "TA+IF+Infl+-")
      {
        // Update state of mesangial array
        let arr = {...this.state["TA+IF+Infl+-"]};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ "TA+IF+Infl+-": arr });

        // Also update label for entire image **UPDATE
        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["TA+IF+Infl+-"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
      else if (cond === "TA+IF-Infl+-")
      {
        let arr = {...this.state["TA+IF-Infl+-"]};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ "TA+IF-Infl+-": arr });

        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["TA+IF-Infl+-"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
      else if (cond === "TA-IF+Infl+-")
      {
        let arr = {...this.state["TA-IF+Infl+-"]};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ "TA-IF+Infl+-": arr });

        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["TA-IF+Infl+-"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
      else if (cond === "TA-IF-Infl+")
      {
        let arr = {...this.state["TA-IF-Infl+"]};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ "TA-IF-Infl+": arr });

        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["TA-IF-Infl+"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
      else if (cond === "TA-IF-Infl-")
      {
        let arr = {...this.state["TA-IF-Infl-"]};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ "TA-IF-Infl-": arr });

        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["TA-IF-Infl-"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
    }
    this.setState({ cursorMoved: false });
  }

  handleMove(e) {
    var bounds = e.target.getBoundingClientRect();
    var x = e.clientX - bounds.left;
    var y = e.clientY - bounds.top;
    this.setState({ 
      x: parseInt(x), 
      y: parseInt(y), 
      ImageWidth: parseInt(bounds.right - bounds.left), 
      ImageHeight: parseInt(bounds.bottom - bounds.top), 
      cursorMoved: true,
    });
    // cursorMoved: true, click: false
  }

  render() {
    return (
      <div className={"LabelingUIContainer"} >
        <div className={"ImageContainer"} onMouseMove={this.handleMove.bind(this)} >
          <PinchZoomPan 
            maxScale={10} 
            initialScale={0.35} 
            position="center" 
            minScale={0.25} 
            doubleTapBehavior="reset"
          >
            <img alt='Glomeruli' src={this.props.data} onClick={this.onImageClick} />
          </PinchZoomPan>
        </div>

        <div className={"SelectionRightBar"} >
          {/* <p>Mouse coordinates: {this.state.x}, { this.state.y }</p> */}
          {/* <p>Image: Width is { this.state.ImageWidth }, Height is { this.state.ImageHeight } </p> */}
          {/* {this.state.cursorMoved ? <p>Cursor Moved: True</p> : <p>Cursor Moved: False</p>} */}
          
          <div className="gridContainer" >
            <p>Tubular Atrophy <span className="checkSpan" >✓</span>, Interstitial Fibrosis <span className="checkSpan" >✓</span>, (± infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state["TA+IF+Infl+-"][0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF+Infl+-"][0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF+Infl+-"][0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state["TA+IF+Infl+-"][1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF+Infl+-"][1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF+Infl+-"][1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state["TA+IF+Infl+-"][2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF+Infl+-"][2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF+Infl+-"][2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Tubular Atrophy <span className="checkSpan" >✓</span>, Interstitial Fibrosis <span className="xSpan" >✘</span>, (± infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state["TA+IF-Infl+-"][0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF-Infl+-"][0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF-Infl+-"][0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state["TA+IF-Infl+-"][1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF-Infl+-"][1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF-Infl+-"][1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state["TA+IF-Infl+-"][2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF-Infl+-"][2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state["TA+IF-Infl+-"][2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Tubular Atrophy <span className="xSpan" >✘</span>, Interstitial Fibrosis <span className="checkSpan" >✓</span>, (± infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state["TA-IF+Infl+-"][0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF+Infl+-"][0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF+Infl+-"][0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state["TA-IF+Infl+-"][1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF+Infl+-"][1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF+Infl+-"][1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state["TA-IF+Infl+-"][2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF+Infl+-"][2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF+Infl+-"][2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Tubular Atrophy <span className="xSpan" >✘</span>, Interstitial Fibrosis <span className="xSpan" >✘</span>, (+ infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state["TA-IF-Infl+"][0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl+"][0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl+"][0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state["TA-IF-Infl+"][1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl+"][1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl+"][1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state["TA-IF-Infl+"][2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl+"][2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl+"][2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
          </div>

          <div className="gridContainer" >
            <p>Tubular Atrophy <span className="xSpan" >✘</span>, Interstitial Fibrosis <span className="xSpan" >✘</span>, (- infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} >
              {(this.state["TA-IF-Infl-"][0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl-"][0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl-"][0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} >
              {(this.state["TA-IF-Infl-"][1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl-"][1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl-"][1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} >
              {(this.state["TA-IF-Infl-"][2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl-"][2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state["TA-IF-Infl-"][2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
