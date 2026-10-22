export type Values = Record<string, any>;

/** Small observable state adapter for the authored screen interactions. */
export class DesignLogic {
  state: Values = {};
  context: Values = {};
  private listeners = new Set<() => void>();
  constructor(_props?: unknown) {}
  setState(next: Values) {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((listener) => listener());
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  snapshot = () => this.state;
  renderVals(): Values { return {}; }
}

export type DesignNode = string | {
  tag: string;
  attrs: Record<string, string | null>;
  children: DesignNode[];
};
export type DesignScreen = {
  id: string;
  title: string;
  group: number;
  height: number;
  linkColor?: string;
  tree: Exclude<DesignNode, string>;
  assets: Record<string, string>;
};

export function resolve(value: string | null | undefined, scope: Values): any {
  if (value == null) return undefined;
  const lookup = (path: string) => {
    if (path === 'true') return true;
    if (path === 'false') return false;
    return path.split('.').reduce((v, key) => v?.[key], scope);
  };
  const exact = value.match(/^{{([\w.]+)}}$/);
  if (exact) return lookup(exact[1]);
  return value.replace(/{{([\w.]+)}}/g, (_, key) => String(lookup(key) ?? ''));
}

export type ExpandedNode = { node: DesignNode; scope: Values; key: string };
export function expand(nodes: DesignNode[], scope: Values, prefix = ''): ExpandedNode[] {
  return nodes.flatMap((node, i): ExpandedNode[] => {
    const key = `${prefix}.${i}`;
    if (typeof node === 'string') return [{ node, scope, key }];
    if (node.tag === 'sc-if') return resolve(node.attrs.value, scope) ? expand(node.children, scope, key) : [];
    if (node.tag === 'sc-for') {
      const items = resolve(node.attrs.list, scope);
      return Array.isArray(items) ? items.flatMap((item, j) => expand(node.children, { ...scope, [node.attrs.as || 'item']: item }, `${key}.${j}`)) : [];
    }
    return [{ node, scope, key }];
  });
}
