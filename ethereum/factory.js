import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x4dF92f6a173442614C2fBD71A6818f9D7C164C98'
);

export default instance;