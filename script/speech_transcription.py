import json
from os.path import join, dirname
import os
from watson_developer_cloud import SpeechToTextV1

def speech_transcription(file_name):
    username = '83d39326-9222-47e2-9a1a-3c99fe8d00b4'
    password = 'm22kmYEflKcc'

    file_path = os.getcwd() + '/solid/' + file_name

    audio = open(file_path, 'rb')

    speech_to_text = SpeechToTextV1(
        username=username,
        password=password,
        x_watson_learning_opt_out=False
    )

    a = json.dumps(speech_to_text.recognize(
        audio, content_type='audio/wav', timestamps=True, inactivity_timeout=600,
        profanity_filter=False, continuous=True, word_confidence=True, word_alternatives_threshold=1),
        indent=2)

    b = json.loads(a)

    print b

    transcription_array = []

    for i in range(len(b["results"])):
        for j in range(len(b["results"][i]["alternatives"][0]["timestamps"])):
            word = (b["results"][i]["alternatives"][0]["timestamps"][j][0]).lower()
            start = (b["results"][i]["alternatives"][0]["timestamps"][j][1])
            end = (b["results"][i]["alternatives"][0]["timestamps"][j][2])
            confidence = (b["results"][i]["alternatives"][0]["word_confidence"][j][1])

            transcription_array.append([word, start, end, confidence])

    print transcription_array

    return transcription_array
