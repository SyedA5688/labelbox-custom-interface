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
      TApIFpInflpn: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      TApIFnInflpn: [[0,0,0], [0,0,0], [0,0,0]],
      TAnIFpInflpn: [[0,0,0], [0,0,0], [0,0,0]],
      TAnIFnInflp: [[0,0,0], [0,0,0], [0,0,0]],
      TAnIFnInfln: [[0,0,0], [0,0,0], [0,0,0]],
    };
  }

  componentDidUpdate() {
    if (!this.props.UIUpdated) {
      let keyArr = Object.keys(this.props.label);
      for (let i = 0; i < keyArr.length; i++) {
        let newArr = [[0,0,0], [0,0,0], [0,0,0]];
        let str = this.props.label[keyArr[i]];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            newArr[r][c] = parseInt( str.charAt(3*r + c) );
          }
        }
        if (keyArr[i] === "MES") {
          this.setState({ Mesangial: newArr });
          //console.log("Updating Mesangial arr to", newArr);
        }
        else if (keyArr[i] === "SUBEND") {
          this.setState({ Subendothelial: newArr });
        }
        else if (keyArr[i] === "SUBEPI") {
          this.setState({ Subepithelial: newArr });
        }
        else if (keyArr[i] === "TUB") {
          this.setState({ Tubuloreticular: newArr });
        }
      }
      this.props.onUIUpdated();
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
        let arr = {...this.state.TApIFpInflpn};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ TApIFpInflpn: arr });

        // Also update label for entire image **UPDATE
        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["MES"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
      else if (cond === "TA+IF-Infl+-")
      {
        let arr = {...this.state.TApIFnInflpn};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ TApIFnInflpn: arr });

        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["SUBEND"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
      else if (cond === "TA-IF+Infl+-")
      {
        let arr = {...this.state.TAnIFpInflpn};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ TAnIFpInflpn: arr });

        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["SUBEPI"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
      else if (cond === "TA-IF-Infl+")
      {
        let arr = {...this.state.TAnIFnInflp};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ Tubuloreticular: arr });

        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["TUB"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
      else if (cond === "TA-IF-Infl-")
      {
        let arr = {...this.state.TAnIFnInfln};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ TAnIFnInfln: arr });

        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["TUB"] = labelStr;
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
            initialScale={0.4} 
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
            <p>Tubular Atrophy √, Interstitial Fibrosis √, (± infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state.TApIFpInflpn[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFpInflpn[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFpInflpn[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state.TApIFpInflpn[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFpInflpn[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFpInflpn[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state.TApIFpInflpn[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFpInflpn[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFpInflpn[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Tubular Atrophy √, Interstitial Fibrosis X, (± infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state.TApIFnInflpn[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFnInflpn[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFnInflpn[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state.TApIFnInflpn[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFnInflpn[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFnInflpn[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state.TApIFnInflpn[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFnInflpn[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.TApIFnInflpn[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Tubular Atrophy X, Interstitial Fibrosis √, (± infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state.TAnIFpInflpn[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFpInflpn[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFpInflpn[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state.TAnIFpInflpn[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFpInflpn[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFpInflpn[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state.TAnIFpInflpn[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFpInflpn[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFpInflpn[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Tubular Atrophy X, Interstitial Fibrosis X, (+ infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state.TAnIFnInflp[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInflp[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInflp[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state.TAnIFnInflp[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInflp[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInflp[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state.TAnIFnInflp[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInflp[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInflp[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
          </div>

          <div className="gridContainer" >
            <p>Tubular Atrophy X, Interstitial Fibrosis X, (- infiltrates)</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} >
              {(this.state.TAnIFnInfln[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInfln[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInfln[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} >
              {(this.state.TAnIFnInfln[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInfln[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInfln[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} >
              {(this.state.TAnIFnInfln[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInfln[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
              {(this.state.TAnIFnInfln[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "red", borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "red", borderStyle: "solid" }} ></div> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
