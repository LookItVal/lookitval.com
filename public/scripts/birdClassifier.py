import pickle
import re
import js
from sys import float_info
from io import BytesIO
from datetime import datetime
from typing import List, Union, Optional, Tuple
from functools import lru_cache

import pandas as pd
import numpy as np
from sklearn.neural_network import MLPClassifier
from scipy.fft import rfft, rfftfreq
from scipy.signal import stft, istft, hilbert
from scipy.ndimage import gaussian_filter1d

number = Union[int, float]
BIRD_CLASSIFIER: Optional[MLPClassifier] = None


def polar_to_complex(magnitudes: np.ndarray|number, phases: np.ndarray|number) -> np.ndarray|complex:
  """Convert polar coordinates to complex numbers using Euler's formula.
  Can convert either a single value or an array of values.
  Does not check if both inputs are the same type or shape.

  Args:
    magnitudes (np.ndarray | float | int): The magnitudes of the complex numbers.
    phases (np.ndarray | float | int): The phases of the complex numbers.
  
  Returns:
    np.ndarray|complex: The complex numbers. Return type matches the input signal type.
  """
  return magnitudes * np.exp(1j * phases)


def short_time_fourier_transform(signal: np.ndarray, sample_rate: int, nperseg_constant: int=10, noverlap_constant: int=2) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
  """Calculate the Short Time Fourier Transform (STFT) of an audio signal.

  Args:
    signal (np.ndarray): The audio signal to calculate the STFT of.
    sample_rate (int): The sample rate of the audio signal.
    nperseg_constant (int, optional): The constant to determine the window size used in the formula nperseg = sample_rate / nperseg_constant. Defaults to 10.
    noverlap_constant (int, optional): The constant to determine the overlap size used in the formula noverlap = nperseg / noverlap_constant. Defaults to 2.
  
  Returns
  -------
  - **np.ndarray:** The frequencies of the STFT.
  - **np.ndarray:** The time values of the STFT.
  - **np.ndarray:** The complex time-frequency signal from the STFT.
  """
  nperseg = sample_rate // nperseg_constant # Calculate the window size
  noverlap = nperseg // noverlap_constant # Calculate the overlap size
  return stft(signal, fs=sample_rate, nperseg=nperseg, noverlap=noverlap) # Calculate the STFT


def inverse_short_time_fourier_transform(signal: np.ndarray, sample_rate: int, nperseg_constant: int=10, noverlap_constant: int=2) -> np.ndarray:
  """Calculate the Inverse Short Time Fourier Transform (ISTFT) of an audio signal.

  Args:
    signal (np.ndarray): The audio signal to calculate the ISTFT of.
    sample_rate (int): The sample rate of the audio signal.
    nperseg_constant (int, optional): The constant to determine the window size used in the formula nperseg = sample_rate / nperseg_constant. Defaults to 10.
    noverlap_constant (int, optional): The constant to determine the overlap size used in the formula noverlap = nperseg / noverlap_constant. Defaults to 2.
  
  Returns:
    np.ndarray: The audio signal after applying the ISTFT.
  """
  nperseg = sample_rate // nperseg_constant # Calculate the window size
  noverlap = nperseg // noverlap_constant # Calculate the overlap size
  return istft(signal, fs=sample_rate, nperseg=nperseg, noverlap=noverlap)[1] # Calculate the ISTFT. The 0th value is the time values, the 1st value is the audio signal.


def normalize_time(time_str: str) -> Optional[float]:
  """Normalize the time string to a value in the range [0,1] representing the time of day from 00:00 to 23:59.
  Handle cases where the time string is in a 24-hour format, or 12-hour format with AM/PM.
  If the time string is invalid, return None.

  Args:
    time_str (str): The time string to normalize.
  
  Returns:
    Optional[float]: The normalized time value in the range [0,1], or None if the time string is invalid.
  """
  # Handle outliers in format
  if 'pm' in time_str.lower(): # If the time string contains 'pm', convert it to 24-hour format
    time_str = time_str.replace('pm', '').strip()
    try:
      hours, minutes = time_str.split(':')
    except:
      return None # If the time string is not parsable, return None
    if int(hours) != 12:
      hours = int(hours) + 12
    time_str = f'{hours}:{minutes}'
  elif 'am' in time_str: # If the time string contains 'am', convert it to 24-hour format
    time_str = time_str.replace('am', '').strip()
    try:
      hours, minutes = time_str.split(':')
    except:
      return None # If the time string is not parsable, return None
    if int(hours) == 12:
      hours = 0
    time_str = f'{hours}:{minutes}'
  if not re.match(r'^\d{1,2}:\d{2}$', time_str):
      return None # If the time string does not match the format 'hh:mm', return None. This removes anything with trailing characters
  
  # Normalize value to range [0,1]
  hours, minutes = time_str.split(':')
  total_minutes = int(hours) * 60 + int(minutes) # Calculate the total minutes from 00:00
  return total_minutes / (24 * 60) # Divide by the total minutes in a day to get the normalized value


def normalize_date(date_str: str) -> Optional[float]:
  """Normalize the date string to a value in the range [0,1] representing the date of the year from January 1st to December 31st.
  Ignore the year component of the date string.
  If the month component is invalid, return None.
  If the day component is invalid, assume the first day of the month.
  
  Args:
    date_str (str): The date string to normalize.
  
  Returns:
    Optional[float]: The normalized date value in the range [0,1], or None if the date string is invalid.
  
  Note:
    The function assumes a non-leap year with 365 days always. Error from this assumption is negligible.
  """
  # Handle outliers in format
  if not re.match(r'^\d{4}-\d{2}-\d{2}$', date_str):
    return None # If the date string does not match the format 'yyyy-mm-dd', return None
  _, month, day = date_str.split('-') # Extract the month and day components from the date string
  month, day = int(month), int(day) # Convert the month and day components to integers
  if month < 1 or month > 12:
    return None # If the month date is invald, return None
  if day < 1:
    day = '01' # If the day is less than 1, assume the first day of the month
  if int(day) > 28:
    day = '28' # If the day is greater than 28, set it to 28 to avoid invalid dates
  date_str = f'2023-{month}-{day}' # Set the year to 2023 for a non-leap year

  date = datetime.strptime(date_str, '%Y-%m-%d') # Parse the date string to a datetime object

  # Normalize value to range [0,1] based on the day of the year
  total_days = (date - datetime(date.year, 1, 1)).days # Calculate the total days from January 1st
  return total_days / 365 # Divide by the total days in a year to get the normalized value


def normalize_latitude(lat_str: str) -> float:
  """Normalize the latitude string to a value in the range [0,1] representing the latitude from -90 to 90 degrees.
  Does not handle invalid latitude strings.

  Args:
    lat_str (str): The latitude string to normalize.
  
  Returns:
    float: The normalized latitude value in the range [0,1].
  """
  return (float(lat_str) + 90) / 180


def normalize_longitude(lon_str: str) -> Optional[float]:
  """Normalize the longitude string to a value in the range [0,1] representing the longitude from -180 to 180 degrees.
  Does not handle invalid longitude strings.

  Args:
    lon_str (str): The longitude string to normalize.
  
  Returns:
    float: The normalized longitude value in the range [0,1].
  """
  return (float(lon_str) + 180) / 360


def normalize_elevation(elevation: float, min=-240.0, max=2900.0) -> float:
  """Map the elevation value to a range such that the minimum value is 0 and the maximum value is 1 where 
  the minimum value is either the lower bound of outliers or the minimum value in the dataframe, and
  the maximum value is either the upper bound of outliers or the maximum value in the dataframe.

  Args:
    elevation (float): The elevation value to normalize.
    min (float, optional): The minimum value of the range.
    max (float, optional): The maximum value of the range.
  """
  return (elevation - min) / (max - min) # Normalize the elevation to the range [0,1]


def normalize_signal(signal: np.ndarray, max_amplitude: Optional[number]=None) -> np.ndarray:
  """Normalizes the amplitude of an audio signal to the range [-1,1].
  
  Args:
    signal (np.ndarray): The audio signal to normalize.
    max_amplitude (int | float, optional): The maximum amplitude value in the signal. Defaults to None.
  
  Returns:
    np.ndarray: The normalized audio signal.
  """
  if max_amplitude is None: # If the maximum amplitude is not provided find the maximum amplitude in the signal
      max_amplitude = np.max(np.abs(signal))
  return signal / max_amplitude # Normalize the signal to the range [-1,1]


def fourier_transform(signal: np.ndarray, sample_rate: int) -> Tuple[np.ndarray, np.ndarray]:
  """Calculate the Fourier Transform of a real valued signal.

  Args:
    signal (cp.ndarray | np.ndarray): The signal to calculate the Fourier Transform of.
    sample_rate (int): The sample rate of the signal.

  Returns
  --------
   - **np.ndarray:** The frequencies of the Fourier Transform.
   - **np.ndarray:** The Fourier Transform of the signal.
  """
  n = signal.size
  frequencies = rfftfreq(n, d=1/sample_rate)
  signal = rfft(signal, overwrite_x=True)
  signal = signal / (n//2) # Normalize the signal
  return frequencies, signal


def hz_to_bark(hz: np.ndarray|number) -> np.ndarray|number:
  """Convert a frequency value in Hertz to the Bark scale.

  Args:
    hz (np.ndarray | float | int): The frequency value in Hertz to convert. Will take either an array or a single value.
  
  Returns:
    np.ndarray|float|int: The frequency value converted to the Bark scale. Return type matches the input signal type.
  
  Formula:
  --------
    bark = 13 * arctan(0.00076 * hz) + 3.5 * arctan((hz / 7500) ** 2)
  """
  return 13 * np.arctan(0.00076 * hz) + 3.5 * np.arctan((hz / 7500) ** 2)


# Good Luck Undoing the hz_to_bark function without a key. This is the key to make the calculation faster
BARK_KEY = np.arange(0, 20000, 1) # Generate a range of frequencies from 0 to 20000 Hz
BARK_KEY = hz_to_bark(BARK_KEY) # Convert the frequencies to the Bark scale


def bark_to_hz(bark: np.ndarray|number) -> np.ndarray|number:
  """Convert a frequency value in the Bark scale to Hertz by referencing a key.

  Args:
    bark (np.ndarray | float | int): The frequency value in the Bark scale to convert. Will take either an array or a single value.

  Returns:
    np.ndarray|float|int: The frequency value converted to Hertz. Return type matches the input signal type.
  """
  return np.digitize(bark, BARK_KEY) - 1


@lru_cache(maxsize=None)
def get_bark_spaced_frequencies(num_bands: int = 100) -> np.ndarray:
  """Generate a set of frequencies between 20 and 20000 Hz spaced evenly along the Bark scale.
  The frequencies are cached for faster access and to avoid recalculating the same values.

  Args:
    num_bands (int, optional): The number of frequency bands to generate. Defaults to 100.

  Returns:
    np.ndarray: The frequencies spaced evenly along the Bark scale.
  """
  frequencies = np.linspace(hz_to_bark(20), hz_to_bark(20000), num_bands) # Generate the frequency bins
  frequencies = bark_to_hz(frequencies) # Convert the frequency bins back to Hz
  return frequencies


def group_frequencies(frequencies: np.ndarray,
                      freq_signal: np.ndarray,
                      freq_bins: Optional[np.ndarray]=None,
                      num_groups: int=100
                      ) -> Tuple[np.ndarray, np.ndarray]:
  """Group the frequencies of a Fourier Transform into a smaller number of groups by calculating the RMS of each group.
  Each group is spaced evenly along the Bark Scale.

  Args:
    frequencies (np.ndarray): The frequencies of the Fourier Transform.
    freq_signal (np.ndarray): The resulting complex signal from the Fourier Transform.
    freq_bins (np.ndarray, optional): The frequency bins to group the frequencies into. Defaults to None.
    num_groups (int, optional): The number of groups to create. Defaults to 100.
  
    Returns
    -------
    - **np.ndarray**: The grouped frequencies.
    - **np.ndarray**: The magnitude value for the bin.
  """
  if freq_bins is None: # If the frequency bins are not provided
    freq_bins = get_bark_spaced_frequencies(num_groups) # Get the Bark spaced frequencies
  bin_indicies = np.digitize(frequencies, freq_bins) - 1 # Group the frequencies into bins
  reduced_freq_signal = np.zeros(len(freq_bins)) # Initialize an array to store the maximum magnitude in each bin
  for i in range(len(freq_bins)): # Iterate through each bin
    bin_values = freq_signal[bin_indicies == i] # Get the values in the bin
    reduced_freq_signal[i] = np.sqrt(np.mean(np.abs(bin_values) ** 2)) # Calculate the RMS of the bin
  return freq_bins, reduced_freq_signal


def magnitude_to_db(signal: np.ndarray|number, epsilon: float=float_info.epsilon) -> np.ndarray|number:
  """Calculate the magnitude of an audio signal in decibels.
  
  Args:
    signal (np.ndarray | float | int): The audio signal to calculate the magnitude of. Will take either an array or a single value.
    epsilon (float, optional): A small value to prevent `log(0)`. Defaults to `sys.float_info.epsilon`.
      
  Returns:
    np.ndarray|float|int: The magnitude of the audio signal in decibels. Return type matches the input signal type.
  """
  return 20 * np.log10(np.abs(signal + epsilon)) # Calculate the magnitude in decibels


def normalize_decibels(signal: np.ndarray) -> np.ndarray:
  """Normalize the decibel values of a signal to the range [0,1] from -120 to 0 db.
  
  Args:
    signal (np.ndarray): The signal to normalize.
  
  Returns:
    np.ndarray: The normalized signal.
  """
  signal = np.clip(signal, -120, 0) # Clip the signal to the range [-120,0]
  signal = signal + 120 # Shift the signal to the range [0,120]
  signal = signal / 120 # Normalize the signal to the range [0,1]
  return signal


def reduce_noise_floor(signal: np.ndarray, sample_rate: int, noise_floor_percentile: number=2.5, reduction_coefficient: number=7.5) -> np.ndarray:
  """Reduce the noise floor of a signal by determining the noise floor using the Short Time Fourier Transform.
  Can perform the calculation on either the CPU or GPU, depending on the input signal type.

  Method
  ------
  1. Calculate the Short Time Fourier Transform of the audio signal.
  2. Determine the noise floor by taking a low percentile of the magnitudes in each frequency bin.
  3. Subtract the noise floor from the magnitudes. Only the magnitude should be reduced, which means the complex value must be recomputed using the phase.
  4. Calculate the Inverse Short Time Fourier Transform on the modified time-frequency signal to get the new real time signal.

  Args:
    signal (cp.ndarray | np.ndarray): The signal to reduce the noise floor of.
    sample_rate (int): The sample rate of the signal.
    noise_floor_percentile (number, optional): The percentile of the magnitudes to use as the noise floor. Defaults to 2.5.
    reduction_coefficient (number, optional): The coefficient to reduce the noise floor by. Defaults to 10.
  
  Returns:
    cp.ndarray|np.ndarray: The signal with the noise floor reduced. Return type matches the input signal type.
  """
  nperseg_constant = 100 # Set the constant to determine the window size
  noverlap_constant = 2 # Set the constant to determine the overlap size
      
  _, _, Zxx = short_time_fourier_transform(signal, sample_rate, nperseg_constant, noverlap_constant) # Calculate the Short Time Fourier Transform with high time resolution
  noise_floor = np.zeros(Zxx.shape[0]) # Initialize an array to store the noise floor
  for i in range(Zxx.shape[0]): # Iterate through each frequency bin
    # Calculate the noise floor as a percentile of the magnitudes. (min value is always 0, so a low percentile is used instead)
    noise_floor[i] = np.percentile(np.abs(Zxx[i]), noise_floor_percentile) 
    noise_floor[i] *= reduction_coefficient # Reduce the noise floor by the reduction coefficient to adjust the amount of reduction applied.
  for i in range(Zxx.shape[1]): # Iterate through each time slice
      # Subtract the noise floor from the magnitudes and recompute the complex values with the phase (minimum value magnitude is 0)
      Zxx[:, i] = polar_to_complex(np.maximum(np.abs(Zxx[:, i]) - noise_floor, 0), np.angle(Zxx[:, i]))
  del noise_floor # Clear the noise floor from memory
  return inverse_short_time_fourier_transform(Zxx, sample_rate, nperseg_constant, noverlap_constant) # Calculate the Inverse Short Time Fourier Transform to get the noise reduced signal


def hilbert_transform(signal: np.ndarray) -> np.ndarray:
  """Calculate the analytic signal of a real valued signal using the Hilbert Transform.

  Args:
    signal (np.ndarray): The signal to calculate the analytic signal of.
  
  Returns:
    np.ndarray: The analytic signal.
  """
  return hilbert(signal) # Calculate the analytic signal


def signal_to_rms_signal(signal: np.ndarray, sample_rate: int, window_size: int=300, centered: bool=False) -> np.ndarray:
  """Calculate the Root Mean Square (RMS) of an audio signal. The RMS is calculated over a moving window of the signal.

  Args:
    signal (np.ndarray): The audio signal to calculate the RMS of.
    sample_rate (int): The sample rate of the audio signal.
    window_size (int, optional): The size of the moving window in milliseconds. Defaults to 300.
    centered (bool, optional): If True, the RMS is calculated at the center of the window. This is abnormal. Defaults to False.
  
  Returns:
    np.ndarray: The RMS of the audio signal.
  """
  window_size = int(window_size * sample_rate / 1000) # Convert the window size to samples

  pad_width = window_size // 2 if centered else window_size # Calculate the padding width
  padded_signal = np.pad(signal, pad_width, mode='constant') # Pad the area around the signal making it longer

  cumsum = np.cumsum(padded_signal ** 2) # Calculate the cumulative sum of the squared signal
  cumsum = cumsum[window_size:] - cumsum[:-window_size] # Calculate the difference between the cumulative sums to get the sum of the squared signal in the window
  rms_signal = np.sqrt(cumsum / window_size) # Calculate the RMS of the signal

  if signal.size > rms_signal.size: # Add 1 element of padding to the end of the RMS signal with the value 0
    rms_signal = np.concatenate((rms_signal, np.array([0])))
  del padded_signal # Delete the padded signal to free up memory
  return rms_signal[:signal.size] # Remove the padding from the RMS signal if needed


def calculate_click_envelope(signal: np.ndarray, sample_rate: int, click_threshold: float=0.05, large_window_size: number=30, small_window_size: number=0.3) -> np.ndarray:
  """Calculate the envelope of the clicks in an audio signal.
  
  Args:
    signal (np.ndarray): The signal to calculate the envelope of. **Must be normalized to the range [-1,1]**
    sample_rate (int): The sample rate of the signal.
    click_threshold (float, optional): The threshold for the magnitude of the clicks. Defaults to 0.1.
    large_window_size (number, optional): The size of the wide window for the RMS envelope. Defaults to 30.
    small_window_size (number, optional): The size of the thin window for the RMS envelope. Defaults to 0.3.

  Returns:
      np.ndarray: The envelope of the clicks.
  """ 
  analytic_signal = hilbert_transform(signal) # Calculate the analytic signal
  envelope = np.abs(analytic_signal) # Calculate the envelope of the analytic signal
  wide_rms_envelope = signal_to_rms_signal(envelope, sample_rate, large_window_size, centered=True) # Calculate a wide RMS envelope of the envelope
  thin_rms_envelope = signal_to_rms_signal(envelope, sample_rate, small_window_size, centered=True) # Calculate a thin RMS envelope of the envelope
  adjusted_envelope = wide_rms_envelope + thin_rms_envelope # Add the two envelopes together
  click_envelope = envelope - adjusted_envelope # Subtract the adjusted envelope from the envelope
  click_envelope = click_envelope - click_threshold # Subtract the threshold from the envelope
  click_envelope = np.maximum(click_envelope, 0) # Return only the positive values
  click_envelope = click_envelope ** (1/2) # Take the square root of the envelope to make the clicks more visible
  del analytic_signal, envelope, wide_rms_envelope, thin_rms_envelope, adjusted_envelope # Clear the variables from memory
  return click_envelope


def widen_peaks(signal: np.ndarray, sample_rate: int=44100, width: number=2) -> np.ndarray:
  """Widen the peaks in an audio signal using a Gaussian function.

  Args:
    signal (np.ndarray): The signal to widen the peaks of.
    sample_rate (int, optional): The sample rate of the signal. Defaults to 44100.
    width (number, optional): The width of the Gaussian filter in ms. Defaults to 2.
  
  Returns:
    np.ndarray: The signal with the widened peaks.
  """
  width = int(width * sample_rate / 1000) # Convert the width to samples

  # Create a Gaussian function
  gaussian_filter = np.exp(-((np.arange(-width//2, width//2) / (width//4))**2))

  # Apply the Gaussian filter to the signal
  widened_signal = signal.copy() # Copy the signal to avoid modifying the original
  for index in range(len(signal)):
    if signal[index] != 0: # If the signal is not zero
      start = max(0, index - width//2) # Calculate the start of the filter
      end = min(len(signal), index + width//2) # Calculate the end of the filter
      filter_start = max(0, width//2 - index) # Calculate the start of the filter
      filter_end = min(width, width//2 + (len(signal) - index)) # Calculate the end of the filter
      filter = gaussian_filter * signal[index] # Normalize the filter by the signal value
      widened_signal[start:end] = np.maximum(widened_signal[start:end], filter[filter_start:filter_end]) # Apply the function to the signal
  return widened_signal


def reduce_clicks(signal: np.ndarray, sample_rate: int, click_widening: number=2, click_strengthening: number=4) -> np.ndarray:
  """Reduce the clicks in an audio signal by determining the clicks using the envelope.

  Args:
    signal (np.ndarray): The signal to reduce the clicks of.
    sample_rate (int): The sample rate of the signal.
    click_widening (number, optional): The amount to widen the clicks by in ms. Defaults to 2.
    click_strengthening (number, optional): The amount to strengthen the clicks by. Defaults to 2.
  
  Returns:
    np.ndarray: The signal with the clicks reduced.
  """
  
  click_envelope = calculate_click_envelope(signal, sample_rate) * click_strengthening # Calculate the envelope of the clicks
  click_envelope = widen_peaks(click_envelope, sample_rate, width=click_widening) # Widen the peaks of the envelope
  analytic_signal = hilbert_transform(signal) # Calculate the analytic signal
  envelope = np.abs(analytic_signal) # Calculate the envelope of the analytic signal
  envelope = envelope - click_envelope # Subtract the click envelope from the envelope
  envelope = np.maximum(envelope, 0) # Return only the positive values
  analytic_signal = polar_to_complex(envelope, np.angle(analytic_signal)) # Recreate the analytic signal with the new envelope
  del envelope, click_envelope # Clear the envelope and click envelope from memory
  return analytic_signal.real # Return the real part of the analytic signal as the new signal


def calculate_transient_envelope(signal: np.ndarray, sample_rate: int, rms_coefficent: number=4, window_size: number=10) -> np.ndarray:
  """Calculate the envelope of the transients in an audio signal.
  
  Args:
    signal (np.ndarray): The signal to calculate the envelope of. **Must be normalized to the range [-1,1]**
    sample_rate (int): The sample rate of the signal.
    rms_coefficent (number, optional): The coefficient to adjust the RMS envelope by. Defaults to 4.
    window_size (number, optional): The size of the window in ms. Defaults to 10.

  Returns:
    np.ndarray: The envelope of the clicks.
  """ 
  analytic_signal = hilbert_transform(signal) # Calculate the analytic signal
  envelope = np.abs(analytic_signal) # Calculate the envelope of the analytic signal
  rms_envelope = signal_to_rms_signal(envelope, sample_rate, window_size) # Calculate a wide RMS envelope of the envelope
  transient_envelope = envelope - (rms_envelope * rms_coefficent) # Subtract the adjusted envelope from the envelope
  transient_envelope = np.maximum(transient_envelope, 0) # Return only the positive values
  del analytic_signal, envelope, rms_envelope # Clear the variables from memory
  return transient_envelope


def smooth_peaks(signal: np.ndarray, sample_rate: int, width: number=0.5) -> np.ndarray:
  """Round out the peaks of a signal with a Gaussian Filter to smooth the signal.
  
  Args:
    signal (np.ndarray): The signal to smooth the peaks of.
    sample_rate (int): The sample rate of the signal.
    width (number, optional): The size of the Gaussian filter in ms. Defaults to 1.
      
  Returns:
      np.ndarray: The signal with the smoothed peaks.
  """
  width = int(width * sample_rate / 1000) # Convert the window size to samples
  return gaussian_filter1d(signal, width) ** (1/2)# Apply the Gaussian filter to the signal


def reduce_transients(signal: np.ndarray, sample_rate: int, transient_widening: number=0.5) -> np.ndarray:
  """Reduce the transients in an audio signal.

  Args:
    signal (np.ndarray): The signal to reduce the transients of.
    sample_rate (int): The sample rate of the signal.
    transient_widening (number, optional): The amount to widen the transients by in ms. Defaults to 0.5.
  
  Returns:
    np.ndarray: The signal with the transients reduced.
  """
  transient_envelope = calculate_transient_envelope(signal, sample_rate) # Calculate the envelope of the transients
  transient_envelope = smooth_peaks(transient_envelope, sample_rate, width=transient_widening) # Widen the peaks of the envelope
  analytic_signal = hilbert_transform(signal) # Calculate the analytic signal
  envelope = np.abs(analytic_signal) # Calculate the envelope of the analytic signal
  envelope = envelope - transient_envelope # Subtract the transient envelope from the envelope
  envelope = np.maximum(envelope, 0) # Return only the positive values
  analytic_signal = polar_to_complex(envelope, np.angle(analytic_signal)) # Recreate the analytic signal with the new envelope
  del envelope, transient_envelope # Clear the envelope and transient envelope from memory
  return analytic_signal.real # Return the real part of the analytic signal as the new signal


def package_signal_data(signal: Union[List, np.ndarray], sample_rate: int, metadata: dict) -> pd.Series:
  """Package audio signal and metadata into a DataFrame for model input.
  
  Args:
    signal (array-like): The audio signal array.
    metadata (dict): Metadata including 'date', 'time', 'latitude', 'longitude', 'elevation'.

  Returns:
    pd.Series: A pandas Series combining the signal and metadata for model input.
  """
  # Validate and normalize metadata
  data = {
    'date': normalize_date(metadata['date']),
    'time': normalize_time(metadata['time']),
    'latitude': normalize_latitude(metadata['latitude']),
    'longitude': normalize_longitude(metadata['longitude']),
    'elevation': normalize_elevation(metadata['elevation'])
  }
  for key, value in data.items():
    if value is None:
      raise ValueError(f"Invalid metadata value for {key}: {metadata[key]}")

  signal = np.asarray(signal)

  # Preprocess the signal
  signal = normalize_signal(signal)
  signal = reduce_noise_floor(signal, sample_rate)
  signal = reduce_clicks(signal, sample_rate)
  signal = reduce_transients(signal, sample_rate)
  signal = normalize_signal(signal)

  # Group Frequencies and convert to decibels
  frequencies, freq_signal = fourier_transform(signal, sample_rate)
  frequencies, freq_signal = group_frequencies(frequencies, freq_signal)
  freq_signal = magnitude_to_db(freq_signal)
  freq_signal = normalize_decibels(freq_signal)
  freq_bins = get_bark_spaced_frequencies(100)
  for freq, value in zip(freq_bins, freq_signal):
    data[f'{int(freq)}Hz'] = value
  
  return pd.Series(data)


def classify_bird(signal: Union[List, np.ndarray], sample_rate: int, metadata: dict) -> str:
  """Classify bird species based on audio signal and metadata using a pre-trained model.
  
  Args:
    signal (Union[List, np.ndarray]): The audio signal to classify.
    sample_rate (int): The sample rate of the audio signal.
    metadata (dict): Metadata including 'date', 'time', 'latitude', 'longitude', 'elevation'.

  Returns:
    str: The predicted bird species.
  """
  try:
    signal_data = package_signal_data(signal, sample_rate, metadata)
    prediction = BIRD_CLASSIFIER.predict(pd.DataFrame([signal_data]));
    return prediction[0]
  except Exception as e:
    return "Model Prediction Error"


async def load_model() -> None:
  """Load the pre-trained bird classification model from a pickle file."""
  global BIRD_CLASSIFIER
  try:
    response = await js.fetch('/models/birdClassifier.pkl', create_proxy({"method": "GET"})) # Fetch the model file
    if not response.ok:
      raise Exception(f"Failed to load model: {response.status}")
    
    buffer = await response.arrayBuffer()
    bytes_data = BytesIO(pyodide.ffi.to_py(buffer))
    BIRD_CLASSIFIER = pickle.load(bytes_data) # Load the model from the pickle file
  except Exception as e:
    print(f"Error loading model: {e}")
    BIRD_CLASSIFIER = None


# await load_model() # Load the model when the script is imported