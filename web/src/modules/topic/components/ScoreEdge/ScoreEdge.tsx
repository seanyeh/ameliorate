import { Typography } from "@mui/material";
import React from "react";
import { EdgeLabelRenderer, getBezierPath } from "reactflow";

import { Edge, markerStart } from "../../utils/diagram";
import { RelationName } from "../../utils/edge";
import { EdgeProps } from "../Diagram/Diagram";
import { EdgeIndicatorGroup } from "../EdgeIndicatorGroup/EdgeIndicatorGroup";
import { StyledDiv } from "./ScoreEdge.styles";

const convertToEdge = (flowEdge: EdgeProps): Edge => {
  return {
    id: flowEdge.id,
    // react-flow makes these nullable but we'll always pass them
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    data: flowEdge.data!,
    label: flowEdge.label! as RelationName,
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    // janky, not grabbing from flow edge because flow edge converts this to some URL format that idk how to convert;
    // but this value is currently always constant so it should be fine
    markerStart: markerStart,
    source: flowEdge.source,
    target: flowEdge.target,
    type: "ScoreEdge",
  };
};

// base for custom edge taken from https://reactflow.dev/docs/examples/edges/edge-with-button/
export const ScoreEdge = (flowEdge: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: flowEdge.sourceX,
    sourceY: flowEdge.sourceY,
    sourcePosition: flowEdge.sourcePosition,
    targetX: flowEdge.targetX,
    targetY: flowEdge.targetY,
    targetPosition: flowEdge.targetPosition,
  });

  const edge = convertToEdge(flowEdge);

  return (
    <>
      <path
        id={flowEdge.id}
        style={flowEdge.style}
        className="react-flow__edge-path"
        d={edgePath}
        markerStart={flowEdge.markerStart}
        markerEnd={flowEdge.markerEnd}
      />
      {/* see for example usage https://reactflow.dev/docs/api/edges/edge-label-renderer/ */}
      <EdgeLabelRenderer>
        <StyledDiv labelX={labelX} labelY={labelY}>
          <Typography variant="body1" margin="0">
            {flowEdge.label}
          </Typography>
          <EdgeIndicatorGroup edge={edge} />
        </StyledDiv>
      </EdgeLabelRenderer>
    </>
  );
};
