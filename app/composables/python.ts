import type { PyodideAPI } from 'pyodide'
import { loadPyodide } from 'pyodide'

export const usePyodide = () => {
  const pyodide: Ref<PyodideAPI | null> = ref(null)
  const isLoading = ref(true)
  const isReady = computed(() => !!pyodide.value && !isLoading.value)

  const initialize = async () => {
    if (pyodide.value) return pyodide.value
    
    try {
      pyodide.value = await loadPyodide()
      await pyodide.value.loadPackage("micropip")
      isLoading.value = false
      return pyodide.value
    } catch (error) {
      console.error('Failed to load Pyodide:', error)
      isLoading.value = false
      throw error
    }
  }

  const runPython = async (code: string): Promise<string> => {
    if (!pyodide.value) {
      throw new Error('Pyodide not initialized')
    }

    try {
      // Capture stdout
      pyodide.value.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `)

      // Run code (async if contains await)
      if (code.includes('await')) {
        await pyodide.value.runPythonAsync(code)
      } else {
        pyodide.value.runPython(code)
      }

      // Get output
      return pyodide.value.runPython('sys.stdout.getvalue()')
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