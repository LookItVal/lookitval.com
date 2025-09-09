import type { PyodideAPI } from 'pyodide'
import { loadPyodide } from 'pyodide'

export const usePython = () => {
  const pyodide: Ref<PyodideAPI | null> = ref(null)
  const isLoading = ref(true)
  const isReady = computed(() => !!pyodide.value && !isLoading.value)

  const initialize = async () => {
    if (pyodide.value) return pyodide.value
    
    try {
      pyodide.value = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.2/full/'
      })
      await pyodide.value.loadPackage("micropip")
      isLoading.value = false
      return pyodide.value
    } catch (error) {
      console.error('Failed to load Pyodide:', error)
      isLoading.value = false
      throw error
    }
  }

  const runPython = async (code: string, globals = {}): Promise<string> => {
    if (!pyodide.value) {
      throw new Error('Pyodide not initialized')
    }

    try {
      // Run code (async if contains await)
      if (code.includes('await')) {
        if (Object.keys(globals).length !== 0) {
          globals = pyodide.value.toPy(globals)
          return await pyodide.value.runPythonAsync(code, { globals })
        } else {
          return await pyodide.value.runPythonAsync(code)
        }
      } else {
        if (Object.keys(globals).length !== 0) {
          globals = pyodide.value.toPy(globals)
          return pyodide.value.runPython(code, { globals })
        } else {
          return pyodide.value.runPython(code)
        }
      }
    } catch (error) {
      throw new Error(`Python Error: ${(error as Error).message}`)
    }
  }

  const installPackage = async (packageName: string): Promise<void> => {
    if (!pyodide.value) {
      throw new Error('Pyodide not initialized')
    }

    await pyodide.value.runPythonAsync(`
      import micropip
      await micropip.install('${packageName}')
    `)
  }

  return {
    pyodide: readonly(pyodide),
    isLoading: readonly(isLoading),
    isReady,
    initialize,
    runPython,
    installPackage
  }
}