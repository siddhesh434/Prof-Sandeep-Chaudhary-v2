import os
import re

css_dir = r"c:\Users\Hp\Desktop\Projects\sandeep sir\Prof-Sandeep-Chaudhary-v2\public"
targets = ["container", "main-wrapper"]

for filename in os.listdir(css_dir):
    if filename.endswith(".css"):
        filepath = os.path.join(css_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for target in targets:
            # Look for .classname { or .classname, 
            pattern =  r'\.' + re.escape(target) + r'\s*[{},]'
            matches = re.findall(pattern, content)
            if matches:
                 print(f"Found .{target} in {filename}")
