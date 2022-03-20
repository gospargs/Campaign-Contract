import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import LayoutComponent from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {Router} from '../../routes';
// Router - allows ous to programaticly redirect people from one page to another
class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault(); // prevents the browser to submit the form
    this.setState({loading: true, errorMessage:''});
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          // calling this function from browser we dont need to specify gas
          from: accounts[0],
        });

    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({loading: false});
  };

  render() {
    return (
      <LayoutComponent>
        <h1>Create a Campaign</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}> 
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              } // setting minimumContribution with what the user entered
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>Create!</Button>
        </Form>
      </LayoutComponent>
    );
  }
}

export default CampaignNew;
