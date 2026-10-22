const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname,'..');
const cache = new Map();
function load(relative) {
  const filename = path.resolve(root,relative);
  if(cache.has(filename)) return cache.get(filename);
  const source=fs.readFileSync(filename,'utf8');
  const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const module={exports:{}};
  vm.runInNewContext(output,{module,exports:module.exports,require:(request)=>load(path.relative(root,path.resolve(path.dirname(filename),request+'.ts'))),console},{filename,timeout:2000});
  cache.set(filename,module.exports);return module.exports;
}
const {models}=load('src/features/designs/generated/logic.js');
const {expand,resolve}=load('src/features/designs/model.ts');
const {destination}=load('src/features/designs/navigation.ts');
const {nativeStyle}=load('src/features/designs/styles.ts');
const screens=JSON.parse(fs.readFileSync(path.join(root,'src/features/designs/generated/screens.json')));
const ids=new Set(screens.map(s=>s.id));
assert.equal(screens.length,80);assert.equal(ids.size,80);
const unknown=[];
function walk(node,scope,screen) {
  if(typeof node==='string') {assert(!String(resolve(node,scope)).includes('{{'),screen.id+' unresolved text');return;}
  const css=String(resolve(node.attrs.style,scope)||'');
  const style=nativeStyle(css);
  for(const group of [style.text,style.view]) for(const [key,v] of Object.entries(group)) assert(!(typeof v==='number' && !Number.isFinite(v)),`${screen.id} invalid ${key}`);
  if(node.tag==='a') {
    const href=String(resolve(node.attrs.href,scope)||'');
    const label=node.attrs['aria-label'] ? String(resolve(node.attrs['aria-label'],scope)) : text(node,scope);
    const target=destination(screen.id,href,label);
    if(target) assert(target==='back' || ids.has(target),`${screen.id} links to missing ${target}`);
    else if(href.endsWith('.dc.html')) unknown.push(`${screen.id}: ${href} (${label})`);
  }
  for(const child of expand(node.children,scope)) walk(child.node,child.scope,screen);
}
function text(node,scope) {return typeof node==='string'?String(resolve(node,scope)||''):expand(node.children,scope).map(c=>text(c.node,c.scope)).join(' ').replace(/\s+/g,' ').trim();}
for(const screen of screens) {
  const model=new models[screen.id]();
  walk(screen.tree,model.renderVals(),screen);
  for(const file of Object.values(screen.assets)) assert(fs.existsSync(path.join(root,'assets/designs',file)),`missing asset ${file}`);
}
assert.deepEqual(unknown,[],'Unmapped design links');
const seats=new models.D4();
let view=seats.renderVals();
assert.equal(view.chips.length,2);
view.rows[0].left[0].pick();assert.equal(seats.state.picked.length,2,'occupied seats stay unavailable');
view.rows[2].left[4].pick();assert.equal(seats.state.picked.length,1,'selected seat can be removed');
assert.match(seats.renderVals().ctaLabel,/Pick 1 more/);
seats.renderVals().rows[2].left[4].pick();assert.equal(seats.renderVals().ctaLabel,'Continue to checkout');
seats.context={count:3,subtotal:15000};
seats.renderVals().rows[2].right[1].pick();
assert.equal(seats.state.picked.length,3);
assert.equal(seats.renderVals().ctaLabel,'Continue to checkout');
assert.equal(seats.renderVals().total,'LKR 15,000');
const notifications=new models.H1();
let n=notifications.renderVals();
const mark=Object.values(n).find(v=>typeof v==='function');assert(mark);mark();assert.equal(notifications.state.allRead,true);
const faq=new models.J5();const f=faq.renderVals();
assert(Object.values(f).some(Array.isArray),'FAQ provides topic/question groups');
const checkout=new models.D5();
assert.match(checkout.renderVals().total,/10,300/);
const promo=Object.entries(checkout.renderVals()).find(([key,v])=>typeof v==='function' && /promo|apply/i.test(key));
assert(promo,'checkout promo interaction exists');promo[1]();assert.match(checkout.renderVals().total,/9,300/);
assert.equal(destination('C1','https://claude.ai/artifact/example','Profile'),'E2');
assert.equal(destination('C1','https://claude.ai/artifact/example','Notifications, 3 unread'),'H1');
assert.equal(destination('D5','Confirm.dc.html','Pay LKR 10,300'),'I3');
console.log('PASS: 80 screen trees, assets, navigation, native styles, seat availability, notification and promo interactions.');
