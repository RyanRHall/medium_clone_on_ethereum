import React, { Component } from "react";
import PropTypes from "prop-types";
import contract from "truffle-contract";
import { userAddress, web3 } from "../util/context";
import { camelCase, tryTo } from "../util/functions";
import { bindAll, omit } from "lodash";

class ContractComponent extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["connectContract"])
    // state
    this.state = {
      contracts: {}
    };
  }

  // Lifecycle Methods
  // componentWillMount() {
    // assertions
    // console.assert(this.props.children, "a single child component must be provided");
  // }

  // componentDidMount() {
  //   this.loadContract();
  //   this.runContractCallbacks(...arguments);
  // }

  // componentDidUpdate(prevProps, prevState) {
    // load contract if not yet loaded or if contract's address changes
  //   if(!this.state.contract || prevProps.address !== this.props.address) {
  //     this.loadContract();
  //   }
  //   this.runContractCallbacks(...arguments);
  // }

  // Connect Contract
  async connectContract(contractName, contractProperties={}) {
    if(!this.props.web3) { return; }
    // find contract file
    const fileName = contractProperties.fileName || contractName;
    const json = require(`../../build/contracts/${fileName}.json`);
    // create contact object
    const componentContractClass = contract(json);
    componentContractClass.setProvider(this.props.web3.currentProvider);
    // load contract by address or deployment
    const componentContract = contractProperties.address ? await componentContractClass.at(contractProperties.address) : await componentContractClass.deployed();
    // set event listeners
    for (let eventName in contractProperties.watch) {
      if (contractProperties.watch.hasOwnProperty(eventName)) {
        debugger
        this.state.contract[eventName]().watch(contractProperties.watch[eventName]);
      }
    }
    // set component's state with contract
    await this.setState({
      contracts: Object.assign({}, this.state.contracts, { [contractName]: componentContract })
    });
    tryTo(contractProperties, "ready");
  }

  // Set Contract Properties
  // setContractProperties(contractProperties) {
  //   console.assert(typeof(contractProperties) === "object");
  //   this.contractProperties = contractProperties;
  // }

  // Contract Callbacks
  // runContractCallbacks(prevProps={}, prevState={}) {
  //   // contract ready
  //   const contractReady = this.state.contract && this.state.contract !== prevState.contract
  //   const userReady = this.props.userAddress && this.props.userAddress !== prevProps.userAddress
  //   if(contractReady) {
  //     tryTo(this.eventListeners, "contractReady");
  //   }
  //   // user ready
  //   if(userReady) {
  //     tryTo(this.eventListeners, "userReady");
  //   }
  //   // user and contract ready
  //   if(this.state.contract && this.props.userAddress && (contractReady || userReady)) {
  //     tryTo(this.eventListeners, "userAndContractReady");
  //     this.setState({ ready: true });
  //   }
  // }

  // Event Listeners
  // setEventListeners(eventListeners) {
  //   console.assert(typeof(eventListeners) === "object");
  //   this.eventListeners = eventListeners;
  // }

  // startEventListeners() {
  //   for (let eventName in this.eventListeners) {
  //     if (this.eventListeners.hasOwnProperty(eventName)) {
  //       console.assert(typeof(eventName) === "string", "invalid event name");
  //       console.assert(typeof(this.eventListeners[eventName]) === "function", "invalid event listener");
  //       let callback = this.eventListeners[eventName];
  //       // setup listeners, but exclude "special" events
  //       if(!SPECIAL_EVENTS.includes(eventName)) {
  //         this.state.contract[eventName]().watch(callback);
  //       }
  //     }
  //   }
  // }

  // Magic!
  render(){
    const props = omit(this.props, ["children"]);
    return React.cloneElement(
      this.props.children,
      {
        ...props,
        contracts: this.state.contracts,
        connectContract: this.connectContract
      }
    );
  }

}

// ContractComponent.propTypes = {
//   address: PropTypes.string,
//   deployed: PropTypes.bool
// }

// ContractComponent.defaultProps = {
//   deployed: false
// }

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
