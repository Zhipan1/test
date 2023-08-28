import * as React from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from 'wagmi'

import appConfigs from '../configs.tsx'

import ContractAbi from "./abi.ts";
import { decodeAbiParameters } from 'viem';


const proof = {"merkle_root":"0x2bce521c4b0243bf7104ebd912b92f6773374fe8a4b17099d1ef928e95a32407","nullifier_hash":"0x24c846a2ed4a1b9b05df40502fb0cb43a50379c0186d1d09e615394cb571cc8d","proof":"0x19c6a62778643208c5f9c5eaaf5c7bd93a8a6a63366d8aa9416cfa6253f122011218b30b44789ed9ea8b5ee7abd82415fcc63ce4a3ecaf40412231b09f39508124069cd0667998d2d9a708ea0ede054ef49ea02dfd8496bb0c60d78e98f2f6a90863045dd30e7dfe3d5f73c604d27b71914eb3f89aaa63a023426dcd6b6ab5dc1806b274c9566e1185d71df2eedb9f6bac5f85845f6fd88bd71a4a92746d903b2b7982babf8e8f988b96cfd5d93fd4d9313efe1e5ace995fbdded64fedd2829a08df16f4568a499549abd9dd179ffcc5e37d41f65eaa0f5fd15c852a91d348be1696ca58510485865fed48a03874294e27f22a2eb184f9a37b07959c1bea7f86","credential_type":"orb"}

export default function MintNFT() {
  const { address: claimingWalletAddress } = useAccount();

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: appConfigs.AIRDROP_CONTRACT_ADDRESS,
    abi: ContractAbi,
    functionName: 'verifyAndExecute',
    args: [
        claimingWalletAddress!,
        decodeAbiParameters<[{ type: "uint256" }]>(
          [{ type: "uint256" }],
          proof.merkle_root as EncodedString
        )[0],
        decodeAbiParameters<[{ type: "uint256" }]>(
          [{ type: "uint256" }],
          proof.nullifier_hash as EncodedString
        )[0],
        decodeAbiParameters<[{ type: "uint256[8]" }]>(
          [{ type: "uint256[8]" }],
          proof.proof as EncodedString
        )[0],
      ]
  })
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (
    <div>
      <button disabled={!write || isLoading} onClick={() => write()}>
        {isLoading ? 'Minting...' : 'Mint'}
      </button>
      {isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </div>
  )
}
