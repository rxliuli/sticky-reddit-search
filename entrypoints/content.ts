import { observeElement } from '@/lib/observeElement'
import { debounce } from 'es-toolkit'
import { querySelectorDeep } from 'query-selector-shadow-dom'

export default defineContentScript({
  matches: ['https://www.reddit.com/**'],
  async main(ctx) {
    const cleanup = observeElement({
      selector: '.input-container > input[name="q"]',
      onElement: debounce((element) => {
        const searchInput = element as HTMLInputElement
        console.debug('interceptSearch', searchInput)

        searchInput.addEventListener(
          'keydown',
          (ev) => {
            // console.debug('keydown', ev.key)
            if (ev.key === 'Enter') {
              ev.preventDefault()
              ev.stopPropagation()

              const query = searchInput.value.trim()
              if (!query) {
                return
              }

              performSearch(query)
            }
          },
          true,
        )
      }, 100),
      supportShadowDOM: true,
      root: document.body,
    })

    ctx.onInvalidated(() => {
      cleanup()
    })
  },
})

function performSearch(query: string) {
  const subredditMatch = location.pathname.match(/^\/r\/([^\/]+)/)
  const baseURL =
    subredditMatch &&
    querySelectorDeep('faceplate-search-input #search-input-chip')
      ? `/r/${subredditMatch[1]}/search`
      : '/search'
  const params = new URLSearchParams(location.search)
  const paramsToKeep = ['sort', 't', 'type']
  const keysToDelete = Array.from(params.keys()).filter(
    (key) => !paramsToKeep.includes(key),
  )
  keysToDelete.forEach((key) => params.delete(key))
  params.set('q', query)
  location.href = `${baseURL}?${params.toString()}`
}
