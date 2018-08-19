import React, { Component } from "react";
import PropTypes from "prop-types";
import contract from "truffle-contract";
import { userAddress, web3 } from "../util/context";
import { camelCase, tryTo } from "../util/functions";
import { bindAll, omit } from "lodash";

const SPECIAL_EVENTS = [
  "contractReady",
  "userReady",
  "userAndContractReady"
];

class ContractComponent extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["setContractProperties", "setEventListeners"])
    // prop assertions
    console.assert((this.props.deployed !== !!this.props.address), "a contract can only be deployed or provided an address, but not both");
    console.assert(this.props.deployed || this.props.address, "an address or deployment key must be provided");
    console.assert(props.children, "a single child component must be provided");
    // state
    this.state = {
      contract: null
    };
    // contract properties
    this.contractProperties = {};
    // event listeners
    this.eventListeners = {};
  }

  // Lifecycle Methods
  componentDidMount() {
    this.loadContract();
    this.runContractCallbacks(...arguments);
  }

  componentDidUpdate(prevProps, prevState) {
    // load contract if not yet loaded or if contract's address changes
    if(!this.state.contract || prevProps.address !== this.props.address) {
      this.loadContract();
    }
    this.runContractCallbacks(...arguments);
  }

  // Load Contract
  async loadContract() {
    if(!this.props.web3) { return; }
    // find contract file
    const contractName = camelCase(this.contractProperties.name || this.props.children.type.name);
    const json = require(`../../build/contracts/${contractName}.json`);
    // create contact object
    const componentContractClass = contract(json);
    componentContractClass.setProvider(this.props.web3.currentProvider);
    // load contract by address or deployment
    const componentContract = this.props.deployed ? await componentContractClass.deployed() : await componentContractClass.at(this.props.address);
    // set component's state with contract
    this.setState({ contract: componentContract });
    // start event listers
    this.startEventListeners();
  }

  // Set Contract Properties
  setContractProperties(contractProperties) {
    console.assert(typeof(contractProperties) === "object");
    this.contractProperties = contractProperties;
  }

  // Contract Callbacks
  runContractCallbacks(prevProps={}, prevState={}) {
    // contract ready
    const contractReady = this.state.contract && this.state.contract !== prevState.contract
    const userReady = this.props.userAddress && this.props.userAddress !== prevProps.userAddress
    if(contractReady) {
      tryTo(this.eventListeners, "contractReady");
    }
    // user ready
    if(userReady) {
      tryTo(this.eventListeners, "userReady");
    }
    // user and contract ready
    if(this.state.contract && this.props.userAddress && (contractReady || userReady)) {
      tryTo(this.eventListeners, "userAndContractReady");
    }
  }

  // Event Listeners
  setEventListeners(eventListeners) {
    console.assert(typeof(eventListeners) === "object");
    this.eventListeners = eventListeners;
  }

  startEventListeners() {
    for (let eventName in this.eventListeners) {
      if (this.eventListeners.hasOwnProperty(eventName)) {
        console.assert(typeof(eventName) === "string", "invalid event name");
        console.assert(typeof(this.eventListeners[eventName]) === "function", "invalid event listener");
        let callback = this.eventListeners[eventName];
        // setup listeners, but exclude "special" events
        if(!SPECIAL_EVENTS.includes(eventName)) {
          this.state.contract[eventName]().watch(callback);
        }
      }
    }
  }

  // Magic!
  render(){
    const props = omit(this.props, ["address", "children"]);
    return React.cloneElement(
      this.props.children,
      {
        ...props,
        contract: this.state.contract,
        setContractProperties: this.setContractProperties,
        setContractListeners: this.setContractListeners,
        setEventListeners: this.setEventListeners,
      }
    );
  }

}

ContractComponent.propTypes = {
  address: PropTypes.string,
  deployed: PropTypes.bool
}

ContractComponent.defaultProps = {
  deployed: false
}

const connectToContract = Component => props => {
  return (
    <web3.Consumer>
      {
        web3 =>
          <userAddress.Consumer>
            {
              userAddress =>
                <ContractComponent {...props} userAddress={userAddress} web3={web3}>
                  <Component/>
                </ContractComponent>
            }
          </userAddress.Consumer>
      }
    </web3.Consumer>
  );
}

export default connectToContract;
