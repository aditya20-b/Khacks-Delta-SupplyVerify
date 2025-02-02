import { abi } from "@/app/page";
import { useWriteContract } from "wagmi";

export default function CreateShipment() {
  const { writeContract } = useWriteContract();

  return (
    <button
      onClick={() => {
        writeContract({
          abi,
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          functionName: "createShipment",
          args: [
            "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
            "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
          ],
        });
      }}
    >
      Create Shipment
    </button>
  );
}
