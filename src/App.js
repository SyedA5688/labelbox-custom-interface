import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import './App.css';
import { LabelingUI } from './LabelingUI';
import HomeIcon from '@material-ui/icons/Home';
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
// label is what will be assigned to overall image
const defaultState = {data: undefined, previousAsset: undefined, loading: true, 
                      label: { "NoCortical":"000000000", "TA+IF+Infl+-": "000000000", "TA+IF-Infl+-": "000000000", "TA-IF+Infl+-": "000000000", "TA-IF-Infl+": "000000000", "TA-IF-Infl-": "000000000" }, 
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
    window.Labelbox.currentAsset().subscribe((asset) => {
      if (!asset){
        this.setState({loading: true});
        return;
      }

      this.setState({data: asset.data, loading: false, previousAsset: asset.previous});
      if (asset.label === undefined)
        this.setState({ label: { "NoCortical":"000000000", "TA+IF+Infl+-": "000000000", "TA+IF-Infl+-": "000000000", "TA-IF+Infl+-": "000000000", "TA-IF-Infl+": "000000000", "TA-IF-Infl-": "000000000" }, 
                        updateKey: Math.random(), alertOpen: false });
      else if (asset.label === "Skip")
        this.setState({ label: { "NoCortical":"000000000", "TA+IF+Infl+-": "000000000", "TA+IF-Infl+-": "000000000", "TA-IF+Infl+-": "000000000", "TA-IF-Infl+": "000000000", "TA-IF-Infl-": "000000000" }, 
                        updateKey: Math.random(), alertOpen: false });
      else
        this.setState({ label: JSON.parse(asset.label), updateKey: Math.random(), alertOpen: false });
    });
  }

  handleInputChange = (e) => {
    this.setState({ selectedCond: e.currentTarget.value });
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
                    <p style={{fontSize: 20}} >Instructions:</p>
                    <p>
                      1. If the entire image cannot be labeled (e.g. no tissue, noise, inconclusive, etc.) please 
                      select the "<span style={{color: "red", textDecoration: "underline"}} >Skip</span>" button.
                    </p>
                    <p>
                      2. Otherwise, select label category representing the majority of the square from "Labels" list below.
                    </p>
                    <p>
                      3. Once selected, double click tiles that are positive for the selected label. Feedback will appear on the right panel. 
                      To deselect a tile, double click it again.
                    </p>
                    <p>
                      4. Repeat process for all labels applicable to the sample.
                    </p>
                    <p>
                      5. Once done, press "<span style={{color: "blue", textDecoration: "underline"}} >Submit</span>" to move to the
                      next sample.
                    </p>
                    <p>
                      *Scroll up and down with two fingers over image or use controls to zoom in/out. Click and drag to
                      pan around image.
                    </p>
                    <p className="warning" >
                      *Moving mouse while double-clicking leads to weird behavior. <br/>
                      *Image may render incorrectly on safari browsers, use chrome for best results.
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
                    <p style={{fontSize: 18}} >Label List:</p>
                    <form>
                      <label>
                        <input
                          name="label1"
                          type="radio"
                          value="NoCortical"
                          checked={this.state.selectedCond === "NoCortical"}
                          onChange={this.handleInputChange} />
                        <p style={{fontSize: 16, display: "inline"}}>
                          No cortical tubulointerstitum or artefacts present (white space or<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          other tissue, e.g. artery/arterioles, glomerulus, capsule, medulla, or<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          artefacts that make it hard to label). </p>
                      </label>
                      <br/>
                      <label>
                        <input
                          name="label2"
                          type="radio"
                          value="TA+IF+Infl+-"
                          checked={this.state.selectedCond === "TA+IF+Infl+-"}
                          onChange={this.handleInputChange} />
                        <p style={{fontSize: 16, display: "inline"}}>
                          Cortex:  tubular atrophy  <span className="checkSpan" >✓</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          interstitial fibrosis <span className="checkSpan" >✓</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          infiltrates <span className="plusMinusSpan" >±</span>
                        </p>
                      </label>
                      <br />
                      <label>
                        <input
                          name="label3"
                          type="radio"
                          value="TA+IF-Infl+-"
                          checked={this.state.selectedCond === "TA+IF-Infl+-"}
                          onChange={this.handleInputChange} />
                        <p style={{fontSize: 16, display: "inline"}}>
                          Cortex:  tubular atrophy  <span className="checkSpan" >✓</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          interstitial fibrosis <span className="xSpan" >✘</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          infiltrates <span className="plusMinusSpan" >±</span>
                        </p>
                      </label>
                      <br />
                      <label>
                        <input
                          name="label4"
                          type="radio"
                          value="TA-IF+Infl+-"
                          checked={this.state.selectedCond === "TA-IF+Infl+-"}
                          onChange={this.handleInputChange} />
                        <p style={{fontSize: 16, display: "inline"}}>
                          Cortex:  tubular atrophy  <span className="xSpan" >✘</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          interstitial fibrosis <span className="checkSpan" >✓</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          infiltrates <span className="plusMinusSpan" >±</span>
                        </p>
                      </label>
                      <br />
                      <label>
                        <input
                          name="label5"
                          type="radio"
                          value="TA-IF-Infl+"
                          checked={this.state.selectedCond === "TA-IF-Infl+"}
                          onChange={this.handleInputChange} />
                        <p style={{fontSize: 16, display: "inline"}}>
                          Cortex:  tubular atrophy  <span className="xSpan" >✘</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          interstitial fibrosis <span className="xSpan" >✘</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          infiltrates <span className="plusSpan" >+</span>
                        </p>
                      </label>
                      <br />
                      <label>
                        <input
                          name="label6"
                          type="radio"
                          value="TA-IF-Infl-"
                          checked={this.state.selectedCond === "TA-IF-Infl-"}
                          onChange={this.handleInputChange} />
                        <p style={{fontSize: 16, display: "inline"}}>
                          Cortex:  tubular atrophy  <span className="xSpan" >✘</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          interstitial fibrosis <span className="xSpan" >✘</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          infiltrates <span className="minusSpan" >-</span>
                        </p>
                      </label>
                    </form>
                  </div>
                </div>
                <div className={"ButtonBar"}>
                  <Button  
                    className="PreviousButton"
                    variant="contained"
                    onClick={() => {window.Labelbox.setLabelAsCurrentAsset(this.state.previousAsset);}}
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
                    onClick={this.handleSubmitClick}
                  >
                    Submit
                  </Button>
                </div>
              </div>

              <LabelingUI 
                key={this.state.updateKey} 
                selectedCondition={this.state.selectedCond} 
                label={this.state.label} 
                data={this.state.data} 
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
