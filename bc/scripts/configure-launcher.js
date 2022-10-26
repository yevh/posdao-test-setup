const fs = require('fs');
const os = require('os');
const calcNumberOfValidators = require('./calc-validators-number.js');
const constants = require('../../utils/constants');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8641');

async function main() {
  const contractsDir = `${__dirname}/../contracts`;
  const launcherDir = `${__dirname}/../launcher`;
  const depositScriptDir = `${__dirname}/../deposit-script`;

  // Add host.docker.internal to docker-compose.yml for Linux
  if (os.platform() === 'linux') {
    const dockerComposeYmlPath = `${launcherDir}/docker-compose.yml`;
    let dockerComposeYmlContent = fs.readFileSync(dockerComposeYmlPath, 'utf8');
    dockerComposeYmlContent = dockerComposeYmlContent.replace('node0:', `node0:
    extra_hosts:
      - "host.docker.internal:host-gateway"`);
    dockerComposeYmlContent = dockerComposeYmlContent.replace('node1:', `node1:
    extra_hosts:
      - "host.docker.internal:host-gateway"`);
    dockerComposeYmlContent = dockerComposeYmlContent.replace('node2:', `node2:
    extra_hosts:
      - "host.docker.internal:host-gateway"`);
    dockerComposeYmlContent = dockerComposeYmlContent.replace('node3:', `node3:
    extra_hosts:
      - "host.docker.internal:host-gateway"`);
    fs.writeFileSync(dockerComposeYmlPath, dockerComposeYmlContent, 'utf8');
  }

  // Create launcher/config/deploy_block.txt
  const deployBlock = fs.readFileSync(`${contractsDir}/deploy_block.txt`, 'utf8');
  fs.writeFileSync(`${launcherDir}/config/deploy_block.txt`, deployBlock, 'utf8');

  // Modify launcher/config/config.yaml
  const configYamlPath = `${launcherDir}/config/config.yaml`;
  const numberOfValidators = calcNumberOfValidators();
  const chainId = await web3.eth.getChainId();
  const netId = await web3.eth.net.getId();
  const depositContractAddress = fs.readFileSync(`${contractsDir}/deposit_contract_address.txt`, 'utf8');
  let configYamlContent = fs.readFileSync(configYamlPath, 'utf8');
  configYamlContent = configYamlContent.replace(/DEPOSIT_CONTRACT_ADDRESS: [a-fA-F0-9x]+/, `DEPOSIT_CONTRACT_ADDRESS: ${depositContractAddress}`);
  configYamlContent = configYamlContent.replace(/DEPOSIT_CHAIN_ID: [a-fA-F0-9x]+/, `DEPOSIT_CHAIN_ID: ${chainId}`);
  configYamlContent = configYamlContent.replace(/DEPOSIT_NETWORK_ID: [a-fA-F0-9x]+/, `DEPOSIT_NETWORK_ID: ${netId}`);
  configYamlContent = configYamlContent.replace(/MIN_GENESIS_ACTIVE_VALIDATOR_COUNT: [a-fA-F0-9x]+/, `MIN_GENESIS_ACTIVE_VALIDATOR_COUNT: ${numberOfValidators}`);
  configYamlContent = configYamlContent.replace(/GENESIS_FORK_VERSION: [a-fA-F0-9x]+/, `GENESIS_FORK_VERSION: ${web3.utils.padLeft(web3.utils.toHex(chainId), 8)}`);
  configYamlContent = configYamlContent.replace(/ALTAIR_FORK_VERSION: [a-fA-F0-9x]+/, `ALTAIR_FORK_VERSION: ${web3.utils.padLeft(web3.utils.toHex(chainId + 0x01000000), 8)}`);
  configYamlContent = configYamlContent.replace(/BELLATRIX_FORK_VERSION: [a-fA-F0-9x]+/, `BELLATRIX_FORK_VERSION: ${web3.utils.padLeft(web3.utils.toHex(chainId + 0x02000000), 8)}`);
  fs.writeFileSync(configYamlPath, configYamlContent, 'utf8');

  // Create key file in launcher/node0_db/beacon/network directory
  const node0NetworkDir = `${launcherDir}/node0_db/beacon/network`;
  fs.mkdirSync(node0NetworkDir, { recursive: true });
  fs.writeFileSync(`${node0NetworkDir}/key`, Buffer.from('266786bc28821f83f635095e28a308bf8d34da3596c52fd9f6889bf0d173293f', 'hex'), 'binary');
  // Peer id: 16Uiu2HAmJ7CvpzYR2QYWr3YTQBfeeYCqFVP3Ugm3XmSurG4WJzyC

  // Create key file in launcher/node1_db/beacon/network directory
  const node1NetworkDir = `${launcherDir}/node1_db/beacon/network`;
  fs.mkdirSync(node1NetworkDir, { recursive: true });
  fs.writeFileSync(`${node1NetworkDir}/key`, Buffer.from('a970f0c1a3ffbcc38a88e985f68c3f9eff52cfb3cf876ddce5ec65ce22c4d0d3', 'hex'), 'binary');
  // Peer id: 16Uiu2HAmN5seNB3AYkTo4qRC3oWsPTEGiR68w5suCcuqG3pSf4Ze

  // Create key file in launcher/node2_db/beacon/network directory
  const node2NetworkDir = `${launcherDir}/node2_db/beacon/network`;
  fs.mkdirSync(node2NetworkDir, { recursive: true });
  fs.writeFileSync(`${node2NetworkDir}/key`, Buffer.from('c00282b91d8eec3e4dbd7e7f51662f0bc540dff8e71ac862c80aa2c7f676be82', 'hex'), 'binary');
  // Peer id: 16Uiu2HAmLCN7qTEBuknCa6R7thyTdUjALjYTpkSsrHhq3FKEL5q9

  // Create key file in launcher/node3_db/beacon/network directory
  const node3NetworkDir = `${launcherDir}/node3_db/beacon/network`;
  fs.mkdirSync(node3NetworkDir, { recursive: true });
  fs.writeFileSync(`${node3NetworkDir}/key`, Buffer.from('e76212c4028caed5aaba9f4b4414da1996881858f9858cf95df4cfd0fbf42e55', 'hex'), 'binary');
  // Peer id: 16Uiu2HAm5xMT8ZbN2az5ozTXqmV1JxNh8CM9CkP9BHkPhGAJZMth

  // Create deposit-script/.env
  const localhost = os.platform() === 'darwin' ? 'host.docker.internal' : 'localhost';
  const ownerKeystoreJson = require(`${__dirname}/../../accounts/keystore/${web3.utils.stripHexPrefix(constants.OWNER)}.json`);
  const ownerKeystorePassword = fs.readFileSync(`${__dirname}/../../config/password`, 'utf8').trim();
  const ownerPrivateKey = web3.eth.accounts.decrypt(ownerKeystoreJson, ownerKeystorePassword).privateKey;
  const tokenContractAddress = fs.readFileSync(`${contractsDir}/token_contract_address.txt`, 'utf8');
  fs.mkdirSync(depositScriptDir);
  dotEnvContent = `
STAKING_ACCOUNT_PRIVATE_KEY=${ownerPrivateKey}
RPC_URL=http://${localhost}:8640
GAS_PRICE=0
BATCH_SIZE=64
N=${numberOfValidators}
OFFSET=0
META_TOKEN_ADDRESS=${tokenContractAddress}
DEPOSIT_CONTRACT_ADDRESS=${depositContractAddress}
START_BLOCK_NUMBER=${deployBlock}
  `;
  fs.writeFileSync(`${depositScriptDir}/.env`, dotEnvContent.trim(), 'utf8');

  // Copy deposit_data*.json file
  const validatorKeysPath = `${launcherDir}/keys/validator_keys`;
  const validatorKeysList = fs.readdirSync(validatorKeysPath);
  const depositDataFile = validatorKeysList.find(item => {
    return item.match(/deposit_data.*\.json/ig);
  });
  fs.copyFileSync(`${validatorKeysPath}/${depositDataFile}`, `${depositScriptDir}/deposit_data.json`);
}

main();
