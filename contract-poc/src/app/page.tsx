"use client";
import { grantAdminRole } from "@/utils/helpers";
import { useEffect } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useReadContract,
} from "wagmi";
import { useWriteContract } from "wagmi";
import MultiSigSupplyChain from "../abi/MultisigSupplyChain.json";
import CreateShipment from "@/components/CreateShipment";
import StartShipment from "@/components/StartShipment";
import ProposeShipment from "@/components/ProposeShipment";
import ApproveShipment from "@/components/ApproveShipment";
import DenyShipment from "@/components/DenyShipment";
import AcceptShipment from "@/components/AcceptShipment";

export const abi = MultiSigSupplyChain.abi;

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const { writeContract } = useWriteContract();

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
        <button
          onClick={() => {
            writeContract({
              abi,
              address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
              functionName: "grantAdminRole",
              args: ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
            });
          }}
        >
          Bunda
        </button>
        <button
          onClick={() => {
            writeContract({
              abi,
              address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
              functionName: "grantVerifierRole",
              args: ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"],
            });
          }}
        >
          Bunda
        </button>
        <CreateShipment />
        <StartShipment />
        <ProposeShipment />
        <ApproveShipment />
        <DenyShipment />
        <AcceptShipment />
      </div>
    </>
  );
}

export default App;
