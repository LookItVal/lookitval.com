---
title: 'Classification of Birds from their Call: Preface'
description: ''
---

# § N: Preface
In the fall of 2024, I was enrolled at Johnson County Community College (JCCC) in Overland Park, Kansas, taking a course on Machine Learning. For my final project, I decided to call on my experience as an audio engineer and work on a project that involved classifying audio signals. I found a Kaggle competition from a few years back that involved classifying bird species based on the audio of their calls. The dataset was provided by the Cornell Lab of Ornithology, and was pre-labeled and organized. It was hosted on Kaggle and was easy to download and work with. At the time, I had no idea how huge this project would become, and how much I needed to learn in order to complete it. Much of this project focuses on the what I needed to learn or understand in order to get useful features from the audio data, and because of this, some of the information is simply a review of the concepts surrounding signal processing, and vector math.

The original paper is public for all to see [here](https://github.com/LookItVal/Bird-Classification-Final-Project/blob/master/revised_final.ipynb), but it grew to be quite large and become difficult to navigate, so I have broken it up into several sections you can navigate through on this site. By the end of the paper it was getting quite close to the deadline and I pushed this project to something far bigger than I had originally intended, so the original paper was completed without major editing and was filled with typos and other errors. I have done my best to clean it up, but I have not changed it from the original content, I have only fixed typos and formatting issues, and added some image web components to view the images in a more user friendly way. Anywhere I feel the need to clarify something, or add more information, I have done so in a footnote that looks like this[^1].

[^1]: I think this entire section was overly wordy. No one is really going to read this preface, are they?

In the original paper, they were *supposed* to render audio to be played in the file, but on release they did not fully link. Here I have made a proper element that plays audio that looks like this:

::ui-audio-player{src='', title='Bird Chirp'}
::

The final change was adding this simple transition swipers to before and after images but only where it made sense. Everything else was as it was in the original paper. The original paper was written in a Jupyter Notebook, but all of the code blocks have been locked and are not executable here. The original execution results are shown for the machine I ran the code on, but some of the results depend on the speed of the machine the code is run on, so your results may vary. The code for this entire case study was originally in a shared global namespace, because it was all in one notebook, so much of the code depends on code that was run in previous cells. I will do my best to label the source of important functions so you can find them when skimming. They will be in those footnotes.[^2]

[^2]: As if anyone who is going to skim this is reading the section titled "Preface".