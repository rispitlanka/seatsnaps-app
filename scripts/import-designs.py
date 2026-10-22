"""Import the supplied design boards into native-renderable screen descriptions.
Run from seatsnaps-app: python3 scripts/import-designs.py
Only the authored Component logic is retained; bundled browser runtimes are discarded.
"""
import base64, gzip, hashlib, html, json, re
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'seatsnaps'
OUT = ROOT / 'src/features/designs/generated'
ASSETS = ROOT / 'assets/designs'
OUT.mkdir(parents=True, exist_ok=True)
ASSETS.mkdir(parents=True, exist_ok=True)

def island(source, name, default=None):
    m = re.search(r'<script type="__bundler/' + name + r'">(.*?)</script>', source, re.S)
    return json.loads(m[1]) if m else default

def unpack(entry):
    data = base64.b64decode(entry['data'])
    return gzip.decompress(data) if entry.get('compressed') else data

class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {'tag': 'root', 'attrs': {}, 'children': []}
        self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        node = {'tag': tag, 'attrs': dict(attrs), 'children': []}
        self.stack[-1]['children'].append(node)
        if tag not in ['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'wbr']:
            self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack[-1]['tag'] == tag: self.stack.pop()
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i]['tag'] == tag:
                self.stack = self.stack[:i]
                break
    def handle_data(self, text):
        if text.strip(): self.stack[-1]['children'].append(re.sub(r'\s+', ' ', text))

asset_files = {}
screens = []
logic = []
for group, board in enumerate(sorted(SOURCE.glob('SeatSnaps App*.html')), 1):
    source = board.read_text()
    template = island(source, 'template')
    manifest = island(source, 'manifest')
    entries = re.findall(r'<h2>(.*?)</h2><iframe src="about:blank#([^"]+)"[^>]*height="(\d+)"', template)
    for title, uuid, height in entries:
        title = html.unescape(title)
        code, name = title.split(' ', 1)
        nested = unpack(manifest[uuid]).decode()
        page = island(nested, 'template')
        assets = island(nested, 'manifest', {})
        local = {}
        for key, entry in assets.items():
            if not (entry['mime'].startswith('image/') or entry['mime'].startswith('font/')): continue
            data = unpack(entry)
            ext = {'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/svg+xml':'svg','font/woff2':'woff2'}.get(entry['mime'])
            if not ext: continue
            filename = hashlib.sha256(data).hexdigest()[:20] + '.' + ext
            (ASSETS / filename).write_bytes(data)
            asset_files[filename] = filename
            local[key] = filename
        for item in island(nested, 'ext_resources', []):
            if item['uuid'] in local: local[item['id']] = local[item['uuid']]
        # Remove browser-only metadata and retain the actual screen tree.
        content = re.search(r'<x-dc>(.*?)</x-dc>', page, re.S)[1]
        content = re.sub(r'<helmet>.*?</helmet>', '', content, flags=re.S)
        parser = Tree(); parser.feed(content)
        tree = next(n for n in parser.root['children'] if isinstance(n, dict))
        script = re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', page, re.S)
        body = script[1].strip() if script else 'class Component extends DCLogic { renderVals() { return {}; } }'
        body = body.replace('class Component extends DCLogic', 'class ' + code + ' extends DesignLogic', 1)
        # Connect authored booking UI to the local demo cart.
        if code == 'D4':
            body = body.replace('var need = 2;', 'var need = this.context.count || 2;')
            body = body.replace('(picked.length * 5000)', '(picked.length * ((this.context.subtotal || 10000) / need))')
        if code == 'D5':
            body = body.replace('var total = 10300 -', 'var total = (this.context.subtotal ?? 10000) + 300 -')
        logic.append(body)
        screens.append({'id': code, 'title': name, 'group': group, 'height': int(height), 'linkColor': (re.search(r'a\s*\{\s*color:\s*([^;}]+)',page)[1].strip() if re.search(r'a\s*\{\s*color:\s*([^;}]+)',page) else '#2F5BFF'), 'tree': tree, 'assets': local})

(OUT / 'screens.json').write_text(json.dumps(screens, ensure_ascii=False, separators=(',',':')))
(OUT / 'logic.js').write_text('// Generated from the supplied design Component classes. No runtime eval.\nimport { DesignLogic } from "../model";\n\n' + '\n\n'.join(logic) + '\n\nexport const models = {' + ', '.join(s['id'] for s in screens) + '};\n')
(OUT / 'logic.d.ts').write_text('import { DesignLogic } from "../model";\nexport const models: Record<string, new () => DesignLogic>;\n')
(OUT / 'assets.ts').write_text('// Generated local assets; static requires allow Metro to bundle them offline.\nexport const assets: Record<string, number> = {\n' + '\n'.join('  '+json.dumps(f)+': require("../../../../assets/designs/'+f+'"),' for f in sorted(asset_files) if not f.endswith('.woff2')) + '\n};\n')
(ROOT / 'DESIGN-SCREENS.md').write_text('# SeatSnaps UI screen inventory\n\nAll 80 screens are available at `/screens/<ID>`. Open `/screen-library` to browse them.\n\nThese are local UI demonstrations; payment, QR admission, refunds, support requests and account changes are not submitted to services. Existing API-backed routes remain separate.\n\n| ID | Board | Screen |\n| --- | --- | --- |\n'+'\n'.join(f"| {s['id']} | {s['group']} | {s['title']} |" for s in screens)+'\n')
print(f'Imported {len(screens)} screens and {len(asset_files)} unique assets.')
