import { Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { FileNode } from '../../../lib';
import { NodeContainer, ExpandIconWrapper, NodeLabel } from './styles';

interface TreeNodeProps {
  node: FileNode;
  onSelect: (path: string) => void;
  activeFilePath: string | null;
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
  depth: number;
}

export const TreeNode = ({
  node,
  onSelect,
  activeFilePath,
  expandedFolders,
  toggleFolder,
  depth,
}: TreeNodeProps) => {
  const isDir = node.type === 'directory';
  const isExpanded = expandedFolders.has(node.path);
  const isActive = node.path === activeFilePath;

  const handleToggle = () => (isDir ? toggleFolder(node.path) : onSelect(node.path));

  return (
    <>
      <NodeContainer isActive={isActive} depth={depth} onClick={handleToggle}>
        <ExpandIconWrapper>
          {isDir && (isExpanded ? <ExpandMoreIcon sx={{ fontSize: 18 }} /> : <ChevronRightIcon sx={{ fontSize: 18 }} />)}
        </ExpandIconWrapper>
        
        <NodeLabel>
          {isDir ? (
            isExpanded ? (
              <FolderOpenIcon sx={{ fontSize: 18, color: 'primary.dark' }} /> 
            ) : (
              <FolderIcon sx={{ fontSize: 18 }} color="action" />
            )
          ) : (
            <InsertDriveFileIcon 
              sx={{ 
                fontSize: 18, 
                color: isActive ? 'primary.dark' : 'action.active' 
              }} 
            />
          )} 
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.85rem',
              color: isActive ? 'primary.dark' : 'text.primary',
            }}
          >
            {node.name}
          </Typography>
        </NodeLabel>
      </NodeContainer>

      {isDir && isExpanded && node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          onSelect={onSelect}
          activeFilePath={activeFilePath}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          depth={depth + 1}
        />
      ))}
    </>
  );
};