---
title: 'Classification of Birds from their Call: Utility Functions'
description: ''
---

# § II: Data Preparation and Exploration
## A. Initial Setup
### 3. Establishing Utility Functions :u-i-footnote{note='All of the functions in this section were not set up like a page of documentation like you might hope, but were all the actual source code in the original notebook. All of these functions are documented using PEP 257 docstrings so you can use that as the documentation." icon='1'}

#### a) Simple Aliases

```python
MAX_AMPLITUDE_AT_16_BIT = 32767 # The maximum amplitude for a 16-bit audio signal

def load_sound_file(file: str) -> Optional[AudioSegment]:
    """Method for loading an audio file and ensuring that the correct format is used to decode the file.

    Args:
        file (str): The path to the file to be loaded
    
    Returns:
       Optional[AudioSegment]: The audio file as an AudioSegment object, or None if an error occurs while loading the file.
    """
    try:
        return AudioSegment.from_file(file, format=mediainfo(file)['format_name'])
    except: # If the file cannot be loaded, print an error message and return None
        print(f"Error loading file {file}")
        print(f'Format: {mediainfo(file)["format_name"]}')
        return None
```

Believe it or not, sometimes the filename ends in `.mp3` but the actual internal format is used is that of a `.wav` file. In those cases `mediainfo(file)['format_name']` will return the actual internal format. :u-i-footnote{note='I need you to just re-read that last sentence. You can not believe how confusing that was' icon='2'}

```python
def print_boundry(message: str="") -> None:
    """Print a message surrounded by a line of dashes with a total length of 100 characters
    
    Args:
        message (str, optional): The message to be printed. Prints an empty line if no message is provided.
    """
    length = (100 - len(message)) // 2
    print('-' * length, message, '-' * length)
```
```python
# Type Aliases
ndarray = np.ndarray | cp.ndarray
number = int | float
```

#### b) Data Conversions

```python
def percentage_color_conversion(input_value: number, input_min: int=0, input_max: int=100, output_min: int=0, output_max: int=110) -> float:
    """Convert a percentage value to a color in the range of red to green.
    The input value is mapped to a non-linear scale to create a more pronounced color change effect.
    The output value is in the range of 0 to 110, which corresponds to the hue values in an HSV color space for red to green.

    Args:
        input_value (int | float): The value to be converted.
        input_min (int, optional): The minimum value of the input range. Defaults to 0.
        input_max (int, optional): The maximum value of the input range. Defaults to 100.
        output_min (int, optional): The minimum value of the output range. Defaults to 0.
        output_max (int, optional): The maximum value of the output range. Defaults to 110.

    Returns:
        float: The converted value within the output range.
    """
    normalized_input = (input_value - input_min) / (input_max - input_min) # Normalize the input value to a range of 0 to 1
    scaled_value = (np.exp(normalized_input) - 1) / (np.e - 1) # Apply an exponential function to create a non-linear scale
    scaled_value = (np.exp(scaled_value) - 1) / (np.e - 1) # Repeat the function to create a more pronounced effect
    return output_min + scaled_value * (output_max - output_min) # Map the scaled value to the output range


def signal_to_audio(signal: ndarray, sample_rate: int=44100, denormalize: bool=False) -> AudioSegment:
    """Convert a signal array to an audio segment object.
    Will automatically convert cupy arrays to int16 numpy arrays if necessary.

    Args:
        signal (cp.ndarray | np.ndarray): The signal array to be converted.
        sample_rate (int, optional): The sample rate of the signal. Defaults to 44100.
        denormalize (bool, optional): Whether to denormalize the signal to the range of int16. Defaults to False.
    
    Returns:
        AudioSegment: The audio segment object created from the signal array.
    """
    if isinstance(signal, cp.ndarray): # If the signal is a cupy array, convert it to a numpy array
        signal = cp.asnumpy(signal)
    if denormalize: # If the signal should be denormalized, scale it to the range of int16
        signal = signal * MAX_AMPLITUDE_AT_16_BIT
    signal = signal.astype(np.int16) # Convert the signal to a 16-bit integer array
    return AudioSegment(signal.tobytes(), frame_rate=sample_rate, sample_width=signal.dtype.itemsize, channels=1) # Create an audio segment object from the signal array
```

#### c) Human-Readable Conversion Functions

```python
def bytes_to_human_readable(n: int, depth: int=2) -> str:
    """Convert a byte value into a human-readable string with appropriate units.

    Args:
        n (int): The number of bytes.
        depth (int, optional): The number of decimal places to include in the output. Default is 2.

    Returns:
        str: A string representing the byte value in a human-readable format with units (B, KB, MB, GB, TB, PB).
    """
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if n < 1024:
            return f"{n:.{depth}f} {unit}"
        n /= 1024
    return f"{n:.{depth}f} PB"


def time_to_human_readable(seconds: number, depth: int=3) -> str:
    """Convert a time duration in seconds to a human-readable string format.

    Args:
        seconds (int|float): The time duration in seconds.
        depth (int): The level of detail for the output format. 
                    - 0 or 1: Returns seconds (with milliseconds if `seconds` is a float).
                    - 2: Returns minutes and seconds.
                    - 3: Returns hours, minutes, and seconds.

    Returns:
        str: The time duration in a human-readable string format.
    """
    if depth == 0 or depth == 1: # If the depth is 0 or 1, return the seconds with or without milliseconds
        if isinstance(seconds, int): # If the seconds is an integer, return the number of seconds in 'x seconds' format
            return f'{seconds} seconds'
        # If the seconds is a float, return the time in 'xx:xxx' format with seconds and milliseconds
        miliseconds = (seconds - int(seconds)) * 1000
        return f'{int(seconds):02}:{int(miliseconds):03}'
    
    if depth == 2: # If the depth is 2, return the time in 'xx:xx' format with minutes and seconds
        minutes, seconds = divmod(seconds, 60)
        return f'{int(minutes):02}:{int(seconds):02}'
    
    # If the depth anything other than 0, 1 or 2 return the time in 'xx:xx:xx' format with hours, minutes, and seconds
    hours, rem = divmod(seconds, 3600)
    minutes, seconds = divmod(rem, 60)
    return f'{int(hours):02}:{int(minutes):02}:{int(seconds):02}'
```

```python
print(f'123456789 bytes is equal to {bytes_to_human_readable(123456789)}')
print(f'12345 seconds with a depth of 3 (default depth) is equal to {time_to_human_readable(12345)}')
print(f'12.345 seconds with a depth of 1 is equal to {time_to_human_readable(12.345, 1)}')
```
```output
123456789 bytes is equal to 117.74 MB
12345 seconds with a depth of 3 (default depth) is equal to 03:25:45
12.345 seconds with a depth of 1 is equal to 12:345
```

#### d) Process Monitoring and Caching

##### (i) Normal, not insane functions

```python
def memory_usage(df: pd.DataFrame) -> int:
    """Calculate the total memory usage of a pandas DataFrame.

    Args:
        df (pd.DataFrame): The DataFrame to calculate the memory usage of.

    Returns:
        int: The total memory usage of the DataFrame in bytes.
    """
    return df.memory_usage(deep=True).sum()


def print_memory_usage(df: pd.DataFrame) -> None:
    """Prints the memory usage of a given pandas DataFrame in a human-readable format.

    Args:
        df (pd.DataFrame): The DataFrame for which to calculate and print memory usage.
    """
    print(f"Memory Usage: {bytes_to_human_readable(memory_usage(df))}")

def calculate_time_remaining(start_time: float, iteration: int, length: int) -> str:
    """Estimates the time remaining for a process.

    Args:
        start_time (float): The start time of the process in seconds since the epoch (returned from `time.time()`).
        iteration (int): The current iteration number.
        length (int): The total number of iterations.

    Returns:
        str: The estimated time remaining in a human-readable format.
    """
    elapsed_time = time.time() - start_time
    iterations_remaining = length - iteration
    time_per_iteration = 0
    try:
        time_per_iteration = elapsed_time / iteration
    except ZeroDivisionError:
        pass # Ignore division by zero error from 0th iteration
    time_remaining = iterations_remaining * time_per_iteration
    time_remaining_str = time_to_human_readable(time_remaining)
    return time_remaining_str


def print_progress_bar(iteration: int, 
                       max_iteration: int, 
                       message: str='', 
                       display_handler: Optional[DisplayHandle]=None, 
                       treat_as_data: bool=False,
                       treat_as_time: bool=False
                       ) -> DisplayHandle:
    """Print a progress bar that updates in place.

    Args:
        iteration (int): Current iteration or progress value.
        max_iteration (int): Maximum iteration or maximum value for the progress.
        display_handler (DisplayHandle, optional): An existing display handler to update the progress bar. Defaults to None where a new display handler is generated. 
        message (str, optional): Additional message to display alongside the progress bar.
        treat_as_data (bool, optional): If True, converts iteration and length to human-readable data format. Defaults to False.

    Returns:
        DisplayHandle: The display handler used to render the progress bar.
                         - **In order to update the progress bar, pass this handler to the next call of this function.**
    
    Notes:
        This function is intended for use in Jupyter notebooks, and uses the IPython display module to render the progress bar as HTML.
        That HTML is rendered in place, allowing the progress bar to update in place.
    """
    progress = int((iteration / max_iteration) * 100) # Calculate progress as a whole number percentage

    if treat_as_data: # Convert the iteration and length to human-readable data format if specified
        iteration: str = bytes_to_human_readable(iteration)
        max_iteration: str = bytes_to_human_readable(max_iteration)
    if treat_as_time: # Convert the iteration and length to human-readable time format if specified
        iteration: str = time_to_human_readable(iteration)
        max_iteration: str = time_to_human_readable(max_iteration)

    # Get the color for the progress bar based on the percentage value using css hsl color format
    color = f'hsl({percentage_color_conversion(progress)}, 100%, 50%)'
    # Create the progress bar as a string of equal signs with the appropriate color
    # This is formatted in html to allow for color styling
    bar = f'<span style="color: {color};">{"=" * progress}</span>{" " * (100 - progress)}'
    style = 'font-family: monospace; font-size: 13px;' # Ensure monospacing for consistent character width
    # Create the message to display text in html format
    html_string = f'<pre style="{style}">[{bar}] - {iteration}/{max_iteration}'
    if message: # Add the message to the html string if provided
        html_string += f' - {message}'
    html_string += '</pre>'

    # display the message as HTML, updating the display handler if provided
    if not display_handler:
        display_handler = display(HTML(html_string), display_id=True)
    else:
        display_handler.update(HTML(html_string))
    return display_handler # Return the display handler for updating the progress bar
```

The `print_progress_bar` is not the simplest design for what that is[^3], and there is no reason for it to be rendered in html[^4] except that it allows for a smoother gradient of color, and organizing it like this allows its output to be separated from other prints in output cells in Jupyter notebook. The main reason for this was to integrate easier when overriding the standard IO later in the project.

[^3]: Not sure why its in the "Normal, not insane functions" section tbh
[^4]: That's probably not 100% clear to anyone skimming this code but the `print_progress_bar` function is just a progress bar that is rendered in html in the jupyter notebook that slowly changes color over time. I made this purely because I spend a lot of time waiting on slow processes and I wanted something to look at while I waited.

```python
display_handler = None
for i in range(100):
    time.sleep(0.1)
    display_handler = print_progress_bar(i+1, 100, message=f'Progress: {i+1}%', display_handler=display_handler)
del display_handler
```
[^5]
[^5]: I'm not going to display the output of this code block. I do not want to rebuilt it for a fully web context just for this.

##### (ii) Insane ideas that worked better than expected

The following script is used exclusively to replace the "verbose" form of the training phase of a `sklearn.neural_network.MLPClassifier` instance. Below is an in depth description of what is going on so it is clear how this works, but this is nothing more than a means of monitoring the training process of a `sklearn.neural_network.MLPClassifier` instance. This section can be skipped if that is not important to you.[^6]

[^6]: I am not going to lie, this is actually remarkably useful when actually training a model. It's a bit much to read through if you are not actively training and retraining models though.

```python
class MLPTrainingMonitor:
    """A class to monitor and reformat training output for `sklearn.neural_network.MLPClassifier`.

    This class overrides the standard output stream to intercept and process verbose messages from the MLPClassifier 
    during training. It parses these messages to display a real-time progress bar, provide an estimate of the remaining 
    training time, and optionally save or load training metadata for later use.

    The key use case is to provide a cleaner, more informative visualization of the training process than the default 
    output from `sklearn.neural_network.MLPClassifier`.

    Methods:
    --------
    monitor_engine() -> None
    setup_training(max_iterations: int, learning_rate: float) -> None
    end_training(path: str) -> None
    display_training(path: str) -> None
    training_simulator(iterations: int) -> None
    
    Example Usage:
    --------------
    nn = sklearn.neural_network.MLPClassifier(max_iter=100,
                                              verbose=True,
                                              hidden_layer_sizes=[100, 10],
                                              learning_rate_init=0.01,
                                              learning_rate='adaptive')

    with MLPTrainingMonitor.monitor_engine():
        MLPTrainingMonitor.setup_training(max_iterations=100, learning_rate=0.01)
        nn.fit(X_train, y_train)
        MLPTrainingMonitor.end_training(path='path/to/save')
    """
    def __init__(self) -> None:
        self._start_time = None
        self._max_iterations = 0
        self._iteration = 0
        self._loss = 0
        self._learning_rate = 0
        self._min_loss = 10000
        self._iterations_since_minimum = 0
        self._display_handler = None


    def flush(self) -> None:
        """Required method for the stream class, but not used in this implementation."""
        pass


    def write(self, text: str) -> None:
        """Parse and process the text output from the MLPClassifier during training.
        This method gets called in place of the standard print() function when the monitor is active.

        Args:
            text (str): The text output from the MLPClassifier during training.
        """
        # Check the text for specific keywords that indicate the type of message
        if 'SETUP:' in text:
            self._setup(text)
            return
        elif 'FINISH:' in text:
            self._finish(text)
            return
        elif 'DISPLAY:' in text:
            self._display(text)
            return
        
        # If the text does not contain a keyword, check for specific messages that contain data to be extracted
        elif 'Iteration' in text:
            self._iteration = int(text.split(' ')[1][:-1])
            self._loss = float(text.split('loss =')[1].strip())
            if self._min_loss > self._loss: # Check if the current loss is the minimum loss seen so far
                self._min_loss = self._loss
                self._iterations_since_minimum = 0
            else: # If the loss is not the minimum, increment the counter
                self._iterations_since_minimum += 1
        elif 'learning rate' in text: # If the text does not contain Iteration, check for the learning rate setting message
            self._learning_rate = float(text.split('Setting learning rate to ')[1].strip())
        else: # If the text does not contain any relevant information, return early
            return
        
        # Create a message to display the current progress and training information
        message = f'\nLoss: {self._loss:.6f}'
        message += f' - Min Loss: {self._min_loss:.6f}'
        message += f' - Iterations Since Minimum: {self._iterations_since_minimum}'
        message += f' - Learning Rate: {self._learning_rate:.6f}'
        message += f' - Estimated Time Remaining: {calculate_time_remaining(self._start_time, self._iteration, self._max_iterations)}'
        # Update the progress bar with the current iteration and message
        self._display_handler = print_progress_bar(self._iteration, 
                                                  self._max_iterations,
                                                  display_handler=self._display_handler,
                                                  message=message)
    

    def _setup(self, text: str) -> None:
        """Parses setup information and initializes monitoring attributes.

        Args:
            text (str): The setup message, expected to include maximum iterations and initial learning rate.
             - Input Example: 'SETUP: 100 0.01'
        """
        self.__init__() # Reset the attributes to their default values
        # Extract the start time and setup information from the text
        self._start_time = time.time()
        self._max_iterations = int(text.split(' ')[1].strip())
        self._learning_rate = float(text.split(' ')[2].strip())
    

    def _finish(self, text: str) -> None:
        """Handles the end of training, calculates total time, and saves results.

        Args:
            text (str): The finish message, expected to include the path to save the training monitor data.
             - Input Example: 'FINISH: /path/to/save'
        """
        time_taken = time.time() - self._start_time # Calculate the time taken to complete the training process
        # Create a message to display the final results of the training process
        message = f'Loss: {self._loss:.6f}'
        message += f' - Min Loss: {self._min_loss:.6f}'
        message += f' - Final Iteration: {self._iteration}'
        message += f' - Learning Rate: {self._learning_rate}'
        message += f' - Time to complete: {time_to_human_readable(time_taken)}'
        # Update the display with the final results
        self._display_handler.update(HTML(f'<pre style="font-family: monospace; font-size: 13px;">{message}</pre>'))

        # Save the training monitor data to a csv file
        path = text.split(' ')[1].strip()
        columns = ['loss', 'min_loss', 'final_iteration', 'learning_rate', 'time_taken']
        data = [[self._loss, self._min_loss, self._iteration, self._learning_rate, time_taken]]
        df = pd.DataFrame(data, columns=columns)
        path += '/training_monitor.csv'
        df.to_csv(path, index=False)
    

    def _display(self, text: str) -> None:
        """Displays the training information from a saved csv file.

        Args:
            text (str): The display message, expected to include the path to load the training monitor data.
             - Input Example: 'DISPLAY: /path/to/load'
        """
        df = pd.read_csv(text.split(' ')[1].strip() + '/training_monitor.csv') # Load the training monitor data from the csv file
        accuracy_score = ''
        with open(text.split(' ')[1].strip() + '/accuracy.txt', 'r') as file:
            accuracy_score = file.readline()
        # Extract the training information from the data frame
        self._loss = df.loss.values[0]
        self._min_loss = df.min_loss.values[0]
        final_iteration = df.final_iteration.values[0]
        self._learning_rate = df.learning_rate.values[0]
        time_taken = df.time_taken.values[0]
        # Create a message to display the training information
        message = f'Loss: {self._loss:.6f}'
        message += f' - Min Loss: {self._min_loss:.6f}'
        message += f' - Final Iteration: {final_iteration}'
        message += f' - Learning Rate: {self._learning_rate}'
        message += f' - Time to complete: {time_to_human_readable(time_taken)}'
        message += f'\n{accuracy_score}'
        # Display the training information
        if self._display_handler is None:
            self._display_handler = display(HTML(f'<pre style="font-family: monospace; font-size: 13px;">{message}</pre>'))
        else:
            self._display_handler = self._display_handler.update(HTML(f'<pre style="font-family: monospace; font-size: 13px;">{message}</pre>'))
        return


    @staticmethod
    def training_simulator(iterations: int=100) -> None:
        """Simulates the output of the training process for testing purposes.
        
        Args:
            iterations (int, optional): The number of iterations to simulate. Defaults to 100.
        """
        for i in range(iterations):
            time.sleep(0.1)
            print(f'Iteration {i + 1}, loss = {np.random.uniform(0, 1):.4f}', flush=True)


    @staticmethod
    def setup_training(max_iterations: int, learning_rate: float) -> None:
        """Sends the setup message to the monitor to initialize the training process.
        
        Args:
            max_iterations (int): The maximum number of iterations for the training process.
            learning_rate (float): The initial learning rate for the training process.
        """
        print(f'SETUP: {max_iterations} {learning_rate}')


    @staticmethod
    def end_training(path: str) -> None:
        """Sends a finish message to save training results.
        
        Args:
            path (str): The path of the ***directory*** to put the `training_monitor.csv` file.
        """
        print(f'FINISH: {path}')


    @staticmethod
    def display_training(path: str) -> None:
        """Loads and displays training results from a previous session.
        
        Args:
            path (str): The path of the ***directory*** containing the `training_monitor.csv` file.
        """
        print(f'DISPLAY: {path}')


    @classmethod
    @contextmanager # The contextmanager decorator allows the class method to be used in a 'with' statement
    def monitor_engine(cls) -> Generator[None, None, None]:
        """A context manager to activate the training monitor.

        Replaces the standard output stream with an instance of this class, allowing all printed messages 
        within the `with` block to be intercepted and processed.
        
        Example Usage:
        --------------
        nn = sklearn.neural_network.MLPClassifier(max_iter=100,
                                                  verbose=True,
                                                  hidden_layer_sizes=[100, 10],
                                                  learning_rate_init=0.01,
                                                  learning_rate='adaptive')
        
        with MLPTrainingMonitor.monitor_engine():
            MLPTrainingMonitor.setup_training(max_iterations=100, learning_rate=0.01)
            nn.fit(X_train, y_train)
            MLPTrainingMonitor.end_training(path='path/to/save')
        """
        #----From here on gets run before the code inside the with statement
        original_stdout = sys.stdout # Save the original standard output stream
        sys.stdout = cls() # Replace the standard output stream with an instance of this class
        try:
            yield # Yeild control back to the with statement

        #----From here on gets run after the code inside the with statement
        finally:
            sys.stdout = original_stdout # Restore the original standard output stream
```
This is a complicated[^7] class that allows for one simple thing: to reformat the verbose message in the `sklearn.neural_network.MLPClassifier` training function. By default the `MLPClassifier` prints messages that look something like the result of this method:

[^7]: For the context.

```python
MLPTrainingMonitor.training_simulator(5)
```
```output
Iteration 1, loss = 0.5082
Iteration 2, loss = 0.9348
Iteration 3, loss = 0.6981
Iteration 4, loss = 0.5624
Iteration 5, loss = 0.1207
```

In this case the loss is randomized but in the actual training the loss should steadily decline, and if it does not decline in 10 iterations it will adjust the learning rate to compensate. This class will watch everything sent to the standard output and will update a progress bar with the relevant information in a clean way with an estimation on time remaining. The main motivation for this function was to be able to estimate the time to train a model before it finished.

The usage of this class is quite simple. The main magic is behind the `MLPTrainingMonitor.monitor_engine` class method. It is designed to be used in a with statement like this:

```python
with MLPTrainingMonitor.monitor_engine():
    # Anything printed here will be processed by the MLPTrainingMonitor.write() method instead of the standard output stream
```

- `MLPTrainingMonitor.setup_training` method should be ran first inside the with statement with the max iterations, and learning rate used to setup the `MLPClassifier`.

- Next the model should be trained against the data. Here the progress bar will be printed with the relevant data. `MLPTrainingMonitor.training_simulator` can be ran instead to emulate what that would look like.

- `MLPTrainingMonitor.end_training` can be run in the end to save the results of the model training to be displayed next time instead of retraining the same model.

- `MLPTrainingMonitor.display_training` can be run in place of the training phase if there is an existing record of training results to display the results without training the model.

```python
with MLPTrainingMonitor.monitor_engine():
    MLPTrainingMonitor.setup_training(10, 0.01)
    MLPTrainingMonitor.training_simulator(10)
```
```output
[====================================================================================================] - 10/10 - 
Loss: 0.780100 - Min Loss: 0.067700 - Iterations Since Minimum: 5 - Learning Rate: 0.010000 - Estimated Time Remaining: 00:00:00
```
[^8]
[^8]: Again, this code block looks slightly different because its generated by the `print_progress_bar` function which uses html to render the progress bar in a jupyter notebook. The output here is just a static text representation of what it looks like without color.

#### e) Signal Generation
(Hopefully what these do is relatively self evident)

##### (i) Sine Wave

```python
def generate_sine_wave(frequency: int, duration: number, sample_rate: int=44100, magnitude: float=0.5) -> AudioSegment:
    """Generate a sine wave `AudioSegment` object.

    Args:
        frequency (int): The frequency of the sine wave in Hertz.
        duration (int | float): The duration of the sine wave in seconds.
        sample_rate (int, optional): The sample rate in samples per second. Default is 44100.
        magnitude (float, optional): The magnitude of the sine wave in the range [0,1]. Default is 0.5.

    Returns:
        AudioSegment: The generated sine wave.
    """
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    signal = magnitude * np.sin(2 * np.pi * frequency * t)
    signal = np.int16(signal * MAX_AMPLITUDE_AT_16_BIT)
    audio = AudioSegment(
        signal.tobytes(),
        frame_rate=sample_rate,
        sample_width=signal.dtype.itemsize,
        channels=1
    )
    return audio

generate_sine_wave(440, 10).export('exports/440hz.wav', format='wav')
```

::ui-audio-player{src='', title='Sine Wave'}
::

##### (ii) Triangle Wave

```python
def generate_triangle_wave(frequency: int, duration: number, sample_rate: int=44100, magnitude: float=0.5) -> AudioSegment:
    """Generate a triangle wave `AudioSegment` object.

    Args:
        frequency (int): The frequency of the triangle wave in Hz.
        duration (int | float): The duration of the audio signal in seconds.
        sample_rate (int, optional): The sample rate of the audio signal in samples per second. Defaults to 44100.
        magnitude (float, optional): The peak amplitude of the triangle wave in the range [0,1]. Defaults to 0.5.

    Returns:
        AudioSegment: The generated triangle wave.
    """
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    signal = magnitude * np.abs(2 * (t * frequency - np.floor(t * frequency + 0.5))) - magnitude
    signal = np.int16(signal * MAX_AMPLITUDE_AT_16_BIT)
    audio = AudioSegment(
        signal.tobytes(),
        frame_rate=sample_rate,
        sample_width=signal.dtype.itemsize,
        channels=1
    )
    return audio

generate_triangle_wave(440, 10).export('exports/440hz_triangle.wav', format='wav')
```

::ui-audio-player{src='', title='Triangle Wave'}
::

##### (iii) Sawtooth Wave

```python
def generate_sawtooth_wave(frequency: int, duration: number, sample_rate: int=44100, magnitude: float=0.5) -> AudioSegment:
    """Generate a sawtooth wave audio signal.

    Args:
        frequency (int): The frequency of the sawtooth wave in Hertz.
        duration (int | float): The duration of the audio signal in seconds.
        sample_rate (int, optional): The sample rate of the audio signal in samples per second. Default is 44100.
        magnitude (float, optional): The peak amplitude of the sawtooth wave in the range [0,1]. Default is 0.5.

    Returns:
        AudioSegment: The generated sawtooth wave.
    """
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    signal = magnitude * (t * frequency - np.floor(t * frequency + 0.5))
    signal = np.int16(signal * MAX_AMPLITUDE_AT_16_BIT)
    audio = AudioSegment(
        signal.tobytes(),
        frame_rate=sample_rate,
        sample_width=signal.dtype.itemsize,
        channels=1)
    return audio

generate_sawtooth_wave(440, 10).export('exports/440hz_sawtooth.wav', format='wav')
```

::ui-audio-player{src='', title='Sawtooth Wave'}
::

##### (iv) Square Wave

```python
def generate_square_wave(frequency: int, duration: number, sample_rate: int=44100, magnitude: float=0.5) -> AudioSegment:
    """Generate a square wave audio signal.

    Args:
        frequency (int): The frequency of the square wave in Hertz.
        duration (int | float): The duration of the audio signal in seconds.
        sample_rate (int, optional): The sample rate of the audio signal in samples per second. Default is 44100.
        magnitude (float, optional): The peak amplitude of the square wave. Default is 0.5.

    Returns:
        AudioSegment: The generated square wave.
    """
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    signal = magnitude * sp.signal.square(2 * np.pi * frequency * t)
    signal = np.int16(signal * MAX_AMPLITUDE_AT_16_BIT)
    audio = AudioSegment(
        signal.tobytes(),
        frame_rate=sample_rate,
        sample_width=signal.dtype.itemsize,
        channels=1)
    return audio

generate_square_wave(440, 10).export('exports/440hz_square.wav', format='wav')
```

::ui-audio-player{src='', title='Square Wave'}
::

##### (v) White Noise

```python
def generate_white_noise(duration: number, sample_rate: int=44100, magnitude: float=0.5) -> AudioSegment:
    """
    Generate white noise audio segment.

    Args:
        duration (int | float): Duration of the white noise in seconds.
        sample_rate (int, optional): Sample rate of the audio in Hz. Default is 44100 Hz.
        magnitude (float, optional): The peak amplitude of the white noise. Default is 0.5.

    Returns:
        AudioSegment: The generated white noise.
    """
    # Randomly generated samples are the same as white noise
    # Thats why blanket radiation picked up by radio telescopes is interpreted as white noise
    signal = magnitude * np.random.uniform(low=-1.0, high=1.0, size=int(sample_rate * duration))
    signal = np.int16(signal * MAX_AMPLITUDE_AT_16_BIT)
    audio = AudioSegment(
        signal.tobytes(),
        frame_rate=sample_rate,
        sample_width=signal.dtype.itemsize,
        channels=1)
    return audio

generate_white_noise(10).export('exports/white_noise.wav', format='wav')
```

::ui-audio-player{src='', title='White Noise'}
::

##### (vi) Pink Noise

```python
def generate_pink_noise(duration: number, sample_rate: int=44100, magnitude: float=0.5) -> AudioSegment:
    """Generates pink noise audio.
    Pink noise is a signal with a frequency power spectrum that is inversely proportional to its frequency.
    This function generates pink noise by filtering white noise.

    Args:
        duration (int | float): Duration of the pink noise in seconds.
        sample_rate (int, optional): Sampling rate of the audio in Hz. Default is 44100 Hz.
        magnitude (float, optional): The peak amplitude of the generated pink noise. Default is 0.5.

    Returns:
        AudioSegment: The generated pink noise.
    """
    signal = np.random.randn(int(sample_rate * duration))
    signal = sp.signal.lfilter(*sp.signal.butter(1, 1/50, btype='low'), signal)
    signal = (signal * magnitude * MAX_AMPLITUDE_AT_16_BIT).astype(np.int16)
    audio = AudioSegment(
        signal.tobytes(),
        frame_rate=sample_rate,
        sample_width=signal.dtype.itemsize,
        channels=1)
    return audio

generate_pink_noise(10).export('exports/pink_noise.wav', format='wav')
```

::ui-audio-player{src='', title='Pink Noise'}
::

#### f) Data Analysis

##### (i) Print Aliases

```python
def print_range(column: pd.Series, title: str='') -> None:
    """Print the range of a column in a DataFrame

    Args:
        column (pd.Series): The column to be analyzed
        title (str, optional): The title of the range. Defaults to ''.
    """
    if title: # If a title is provided, add a space to the end of the title
        title += ' '
    column = column.astype(float)
    print(f"{title}Range Interval: [{column.min()},{column.max()}]")
    print(f"{title}Span: {column.max() - column.min()}")


def print_ranges(df: pd.DataFrame) -> None:
    """Print the ranges of all numeric columns in a DataFrame

    Args:
        df (pd.DataFrame): The DataFrame to be analyzed
    """
    for column in df.columns:
        if df[column].dtype in [np.float64, np.int64]:
            print_range(df[column], column)
```

##### (ii) Plots

```python
def plot_histogram(column: pd.Series, title: str='Histogram', bins: int=25) -> None:
    """Plot a histogram of the values in a column of a pandas DataFrame.
    Column must be numeric.

    Args:
        column (pd.Series): The column to plot.
        title (str, optional): The title of the plot. Defaults to 'Histogram'.
        bins (int, optional): The number of bins to use in the histogram. Defaults to 10.
    """
    if column.dtype not in [np.float64, np.int64]:
        raise ValueError('Column must be numeric')
    plt.hist(column, bins=bins)
    plt.title(title)
    plt.xlabel('Value')
    plt.ylabel('Frequency')
    plt.grid(True, axis='y')
    plt.show()
```