import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import HomeIcon from '@material-ui/icons/Home';
import './App.css';
import { LabelingUI } from './LabelingUI';
import LinearProgress from '@material-ui/core/LinearProgress';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';

export const primary = '#5495e3';
export const secondary = '#c1c1c1';
export const error = red.A700;
export const textColor = '#5b5b5b';
export const theme = createMuiTheme({
  palette: {
    primary: {
      ...lightBlue,
      A700: primary
    }
  }
});
// label is what will be assigned to overall image # Transmembranous immune Complex
const defaultState = {data: undefined, previousAsset: undefined, loading: true, 
                      label: { "NOCOMPLEXES":"000000000", "MES": "000000000", "SUBEND": "000000000", "SUBEPI": "000000000", "TUB": "000000000", "TRAN": "000000000" }, 
                      selectedCond: "", updateKey: Math.random(), alertOpen: false};

class App extends Component {
  state = defaultState;

  next(submission){
    this.setState(defaultState);
    const getNext = () => {
      window.Labelbox.fetchNextAssetToLabel();
    };
    if (!submission) {
      getNext();
    } else if (submission.label) {
      window.Labelbox.setLabelForAsset(JSON.stringify(submission.label || '')).then(getNext);
    } else if (submission.skip) {
      window.Labelbox.skip().then(getNext);
    }
    this.setState({ updateKey: Math.random() });
  }

  componentDidMount(){
    //console.log("Function ran");
    window.Labelbox.currentAsset().subscribe((asset) => {
      if (!asset){
        this.setState({loading: true});
        return;
      }

      this.setState({data: asset.data, loading: false, previousAsset: asset.previous});
      if (asset.label === undefined)
        this.setState({ label: { "NOCOMPLEXES":"000000000", "MES": "000000000", "SUBEND": "000000000", "SUBEPI": "000000000", "TUB": "000000000", "TRAN": "000000000" }, 
        updateKey: Math.random(), alertOpen: false });
      else if (asset.label === "Skip")
        this.setState({ label: { "NOCOMPLEXES":"000000000", "MES": "000000000", "SUBEND": "000000000", "SUBEPI": "000000000", "TUB": "000000000", "TRAN": "000000000" }, 
        updateKey: Math.random(), alertOpen: false });
      else
        this.setState({ label: JSON.parse(asset.label), updateKey: Math.random() });
    });
  }

  handleSubmitClick = () => {
    let tileFlags = [[0,0,0],[0,0,0],[0,0,0]];
    let keyArr = Object.keys(this.state.label);
    for (let i = 0; i < keyArr.length; i++) {
      let str = this.state.label[keyArr[i]];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (parseInt( str.charAt(3*r + c) ) === 1) {
            tileFlags[r][c] = 1;
          }
        }
      }
    }
    
    let everyTileLabeled = true;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (tileFlags[r][c] === 0) {
          everyTileLabeled = false;
        }
      }
    }
    

    // If every tile has a label, then submit. Otherwise, bring up an alert modal
    if (everyTileLabeled) {
      this.next({label: this.state.label}); // Submit and move to next image
    }
    else {
      // Bring up an alert modal saying to label every tile
      this.setState({ alertOpen: true });
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <div className="Holder" >
            {this.state.loading && <LinearProgress/>}
            <div className={"LabelingFrame"}>
              <div className="LeftBarContainer" >
                <div className={"InstructionsBar"}>
                  <a href="https://app.labelbox.com/projects" className="HomeButton" >
                    <HomeIcon fontSize="large" color="action" />
                  </a>
                  <div>
                    <p style={{fontSize: "large"}} >Instructions:</p>
                    <p>
                      1. If the entire image is inconclusive and cannot be labeled, please select "
                      <span style={{color: "red", textDecoration: "underline"}} >Skip</span>" at the bottom of the panel.
                    </p>
                    <p>
                      2. Otherwise, select label category from the "Labels" list. For labeling tiles with no complexes or inclusions,
                      select "No Complexes/Inclusions".
                    </p>
                    <p>
                      3. Once selected, double click tiles that are positive for the selected label. Feedback will appear on the right panel. 
                      To deselect a tile, double click it again.
                    </p>
                    <p>
                      4. Repeat process for all labels applicable to the image. Tiles with no labels will be considered inconclusive.
                    </p>
                    <p>
                      5. Once done, press the "<span style={{color: "blue", textDecoration: "underline"}} >Submit</span>" button to move to the
                      next sample.
                    </p>
                    <p>
                      *Scroll up and down over image or use controls to zoom in/out. Click and drag to
                      pan around image.
                    </p>
                    <p className="warning" >
                      *Moving mouse while double-clicking leads to weird behavior. <br/>
                      *Safari may render images incorrectly, use chrome for best results. <br/>
                      *Pressing "Submit" and "Previous" too many times in a row leads to weird behaviour.
                    </p>
                    {/* <p>{JSON.stringify(this.state.label)}</p> */}
                    <Collapse in={this.state.alertOpen}>
                      <Alert 
                        severity="error"
                        action={
                          <IconButton
                            aria-label="close-alert"
                            color="inherit"
                            size="small"
                            onClick={() => { this.setState({ alertOpen: false }); }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                      >
                        Error: Please apply a label to each tile before submitting.
                      </Alert>
                    </Collapse>
                  </div>
                  <div className="labelSelectorContainer" >
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">Labels:</FormLabel>
                      <RadioGroup
                        aria-label="gender"
                        name="gender1"
                        value={this.state.selectedCond}
                        onChange={(e) => this.setState({ selectedCond: e.target.value })}
                      >
                        <FormControlLabel value="NoComplexes" control={<Radio color="primary"/>} label="No Complexes/Inclusions or Inconclusive Tile" />
                        <FormControlLabel value="Mesangial" control={<Radio color="primary"/>} label="Mesangial Immune Complexes" />
                        <FormControlLabel value="Subendothelial" control={<Radio color="primary"/>} label="Subendothelial Immune Complexes" />
                        <FormControlLabel value="Subepithelial" control={<Radio color="primary"/>} label="Subepithelial Immune Complexes" />
                        <FormControlLabel value="Tubuloreticular" control={<Radio color="primary"/>} label="Tubuloreticular Inclusion" />
                        <FormControlLabel value="Transmembranous" control={<Radio color="primary"/>} label="Transmembranous Immune Complexes" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
                <div className={"ButtonBar"}>
                  <Button  
                    className="PreviousButton"
                    variant="contained"
                    onClick={() => window.Labelbox.setLabelAsCurrentAsset(this.state.previousAsset)}
                  >
                    Previous
                  </Button>
                  <Button 
                    className="SkipButton"
                    variant="contained" 
                    color="secondary"
                    onClick={() => this.next({skip: true})}
                  >
                    Skip
                  </Button>
                  <Button
                    className="SubmitButton"
                    variant="contained"
                    color="primary"
                    disabled={!this.state.label}
                    onClick={this.handleSubmitClick} /* console.log(JSON.stringify(this.state.label)) */
                  >
                    Submit
                  </Button>
                </div>
              </div>
              
              <LabelingUI 
                key={this.state.updateKey} 
                selectedCondition={this.state.selectedCond} 
                label={this.state.label} data={this.state.data} 
                onLabelUpdate={(label) => this.setState({...this.state, label})} 
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
