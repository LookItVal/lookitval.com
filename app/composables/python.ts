const worker = ref<Worker | null>(null)
const isLoading = ref(true)
const isReady = computed(() => !!worker.value && !isLoading.value)
const messageId = ref(0)
const pendingMessages = new Map<number, { resolve: (value: unknown) => void, reject: (reason?: unknown) => void }>()


export function usePython() {
  const createWorker = () => {
    if (worker.value) return worker.value

    worker.value = new Worker(new URL('@/workers/pythonWorker.ts', import.meta.url), { type: 'module' })

    worker.value.onmessage = (event) => {
      const { id, type, result, error } = event.data
      const pending = pendingMessages.get(id)
      
      if (pending) {
        pendingMessages.delete(id)
        if (type === 'success') {
          pending.resolve(result)
        } else {
          pending.reject(new Error(error))
        }
      }
    }
    
    return worker.value
  }

  const sendMessage = (type: string, payload?: unknown): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      const id = messageId.value++
      const currentWorker = createWorker()
      
      pendingMessages.set(id, { resolve, reject })
      currentWorker.postMessage({ id, type, payload })
    })
  }

  const initialize = async () => {
    if (!isLoading.value) return 'initialized'
    
    try {
      const result = await sendMessage('initialize')
      isLoading.value = false
      return result
    } catch (error) {
      console.error('Failed to load Pyodide:', error)
      isLoading.value = false
      throw error
    }
  }

  const runPython = async (code: string, globals_vars = {}): Promise<string> => {
    return await sendMessage('runPython', { code, globals_vars }) as Promise<string>;
  }

  const installPackage = async (packageName: string): Promise<void> => {
    await sendMessage('installPackage', { packageName })
  }

  return {
    worker: readonly(worker),
    isLoading: readonly(isLoading),
    isReady,
    initialize,
    runPython,
    installPackage
  }
}