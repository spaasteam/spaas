
/* eslint-disable no-console */
// qiankun bootstrap hook
export function bootstrap () {
  console.log('nuxt app bootstraped')
}

// qiankun mount hook
export async function mount (render, props) {
  await render()
  console.log('props from main framework', props)
}

// call after nuxt rendered 接收主应用传递下来的数据
export function mounted (vm) {
  console.log('mounted', vm)
}

// qiankun update hook
export function update (vm, props) {
  console.log(props)
}

// call before qiankun call unmount
export function beforeUnmount (vm, props) {
  console.log(vm)
}

// qiankun unmount hook 需要将部分全局变量移除
export function unmount () {
  console.log('nuxt app unmount')
}