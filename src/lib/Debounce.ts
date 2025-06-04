function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null
    return function (this: any, ...args: Parameters<F>) {
      if (timeout !== null) clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }