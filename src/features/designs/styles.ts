import type { TextStyle, ViewStyle } from 'react-native';

const textKeys = new Set(['color', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight', 'textAlign', 'textTransform', 'textDecorationLine']);
const numeric = new Set(['width','height','minWidth','minHeight','maxWidth','maxHeight','top','bottom','left','right','opacity','zIndex','flex','flexGrow','flexShrink','flexBasis','gap','rowGap','columnGap','padding','paddingTop','paddingBottom','paddingLeft','paddingRight','margin','marginTop','marginBottom','marginLeft','marginRight','borderWidth','borderTopWidth','borderBottomWidth','borderLeftWidth','borderRightWidth','borderRadius','borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius','fontSize','letterSpacing']);
const enums = new Set(['alignItems','alignSelf','justifyContent','flexDirection','flexWrap','overflow','position','color','backgroundColor','borderColor','borderTopColor','borderBottomColor','borderLeftColor','borderRightColor','borderStyle','fontWeight','fontStyle','textAlign','textTransform']);
const camel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const dimension = (v: string): any => v.endsWith('%') || v === 'auto' ? v : Number.parseFloat(v);
export function nativeStyle(css = '', inherited: TextStyle = {}) {
  const declarations: Record<string,string> = {};
  for (const part of css.split(';')) {
    const colon = part.indexOf(':');
    if (colon > 0) declarations[part.slice(0, colon).trim()] = part.slice(colon + 1).trim();
  }
  const view: Record<string, any> = {};
  const text: Record<string, any> = { ...inherited };
  let gradient: string[] | undefined;
  let columns = 0;
  if (declarations.display === 'flex') view.flexDirection = declarations['flex-direction'] || 'row';
  if (declarations.display === 'grid') {
    columns = Number(declarations['grid-template-columns']?.match(/repeat\((\d+)/)?.[1] || 3);
    view.flexDirection = 'row'; view.flexWrap = 'wrap';
  }
  if (declarations.display === 'none') view.display = 'none';
  for (const [raw, value] of Object.entries(declarations)) {
    let key = camel(raw);
    if (raw === 'background') {
      if (value.includes('gradient')) {
        gradient = value.match(/#[a-f\d]{3,8}\b|rgba?\([^)]+\)/gi) || undefined;
        continue;
      }
      key = 'backgroundColor';
    }
    if (raw === 'margin' || raw === 'padding') {
      const a = value.split(/\s+/).map(dimension);
      const sides = [a[0], a[1] ?? a[0], a[2] ?? a[0], a[3] ?? a[1] ?? a[0]];
      ['Top','Right','Bottom','Left'].forEach((side, i) => { if (sides[i] === 'auto' || Number.isFinite(sides[i])) view[key + side] = sides[i]; });
      continue;
    }
    if (raw === 'border-radius') {
      const a = value.split(/\s+/).map(dimension);
      if (a.length === 1) view.borderRadius = a[0];
      else ['TopLeft','TopRight','BottomRight','BottomLeft'].forEach((corner,i) => view[`border${corner}Radius`] = a[i] ?? a[i % 2]);
      continue;
    }
    if (/^border(?:-(top|bottom|left|right))?$/.test(raw)) {
      const match = value.match(/^([\d.]+)px\s+(solid|dashed|dotted)\s+(.+)$/);
      if (match) {
        view[key + 'Width'] = Number(match[1]); view[key + 'Color'] = match[3];
        if (raw === 'border') view.borderStyle = match[2];
      }
      continue;
    }
    if (raw === 'line-height') {
      const size = Number.parseFloat(declarations['font-size'] || '') || Number(inherited.fontSize) || 14;
      text.lineHeight = value.endsWith('px') ? parseFloat(value) : parseFloat(value) * size;
      continue;
    }
    if (raw === 'letter-spacing' && value.endsWith('em')) {
      text.letterSpacing = parseFloat(value) * (parseFloat(declarations['font-size']) || Number(inherited.fontSize) || 14);
      continue;
    }
    if (raw === 'text-decoration') { if (value === 'underline') text.textDecorationLine = 'underline'; continue; }
    if (numeric.has(key)) {
      const val = dimension(value);
      if (typeof val === 'number' && !Number.isFinite(val)) continue;
      (textKeys.has(key) ? text : view)[key] = val;
    } else if (enums.has(key)) (textKeys.has(key) ? text : view)[key] = value;
  }
  // CSS line-height is inherited as a ratio; don't carry a parent's tiny line box into a heading.
  if (declarations['font-size'] && !declarations['line-height']) text.lineHeight = Number(text.fontSize) * 1.4;
  const weight = text.fontWeight === 'bold' ? 700 : Number(text.fontWeight) || 400;
  text.fontFamily = `Jakarta${Math.max(400,Math.min(800,Math.round(weight/100)*100))}`;
  return { view: view as ViewStyle, text: text as TextStyle, gradient, columns, declarations };
}
