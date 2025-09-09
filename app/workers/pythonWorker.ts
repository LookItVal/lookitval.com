import type { PyodideAPI } from 'pyodide'
import { loadPyodide } from 'pyodide'

let pyodide: PyodideAPI | null = null

export async function initializePyodide(): Promise<PyodideAPI> {
  if (pyodide) return pyodide

  try {
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.2/full/'
    })
    await pyodide.loadPackage("micropip")
    return pyodide
  } catch (error) {
    throw new Error('Failed to load Pyodide: ' + (error as Error).message)
  }
}


export async function runPython(code: string, globals_vars = {}): Promise<string> {
  if (!pyodide) {
    throw new Error('Pyodide not initialized')
  }

  try {
    // Run code (async if contains await)
    if (code.includes('await')) {
      if (Object.keys(globals_vars).length !== 0) {
        for (const [key, value] of Object.entries(globals_vars)) {
          pyodide.globals.set(key, value)
        }
      }
      return await pyodide.runPythonAsync(code)
    } else {
      if (Object.keys(globals_vars).length !== 0) {
        for (const [key, value] of Object.entries(globals_vars)) {
          pyodide.globals.set(key, value)
        }
      }
      return pyodide.runPython(code)
    }
  } catch (error) {
    throw new Error(`Python Error: ${(error as Error).message}`)
  }
}

export async function installPackage(packageName: string): Promise<void> {
  if (!pyodide) {
    throw new Error('Pyodide not initialized')
  }

  await pyodide.runPythonAsync(`
    import micropip
    await micropip.install('${packageName}')
  `)
}


self.onmessage = async (event) => {
  const { id, type, payload } = event.data

  try {
    let result
    
    switch (type) {
      case 'initialize':
        await initializePyodide()
        self.postMessage({ id, type: 'success', result: 'initialized' })
        break
        
      case 'runPython':
        result = await runPython(payload.code, payload.globals_vars)
        self.postMessage({ id, type: 'success', result })
        break
        
      case 'installPackage':
        await installPackage(payload.packageName)
        self.postMessage({ id, type: 'success', result: 'installed' })
        break
        
      default:
        throw new Error(`Unknown message type: ${type}`)
    }
  } catch (error) {
    self.postMessage({ 
      id, 
      type: 'error', 
      error: error instanceof Error ? error.message : String(error)
    })
  }
}