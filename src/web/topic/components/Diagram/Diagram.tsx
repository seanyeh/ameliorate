import { Cancel } from "@mui/icons-material";
import { Typography } from "@mui/material";
import isEmpty from "lodash/isEmpty";
import { ComponentType, useEffect } from "react";
import {
  Background,
  BackgroundVariant,
  type EdgeProps as DefaultEdgeProps,
  type NodeProps as DefaultNodeProps,
  type EdgeChange,
  type EdgeSelectionChange,
  type NodeChange,
  type NodeSelectionChange,
  ReactFlowProvider,
} from "reactflow";

import { emitter } from "../../../common/event";
import { useViewportUpdater } from "../../hooks/flowHooks";
import { setSelected } from "../../store/actions";
import { connectNodes } from "../../store/createDeleteActions";
import { useFilteredDiagram } from "../../store/store";
import { closeClaimTree } from "../../store/viewActions";
import { type Edge, type Node } from "../../utils/diagram";
import { FlowNodeType } from "../../utils/node";
import { FlowNode } from "../Node/FlowNode";
import { ScoreEdge } from "../ScoreEdge/ScoreEdge";
import { PositionedCloseButton, StyledReactFlow } from "./Diagram.styles";

const buildNodeComponent = (type: FlowNodeType) => {
  // eslint-disable-next-line react/display-name -- react flow dynamically creates these components without name anyway
  return (props: NodeProps) => {
    return <FlowNode {...props} type={type} />;
  };
};

// this can be generated via `nodeDecorations` but hard to do without the complexity making it hard to follow, so leaving this hardcoded
const nodeTypes: Record<FlowNodeType, ComponentType<NodeProps>> = {
  problem: buildNodeComponent("problem"),
  solution: buildNodeComponent("solution"),
  solutionComponent: buildNodeComponent("solutionComponent"),
  criterion: buildNodeComponent("criterion"),
  effect: buildNodeComponent("effect"),
  rootClaim: buildNodeComponent("rootClaim"),
  support: buildNodeComponent("support"),
  critique: buildNodeComponent("critique"),
};

const edgeTypes: Record<"ScoreEdge", ComponentType<EdgeProps>> = { ScoreEdge: ScoreEdge };

// react-flow passes exactly DefaultNodeProps but data can be customized
// not sure why, but DefaultNodeProps has xPos and yPos instead of Node's position.x and position.y
export interface NodeProps extends DefaultNodeProps {
  data: Node["data"];
}

export interface EdgeProps extends DefaultEdgeProps {
  // we'll always pass data - why does react-flow make it nullable :(
  // can't figure out how to amend this to make it non-nullable, since react-flow's Edge is defined as a type, not an interface
  data?: Edge["data"];
}

const onGraphPartChange = (changes: (NodeChange | EdgeChange)[]) => {
  const selectChanges = changes.filter((change) => change.type === "select") as
    | NodeSelectionChange[]
    | EdgeSelectionChange[];

  if (selectChanges.length > 0) setSelected(selectChanges);
};

interface DiagramProps {
  diagramId: string;
}

const DiagramWithoutProvider = ({ diagramId }: DiagramProps) => {
  const diagram = useFilteredDiagram(diagramId);
  const { fitViewForNodes, moveViewportToIncludeNode } = useViewportUpdater();

  const nodes = diagram.nodes;
  const edges = diagram.edges;

  const showCloseButton = diagram.type === "claim";
  const closeButton = (
    <PositionedCloseButton onClick={() => closeClaimTree()} color="primary">
      <Cancel />
    </PositionedCloseButton>
  );

  useEffect(() => {
    const unbindAdd = emitter.on("addNode", (node) => {
      if (node.data.diagramId !== diagramId) return;
      moveViewportToIncludeNode(node);
    });
    const unbindLoad = emitter.on("loadedTopicData", (diagram) => fitViewForNodes(diagram.nodes));

    return () => {
      unbindAdd();
      unbindLoad();
    };
  }, [diagramId, fitViewForNodes, moveViewportToIncludeNode]);

  const emptyText = <Typography variant="h5">Right-click to create</Typography>;

  return (
    <>
      {showCloseButton && closeButton}

      <StyledReactFlow
        id={diagramId} // need unique ids to use multiple flow instances on the same page
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ maxZoom: 1 }}
        minZoom={0.25}
        onConnect={({ source, target }) => void connectNodes(source, target)}
        onContextMenu={(e) => e.preventDefault()}
        onEdgesChange={(changes) => onGraphPartChange(changes)}
        onNodesChange={(changes) => onGraphPartChange(changes)}
        nodesDraggable={false}
        nodesConnectable={diagram.type !== "claim"} // claims are in a tree, so cannot connect existing nodes
        deleteKeyCode={null} // was preventing holding ctrl and repeating backspace to delete multiple words from node text
        elevateEdgesOnSelect={true} // this puts selected edges (or neighbor-to-selected-node edges) in a separate svg that is given a higher zindex, so they can be elevated above other nodes
      >
        <Background variant={BackgroundVariant.Dots} />
        {isEmpty(nodes) && emptyText}
      </StyledReactFlow>
    </>
  );
};

export const Diagram = (props: DiagramProps) => (
  // wrap in provider so we can use react-flow state https://reactflow.dev/docs/api/react-flow-provider/
  <ReactFlowProvider>
    <DiagramWithoutProvider {...props} />
  </ReactFlowProvider>
);
