import re

with open('c:/Users/kisho/Downloads/Health-Hub-Portal-1/Health-Hub-Portal-1/client/src/hooks/use-lab.ts', 'r', encoding='utf-8') as f:
    text = f.read()

if 'getApiUrl' not in text:
    text = text.replace('import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";',
                        'import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";\nimport { getApiUrl } from "@/lib/api-url";')
    text = re.sub(r'fetch\((api\.[a-zA-Z.]+\.path)', r'fetch(getApiUrl(\1)', text)
    text = re.sub(r'fetch\((url)(,? [\{])', r'fetch(getApiUrl(\1)\2', text)
    text = re.sub(r'fetch\((url)\)', r'fetch(getApiUrl(\1))', text)
    text = re.sub(r'const url \= `(.+?)`', r'const url = getApiUrl(`\1`)', text)
    
with open('c:/Users/kisho/Downloads/Health-Hub-Portal-1/Health-Hub-Portal-1/client/src/hooks/use-lab.ts', 'w', encoding='utf-8') as f:
    f.write(text)

with open('c:/Users/kisho/Downloads/Health-Hub-Portal-1/Health-Hub-Portal-1/client/src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

if 'getApiUrl' not in text:
    text = text.replace('import { api, buildUrl } from "@shared/routes";',
                        'import { api, buildUrl } from "@shared/routes";\nimport { getApiUrl } from "@/lib/api-url";')
    text = re.sub(r'fetch\((url)\)', r'fetch(getApiUrl(\1))', text)

with open('c:/Users/kisho/Downloads/Health-Hub-Portal-1/Health-Hub-Portal-1/client/src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
