---
title: 'Classification of Birds from their Call: Data Preparation and Exploration'
description: ''
---

# § II: Data Preparation and Exploration

## A. Initial Setup

### 1. Building the Virtual Environment

The first step was to establish a virtual environment with the required libraries. A virtual environment was created with `micromamba` to ensure that all dependencies, libraries, and tools used in the project are isolated from the host system. This approach prevents version conflicts and facilitates seamless collaboration and deployment.[^1]

[^1]: I should have made it more clear that `micromamba` is intended to be a drop in replacement for `conda`. There is nothing special about it over other virtual environment managers, its just the one I used.

```bash
micromamba create ./.conda pandas numpy scipy ipython scikit-learn matplotlib pydub ffmpeg cupy
```

### 2. Importing Libraries

We can now import the specific parts of these libraries and the standard library that we need for this project.

```python
# Standard Library
import time
import os
import sys
import re
import warnings
import gc
import pickle
from datetime import datetime
from typing import Generator, Optional, Callable, Tuple, Literal, List
from contextlib import contextmanager
from functools import lru_cache

# Disable only FutureWarnings - they are annoying
warnings.simplefilter(action='ignore', category=FutureWarning)

# Anaconda Libraries
import pandas as pd
import numpy as np
import scipy as sp
from IPython.display import display, HTML, DisplayHandle
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import cross_val_score
from sklearn.neural_network import MLPClassifier
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors

# Third Party Libraries
import cupy as cp
import cupyx as cpx
import cupyx.scipy.fft as cufft
import cupyx.scipy.signal as cusig
from pydub import AudioSegment
from pydub.utils import mediainfo

OutOfMemoryError = cp.cuda.memory.OutOfMemoryError
```

#### a) Overview of Libraries and their purposes [^1]

[^1]: Except its really only an overview of the libraries I used that are not part of the standard library or Anaconda.

##### (i) `pydub`

`pydub` is a library used for simple processing of audio files. It provides a simple means for decoding mp3 files in python, and manipulating the audio data in a relatively basic way. `pydub` provides the ability to split up audio files as if they were python lists where the index of the list is the number of milliseconds from the beginning of the file. With the addition of another library called `simpleaudio`, audio can be played directly with python, but for this project all audio files will exported and displayed with html in markdown cells.[^2] Below are basic examples of what working with audio in `pydub` looks like:

[^2]: 1. The exported audio files did not come through in the final paper, and 2. here they will be rendered with full html audio players, because, of course, this is a website.

```python
# loads audio file
sound = AudioSegment.from_file(filename, format='wav')

# cuts the sound to only the first second of the file
sound = sound[:1000]

# returns the signal array for more nuanced signal manipulation
signal = sound.get_array_of_samples()

# returns a list of mono sounds for each channel in the audio file
sounds = sound.split_to_mono()
Metadata of audio files is also accessed with pydub either through the pydub.AudioSegment object or through the pydub.utils.mediainfo function.

# the length of the audio file in miliseconds
len(sound)

# the sample rate of the audio file
sound.frame_rate

# the number of channels in the audio file
sound.channels

# returns the name of the format used to store the audio file
mediainfo(filename)['format_name']

# returns the sample format, needed to get the bit depth of the file
mediainfo(filename)['sample_fmt']
```

##### (ii) `ffmpeg`

`ffmpeg` is a powerful tool for handling a wide variety of media formats, including audio and video. Within this environment, `ffmpeg` serves as the backend for `pydub` to decode `.mp3` files. By default, when an `.mp3` file is loaded using `pydub`, `ffmpeg` is called automatically to handle the decoding. This integration ensures that the project can work seamlessly with compressed audio formats like `.mp3`.[^3]

[^3]: This really doesn't accent exactly how ubiquitous `ffmpeg` is in the media processing world, and that `ffmpeg` is not a python library, but a tool. `ffmpeg` is a tool that powers the whole media world. See relevant XKCD about `ffmpeg` [here](https://xkcd.com/2347/).

```python
# decodes codec with ffmpeg and returns the AudioSegment object as normal
sound = AudioSegment.from_file(filename, format='mp3')
```

##### (iii) `cupy`

`cupy` is a GPU-accelerated library that provides a drop-in replacement for the `numpy` and `scipy` libraries, leveraging NVIDIA's CUDA toolkit for GPU-accelerated parallel processing. This allows for significant performance improvements when performing computationally intensive tasks, such as Fourier transformations, matrix operations, and large-scale data manipulations.

In this project, `cupy` was particularly useful for processing large audio datasets and accelerating tasks like feature extraction and data preprocessing via signal transformations, where CPU-based computation would be too slow.

```python
import cupy as cp

# Create a large random array on the GPU
gpu_array = cp.random.rand(1000000)

# Perform fast computations on the GPU
mean_value = cp.mean(gpu_array)
```

Arrays in `cupy` match the syntax of `numpy.ndarray` objects[^4] and `scipy` methods can be called via the `cupyx.scipy` library.

[^4]: You can convert between `numpy` and `cupy` arrays with `cp.asarray()` and `cp.asnumpy()`, and kind of think of the type as information about where the data is stored, with `numpy.ndarray` being stored in system RAM and `cupy.ndarray` being stored in GPU VRAM.

###### CUDA-Specific Features

While `cupy` emulates `numpy` and `scipy` functionality, it also offers CUDA-specific tools to optimize memory and computation. These are critical for managing GPU resources efficiently when working with large datasets or computationally intensive tasks.

- **Device Management**: `cupy` supports multi-GPU setups and allows explicit control over which GPU device is used:

```python
gpu = cp.cuda.Device(0)  # Access the first GPU
gpu.use()  # Set it as the active GPU
```
```output
<CUDA Device 0>
```

- **Memory Management**: Memory allocation and deallocation are handled through memory pools to reduce overhead during GPU memory operations. The default memory pool can be configured to limit VRAM usage:

```python
# Set the memory pool limit to 75% of the total VRAM
vram_pool = cp.get_default_memory_pool()
pinned_vram_pool = cp.get_default_pinned_memory_pool()
with gpu:
    vram_pool.set_limit(fraction=0.75)

# Clear the memory pool
vram_pool.free_all_blocks()
pinned_vram_pool.free_all_blocks()

# clear the fft plan cache
cp.fft.config.clear_plan_cache()

def clear_gpu_memory() -> None:
    """Clear the GPU memory pool and the pinned memory pool, and clear the FFT plan cache."""
    gc.collect() # Force garbage collection
    vram_pool.free_all_blocks() # Free all memory blocks in the GPU memory pool
    pinned_vram_pool.free_all_blocks() # Free all memory blocks in the pinned memory pool
    cp.fft.config.clear_plan_cache() # Clear the FFT plan cache
```

Manually allocating memory like this helps ensure explicit memory errors occur and stop the program, speeding up debugging time. `cupy` will run without manual allocation of VRAM, it is just more likely to have problems related to memory overflow without explicitly explaining the cause of the program error, and memory management is not managed well by the native python garbage collector in `cupy` so the use of the `clear_gpu_memory` function will become more necessary for some complex functions.[^5]

[^5]: The function does more than it likely needs to every time but its pretty through in making sure the GPU memory is cleared, and that became a big issue when working on this project.

- **FFT Plans with `cupy.cuda.cufft`:** `cupy` provides access to CUDA's FFT library (cuFFT), which allows for pre-planning and optimizing FFT operations. Each FFT plan is formed based on the shape of the input array. To improve performance an prevent recalculating FFT plans, the resulting FFT plan is automatically cached in the default memory pool. To perform an FFT without caching the FFT plan, you can manually create a plan and pass the plan into the FFT, or you can clear the cache of the FFT plan whenever you like with a simple syntax.[^6]

[^6]: This is mostly important knowledge in that it always makes the FFT plan by default, so if you are doing a lot of FFTs on different sized arrays, you can fill up your GPU memory with FFT plans that are not needed anymore.

```python
with cufft.get_fft_plan(signal, value_type='R2C'):  # Create FFT plan and pass into FFT function
    gpu_fft = cufft.rfft(signal, overwrite_x=True)  # This does not cache FFT plan

# or clear the cache at any point
cp.fft.config.clear_plan_cache()
```

### 3. Establishing Utility Functions

*Moved to its own section [here](/case-studies/bird-classification/2-3-establishing-utility-functions)*
