import { Edge, topicDiagramId } from "../../utils/diagram";
import { ClaimIndicator } from "./ClaimIndicator";

interface Props {
  edge: Edge;
}

export const EdgeClaimIndicator = ({ edge }: Props) => {
  // don't render indicator for claim nodes because child claims are all already shown together in the claim view
  if (edge.data.diagramId !== topicDiagramId) return <></>;

  return <ClaimIndicator graphPartId={edge.id} graphPartType="edge" />;
};
