import os
import json
from tqdm import tqdm
from PIL import Image

src = 'source/assets/gallery'
target = 'source/gallery/data.json'

data = {}
data['pics'] = []
for filename in tqdm(os.listdir(src)):
    localfile = '{}/{}'.format(src, filename)
    image = Image.open(localfile)
    width, height = image.size
    url = '/blog/assets/gallery/{}'.format(filename)
    t = {}
    t['url'] = url
    t['width'] = str(width)
    t['height'] = str(height)
    data['pics'].append(t)

with open(target, 'w+') as wf:
    wf.write(json.dumps(data))
