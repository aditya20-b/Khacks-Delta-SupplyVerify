import { SchemaBlock } from '../types/sku';

interface SKUPreviewProps {
  blocks: SchemaBlock[];
  onBlockEdit?: (index: number, value: string) => void;
}

export function SKUPreview({ blocks, onBlockEdit }: SKUPreviewProps) {
  const getBlockPreview = (block: SchemaBlock): string => {
    switch (block.type) {
      case 'delimiter':
        return block.value;
      case 'constant':
        return block.value || '[constant]';
      case 'year':
        return 'YYYY'.slice(0, block.length || 4);
      case 'month':
        return 'MM';
      case 'day':
        return 'DD';
      case 'counter':
        return '0'.repeat(block.length || 4);
      default:
        return '[unknown]';
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex gap-1 font-mono text-lg">
        {blocks.map((block, index) => (
          <div 
            key={index}
            className={`p-2 bg-white border border-gray-300 rounded cursor-pointer hover:border-blue-500 ${
              block.type === 'delimiter' ? 'bg-gray-50 px-1' : ''
            }`}
            onClick={() => onBlockEdit?.(index, block.value)}
          >
            {getBlockPreview(block)}
          </div>
        ))}
      </div>
    </div>
  );
} 