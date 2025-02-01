import { useState } from 'react';
import { SchemaMap, SchemaStorage } from '../types/sku';

interface SchemaManagerProps {
  onCreateSchema: (name: string, schema: SchemaStorage) => void;
  schemas: SchemaMap;
  onSelectSchema: (name: string) => void;
  selectedSchema: string;
}

export function SchemaManager({ onCreateSchema, schemas, onSelectSchema, selectedSchema }: SchemaManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSchemaTitle, setNewSchemaTitle] = useState('');
  const [newSchemaDescription, setNewSchemaDescription] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchemaTitle.trim()) return;

    onCreateSchema(newSchemaTitle.trim(), {
      blocks: [],
      counters: {},
      description: newSchemaDescription.trim()
    });

    setIsCreating(false);
    setNewSchemaTitle('');
    setNewSchemaDescription('');
  };

  const getSchemaPreview = (schema: SchemaStorage) => {
    const blockCount = schema.blocks.length;
    const counterCount = schema.blocks.filter(b => b.type === 'counter').length;
    
    return (
      <div className="flex gap-2 text-xs text-gray-500 mt-2">
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
          {blockCount} {blockCount === 1 ? 'block' : 'blocks'}
        </span>
        {counterCount > 0 && (
          <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
            {counterCount} {counterCount === 1 ? 'counter' : 'counters'}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Your Schemas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your SKU format templates
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                    hover:bg-blue-500 active:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Schema
        </button>
      </div>

      {/* Schema List */}
      <div className="grid gap-3">
        {Object.entries(schemas).length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-gray-400 mb-2">No schemas created yet</div>
            <button
              onClick={() => setIsCreating(true)}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Create your first schema
            </button>
          </div>
        ) : (
          Object.entries(schemas).map(([name, schema]) => (
            <button
              key={name}
              onClick={() => onSelectSchema(name)}
              className={`w-full p-4 rounded-xl text-left transition-all
                        ${selectedSchema === name 
                          ? 'bg-blue-50 border-blue-200 border shadow-sm' 
                          : 'bg-white border-gray-200 border hover:border-blue-200 hover:shadow-sm'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{name}</div>
                  {schema.description && (
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">{schema.description}</div>
                  )}
                  {getSchemaPreview(schema)}
                </div>
                <div className={`ml-4 flex items-center ${selectedSchema === name ? 'text-blue-600' : 'text-gray-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Create Schema Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Create New Schema</h3>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Schema Title
                </label>
                <input
                  type="text"
                  value={newSchemaTitle}
                  onChange={(e) => setNewSchemaTitle(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Product Labels"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newSchemaDescription}
                  onChange={(e) => setNewSchemaDescription(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What is this schema used for?"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg
                            hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg
                            hover:bg-blue-500 active:bg-blue-700 transition-colors"
                >
                  Create Schema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 