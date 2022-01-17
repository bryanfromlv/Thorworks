export default class utilities {
  constructor() {
    const images = document.querySelectorAll('[data-src]')
    const scrollBtn = document.querySelector('#scroll_btn')
    const scrollBtnTrigger = document.querySelector('#scroll_btn_trigger')

    //! lazy load images
    const preloadImage = (img) => {
      const src = img.getAttribute('data-src')
      if (!src) {
        return
      }
      // console.log(`preloading ${src}`)
      img.src = src
    }

    const imgOptions = { threshold: 0, rootMargin: '300px' }
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        } else {
          preloadImage(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, imgOptions)

    images.forEach((image) => {
      imgObserver.observe(image)
    })

    //! scroll to top button
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
    scrollBtn.addEventListener('click', scrollToTop)

    const scrollMethod = (entries, observer) => {
      // console.log(entries[0])
      const intersecting = entries[0].isIntersecting
      scrollBtn.classList.toggle('scroll-btn-show', intersecting)
    }
    const observer = new IntersectionObserver(scrollMethod)
    observer.observe(scrollBtnTrigger)
    console.log(`utilities.js instantiated`)
  }
}
console.log(`utilities.js loaded`)
