import { abi } from "@/app/page";
import { useWriteContract } from "wagmi";

export default function AcceptShipment() {
  const { writeContract } = useWriteContract();

  return (
    <button
      onClick={() => {
        writeContract({
          abi,
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          functionName: "denyShipment",
          args: ["0x90F79bf6EB2c4f870365E785982E1f101E93b906"],
        });
      }}
    >
      Deny Shipment - Receiver
    </button>
  );
}
