require('dotenv').config()
const Web3c = require('../index.js')

const sendTx = async (web3c, from, to, amount, n) => {
    const gasPrices = { low: 2.1, medium: 2.1, high: 5 }

    const tx = {
        from,
        to,
        value: `${web3c.toHex(web3c.toWei(amount, 'cpher'))}`,
        gas: "21000",
        gasPrice: `${gasPrices.low * 1000000000}`, // converts the gwei price to wei
        data: "",
        nonce: n
    }

    await web3c.cph.sendTransaction(tx)
}

const fillRange = (start, end) => {
    return Array(end - start + 1).fill().map((item, index) => start + index);
};

const sendTxns = async (web3c, from, to, amount, start, number) => {
    const nonceArray = fillRange(start, start + number - 1)

    const results = await Promise.all(nonceArray.map(async (nonce) => {
        try {
            const result = await sendTx(web3c, from, to, amount, nonce);
            return result
        }
        catch (e) {
            console.log(`rejected nonce: ${nonce}`)
            return ""
        }
    }))

    return results
}

const sendTxns2 = async (web3c, from, to, amount, start, number) => {
    const nonceArray = fillRange(start, start + number - 1)

    const results = await Promise.all(nonceArray.map( (nonce) => {
        return sendTx(web3c, from, to, amount, nonce).catch(x=> {
            console.log(`rejected nonce: ${nonce}`)
        })
    }))

    return results
}

const sendTxns3 =  (web3c, from, to, amount, start, number) => {
    const nonceArray = fillRange(start, start + number - 1)

    Promise.all(nonceArray.map( (nonce) => {
        return sendTx(web3c, from, to, amount, nonce).catch(x=> {
            console.log(`rejected nonce: ${nonce}`)
        })
    })).then(console.log)
}

const showAccountAndBalance = async (web3c) => {
    let accounts = web3c.cph.accounts

    let balance = accounts.map((account) => {
            return {
                account,
                balance: web3c.fromWei(web3c.cph.getBalance(account).toNumber(), 'cpher')
            }
        }
    )

    console.log(balance)
    return accounts
}

const testInfuraRopsten = async () => {
    const infuraNode = `https://ropsten.infura.io/v3/638870a23d564b2d9fe055da331dc720`

    const web3c = new Web3c( new Web3c.providers.HttpProvider(infuraNode) )
    if(!web3c.isConnected()){
        throw new Error('unable to connect to cypherium node at ' + infuraNode)
    }

    const latest = await web3c.cph.blockNumber
    const txCount = await web3c.cph.getBlockTransactionCount(latest)

    console.log(`Latest block number is ${latest}, contains ${txCount} transactions`)

    const latestBlock = await web3c.cph.getBlock(latest, true)

    console.log(`Latest block is ${JSON.stringify(latestBlock)}`)
}
const testTransaction = async () => {
    const accounts = [
        {//0
            addr: '0xc373f00f6b81cfe6257ef661f12bc00df57b30d7',
            node: 'http://192.168.31.60:8200'
        },
        {//1
            addr: '0x4363fb6247b8ed3be7cff4369908a5fc22a1d4a4',
            node: 'http://192.168.31.60:8200'
        },
        {//2
            addr: '0x30b92ec559efe381f42a74ca4e64207642e8951c',
            node: 'http://192.168.31.60:8200'
        },
        {//3
            addr: '0x6544105298f60c08bf46ce5f9c198c82755a200f',
            node: 'http://192.168.31.60:8100'
        },
        {//4
            addr: '0x5aefbf1a3d4252c1e0b76eec62025b3635420340',
            node: 'http://127.0.0.1:8545'
        },
        {//5
            addr: '0xa922c62ca7fceff103d6c02be266b538911c07d3',
            node: 'http://127.0.0.1:8545'
        },
    ]

    const fromIndex = parseInt(process.argv[3] || '0', 10)
    const toIndex = parseInt(process.argv[4] || '1', 10)

    const from = accounts[fromIndex].addr
    const to = accounts[toIndex].addr

    const node = accounts[fromIndex].node
    const web3c = new Web3c( new Web3c.providers.HttpProvider(node) )
    if(!web3c.isConnected()){
        throw new Error('unable to connect to cypherium node at ' + node)
    }

    const nonce = await web3c.cph.getTransactionCount(from)
    console.log(`nonce start from ${nonce}`)

    await web3c.personal.unlockAccount(from, "1", 10000)

    const numberOfTxs = 100
    for( startNonce = nonce; startNonce < nonce + 1000 - 1; startNonce++){

        await sendTxns(web3c, from, to, 0.01, startNonce, numberOfTxs)
        console.log(`Sent out 100 transactions starting from ${startNonce}`)

        startNonce += numberOfTxs
    }
}

const listAccount = async () => {
    // const node = `http://192.168.31.${process.argv[3]}`
    // const node = `http://192.168.31.116:8200`
    const node =`http://127.0.0.1:8545`

    const web3c = new Web3c( new Web3c.providers.HttpProvider(node) )

    if(!web3c.isConnected()){
        throw new Error('unable to connect to cypherium node at ' + node)
    }
    await showAccountAndBalance(web3c)
}

const testBatch = async () => {
    const accounts = [
        {
            addr: '0x5aefbf1a3d4252c1e0b76eec62025b3635420340',
            node: 'http://127.0.0.1:8545'
        },
        {
            addr: '0xa922c62ca7fceff103d6c02be266b538911c07d3',
            node: 'http://127.0.0.1:8545'
        },
        {
            addr: '0xddedaea15f0a5c9e7da695cf20f0d3185cb43954',
            node: 'http://192.168.31.116:8100'
        },
        {
            addr: '0x7f1bee43026886917fb9469c8dadbe3c7c89eec8',
            node: 'http://192.168.31.116:8800'
        },
        {
            addr: '0x9ca20d11994ce8e54a2d08d4d5e38ca68a4697d0',
            node: 'http://192.168.31.60:8200'
        },
        {
            addr: '0x9ade2b2f05ea5b2e9038a9bf300e15a782855286',
            node: 'http://192.168.31.60:8100'
        },
    ]

    const fromIndex = parseInt(process.argv[3] || '0', 10)
    const toIndex = parseInt(process.argv[4] || '1', 10)

    const numberToSend = parseInt(process.argv[5] || '10', 10)

    const from = accounts[fromIndex].addr
    const to = accounts[toIndex].addr

    const node = accounts[fromIndex].node
    const web3c = new Web3c( new Web3c.providers.HttpProvider(node) )
    if(!web3c.isConnected()){
        throw new Error('unable to connect to cypherium node at ' + node)
    }

    const nonce = await web3c.cph.getTransactionCount(from)
    console.log(`nonce start from ${nonce}`)

    await web3c.personal.unlockAccount(from, "1", 10000)

    const numberOfTxs = 100
    const gasPrices = { low: 2.1, medium: 2.1, high: 5 }

    const tx = {
        from,
        to,
        value: `${web3c.toHex(web3c.toWei(0.01, 'cpher'))}`,
        gas: "21000",
        gasPrice: `${gasPrices.low * 1000000000}`, // converts the gwei price to wei
        data: "",
        nonce
    }

    // { from: '0x5aefbf1a3d4252c1e0b76eec62025b3635420340',
    //     to: '0xa922c62ca7fceff103d6c02be266b538911c07d3',
    //     value: '0x2386f26fc10000',
    //     gas: '21000',
    //     gasPrice: '2100000000',
    //     data: '',
    //     nonce: 9908 }
    //
    // console.log(tx)

    await web3c.cph.batchTransaction(tx, numberToSend)

    console.log('sent out')
}

// node index.js auto start 0 1
const testAutoTransaction = async () => {
    const accounts = [
        {
            addr: '0x5aefbf1a3d4252c1e0b76eec62025b3635420340',
            node: 'http://127.0.0.1:8545'
        },
        {
            addr: '0xa922c62ca7fceff103d6c02be266b538911c07d3',
            node: 'http://127.0.0.1:8545'
        },
        {
            addr: '0xddedaea15f0a5c9e7da695cf20f0d3185cb43954',
            node: 'http://192.168.31.116:8100'
        },
        {
            addr: '0x7f1bee43026886917fb9469c8dadbe3c7c89eec8',
            node: 'http://192.168.31.116:8800'
        },
        {
            addr: '0x9ca20d11994ce8e54a2d08d4d5e38ca68a4697d0',
            node: 'http://192.168.31.60:8200'
        },
        {
            addr: '0x9ade2b2f05ea5b2e9038a9bf300e15a782855286',
            node: 'http://192.168.31.60:8100'
        },
    ]

    let run
    if ( process.argv[3] === 'start' ) {
        run = 1
    }
    else if ( process.argv[3] === 'stop' ){
        run = 0
    }
    else {
        return
    }

    const fromIndex = parseInt(process.argv[4] || '0', 10)
    const toIndex = parseInt(process.argv[5] || '1', 10)

    const from = accounts[fromIndex].addr
    const to = accounts[toIndex].addr

    const node = accounts[fromIndex].node
    const web3c = new Web3c( new Web3c.providers.HttpProvider(node) )
    if(!web3c.isConnected()){
        throw new Error('unable to connect to cypherium node at ' + node)
    }

    await web3c.personal.unlockAccount(from, "1", 0)     // until cpher exits

    const result = await web3c.cph.autoTransaction(run, from, to)
    console.log(result)
}

switch(process.argv[2]){
    case 'list':
        listAccount()
        break;
    case 'tx':
        testTransaction()
        break;
    case 'infura':
        testInfuraRopsten()
        break;
    case 'batch':
        testBatch()
        break;
    case 'auto':
        testAutoTransaction()
        break;
    default:
        break;
}
