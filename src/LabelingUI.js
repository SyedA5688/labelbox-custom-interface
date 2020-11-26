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
      Mesangial: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      Subendothelial: [[0,0,0], [0,0,0], [0,0,0]],
      Subepithelial: [[0,0,0], [0,0,0], [0,0,0]],
      Tubuloreticular: [[0,0,0], [0,0,0], [0,0,0]],
    };
  }

  onDragStop = () => {
    console.log("Drag stopped");
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
      if (cond === "Mesangial")
      {
        // Update state of mesangial array
        let arr = {...this.state.Mesangial};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ Mesangial: arr });

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
        let arr = {...this.state.Subendothelial};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ Subendothelial: arr });

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
        let arr = {...this.state.Subepithelial};
        arr[row][col] = 1 - arr[row][col];
        this.setState({ Subepithelial: arr });

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
        let arr = {...this.state.Tubuloreticular};
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
        <div className={"ImageContainer"} onMouseMove={this.handleMove.bind(this)} onDragStop={this.onDragStop} >
          <PinchZoomPan 
            maxScale={10} 
            initialScale={0.4} 
            position="center" 
            minScale={0.25} 
            doubleTapBehavior="none"
          >
            <img alt='Glomeruli' src={this.props.data} onClick={this.onImageClick} />
          </PinchZoomPan>
        </div>

        <div className={"SelectionRightBar"} >
          {/* <p>Mouse coordinates: {this.state.x}, { this.state.y }</p> */}
          {/* <p>Image: Width is { this.state.ImageWidth }, Height is { this.state.ImageHeight } </p> */}
          {/* {this.state.cursorMoved ? <p>Cursor Moved: True</p> : <p>Cursor Moved: False</p>} */}
          
          <div className="gridContainer" >
            <p>Mesangial Immune Complexes</p>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state.Mesangial[0][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.Mesangial[0][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.Mesangial[0][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state.Mesangial[1][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.Mesangial[1][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.Mesangial[1][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} >
              {(this.state.Mesangial[2][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.Mesangial[2][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
              {(this.state.Mesangial[2][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "cornflowerblue", borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "cornflowerblue", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Subendothelial Immune Complexes</p>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state.Subendothelial[0][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.Subendothelial[0][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.Subendothelial[0][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state.Subendothelial[1][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.Subendothelial[1][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.Subendothelial[1][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} >
              {(this.state.Subendothelial[2][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.Subendothelial[2][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
              {(this.state.Subendothelial[2][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "blueviolet", borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "blueviolet", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Subepithelial Immune Complexes</p>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state.Subepithelial[0][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.Subepithelial[0][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.Subepithelial[0][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state.Subepithelial[1][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.Subepithelial[1][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.Subepithelial[1][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} >
              {(this.state.Subepithelial[2][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.Subepithelial[2][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
              {(this.state.Subepithelial[2][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "coral", borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "coral", borderStyle: "solid" }} ></div> }
            </div>
          </div>
          
          <div className="gridContainer" >
            <p>Tubuloreticular Inclusion</p>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state.Tubuloreticular[0][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.Tubuloreticular[0][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.Tubuloreticular[0][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state.Tubuloreticular[1][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.Tubuloreticular[1][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.Tubuloreticular[1][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
            <div style={{ height: 30, width: 90, display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} >
              {(this.state.Tubuloreticular[2][0] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.Tubuloreticular[2][1] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
              {(this.state.Tubuloreticular[2][2] === 1) ? <div style={{ height: 30, width: 30, backgroundColor: "darkgreen", borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> : <div style={{ height: 30, width: 30, borderWidth: 1, borderColor: "darkgreen", borderStyle: "solid" }} ></div> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
