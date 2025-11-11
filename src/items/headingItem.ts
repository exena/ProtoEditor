import { MenuItem } from "prosemirror-menu";
import { setBlockType } from "prosemirror-commands";
import { NodeType } from "prosemirror-model";

export function createHeadingItem(headingNode: NodeType, level = 1) {
  return new MenuItem({
    title: `Heading ${level}`,
    label: `H${level}`,
    run: setBlockType(headingNode, { level }),
    enable: (state) => setBlockType(headingNode, { level })(state),
  });
}
