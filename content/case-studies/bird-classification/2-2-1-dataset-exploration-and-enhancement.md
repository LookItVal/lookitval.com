---
title: 'Classification of Birds from their Call: Utility Functions'
description: ''
---

# § II: Data Preparation and Exploration
## B. Dataset Exploration and Enhancement
### 1. Initial Dataset Assessment
#### a) Downloading and Viewing Primary Dataset

The first data source is from a [kaggle competition](https://www.birds.cornell.edu/clementschecklist/introduction/updateindex/october-2023/download/). This dataset provides preorganized bird audio data, structured as .mp3 files grouped by bird species. Each species is identified by a unique eBird code, a standard maintained by the Cornell Lab of Ornithology.

This can also be downloaded by running this code after accepting the terms of the competition on a valid kaggle account:

```bash
kaggle competitions download -c birdclef-2023
```

The dataset directory structure is as follows:

```directory
.
├── example_test_audio
│  ├── BLKFR-10-CPL_20190611_093000.pt540.mp3
│  └── ORANGE-7-CAP_20190606_093000.pt623.mp3
├── example_test_audio_metadata.csv
├── example_test_audio_summary.csv
├── sample_submission.csv
├── test.csv
├── train.csv
└── train_audio
   ├── aldfly
   │  ├── XC2628.mp3
   │  └── ...
   ├── ameavo
   │  ├── XC99571.mp3
   │  └── ...
   └── ...
```

Key components of the dataset:

- train_audio/: Audio files organized by bird species (eBird codes as folder names).
- train.csv: Metadata about each audio file, including eBird codes, audio duration, and recording location.

```python
df = pd.read_csv('data/birdsong-recognition/train.csv')
print(df.columns)
df.head()
```

```output
Index(['rating', 'playback_used', 'ebird_code', 'channels', 'date', 'pitch',
       'duration', 'filename', 'speed', 'species', 'number_of_notes', 'title',
       'secondary_labels', 'bird_seen', 'sci_name', 'location', 'latitude',
       'sampling_rate', 'type', 'elevation', 'description', 'bitrate_of_mp3',
       'file_type', 'volume', 'background', 'xc_id', 'url', 'country',
       'author', 'primary_label', 'longitude', 'length', 'time', 'recordist',
       'license'],
      dtype='object')
```
| # | rating | playback_used | ebird_code | channels   | date       | pitch         | duration | filename     | speed         | species.         | ... | xc_id  | url                               | country       | author           | primary_label                      | longitude | length        | time  | recordist        | license                                           |
|---|--------|---------------|------------|------------|------------|---------------|----------|--------------|---------------|------------------|-----|--------|-----------------------------------|---------------|------------------|------------------------------------|-----------|---------------|-------|------------------|---------------------------------------------------|
| 0 | 3.5    | no            | aldfly     | 1 (mono)   | 2013-05-25 | Not specified | 25       | XC134874.mp3 | Not specified | Alder Flycatcher | ... | 134874 | https://www.xeno-canto.org/134874 | United States | Jonathon Jongsma | Empidonax alnorum_Alder Flycatcher | -92.962   | Not specified | 8:00  | Jonathon Jongsma | Creative Commons Attribution-ShareAlike 3.0       |
| 1 | 4.0    | no            | aldfly     | 2 (stereo) | 2013-05-27 | both          | 36       | XC135454.mp3 | both          | Alder Flycatcher | ... | 135454 | https://www.xeno-canto.org/135454 | United States | Mike Nelson      | Empidonax alnorum_Alder Flycatcher | -82.1106  | 0-3(s)        | 08:30 | Mike Nelson      | Creative Commons Attribution-NonCommercial-Sha... |
| 2 | 4.0    | no            | aldfly     | 2 (stereo) | 2013-05-27 | both          | 39       | XC135455.mp3 | both          | Alder Flycatcher | ... | 135455 | https://www.xeno-canto.org/135455 | United States | Mike Nelson      | Empidonax alnorum_Alder Flycatcher | -82.1106  | 0-3(s)        | 08:30 | Mike Nelson      | Creative Commons Attribution-NonCommercial-Sha... |
| 3 | 3.5    | no            | aldfly     | 2 (stereo) | 2013-05-27 | both          | 33       | XC135456.mp3 | both          | Alder Flycatcher | ... | 135456 | https://www.xeno-canto.org/135456 | United States | Mike Nelson      | Empidonax alnorum_Alder Flycatcher | -82.1106  | 0-3(s)        | 08:30 | Mike Nelson      | Creative Commons Attribution-NonCommercial-Sha... |
| 4 | 4.0    | no            | aldfly     | 2 (stereo) | 2013-05-27 | both          | 36       | XC135457.mp3 | both          | Alder Flycatcher | ... | 135457 | https://www.xeno-canto.org/135457 | United States | Mike Nelson      | Empidonax alnorum_Alder Flycatcher | -82.1106  | 0-3(s)        | 08:30 | Mike Nelson      | Creative Commons Attribution-NonCommercial-Sha... |

*5 rows × 35 columns*