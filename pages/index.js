import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import LayoutComponent from "../components/Layout";
import { Link } from "../routes";
class CampaignIndex extends Component {
  // Provided by next js, executes before index.html is rendered
  static async getInitialProps() {
    // using static so we dont neet to render the component
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  renderCampaign() {
    const items = this.props.campaigns.map((address) => {
      // iterrating over the list fo campaigns - passing function into map and the function gets called once for every item in the array, everythig return from the function i returned to items
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }

  // main
  render() {
    return (
      <LayoutComponent>
        <div>
          <h3>Open Campaigns</h3>

          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add"
                primary
              />
            </a>
          </Link>
          {this.renderCampaign()}
        </div>
      </LayoutComponent>
    );
  }
}

export default CampaignIndex; // nextJS expects export of a component
