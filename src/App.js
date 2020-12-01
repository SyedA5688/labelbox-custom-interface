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
                      label: { "MES": "000000000", "SUBEND": "000000000", "SUBEPI": "000000000", "TUB": "000000000", "TRAN": "000000000" }, 
                      selectedCond: "", updateKey: Math.random()};

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
        this.setState({ label: { "MES": "000000000", "SUBEND": "000000000", "SUBEPI": "000000000", "TUB": "000000000", "TRAN": "000000000" }, updateKey: Math.random() });
      else if (asset.label === "Skip")
        this.setState({ label: { "MES": "000000000", "SUBEND": "000000000", "SUBEPI": "000000000", "TUB": "000000000", "TRAN": "000000000" }, updateKey: Math.random() }); // set to "Skip"?
      else
        this.setState({ label: JSON.parse(asset.label), updateKey: Math.random() });


      //console.log(asset.label);
    });
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
                      1. If the image cannot be labeled (e.g. no deposits, no tissue, noise, inconclusive, etc.) please 
                      select the "<span style={{color: "red", textDecoration: "underline"}} >Skip</span>" button at the bottom of the panel.
                    </p>
                    <p>
                      2. Otherwise, select label category from "Labels" list below.
                    </p>
                    <p>
                      3. Once selected, double click tiles that are positive for the selected label. Feedback will appear on the right panel. 
                      To deselect a tile, double click it again.
                    </p>
                    <p>
                      4. Repeat process for all labels that are applicable to the image.
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
                      *Warning: Moving mouse while double-clicking leads to weird behavior
                    </p>
                    <p className="warning" >
                      *Warning: Safari may render images incorrectly, use google chrome for best results
                    </p>
                    {/* <p>{JSON.stringify(this.state.label)}</p> */}
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
                    onClick={() => this.next({label: this.state.label})} /* console.log(JSON.stringify(this.state.label)) */
                  >
                    Submit
                  </Button>
                </div>
              </div>
              
              <LabelingUI key={this.state.updateKey} selectedCondition={this.state.selectedCond} label={this.state.label} data={this.state.data} onLabelUpdate={(label) => this.setState({...this.state, label})} />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
