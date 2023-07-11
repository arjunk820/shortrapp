import React from "react";
import { nanoid } from "nanoid"; // for url ids
import { getDatabase, child, ref, set, get } from "firebase/database"; // db
import { isWebUri } from "valid-url"; // import to check valid URL
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip"; // "Copied! " message

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      longURL: "", // stores the original url
      preferedAlias: "", // whatever the user wants the url to be
      generatedURL: "", // stores shortened url
      loading: false, // shows state of communication to db (to user)
      errors: [], // tracks fields with errors
      errorMessage: {}, // tracks message for each error
      toolTipMessage: "Copy To Clip Board", // changes to "Copied!"
    };
  }

  // when user clicks submit
  onSubmit = async (event) => {
    event.preventDefault(); // Prevents the page from reloading
    this.setState({
      loading: true,
      generatedURL: "",
    })
    // confirm the input the user has sumbitted is valid (func below)
    var isFormValid = await this.validateInput();
    if (!isFormValid) {
      return
    }

    // change the url later on (once using heroku)
    var generatedKey = nanoid(5);
    var generatedURL = "shortrapp.com/" + generatedKey;

    // use alias if given. otherwise generate
    if (this.state.preferedAlias !== "") {
      generatedKey = this.state.preferedAlias;
      generatedURL = "shortrapp.com/" + this.state.preferedAlias;
    }

    const db = getDatabase(); // ref to firebase
    set(ref(db, "/" + generatedKey), {
      // write data to the db
      generatedKey: generatedKey,
      longURL: this.state.longURL,
      preferedAlias: this.state.preferedAlias,
      generatedURL: generatedURL,
    })
      .then((result) => {
        // everything is good
        this.setState({
          generatedURL: generatedURL,
          loading: false,
        });
      })
      .catch((e) => {
        // handle errors
      })
  };

  hasError = (key) => {
    // helper func to check for an error
    return this.state.errors.indexOf(key) !== -1;
  }

  handleChange = (e) => {
    // helper func: autosaves id of field
    const { id, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  validateInput = async () => {
    var errors = [];
    var errorMessages = this.state.errorMessage;

    if (this.state.longURL.length === 0) {
      // validates valid url
      errors.push("longURL");
      errorMessages["longURL"] = "Please enter your URL!";
    } else if (!isWebUri(this.state.longURL)) {
      errors.push("longURL");
      errorMessages["longURL"] = "Please a URL in the form of https://www....";
    }

    // preferred alias case
    // check if length of alias is less than 7 chars
    if (this.state.preferedAlias !== "") {
      if (this.state.preferedAlias.length > 7) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "Please Enter an Alias less than 7 Characters";
      } else if (this.state.preferedAlias.indexOf(" ") >= 0) {
        // spaces not allowed
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] = "Spaces are not allowed in URLS";
      }

      var keyExists = await this.checkKeyExists();

      // if alias already exists
      if (keyExists.exists()) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "The Alias you have entered already exists! Use a different one.";
      }
    }
    this.setState({
      errors: errors,
      errorMessages: errorMessages,
      loading: false,
    });
    if (errors.length > 0) {
      // if errors occurred
      return false;
    }
    return true;
  }

  checkKeyExists = async () => {
    // checks if the key user gives exists or not
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((error) => {
      return false;
    });
  }

  copyToClipBoard = () => {
    // tooltip message to copy new url
    navigator.clipboard.writeText(this.state.generatedURL);
    this.setState({
      toolTipMessage: "Copied!",
    });
  }
  
  render() {
    return (
      <div className="container">
        <form autoComplete="off">
          <h3>Make Your Link Shortr!</h3>
          <div className="form-group">
            <label>Enter URL</label>
            <input
              id="longURL"
              onChange={this.handleChange}
              value={this.state.longURL}
              type="url"
              required
              className={
                this.hasError("longURL")
                  ? "form-control is-invalid"
                  : "form-control"
              }
              placeholder="https://www..." // grayed out when field is empty
            />
          </div>
          <div
            className={ // hidden if no error
              this.hasError("longURL") ? "text-danger" : "visually-hidden"
            }
          >
            {this.state.errorMessage.longURL}
          </div>

          <div className="form-group">
            <label htmlFor="basic-url">Your Mini URL</label>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">shortrapp.com/</span>
              </div>
              <input
                id="preferedAlias"
                onChange={this.handleChange}
                value={this.state.preferedAlias}
                className={
                  this.hasError("preferedAlias")
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
                placeholder="eg. 3fwias (Optional)" // alias field code above
              />
            </div>
            <div
              className={ // if alias field has an error (otherwise hidden)
                this.hasError("suggestedAlias")
                  ? "text-danger"
                  : "visually-hidden"
              }
            >
              {this.state.errorMessage.suggestedAlias}
            </div>
          </div>

          <button
            className="btn btn-primary" // button
            type="button"
            onClick={this.onSubmit} // calls submit if button is clicked
          >
            {this.state.loading ? ( /* spinner for loading, button for not */
              <div>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </div>
            ) : (
              <div>
                <span
                  className="visually-hidden spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Shortr!</span>
              </div>
            )}
          </button>

          {this.state.generatedURL === "" ? (
            <div></div>
          ) : (
            <div className="generatedurl">
              <span>Your shortr url is: </span>
              <div className="input-group mb-3">
                <input
                  disabled
                  type="text"
                  value={this.state.generatedURL}
                  className="form-control"
                  placeholder="Recipient's username"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <OverlayTrigger
                    key={"top"}
                    placement={"top"}
                    overlay={
                      <Tooltip id={`tooltip-${"top"}`}>
                        {this.state.toolTipMessage}
                      </Tooltip>
                    }
                  >
                    <button
                      onClick={() => this.copyToClipBoard()} // "Copied!" msg
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top"
                      className="btn btn-outline-secondary"
                      type="button"
                    >
                      Copy
                    </button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default Form;