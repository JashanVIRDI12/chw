import re
with open('nutra.html', 'r') as f:
    text = f.read()
import urllib.parse
for m in re.finditer(r'<img[^>]+src="([^"]+)"', text):
    print("SRC:", urllib.parse.unquote(m.group(1)))
for m in re.finditer(r'"image":\s*"([^"]+)"', text):
    print("JSON:", urllib.parse.unquote(m.group(1)))
