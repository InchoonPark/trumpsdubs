import os
from pydub import AudioSegment

def parse_audio(b_timestamps, e_timestamps, words, speech_audio):
    for i in range(len(b_timestamps)):
        start = int(1000 * b_timestamps[i]);
        end = int(1000 * e_timestamps[i]);
        word = speech_audio[start:end]
        word_string = words[i].lower() + '.mp3';
        word.export(word_string, format="mp3")

def parse_file(b_timestamps, e_timestamps, words, file_name):
    original_path = os.getcwd()
    words_path = os.getcwd() + "/trump_files"
    speech_file_path = os.getcwd()
    os.chdir(speech_file_path)
    speech_audio = AudioSegment.from_wav("trump_files/" + file_name)
    os.chdir(words_path)
    parse_audio(b_timestamps, e_timestamps, words, speech_audio)
    os.chdir(original_path)
