import { v4 as uuid } from "uuid";

import { getImplicitLabel } from "../utils/claim";
import {
  ArguableType,
  RelationDirection,
  buildNode,
  findArguable,
  findNode,
  layoutVisibleComponents,
} from "../utils/diagram";
import { FlowNodeType, children, parents } from "../utils/node";
import { useTopicStore } from "./store";
import {
  getActiveDiagram,
  getClaimDiagrams,
  getDiagram,
  getDuplicateState,
  getProblemDiagram,
} from "./utils";

export const viewOrCreateClaimDiagram = (arguableId: string, arguableType: ArguableType) => {
  const state = getDuplicateState();

  // create claim diagram if it doesn't exist
  if (!getDiagram(state, arguableId)) {
    const activeDiagram = getActiveDiagram(state);
    const arguable = findArguable(arguableId, arguableType, activeDiagram);
    const label = getImplicitLabel(arguableId, arguableType, activeDiagram);

    /* eslint-disable functional/immutable-data, no-param-reassign */
    const newNode = buildNode({
      id: uuid(),
      label: label,
      score: arguable.data.score,
      type: "rootClaim",
      diagramId: arguableId,
    });

    state.diagrams[arguableId] = {
      id: arguableId,
      nodes: [newNode],
      edges: [],
      type: "claim",
    };
    /* eslint-enable functional/immutable-data, no-param-reassign */
  }

  /* eslint-disable functional/immutable-data, no-param-reassign */
  state.activeClaimDiagramId = arguableId;
  /* eslint-enable functional/immutable-data, no-param-reassign */

  useTopicStore.setState(state, false, "viewOrCreateClaimDiagram");
};

export const viewClaimDiagram = (diagramId: string) => {
  useTopicStore.setState({ activeClaimDiagramId: diagramId }, false, "viewClaimDiagram");
};

export const closeClaimDiagram = () => {
  useTopicStore.setState({ activeClaimDiagramId: null }, false, "closeClaimDiagram");
};

export const closeTable = () => {
  useTopicStore.setState({ activeTableProblemId: null }, false, "closeTable");
};

// potential TODO: could show components that were hidden due to being implied by the now-hidden neighbor
export const toggleShowNeighbors = async (
  nodeId: string,
  neighborType: FlowNodeType,
  direction: RelationDirection,
  show: boolean
) => {
  const state = getDuplicateState();

  const problemDiagram = getProblemDiagram(state); // assuming we're only show/hiding from problem diagram

  const node = findNode(nodeId, problemDiagram);

  const neighborsInDirection =
    direction === "parent" ? parents(node, problemDiagram) : children(node, problemDiagram);

  const neighborsToToggle = neighborsInDirection.filter(
    (neighbor) => neighbor.type === neighborType
  );

  /* eslint-disable functional/immutable-data, no-param-reassign */
  neighborsToToggle.forEach((neighbor) => (neighbor.data.showing = show));
  /* eslint-enable functional/immutable-data, no-param-reassign */

  const layoutedDiagram = await layoutVisibleComponents(problemDiagram, getClaimDiagrams(state)); // depends on showing having been updated

  /* eslint-disable functional/immutable-data, no-param-reassign */
  problemDiagram.nodes = layoutedDiagram.nodes;
  problemDiagram.edges = layoutedDiagram.edges;
  /* eslint-enable functional/immutable-data, no-param-reassign */

  useTopicStore.setState(state, false, "toggleShowNeighbors");
};

export const viewProblemDiagram = () => {
  useTopicStore.setState(
    { activeTableProblemId: null, activeClaimDiagramId: null },
    false,
    "viewProblemDiagram"
  );
};

export const viewCriteriaTable = (problemNodeId: string) => {
  useTopicStore.setState(
    { activeTableProblemId: problemNodeId, activeClaimDiagramId: null },
    false,
    "viewCriteriaTable"
  );
};

export const toggleShowImpliedEdges = (show: boolean) => {
  useTopicStore.setState({ showImpliedEdges: show }, false, "toggleShowImpliedEdges");
};

export const relayout = async () => {
  const state = getDuplicateState();

  const activeDiagram = getActiveDiagram(state);

  const layoutedDiagram = await layoutVisibleComponents(activeDiagram, getClaimDiagrams(state));

  /* eslint-disable functional/immutable-data, no-param-reassign */
  activeDiagram.nodes = layoutedDiagram.nodes;
  activeDiagram.edges = layoutedDiagram.edges;
  /* eslint-enable functional/immutable-data, no-param-reassign */

  useTopicStore.setState(state, false, "relayout");
};
