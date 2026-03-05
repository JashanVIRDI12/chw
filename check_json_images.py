import re
import urllib.parse
import os

with open("nutra.html", "r") as f:
    content = f.read()

missing = []

# check src attributes
for match in re.finditer(r'src="([^"]+)"', content):
    path = match.group(1)
    if path.endswith(".webp") or path.endswith(".png") or path.endswith(".jpg") or path.endswith(".mp4"):
        decoded = urllib.parse.unquote(path)
        if not os.path.exists(decoded) and not os.path.exists(path):
            missing.append("SRC: " + path)

# check JSON string literals
for match in re.finditer(r'"image":\s*"([^"]+)"', content):
    path = match.group(1)
    decoded = urllib.parse.unquote(path)
    if not os.path.exists(decoded) and not os.path.exists(path):
        missing.append("JSON: " + path)

if missing:
    print("MISSING:")
    for m in missing:
        print(m)
else:
    print("ALL OK")
