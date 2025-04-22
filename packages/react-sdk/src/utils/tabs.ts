import { PantheonTree, PantheonTreeNode, TabTree } from "../server";

export function findTab<T>(
  tree: TabTree<T> | TabTree<T>[],
  id: string,
): TabTree<T> | undefined {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree?.length; i++) {
      const foundTab = findTab(tree[i], id);

      if (foundTab) return foundTab;
    }

    return undefined;
  }

  if (tree.tabProperties?.tabId === id) return tree;
  if (!tree.childTabs?.length) return undefined;

  for (let i = 0; i < tree.childTabs?.length; i++) {
    const foundTab = findTab(tree.childTabs[i], id);

    if (foundTab) return foundTab;
  }

  return undefined;
}

export function flattenDocumentTabs(
  tree: TabTree<PantheonTree>,
): PantheonTreeNode[] {
  const result: PantheonTreeNode[] = [];

  function recurse(node: TabTree<PantheonTree>) {
    if (node.documentTab) result.push(...node.documentTab.children);
    node.childTabs?.forEach(recurse);
  }

  recurse(tree);
  return result;
}
