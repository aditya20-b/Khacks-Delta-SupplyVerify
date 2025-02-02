import { useState, useEffect } from "react";
import { NFCRecord, NDEFReadingEvent } from "./types/nfc";
import { SKUBuilder } from "./components/SKUBuilder";
import { SKUPreview } from "./components/SKUPreview";
import { SchemaBlock, SchemaStorage, SchemaMap } from "./types/sku";
import { SchemaManager } from "./components/SchemaManager";
import Header from "components/Header";
import { Scanner } from "@yudiel/react-qr-scanner";

// Navigation menu items
const MENU_ITEMS = [
  { id: "tags", label: "Tags", icon: "🏷️" },
  { id: "schemas", label: "Schemas", icon: "📋" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export default function NFCReader() {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [records, setRecords] = useState<NFCRecord[]>([]);
  const [error, setError] = useState("");
  // @ts-expect-error
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [skuBlocks, setSKUBlocks] = useState<SchemaBlock[]>([]);
  // @ts-expect-error
  const [nextSKU, setNextSKU] = useState("");
  const [manualSKU, setManualSKU] = useState("");
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "tags";
  });
  const [schemas, setSchemas] = useState<SchemaMap>({});
  const [selectedSchema, setSelectedSchema] = useState(() => {
    return localStorage.getItem("selectedSchema") || "default";
  });

  // Load schemas from localStorage
  useEffect(() => {
    const savedSchema = localStorage.getItem("schemas");
    if (savedSchema) {
      const parsedSchemas: SchemaMap = JSON.parse(savedSchema);
      setSchemas(parsedSchemas);

      // Load the selected schema's blocks
      const currentSchema = parsedSchemas[selectedSchema];
      if (currentSchema) {
        setSKUBlocks(currentSchema.blocks);
        // Update next SKU when schema is loaded
        const preview = generateNextSKU(
          currentSchema.blocks,
          currentSchema.counters
        );
        setNextSKU(preview);
        setManualSKU(preview);
      }
    }
  }, [selectedSchema]);

  // Save schema to localStorage whenever it changes
  useEffect(() => {
    const updatedSchemas = { ...schemas };
    updatedSchemas[selectedSchema] = {
      blocks: skuBlocks,
      counters: schemas[selectedSchema]?.counters || {},
      description: schemas[selectedSchema]?.description || "",
    };

    setSchemas(updatedSchemas);
    localStorage.setItem("schemas", JSON.stringify(updatedSchemas));

    // Update next SKU when blocks change
    const preview = generateNextSKU(
      skuBlocks,
      updatedSchemas[selectedSchema]?.counters || {}
    );
    setNextSKU(preview);
    setManualSKU(preview);
  }, [skuBlocks, selectedSchema]);

  // Persist active tab
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Persist selected schema
  useEffect(() => {
    localStorage.setItem("selectedSchema", selectedSchema);
  }, [selectedSchema]);

  const handleCreateSchema = (name: string, schema: SchemaStorage) => {
    const updatedSchemas = { ...schemas, [name]: schema };
    setSchemas(updatedSchemas);
    localStorage.setItem("schemas", JSON.stringify(updatedSchemas));
    setSelectedSchema(name);
    setActiveTab("tags");
  };

  const handleSelectSchema = (name: string) => {
    setSelectedSchema(name);
    setActiveTab("tags");
  };

  // Modified support check
  useEffect(() => {
    const addDebugInfo = (info: string) => {
      setDebugInfo((prev) => [...prev, `${new Date().toISOString()}: ${info}`]);
    };

    addDebugInfo(`NDEFReader in window: ${"NDEFReader" in window}`);
    addDebugInfo(`User Agent: ${navigator.userAgent}`);

    try {
      if ("NDEFReader" in window) {
        setNfcSupported(true);
        addDebugInfo("NFC appears to be supported");
      } else {
        setNfcSupported(false);
        setError("Web NFC not supported in this browser");
        addDebugInfo("NFC not found in window object");
      }
    } catch (err) {
      setNfcSupported(false);
      setError(
        `Error checking NFC support: ${err instanceof Error ? err.message : String(err)}`
      );
      addDebugInfo(`Error during support check: ${String(err)}`);
    }
  }, []);

  const handleScanClick = async () => {
    try {
      setDebugInfo((prev) => [
        ...prev,
        `${new Date().toISOString()}: Attempting to create NDEFReader`,
      ]);
      const reader = new window.NDEFReader();

      setDebugInfo((prev) => [
        ...prev,
        `${new Date().toISOString()}: Attempting to scan`,
      ]);
      await reader.scan();
      setDebugInfo((prev) => [
        ...prev,
        `${new Date().toISOString()}: Scan started successfully`,
      ]);

      reader.onreadingerror = (error: Event) => {
        setError("Error reading NFC tag. Try another tag.");
        setDebugInfo((prev) => [
          ...prev,
          `${new Date().toISOString()}: Reading error: ${String(error)}`,
        ]);
      };

      reader.onreading = (event: NDEFReadingEvent) => {
        setDebugInfo((prev) => [
          ...prev,
          `${new Date().toISOString()}: Tag detected`,
        ]);
        const newRecords = event.message.records.map((record) => {
          return {
            recordType: record.recordType,
            mediaType: record.mediaType,
            data: decodeRecordData(record),
            id: event.serialNumber,
          };
        });
        setRecords(newRecords);
        setError("");
      };
    } catch (err: unknown) {
      const errorMessage = `NFC Error: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      setDebugInfo((prev) => [
        ...prev,
        `${new Date().toISOString()}: Error: ${errorMessage}`,
      ]);
    }
  };

  const decodeRecordData = (record: {
    recordType: string;
    mediaType?: string;
    data: ArrayBuffer;
    encoding?: string;
  }) => {
    try {
      switch (record.recordType) {
        case "text":
          const textDecoder = new TextDecoder(record.encoding);
          return textDecoder.decode(record.data);
        case "url":
          return new TextDecoder().decode(record.data);
        case "mime":
          if (record.mediaType === "application/json") {
            return JSON.parse(new TextDecoder().decode(record.data));
          }
          return `Binary MIME Data (${record.mediaType})`;
        default:
          return "Unsupported format";
      }
    } catch (e) {
      return "Error decoding data";
    }
  };

  // @ts-expect-error
  const generateCurrentSKU = (): string => {
    return skuBlocks
      .map((block) => {
        switch (block.type) {
          case "delimiter":
            return block.value;
          case "constant":
            return block.value;
          case "year":
            return new Date()
              .getFullYear()
              .toString()
              .slice(-(block.length || 4));
          case "month":
            return (new Date().getMonth() + 1).toString().padStart(2, "0");
          case "day":
            return new Date().getDate().toString().padStart(2, "0");
          case "counter":
            return "1".padStart(block.length || 4, "0");
          default:
            return "";
        }
      })
      .join("");
  };

  const generateNextSKU = (
    blocks: SchemaBlock[],
    counters: Record<string, number>
  ): string => {
    return blocks
      .map((block, index) => {
        switch (block.type) {
          case "delimiter":
            return block.value;
          case "constant":
            return block.value;
          case "year":
            return new Date()
              .getFullYear()
              .toString()
              .slice(-(block.length || 4));
          case "month":
            return (new Date().getMonth() + 1).toString().padStart(2, "0");
          case "day":
            return new Date().getDate().toString().padStart(2, "0");
          case "counter":
            const currentCount = (counters[index] || 0) + 1;
            return currentCount.toString().padStart(block.length || 4, "0");
          default:
            return "";
        }
      })
      .join("");
  };

  const incrementCounters = () => {
    const updatedSchemas = { ...schemas };
    const counters = updatedSchemas[selectedSchema]?.counters || {};

    skuBlocks.forEach((block, index) => {
      if (block.type === "counter") {
        counters[index] = (counters[index] || 0) + 1;
      }
    });

    updatedSchemas[selectedSchema] = {
      ...updatedSchemas[selectedSchema],
      blocks: skuBlocks,
      counters,
    };

    setSchemas(updatedSchemas);
    localStorage.setItem("schemas", JSON.stringify(updatedSchemas));

    // Update next SKU after incrementing counters
    const preview = generateNextSKU(skuBlocks, counters);
    setNextSKU(preview);
    setManualSKU(preview);
  };

  const handleWrite = async () => {
    if (!manualSKU) {
      setError("Please configure the SKU schema first");
      return;
    }

    setIsWriting(true);
    try {
      setDebugInfo((prev) => [
        ...prev,
        `${new Date().toISOString()}: Attempting to write SKU: ${manualSKU}`,
      ]);
      const writer = new window.NDEFReader();
      await writer.write({
        records: [
          {
            recordType: "text",
            data: manualSKU,
          },
        ],
      });

      setDebugInfo((prev) => [
        ...prev,
        `${new Date().toISOString()}: Write successful`,
      ]);
      incrementCounters();
      const nextPreview = generateNextSKU(
        skuBlocks,
        schemas[selectedSchema]?.counters || {}
      );
      setNextSKU(nextPreview);
      setManualSKU(nextPreview);
      setError("");
      alert("SKU written successfully!");
    } catch (err: unknown) {
      const errorMessage = `Write Error: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      setDebugInfo((prev) => [
        ...prev,
        `${new Date().toISOString()}: ${errorMessage}`,
      ]);
    } finally {
      setIsWriting(false);
    }
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure your NFC Tag Manager
            </p>
          </div>
        </div>

        {/* Scan Preferences */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4">
            <h3 className="font-medium text-gray-900">Scan Preferences</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Customize how NFC scanning behaves
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-700">
                    Auto-scan Mode
                  </div>
                  <div className="text-sm text-gray-500">
                    Automatically start scanning when app opens
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-700">Scan Sound</div>
                  <div className="text-sm text-gray-500">
                    Play sound when tag is detected
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-700">
                    Scan History Limit
                  </div>
                  <div className="text-sm text-gray-500">
                    Maximum number of scans to keep in history
                  </div>
                </div>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
                  <option value="10">10 scans</option>
                  <option value="25">25 scans</option>
                  <option value="50" selected>
                    50 scans
                  </option>
                  <option value="100">100 scans</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-gray-700">
                    Tag Type Filter
                  </div>
                  <div className="text-sm text-gray-500">
                    Filter which types of tags to detect
                  </div>
                </div>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
                  <option value="all" selected>
                    All Types
                  </option>
                  <option value="ndef">NDEF Only</option>
                  <option value="mifare">MIFARE Only</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Access Logs */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-gray-900">Access Logs</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Recent activity in your NFC Tag Manager
                </p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Export Logs
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  action: "Schema Created",
                  details: 'Created new schema "Product Labels v2"',
                  time: "2 minutes ago",
                },
                {
                  action: "Tag Written",
                  details: "Wrote SKU: PRD-2024-0001",
                  time: "15 minutes ago",
                },
                {
                  action: "Schema Modified",
                  details: 'Updated counter in "Default Schema"',
                  time: "1 hour ago",
                },
                {
                  action: "Tag Scanned",
                  details: "Read tag with ID: A7B2C3D4",
                  time: "2 hours ago",
                },
                {
                  action: "Settings Changed",
                  details: "Updated scan preferences",
                  time: "3 hours ago",
                },
              ].map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {log.action}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {log.details}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {log.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "schemas":
        return (
          <SchemaManager
            schemas={schemas}
            onCreateSchema={handleCreateSchema}
            onSelectSchema={handleSelectSchema}
            selectedSchema={selectedSchema}
          />
        );

      case "settings":
        return renderSettings();

      case "tags":
      default:
        return (
          <div className="space-y-4">
            {/* SKU Builder Section */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="font-semibold text-gray-800 text-xl">
                      SKU Builder
                    </h2>
                    <p className="text-gray-500 mt-1 text-lg">
                      Schema:{" "}
                      <span className="font-medium">{selectedSchema}</span>
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-4 px-4">
                  <div className="min-w-full">
                    <SKUBuilder
                      onChange={setSKUBlocks}
                      blocks={schemas[selectedSchema]?.blocks || []}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Preview Section */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Preview
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      See how your SKU will look
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <SKUPreview blocks={skuBlocks} />
                </div>
              </div>
            </section>

            {/* Next SKU Section */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Next SKU
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Edit to override the next SKU to be written
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  value={manualSKU}
                  onChange={(e) => setManualSKU(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg font-mono text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Next SKU"
                />
              </div>
            </section>

            {/* Action Buttons */}
            <section className="space-y-3 py-2">
              <button
                onClick={handleScanClick}
                disabled={!nfcSupported}
                className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-medium shadow-sm
                          disabled:bg-gray-400 disabled:cursor-not-allowed
                          active:bg-blue-700 hover:bg-blue-500 transition-colors
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {nfcSupported ? "Scan NFC Tag" : "NFC Not Supported"}
              </button>

              <button
                onClick={handleWrite}
                disabled={!nfcSupported || isWriting || skuBlocks.length === 0}
                className="w-full py-4 px-6 bg-green-600 text-white rounded-xl font-medium shadow-sm
                          disabled:bg-gray-400 disabled:cursor-not-allowed
                          active:bg-green-700 hover:bg-green-500 transition-colors
                          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {isWriting ? "Writing..." : "Write SKU to Tag"}
              </button>
            </section>

            {/* Records Section */}
            {records.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Recent Scans
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Previously scanned NFC tags
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {records.map((record, index) => (
                      <li
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg space-y-1.5 text-sm"
                      >
                        <div>
                          <span className="font-medium">Type:</span>{" "}
                          {record.recordType}
                        </div>
                        <div className="break-all">
                          <span className="font-medium">Data:</span>{" "}
                          {JSON.stringify(record.data)}
                        </div>
                        <div className="font-mono">
                          <span className="font-medium">Tag ID:</span>{" "}
                          {record.id}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            <section>
              <Scanner
                onScan={(result) => console.log(result)}
                styles={{
                  video: { maxHeight: "300px" },
                  container: {
                    width: "fit-content",
                    margin: "auto",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    height: "300px",
                  },
                }}
              />
              ;
            </section>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-darkerGrotesque">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full mb-24">
        {error && (
          <div className="flex items-center gap-4 text-red-500 py-8 text-xl">
            <div className="w-[5px] h-[5px] rounded-full bg-red-500"></div>
            <p className="-mt-1">{error}</p>
          </div>
        )}

        {renderContent()}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white fixed bottom-0 left-0 right-0">
        <div className="max-w-lg mx-auto">
          <div className="mx-4 mb-2">
            <div className="bg-gray-100 rounded-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
              <ul className="flex justify-around">
                {MENU_ITEMS.map((item) => (
                  <li key={item.id} className="flex-1">
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full py-3 px-2 flex flex-col items-center justify-center
                                ${activeTab === item.id ? "text-blue-600" : "text-gray-600"}
                                transition-colors rounded-2xl
                                ${activeTab === item.id ? "bg-white shadow-sm" : ""}`}
                    >
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
