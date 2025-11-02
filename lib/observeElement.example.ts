/**
 * observeElement 使用示例
 */

import { observeElement, observeElements } from './observeElement'

// ============================================
// 示例 1: 基本用法 - 监听单个元素
// ============================================
function example1() {
  const cleanup = observeElement({
    selector: '.my-button',
    onElement: (element) => {
      console.log('Button found:', element)
      element.addEventListener('click', () => {
        console.log('Button clicked!')
      })
    },
  })

  // 稍后清理
  // cleanup()
}

// ============================================
// 示例 2: 支持多个选择器（fallback）
// ============================================
function example2() {
  observeElement({
    // 按顺序尝试，找到第一个匹配的就停止
    selector: [
      '.input-container > input[name="q"]',
      '.input-container > input[placeholder*="Search"]',
      '#search-input',
    ],
    onElement: (element) => {
      const input = element as HTMLInputElement
      input.value = 'Hello World'
    },
  })
}

// ============================================
// 示例 3: 自定义防抖延迟
// ============================================
function example3() {
  observeElement({
    selector: '.dynamic-content',
    onElement: (element) => {
      console.log('Content loaded')
    },
    debounceDelay: 200, // 增加延迟，减少触发频率
  })
}

// ============================================
// 示例 4: 禁用 Shadow DOM 支持（提升性能）
// ============================================
function example4() {
  observeElement({
    selector: '.regular-element',
    onElement: (element) => {
      console.log('Element found')
    },
    supportShadowDOM: false, // 如果不需要 Shadow DOM，可以禁用
  })
}

// ============================================
// 示例 5: 自定义观察根元素
// ============================================
function example5() {
  const container = document.querySelector('.my-container')
  if (container) {
    observeElement({
      selector: '.child-element',
      onElement: (element) => {
        console.log('Child found')
      },
      root: container, // 只观察容器内的变化
    })
  }
}

// ============================================
// 示例 6: 一次性观察（找到后停止）
// ============================================
function example6() {
  observeElement({
    selector: '.modal',
    onElement: (element) => {
      console.log('Modal appeared!')
      return true // 返回 true 停止观察
    },
  })
}

// ============================================
// 示例 7: 观察多个不同的元素
// ============================================
function example7() {
  const cleanup = observeElements([
    {
      selector: '.search-input',
      onElement: (el) => {
        console.log('Search input found:', el)
      },
    },
    {
      selector: '.submit-button',
      onElement: (el) => {
        console.log('Submit button found:', el)
      },
    },
    {
      selector: '.user-avatar',
      onElement: (el) => {
        console.log('Avatar found:', el)
      },
    },
  ])

  // 一次性清理所有观察器
  // cleanup()
}

// ============================================
// 示例 8: 在浏览器扩展中使用
// ============================================
function example8() {
  // 在 WXT content script 中
  export default defineContentScript({
    matches: ['https://example.com/**'],
    async main(ctx) {
      const cleanup = observeElement({
        selector: '.target-element',
        onElement: (element) => {
          // 处理元素
        },
      })

      // 扩展失效时自动清理
      ctx.onInvalidated(() => {
        cleanup()
      })
    },
  })
}

// ============================================
// 示例 9: 处理 SPA 路由变化
// ============================================
function example9() {
  export default defineContentScript({
    matches: ['https://spa-app.com/**'],
    async main(ctx) {
      // observeElement 会自动处理 DOM 变化
      // 无需手动监听路由变化
      observeElement({
        selector: '.page-content',
        onElement: (element) => {
          console.log('Page content updated')
        },
      })
    },
  })
}

// ============================================
// 示例 10: 复杂场景 - 等待多个元素都出现
// ============================================
function example10() {
  const elementsFound = {
    header: false,
    sidebar: false,
    content: false,
  }

  function checkAllFound() {
    if (Object.values(elementsFound).every(Boolean)) {
      console.log('All elements loaded!')
      // 执行初始化逻辑
    }
  }

  observeElement({
    selector: '.header',
    onElement: () => {
      elementsFound.header = true
      checkAllFound()
      return true
    },
  })

  observeElement({
    selector: '.sidebar',
    onElement: () => {
      elementsFound.sidebar = true
      checkAllFound()
      return true
    },
  })

  observeElement({
    selector: '.content',
    onElement: () => {
      elementsFound.content = true
      checkAllFound()
      return true
    },
  })
}
