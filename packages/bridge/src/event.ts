import { event } from './stark-data/index';

/**
 * 触发已经注册的函数，支持入参
 * @param key 
 * @param value 
 */
function emit(key: string, value: any): void {
  return event.emit(key, value)
}

function on(key: string, callback: (value: any) => void ): void {
  return event.on(key, callback)
}

function off(key: string, callback?: (value: any) => void ): void {
  return event.off(key, callback)
}

function has(key: string): boolean {
  return event.has(key)
}

export default {
  on,
  off,
  emit,
  has,
}