'use strict'

//! Undocumented fact 1: You can't use chrome.search in a content script.

//! Undocumented fact 2: The content script is refreshed when the tab is refreshed.

//! You can't use chrome.commands in the content script, it seems you MUST use it in the background.js service worker.

//! You can't use chrome.tabs in a content script because the script is isolated, you MUST use chrome.runtime instead.

//! However, as you can see in popup.js and in the background.js service worker, you MUST use chrome.tabs.sendMessage() to send a message to the content script.

//! chrome.runtime.onMessage.addListener isn't a promise, and its callback can't be a promise.

//! Automatic searchs are apparently against Google's policies...

//* FUNCTIONS:

//TODO: Make the 'Home' key take you to the beginning of line in a search bar (apparently not all sites do that...)

const FIND_search_inputs = event => {
   const all_elems = Array.from(document.querySelectorAll('*'))
   let input_elems = all_elems.filter(elem => {
      return elem.type === 'search'
   })
   if (input_elems.length === 0) {
      input_elems = all_elems.filter(elem => {
         return elem.type === 'text'
      })
   }
   if (input_elems.length === 0) {
      input_elems = all_elems.filter(elem => {
         return elem.id?.includes('search')
      })
   }
   if (input_elems.length === 0) {
      input_elems = all_elems.filter(elem => {
         return elem.title
            ?.toLowerCase()
            .includes('search')
      })
   }
   //TODO: Support for sidebars.
   //TODO: Add support for elements with class attribute 'search' and similar.
   if (input_elems.length === 0) {
      alert("Sorry, I couldn't get a search bar!")
      return
   }
   const focused_elem = input_elems[i]
   focused_elem.classList.toggle('focused_elem')
   focused_elem.focus()

   // focused_elem.style.setProperty(
   //     'outline',
   //     '3px solid orange',
   //     'important'
   // )
   // //? Try blur()
   focused_elem.addEventListener('focusout', () => {
      focused_elem.classList.toggle('focused_elem')
   }, { once: true, passive: true })

   if ((focused_elem.type === 'text') || (focused_elem.type === 'search')) {
      focused_elem.select()
   }

   //! The line commented out below apparently provokes unsafe eval error in w3schools:

   // input_elems[i].click()

   if (i === input_elems.length - 1) {
      i = 0
   } else {
      ++i
   }
}

//* GLOBAL VARIABLES:

let i = 0

//* EVENT LISTENERS:

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
   if (message === 'go_to_page_search_bar') {
      FIND_search_inputs()
   }
   sendResponse('done')
})
