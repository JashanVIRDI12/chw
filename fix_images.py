import re
import urllib.parse

with open("nutra.html", "r") as f:
    content = f.read()

def repl(match):
    path = match.group(1)
    if "images/Nutraceutical Products" in path:
        encoded_path = urllib.parse.quote(path)
        return f'src="{encoded_path}"'
    return match.group(0)

new_content = re.sub(r'src="([^"]+)"', repl, content)

with open("nutra.html", "w") as f:
    f.write(new_content)
