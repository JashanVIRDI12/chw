import re
import urllib.parse
import os

with open("nutra.html", "r") as f:
    content = f.read()

missing = []
for match in re.finditer(r'src="([^"]+)"', content):
    path = match.group(1)
    if path.endswith(".webp") or path.endswith(".png") or path.endswith(".jpg") or path.endswith(".mp4"):
        decoded_path = urllib.parse.unquote(path)
        if not os.path.exists(decoded_path):
            missing.append(path)

if missing:
    print("MISSING IMAGES:")
    for m in missing:
        print(m)
else:
    print("ALL IMAGES EXIST!")
