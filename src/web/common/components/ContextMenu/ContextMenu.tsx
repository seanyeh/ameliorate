import { Menu as MuiMenu } from "@mui/material";

import { closeContextMenu } from "../../store/contextMenuActions";
import { useAnchorPosition, useContextMenuContext } from "../../store/contextMenuStore";
import { DeleteEdgeMenuItem } from "./DeleteEdgeMenuItem";
import { DeleteNodeMenuItem } from "./DeleteNodeMenuItem";
import { ShowComponentsMenuItem } from "./ShowComponentsMenuItem";
import { ShowCriteriaMenuItem } from "./ShowCriteriaMenuItem";
import { ShowEffectsMenuItem } from "./ShowEffectsMenuItem";

export const ContextMenu = () => {
  const anchorPosition = useAnchorPosition();
  const contextMenuContext = useContextMenuContext();

  if (contextMenuContext === undefined) return <></>;

  const isOpen = Boolean(anchorPosition);

  // create these based on what's set in the context
  const menuItems = [
    contextMenuContext.node && <ShowComponentsMenuItem node={contextMenuContext.node} key={1} />,
    contextMenuContext.node && <ShowCriteriaMenuItem node={contextMenuContext.node} key={2} />,
    contextMenuContext.node && <ShowEffectsMenuItem node={contextMenuContext.node} key={3} />,
    contextMenuContext.node && <DeleteNodeMenuItem node={contextMenuContext.node} key={5} />,
    contextMenuContext.edge && <DeleteEdgeMenuItem edge={contextMenuContext.edge} key={6} />,
  ];

  return (
    <MuiMenu
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      open={isOpen}
      onClose={closeContextMenu}
      onContextMenu={(e) => e.preventDefault()}
    >
      {menuItems}
    </MuiMenu>
  );
};
