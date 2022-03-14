const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts; // list of all the different account on ganache network
let factory; // reference to the deployed instace of the factory
let campaignAddress;
let campaign;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0],gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });
    // getting the address that the contract is deployed to 

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    /** alternative
     *    const addresses = await factory.methods.getDeployedCampaigns().call();
          campaignAddress = addresses[0]
     */

    // creating the instance of the campaign, 
    // instructing web3 to create a JS representation of the contract
    campaign = await new web3.eth.Contract(   
        JSON.parse(compiledCampaign.interface),
        campaignAddress // already deployed address
    );
});

describe('Campaigns', ()=>{
    it('deploys a factory and a campaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager',async ()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);
    });

    it('allows people to contribute money and marks them as approvers', async ()=>{
        await campaign.methods.contribute().send({
            value:'200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });
    it('requires a minimum contribution', async () =>{
        try{
            await campaign.methods.contribute().send({value:'5',from: accounts[1]});    
        }catch(error){
            assert(error);
            return;
        }
        assert(false);
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
          .createRequest('Buy batteries', '100', accounts[1])
          .send({
            from: accounts[0],
            gas: '1000000',
          });
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries', request.description);
        assert.equal('100', request.value);
        assert.equal(accounts[1], request.recipient);
      });

      it('processes request',async ()=>{ 
        // contributed and marked account[0] as a contributor
        await campaign.methods.contribute().send({
            from:accounts[0],
            value: web3.utils.toWei('10','ether')
        });
        // creating a request to send ethr to an account
        await campaign.methods
            .createRequest('A',web3.utils.toWei('5','ether'),accounts[1])
            .send({from: accounts[0],gas:'1000000'});

        // Approvig the request
        await campaign.methods.approveRequest(0).send({from: accounts[0],gas:'1000000'});
        // Should send mones to accounts[1]
        await campaign.methods.finalizeRequest(0).send({from: accounts[0],gas:'1000000'});

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);

        assert(balance > 104);

      });

      // someone who is not a manager approving the request
      // finalize a request without approving it


});