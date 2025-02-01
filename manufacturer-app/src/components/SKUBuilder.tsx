import { useState, useEffect } from 'react';
import { SchemaBlock, ContentBlockType } from '../types/sku';

interface SKUBuilderProps {
  onChange: (blocks: SchemaBlock[]) => void;
  blocks?: SchemaBlock[];
}

export function SKUBuilder({ onChange, blocks: initialBlocks }: SKUBuilderProps) {
  const [blocks, setBlocks] = useState<SchemaBlock[]>(initialBlocks || []);

  useEffect(() => {
    if (initialBlocks) {
      setBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  const addContentBlock = () => {
    const newBlock: SchemaBlock = {
      type: 'constant',
      value: ''
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const addDelimiterBlock = () => {
    const newBlock: SchemaBlock = {
      type: 'delimiter',
      value: '-'
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const updateBlock = (index: number, updates: Partial<SchemaBlock>) => {
    const newBlocks = blocks.map((block, i) => 
      i === index ? { ...block, ...updates } : block
    );
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Build your SKU format by adding and configuring blocks below.
      </p>
      
      <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl transition-colors hover:border-blue-200">
        {blocks.length === 0 && (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Add blocks to start building your SKU format
          </div>
        )}
        {blocks.map((block, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-all"
          >
            {block.type === 'delimiter' ? (
              <input
                type="text"
                value={block.value}
                onChange={(e) => updateBlock(index, { value: e.target.value })}
                className="w-12 text-center border border-gray-300 rounded-md p-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={1}
                placeholder="-"
              />
            ) : (
              <div className="flex gap-2">
                <select
                  value={block.type}
                  onChange={(e) => updateBlock(index, { type: e.target.value as ContentBlockType })}
                  className="border border-gray-300 rounded-md p-1.5 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="constant">Constant</option>
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                  <option value="day">Day</option>
                  <option value="counter">Counter</option>
                </select>
                
                {block.type === 'constant' && (
                  <input
                    type="text"
                    value={block.value}
                    onChange={(e) => updateBlock(index, { value: e.target.value })}
                    placeholder="Value"
                    className="border border-gray-300 rounded-md p-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                
                {(block.type === 'counter' || block.type === 'year') && (
                  <input
                    type="number"
                    value={block.length || 2}
                    onChange={(e) => updateBlock(index, { length: parseInt(e.target.value) })}
                    min={1}
                    max={block.type === 'year' ? 4 : 10}
                    placeholder="Length"
                    className="border border-gray-300 rounded-md p-1.5 w-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            )}
            <button 
              onClick={() => removeBlock(index)}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={addContentBlock}
          className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          Add Content Block
        </button>
        <button 
          onClick={addDelimiterBlock}
          className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          Add Delimiter
        </button>
      </div>
    </div>
  );
} 