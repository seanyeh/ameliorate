import { useNodeParents } from "../../../topic/store/nodeHooks";
import { toggleShowNeighbors } from "../../../topic/store/viewActions";
import { Node } from "../../../topic/utils/diagram";
import { CloseOnClickMenuItem } from "./CloseOnClickMenuItem";

export const ShowEffectsMenuItem = ({ node }: { node: Node }) => {
  const nodeParents = useNodeParents(node.id, node.data.diagramId);

  const effects = nodeParents.filter((child) => child.type === "effect");

  if (!["solution", "solutionComponent"].includes(node.type) || effects.length === 0) {
    return <></>;
  }

  const allEffectsShown = effects.every((child) => child.data.showing);

  return (
    <CloseOnClickMenuItem
      onClick={() => void toggleShowNeighbors(node.id, "effect", "parent", !allEffectsShown)}
    >
      {allEffectsShown ? "Hide effects" : "Show effects"}
    </CloseOnClickMenuItem>
  );
};
