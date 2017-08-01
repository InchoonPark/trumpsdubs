import string
from speech_transcription import *
from parse_file import *

original_path = os.getcwd()

trump_files_directory = original_path + "/trump_files"
file_names = os.listdir(trump_files_directory)

for file_name in file_names:
    if(file_name != '.DS_Store'):
        words_file = open("words.txt", "w")

        print("STARTING SPEECH TRANSLATE TO TEXT FOR " + file_name)
        transcribed_array = speech_transcription(file_name)

        b_timestamps = []
        e_timestamps = []
        words = []
        percentages = []

        for i in range(len(transcribed_array)):
            if(transcribed_array[i][3] < 0.8):
                continue
            else:
            b_timestamp = str(transcribed_array[i][1])
            e_timestamp = str(transcribed_array[i][2])
            word = str(transcribed_array[i][0])
            perc = str(transcribed_array[i][3])

            line = b_timestamp + " " + e_timestamp + " " + word + " " + perc

            words_file.write(line + "\n")

            b_timestamps.append(transcribed_array[i][1])
            e_timestamps.append(transcribed_array[i][2])
            words.append(transcribed_array[i][0])
            percentages.append(transcribed_array[i][3])

        print("STARTING PARSE OF " + file_name)
        parse_file(b_timestamps, e_timestamps, words, file_name)

        words_file.close()
    else:
        continue
