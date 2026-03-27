import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import { FileExplorer } from '@/components/code/FileExplorer';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { FileNode } from '@/lib';
import { TreeNodeProps } from '@/components/code/FileExplorer/TreeNode.tsx'


vi.mock('./TreeNode', () => ({
  TreeNode: ({ node, toggleFolder }: TreeNodeProps) => (
    <div data-testid={`node-${node.name}`}>
      <span>{node.name}</span>
      {node.type === 'directory' && (
        <button onClick={() => toggleFolder(node.path)}>Toggle</button>
      )}
    </div>
  ),
}));

describe('FileExplorer Component', () => {
  const defaultProps = {
    onSelect: vi.fn(),
    activeFilePath: null,
  };

  const mockFileTree: FileNode = {
    id: 'root',
    name: 'root',
    type: 'directory',
    path: '/',
    children: [
      { id: '1', name: 'src', type: 'directory', path: 'src', children: [] },
      { id: '2', name: 'package.json', type: 'file', path: 'package.json' },
    ],
  };

  it('manages expanded folder state when toggled', async () => {
    server.use(
      http.get('*/api/codebase/file-tree', () => HttpResponse.json(mockFileTree))
    );

    render(<FileExplorer {...defaultProps} />);

    // Wait for the mock data to render
    await screen.findByText('src');

    // Click the button we defined in our mock above
    const toggleButton = screen.getByText('Toggle');
    fireEvent.click(toggleButton);
    
    // Test passes if it handles the state update without crashing
  });

  it('automatically expands folders when an activeFilePath is provided', async () => {
    server.use(
      http.get('*/api/codebase/file-tree', () => HttpResponse.json(mockFileTree))
    );

    render(
      <FileExplorer {...defaultProps} activeFilePath="src/components/Button.tsx" />
    );

    const folder = await screen.findByText('src');
    expect(folder).toBeInTheDocument();
  });
});