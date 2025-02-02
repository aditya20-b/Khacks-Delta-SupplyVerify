import { abi } from "@/app/page";
import { useEffect } from "react";
import { encodeAbiParameters } from "viem";
import { useReadContract, useWriteContract } from "wagmi";

export default function ProposeShipment() {
  const { writeContract } = useWriteContract();
  const readContract = useReadContract({
    abi,
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: "encodeShipmentEvent",
    args: ["Chennai", BigInt(50), BigInt(50)],
  });

  console.log(readContract.dataUpdatedAt);
  return (
    <>
      {!readContract.isLoading && (
        <div>{JSON.stringify(readContract.data)}</div>
      )}
      <button
        onClick={() => {
          writeContract({
            abi,
            address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            functionName: "proposeShipmentEvent",
            args: [
              encodeAbiParameters(
                [
                  {
                    name: "location",
                    type: "string",
                  },
                  {
                    name: "temperature",
                    type: "uint",
                  },
                  {
                    name: "humidity",
                    type: "uint",
                  },
                ],
                ["Chennai", BigInt(50), BigInt(50)]
              ),
            ],
          });
        }}
      >
        Propose Shipment
      </button>
    </>
  );
}
