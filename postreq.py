import requests
import json

# URL
url = 'https://proudtechnologicalarguments.tobyfox1.repl.co'

## this is the updated routine...
json_data = [
    {
        "subject": "Mathematics",
        "teacher": "MS",
        "category": "TH",
        "level": "BEI II/I",
        "group": "Both",
        "day": "Wednesday",
        "start_time": "10:30:00",
        "end_time": "11:55:00",
        "date": "2023-07-05"
    },
    {
        "subject": "Instrumentation",
        "teacher": "RK",
        "category": "TH",
        "level": "BEI II/I",
        "group": "Both",
        "day": "Wednesday",
        "start_time": "11:55:00",
        "end_time": "13:35:00",
        "date": "2023-07-05"
    },
    {
        "subject": "Control System",
        "teacher": "UKG",
        "category": "TH",
        "level": "BEI II/I",
        "group": "Both",
        "day": "Wednesday",
        "start_time": "14:00:00",
        "end_time": "17:00:00",
        "date": "2023-07-19"
    }
]

# iterable = json.dumps(json_data)
for i in range(0, len(json_data)):
  # sending get request and saving the response as response object
  r = requests.post(url=url, data=json_data[i])
  # extracting data in json format
  data = r
  print(data)