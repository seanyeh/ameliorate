import { MarkerType } from "reactflow";
import { v4 as uuid } from "uuid";

import { RelationName } from "../../../common/edge";
import { errorWithData } from "../../../common/errorHandling";
import { composedRelations, isEdgeImplied } from "./edge";
import { Orientation, layout } from "./layout";
import { FlowNodeType } from "./node";

export type DiagramType = "problem" | "claim";
export type RelationDirection = "parent" | "child";

export const orientations: Record<DiagramType, Orientation> = {
  problem: "DOWN",
  claim: "RIGHT",
};

export const topicDiagramId = "root";

export interface Diagram {
  id: string;
  nodes: Node[];
  edges: Edge[];
  type: DiagramType;
}

export interface Node {
  id: string;
  data: {
    label: string;
    diagramId: string;
    showing: boolean;
  };
  position: {
    x: number;
    y: number;
  };
  selected: boolean;
  type: FlowNodeType;
}

interface BuildProps {
  id?: string;
  label?: string;
  type: FlowNodeType;
  diagramId: string;
}
export const buildNode = ({ id, label, type, diagramId }: BuildProps): Node => {
  const node = {
    id: id ?? uuid(),
    data: {
      label: label ?? `new node`,
      diagramId: diagramId,
      showing: true,
    },
    position: { x: 0, y: 0 }, // assume layout will adjust this
    selected: false,
    type: type,
  };

  return node;
};

// assumes that we always want to point from child to parent
export const markerStart = { type: MarkerType.ArrowClosed, width: 30, height: 30 };

// TODO: add pointer to child claim tree & own diagram
// this will reduce a ton of extra calculation & param passing
export interface Edge {
  id: string;
  data: {
    diagramId: string;
  };
  label: RelationName;
  selected: boolean;
  markerStart: { type: MarkerType; width: number; height: number };
  source: string; // source === parent if arrows point from bottom to top
  target: string; // target === child if arrows point from bottom to top
  type: "ScoreEdge";
}

interface BuildEdgeProps {
  id?: string;
  sourceNodeId: string;
  targetNodeId: string;
  relation: RelationName;
  diagramId: string;
}
export const buildEdge = ({
  id,
  sourceNodeId,
  targetNodeId,
  relation,
  diagramId,
}: BuildEdgeProps): Edge => {
  return {
    id: id ?? uuid(),
    data: {
      diagramId: diagramId,
    },
    label: relation,
    selected: false,
    markerStart: markerStart,
    source: sourceNodeId,
    target: targetNodeId,
    type: "ScoreEdge" as const,
  };
};

export type GraphPartType = "node" | "edge";

export const possibleScores = ["-", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
export type Score = typeof possibleScores[number];

export const findNode = (nodeId: string, diagram: Diagram) => {
  const node = diagram.nodes.find((node) => node.id === nodeId);
  if (!node) throw errorWithData("node not found", nodeId, diagram);

  return node;
};

export const findEdge = (edgeId: string, diagram: Diagram) => {
  const edge = diagram.edges.find((edge) => edge.id === edgeId);
  if (!edge) throw errorWithData("edge not found", edgeId, diagram);

  return edge;
};

export const findGraphPart = (graphPartId: string, diagram: Diagram) => {
  const graphPart = [...diagram.nodes, ...diagram.edges].find(
    (graphPart) => graphPart.id === graphPartId
  );
  if (!graphPart) throw errorWithData("graph part not found", graphPartId, diagram);

  return graphPart;
};

export const getNodesComposedBy = (node: Node, diagram: Diagram) => {
  return composedRelations.flatMap((composedRelation) => {
    const composingEdges = diagram.edges.filter((edge) => {
      return edge.source === node.id && edge.label === composedRelation.name;
    });

    const potentialComposedNodes = composingEdges.map((edge) => findNode(edge.target, diagram));

    return potentialComposedNodes
      .filter((node) => node.type === composedRelation.child)
      .map((node) => node);
  });
};

export const getDiagramTitle = (diagram: Diagram) => {
  const rootNode = diagram.nodes[0];
  if (!rootNode) throw errorWithData("diagram has no root node", diagram);

  return rootNode.data.label;
};

/**
 * general philosophy on hiding components, to minimize confusion:
 * - do not automatically hide components that have already been shown, unless the user chooses to hide them
 * - always visually indicate hidden components some way
 * - always allow the user to explicitly show/hide components that can be hidden
 * - feel free to hide components when they're created if they're implied and have not been shown yet
 */
export const filterHiddenComponents = (
  diagram: Diagram,
  claimTrees: Diagram[],
  showImpliedEdges: boolean
): Diagram => {
  const shownNodes = diagram.nodes.filter((node) => node.data.showing);
  const shownNodeIds = shownNodes.map((node) => node.id);

  const shownEdges = diagram.edges.filter((edge) => {
    if (!shownNodeIds.includes(edge.source) || !shownNodeIds.includes(edge.target)) return false;

    return true;
  });

  // edges are implied based on other shown nodes & edges, so filter those before filtering implied edges
  const shownEdgesAfterImpliedFilter = shownEdges.filter(
    (edge) =>
      showImpliedEdges ||
      !isEdgeImplied(edge, { ...diagram, nodes: shownNodes, edges: shownEdges }, claimTrees)
  );

  return { ...diagram, nodes: shownNodes, edges: shownEdgesAfterImpliedFilter };
};

export const layoutVisibleComponents = async (diagram: Diagram, claimTrees: Diagram[]) => {
  // filter
  const displayDiagram = filterHiddenComponents(diagram, claimTrees, true);

  // layout only the displayed components
  const { layoutedNodes } = await layout(
    displayDiagram.nodes,
    displayDiagram.edges.filter((edge) => !isEdgeImplied(edge, displayDiagram, claimTrees)), // implied edges shouldn't affect layout
    orientations[diagram.type]
  );

  // update positions of displayed components
  const updatedNodes = diagram.nodes.map((node) => {
    const layoutedNode = layoutedNodes.find((layoutedNode) => layoutedNode.id === node.id);
    if (!layoutedNode) return node;

    // only shallow copy node if the node is changing, since re-renders will occur on Object change
    if (layoutedNode.position.x === node.position.x && layoutedNode.position.y === node.position.y)
      return node;

    return { ...node, position: layoutedNode.position };
  });

  // return both displayed and hidden components
  return { ...diagram, nodes: updatedNodes, edges: diagram.edges };
};
