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
      NOCOMPLEXES: [[0,0,0], [0,0,0], [0,0,0]],
      MES: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      SUBEND: [[0,0,0], [0,0,0], [0,0,0]],
      SUBEPI: [[0,0,0], [0,0,0], [0,0,0]],
      TUB: [[0,0,0], [0,0,0], [0,0,0]],
      TRAN: [[0,0,0], [0,0,0], [0,0,0]],
    };
  }

  componentDidMount() {
    // This function runs whenever update happens to label in App.js
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
      let cond = this.props.selectedCondition;
      if (cond === "NoComplexes")
      {
        // Update state of NOCOMPLEXES array
        let arr = {...this.state.NOCOMPLEXES};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ NOCOMPLEXES: arr });

        // Also update label for entire image
        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["NOCOMPLEXES"] = labelStr;
        this.props.onLabelUpdate(entireLabelObj);
      }
      if (cond === "Mesangial")
      {
        // Update state of mesangial array
        let arr = {...this.state.MES};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ MES: arr });

        // Also update label for entire image
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
      else if (cond === "Subendothelial")
      {
        let arr = {...this.state.SUBEND};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ SUBEND: arr });

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
      else if (cond === "Subepithelial")
      {
        let arr = {...this.state.SUBEPI};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ SUBEPI: arr });

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
      else if (cond === "Tubuloreticular")
      {
        let arr = {...this.state.TUB};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ TUB: arr });

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
      else if (cond === "Transmembranous")
      {
        let arr = {...this.state.TRAN};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ TRAN: arr });

        let labelStr = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            labelStr += arr[i][j];
          }
        }
        let entireLabelObj = this.props.label;
        entireLabelObj["TRAN"] = labelStr;
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
          
          <div className="gridContainer" >
            <p>No Complexes/Inclusions</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} >
              {(this.state.NOCOMPLEXES[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgray", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> }
              {(this.state.NOCOMPLEXES[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgray", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> }
              {(this.state.NOCOMPLEXES[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgray", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} >
              {(this.state.NOCOMPLEXES[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgray", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> }
              {(this.state.NOCOMPLEXES[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgray", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> }
              {(this.state.NOCOMPLEXES[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgray", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} >
              {(this.state.NOCOMPLEXES[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgray", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> }
              {(this.state.NOCOMPLEXES[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgray", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> }
              {(this.state.NOCOMPLEXES[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgray", borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgray", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Mesangial Immune Complexes</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state.MES[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.MES[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.MES[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state.MES[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.MES[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.MES[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state.MES[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.MES[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.MES[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Subendothelial Immune Complexes</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state.SUBEND[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEND[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEND[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state.SUBEND[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEND[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEND[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state.SUBEND[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEND[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEND[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Subepithelial Immune Complexes</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state.SUBEPI[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEPI[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEPI[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state.SUBEPI[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEPI[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEPI[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state.SUBEPI[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEPI[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.SUBEPI[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Tubuloreticular Inclusion</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state.TUB[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TUB[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TUB[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state.TUB[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TUB[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TUB[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state.TUB[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TUB[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.TUB[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
          </div>

          <div className="gridContainer" >
            <p>Transmembranous Immune Complexes</p>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} >
              {(this.state.TRAN[0][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "crimson", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> }
              {(this.state.TRAN[0][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "crimson", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> }
              {(this.state.TRAN[0][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "crimson", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} >
              {(this.state.TRAN[1][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "crimson", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> }
              {(this.state.TRAN[1][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "crimson", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> }
              {(this.state.TRAN[1][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "crimson", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 20, width: 60, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} >
              {(this.state.TRAN[2][0] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "crimson", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> }
              {(this.state.TRAN[2][1] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "crimson", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> }
              {(this.state.TRAN[2][2] === 1) ? <div style={{ height: 20, width: 20, backgroundColor: "crimson", borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> : <div style={{ height: 20, width: 20, borderWidth: 1, borderColor: "crimson", borderStyle: "solid" }} ></div> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
