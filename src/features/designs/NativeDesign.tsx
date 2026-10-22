import { Fragment, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View, type TextStyle, type ViewStyle } from 'react-native';
import { Image, type ImageStyle } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { assets } from './generated/assets';
import { expand, resolve, type DesignNode, type DesignScreen, type Values } from './model';
import { demoText } from './text';
import { nativeStyle } from './styles';
import { useDesignStore } from './store';

export type DesignAction = { label: string; href: string; node: Exclude<DesignNode,string>; callback?: (event?: any) => void };
type Props = {
  node: DesignNode;
  scope: Values;
  screen: DesignScreen;
  onAction: (action: DesignAction) => void;
  inherited?: TextStyle;
  override?: ViewStyle;
  path?: string;
  inline?: boolean;
};
const inlineTags = new Set(['span','strong','b','em','i','br','small','label']);
const textTags = new Set(['h1','h2','h3','h4','p','label','small','strong','b','em']);
function simple(node: DesignNode): boolean {
  return typeof node === 'string' || (inlineTags.has(node.tag) && !/display:|width:|height:|background:/.test(node.attrs.style || '') && node.children.every(simple));
}
export function nodeLabel(node: DesignNode, scope: Values): string {
  if (typeof node === 'string') return String(resolve(node, scope) ?? '');
  if (node.attrs['aria-label']) return String(resolve(node.attrs['aria-label'], scope) ?? '');
  return expand(node.children, scope).map(c => nodeLabel(c.node, c.scope)).join(' ').replace(/\s+/g,' ').trim();
}
function escapeXml(value: string) { return value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
function svgXml(node: DesignNode, scope: Values, color: string): string {
  if (typeof node === 'string') return escapeXml(String(resolve(node, scope) ?? ''));
  const attrs = Object.entries(node.attrs).filter(([k]) => !k.startsWith('sc-') || k === 'sc-camel-view-box').map(([key,value]) => {
    let val = String(resolve(value, scope) ?? '').replace(/currentColor/g, color);
    return `${key === 'sc-camel-view-box' ? 'viewBox' : key}="${escapeXml(val)}"`;
  }).join(' ');
  return `<${node.tag} ${node.tag === 'svg' ? 'xmlns="http://www.w3.org/2000/svg"' : ''} ${attrs}>${expand(node.children,scope).map(c => svgXml(c.node,c.scope,color)).join('')}</${node.tag}>`;
}

// A few dynamic /_blob/ images were omitted by the HTML exporter. Reuse the
// supplied event photography so the demo is bundled and works without a network.
const photos = ['fc6b103704039e814017.jpg','af10b17eed0656e694ee.jpg','a80f184ac7acacecd530.jpg','6a9c9cd8d8f6a42fc591.jpg'];
function imageSource(src: string, screen: DesignScreen) {
  if (screen.assets[src]) return assets[screen.assets[src]];
  if (src.startsWith('/_blob/')) {
    if(src.includes('38d8301699fbd525716d5ddf2cd98a11')) return assets[photos[0]];
    if(src.includes('91bf1841d4c8406abbd784267d171479')) return assets[photos[1]];
    const index = [...src].reduce((a,c) => a + c.charCodeAt(0),0) % photos.length;
    return assets[photos[index]];
  }
  if (/^(https?:|data:)/.test(src)) return { uri:src };
  return undefined;
}


function VerificationCode() {
  const store=useDesignStore();
  const code=store.data.form.L2?.verification || '';
  return <View style={{height:56,position:'relative'}}>
    <View pointerEvents="none" style={{flexDirection:'row',gap:8}}>{Array.from({length:6},(_,i)=><View key={i} style={{flex:1,height:56,borderRadius:14,borderWidth:code.length===i?2:1,borderColor:code.length===i?'#2F5BFF':'#E3E7F1',backgroundColor:code[i]?'#FFFFFF':'#F7F8FB',alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:'Jakarta800',fontSize:22,color:'#0A1130'}}>{code[i] || ''}</Text></View>)}</View>
    <TextInput accessibilityLabel="Email verification code" value={code} onChangeText={value=>store.setField('L2','verification',value.replace(/\D/g,'').slice(0,6))} maxLength={6} keyboardType="number-pad" textContentType="oneTimeCode" caretHidden style={{position:'absolute',top:0,left:0,right:0,bottom:0,opacity:0.02,color:'transparent'}} />
  </View>;
}

export function NativeDesign(props: Props): ReactNode {
  const { node, scope, inherited = {color:'#0A1130',fontSize:14}, screen, onAction, override, path = 'root', inline = false } = props;
  const store = useDesignStore();
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  if (typeof node === 'string') {
    const value = demoText(String(resolve(node, scope) ?? ''),screen.id,store.data);
    return value.trim() ? (inline ? value : <Text style={inherited}>{value}</Text>) : null;
  }
  const { tag, attrs } = node;
  if (['script','style','helmet','head','option'].includes(tag)) return null;
  if (tag === 'br') return <Text>{'\n'}</Text>;
  const css = String(resolve(attrs.style, scope) || '');
  const { view, text, gradient, columns, declarations } = nativeStyle(css, inherited);
  if(tag==='a' && !declarations.color && screen.linkColor) text.color=screen.linkColor;
  const children = expand(node.children, scope, path);
  const value = (name: string) => resolve(attrs[name],scope);
  const disabled = (attrs.disabled != null && value('disabled') !== false && value('disabled') !== 'false') || declarations['pointer-events'] === 'none' || declarations.cursor === 'not-allowed';
  const label = nodeLabel(node,scope);
  const callback = value('sc-camel-on-click');
  const interactive = tag === 'a' || tag === 'button' || typeof callback === 'function';
  const style: ViewStyle = { ...view, ...override };
  if(screen.id==='D4' && tag==='button' && /^Seat [A-Z]\d/.test(label)) style.width=Math.min(23,Math.max(14,((scope.$width || 390)-160)/10));
  if(screen.id==='L2' && attrs['aria-labelledby']==='vlabel') return <VerificationCode />;
  const content = (childInline = false): ReactNode => children.map(({node: child,scope: childScope,key}) => (
    <NativeDesign key={key} node={child} scope={childScope} inherited={text} screen={screen} onAction={onAction} path={key} inline={childInline} />
  ));
  const onPress = () => {
    if (disabled) return;
    if (!callback && tag === 'button' && (attrs.role === 'tab' || /^(today|tomorrow|this weekend|next week|all|free|verified|music|comedy)$/i.test(label))) setSelected(!selected);
    onAction({label,href:String(value('href') || ''),node,callback:typeof callback === 'function' ? callback : undefined});
  };
  if (tag === 'svg') {
    return <Image source={{ uri:'data:image/svg+xml;utf8,' + encodeURIComponent(svgXml(node,scope,String(text.color || '#0A1130'))) }} style={{width:Number(attrs.width)||24,height:Number(attrs.height)||24,...style} as ImageStyle} contentFit="contain" accessibilityLabel={attrs['aria-hidden'] === 'true' ? undefined : label} />;
  }
  if (tag === 'img') {
    return <Image source={imageSource(String(value('src') || ''), screen)} style={style as ImageStyle} contentFit={declarations['object-fit'] === 'contain' ? 'contain' : 'cover'} accessibilityLabel={String(value('alt') || '')} />;
  }
  if (tag === 'input' || tag === 'textarea') {
    const type = String(value('type') || 'text');
    const key = attrs.id || attrs.name || attrs.placeholder || path;
    const current = store.data.form[screen.id]?.[key];
    const onChange = value('sc-camel-on-change');
    if (type === 'checkbox' || type === 'radio') {
      return <Switch accessibilityLabel={attrs['aria-label'] || key} value={current !== undefined ? current === 'true' : checked || attrs.checked != null} onValueChange={next => {setChecked(next);store.setField(screen.id,key,String(next));if(typeof onChange==='function') onChange({target:{checked:next,value:next}});}} trackColor={{false:'#D5DAE6',true:'#2F5BFF'}} style={style} />;
    }
    return <TextInput
      accessibilityLabel={attrs['aria-label'] || attrs.placeholder || key}
      value={current ?? String(value('value') ?? '')}
      placeholder={String(value('placeholder') || '')}
      placeholderTextColor="#7A8398"
      secureTextEntry={type === 'password'}
      keyboardType={type === 'email' ? 'email-address' : type === 'tel' || type === 'number' ? 'number-pad' : 'default'}
      autoCapitalize={type === 'email' || type === 'password' ? 'none' : 'sentences'}
      autoCorrect={type !== 'email' && type !== 'password'}
      editable={!disabled && attrs.readonly == null}
      multiline={tag === 'textarea'}
      maxLength={attrs.maxlength ? Number(attrs.maxlength) : undefined}
      style={[{minHeight:24,padding:0,minWidth:0,flexShrink:1},style as TextStyle,text]}
      onChangeText={next => {store.setField(screen.id,key,next);if(typeof onChange==='function') onChange({target:{value:next}});}}
      returnKeyType={screen.id === 'C6' ? 'search' : 'done'}
      onSubmitEditing={screen.id === 'C6' ? () => onAction({label:'Submit search',href:'Results.dc.html',node}) : undefined}
    />;
  }
  if (tag === 'select' || tag === 'sc-raw-select') {
    const options = node.children.filter((n): n is Exclude<DesignNode,string> => typeof n !== 'string' && n.tag === 'option');
    const key = attrs.id || path;
    const current = store.data.form[screen.id]?.[key] || (options[0] ? nodeLabel(options[0],scope) : 'Select');
    return <Pressable accessibilityRole="button" accessibilityLabel={current} style={[{padding:12},style]} onPress={() => {const index=options.findIndex(o=>nodeLabel(o,scope)===current);store.setField(screen.id,key,nodeLabel(options[(index+1)%options.length],scope));}}><Text style={text}>{current} ▾</Text></Pressable>;
  }
  if (inline && interactive) return <Text onPress={onPress} accessibilityRole="link" style={[style as TextStyle,text]}>{content(true)}</Text>;
  const isText = !interactive && (inline || textTags.has(tag) || (tag === 'span' && simple(node))) && children.every(c => simple(c.node));
  if (isText) return <Text style={[style as TextStyle,text]}>{content(true)}</Text>;

  const inner = columns ? (
    <View style={{flexDirection:'row',flexWrap:'wrap',gap:Number(view.gap)||0}} onLayout={e=>setGridWidth(e.nativeEvent.layout.width)}>
      {children.map(({node:child,scope:childScope,key}) => <NativeDesign key={key} node={child} scope={childScope} inherited={text} screen={screen} onAction={onAction} path={key} override={{width:gridWidth ? (gridWidth - (Number(view.gap)||0)*(columns-1))/columns : `${100/columns}%`}} />)}
    </View>
  ) : content();
  const background = gradient && gradient.length > 1 ? <LinearGradient pointerEvents="none" colors={gradient as [string,string,...string[]]} start={{x:0,y:0}} end={{x:0,y:1}} style={{position:'absolute',top:0,left:0,right:0,bottom:0,borderRadius:view.borderRadius,borderTopLeftRadius:view.borderTopLeftRadius,borderTopRightRadius:view.borderTopRightRadius}} /> : null;
  const horizontal = !interactive && declarations.display === 'flex' && !declarations['flex-direction'] && declarations.overflow === 'hidden' && children.some(c => typeof c.node !== 'string' && /flex-shrink:\s*0|width:/.test(String(resolve(c.node.attrs.style,c.scope))));
  if (horizontal) return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexGrow:0,flexShrink:0}} contentContainerStyle={{...style,overflow:'visible'}}>{background}{inner}</ScrollView>;
  // Grid owns its inner row; the outer container only supplies background and padding.
  if (columns) {style.flexDirection='column';style.flexWrap='nowrap';delete style.gap;}
  if (interactive) return <Pressable accessibilityRole={attrs.role === 'switch' ? 'switch' : 'button'} accessibilityLabel={label || 'Continue'} accessibilityState={{disabled,selected:selected || value('aria-selected') === 'true'}} disabled={disabled} onPress={onPress} style={({pressed})=>[style,selected?{backgroundColor:'#EAF0FF',borderColor:'#2F5BFF'}:null,pressed?{opacity:0.72}:null]}>{background}{inner}</Pressable>;
  if (tag === 'hr') return <View style={{height:1,backgroundColor:'#E3E7F1',...style}} />;
  return <View style={style}>{background}{inner}</View>;
}
