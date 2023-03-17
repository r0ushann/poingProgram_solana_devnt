import web3 = require("@solana/web3.js");
import Dotenv from "dotenv";
Dotenv.config();

//we know the address of the program we are calling
// we also knows the program writes data to a separate account of known address
const PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PROGRAM_DATA_ADDRESS = "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";

async function main() {
    //const newKeypair = web3.Keypair.generate();
    //console.log(newKeypair.secretKey.toString());
    
    //use the initializeKeypair() function to make a connection with the solana Devnet
    const payer = initializeKeypair();
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

    //AirDrop code
    await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL * 1);    
    // calling pingProgram function
    await pingProgram(connection , payer);
  
}


async function pingProgram (connection: web3.Connection, payer: web3.Keypair){
//create a transaction
//create an instruction
//add the instruction to the transaction
// send the transaction
const transaction = new web3.Transaction();

const programId = new web3.PublicKey(PROGRAM_ADDRESS);
const programDataPubkey = new web3.PublicKey(PROGRAM_DATA_ADDRESS);


//instructions part
const instruction = new web3.TransactionInstruction({
    keys: [
        {
            pubkey: programDataPubkey,
            isSigner:false,
            isWritable:true,
        },
    ],
    programId,
});

transaction.add(instruction);

const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer],
)

console.log(
    `You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );
}


//function to initialize keypair from .env file and convert into uint8 array parsed as number
function initializeKeypair():web3.Keypair{
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
    const secretKey = Uint8Array.from(secret);
    //use Keypair method to use the generted secretKey and parse as a new variable
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
    return keypairFromSecretKey;
}

main()
.then(() => {
    console.log("\nFinished Successfully!");
})
.catch((error) => {
    console.error(error);
})