import React, { Component } from "react";
// import PropTypes from "prop-types";
import contract from "truffle-contract";
import { userAddress, userProfile } from "../util/context";
import { tryTo } from "../util/functions";
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

  // Connect Contract
  async connectContract(contractName, contractProperties={}) {
    // find contract file
    const fileName = contractProperties.fileName || contractName;
    const json = require(`../../build/contracts/${fileName}.json`);
    // create contact object
    const componentContractClass = contract(json);
    componentContractClass.setProvider(window.web3.currentProvider);
    // load contract by address or deployment
    const componentContract = contractProperties.address ? await componentContractClass.at(contractProperties.address) : await componentContractClass.deployed();
    // set event listeners
    for (let eventName in contractProperties.watch) {
      if (contractProperties.watch.hasOwnProperty(eventName)) {
        // debugger
        componentContract[eventName]().watch(contractProperties.watch[eventName]);
      }
    }
    // set component's state with contract
    await this.setState({
      contracts: Object.assign({}, this.state.contracts, { [contractName]: componentContract })
    });
    tryTo(contractProperties, "ready");
  }

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

const connectToContract = Component => props => {
  return (
    <userAddress.Consumer>
      {
        userAddress =>
          <userProfile.Consumer>
            {
              userProfile =>
                <ContractComponent {...props} userAddress={userAddress} userProfile={userProfile}>
                  <Component/>
                </ContractComponent>
            }
          </userProfile.Consumer>
      }
    </userAddress.Consumer>
  );
}

export default connectToContract;
