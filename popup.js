//* FUNCTIONS :

const RENDER_sites = () => {
   chrome.storage.local
      .get('sites')
      .then(given => {
         sites = given.sites ?? []

         const sites_ol = document.createElement('ol')

         sites.forEach((site, i) => {
            const { favIconUrl, hostname, checked } = site
            const shorter_hostname = hostname.includes('www.')
               ? hostname.slice(4)
               : hostname

            //! Trying to assign false to the boolean attribute 'checked' will make it true!
            sites_ol.insertAdjacentHTML(
               'beforeend',
               `<li id='${i}'>
                  <input type='checkbox' ${checked ? 'checked' : ''}>
                  <a href='https://${hostname}' target='_blank'>
                     <img src='${favIconUrl}' alt='favicon of ${shorter_hostname}'>
                     <span>${shorter_hostname}</span></a>
                  <button type='button' name='delete_btn' class='material-symbols-outlined'
                  title='Delete from Liked Sites'>
                  delete
               </button>
               </li>`
            )
         })
         list_section.querySelector('ol')?.remove()
         list_section.insertAdjacentElement('beforeend', sites_ol)
      })
}
const DELETE_site = (id) => {
   sites.splice(Number(id), 1)
   chrome.storage.local
      .set({ sites })
      .then(RENDER_sites)

   chrome.tabs
      .query({ active: true, currentWindow: true })
      .then(tabs => chrome.action.setIcon({ path: './unliked_16.png', tabId: tabs[0].id }))


}
const ADD_site = () => {
   chrome.tabs
      .query({ active: true, currentWindow: true })
      .then(tabs => {
         const { favIconUrl, url, id } = tabs[0]
         const { hostname } = new URL(url)
         const site = { favIconUrl, hostname, checked: true }

         sites.push(site)
         chrome.storage.local
            .set({ sites })
            .then(RENDER_sites)
         chrome.action.setIcon({ path: './liked_16.png', tabId: id })
      })
}
const HANDLE_click = (event) => {
   switch (event.target.name) {
      case 'delete_btn':
         DELETE_site(event.target.parentElement.id)
         break
      case 'like_btn':
         ADD_site()
         break
      case 'search_in_liked_sites_btn':
         SEARCH_in_list()
         break
   }
}
const SEARCH_in_list = () => {

   let search_str = `"${search_input.value}"`
   const ticked_Sites = sites.filter(site => site.checked === true)

   if (ticked_Sites.length > 0) {
      search_str += ' ('

      ticked_Sites.forEach((site, i) => {
         search_str += `site:${site.hostname}`
         if (i < ticked_Sites.length - 1) {
            search_str += ' | '
         } else {
            search_str += ')'
         }
      })
   }

   chrome.search.query({ disposition: 'NEW_TAB', text: search_str })

   //* POSSIBLE DEFINITIVE:
   //* intitle:"console.warn" (site:www.w3schools.com | site:developer.mozilla.org site:www.tutorialspoint.com | site:javascript.info | site:www.javascripttutorial.net)
   //! Don't use 'allintitle:'.
   //* BETTER:
   //* intitle:"console.warn" (site:www.w3schools.com OR site:developer.mozilla.org OR site:www.tutorialspoint.com OR site:javascript.info OR site:www.javascripttutorial.net)
   //* CURRENTLY IN USE:
   //* "console.warn" (site:www.w3schools.com | site:developer.mozilla.org site:www.tutorialspoint.com | site:javascript.info | site:www.javascripttutorial.net)
}

//* GLOBAL VARIABLES:

const search_input = document.querySelector('[type=search]')
const search_in_liked_sites_btn = document.querySelector('[name=search_in_liked_sites_btn]')
const list_section = document.getElementById('list_section')
let sites = null

//* ACTION :

RENDER_sites()

//* EVENT LISTENERS :

// chrome.storage.onChanged.addListener(RENDER_sites)

addEventListener('click', HANDLE_click, { passive: true })

search_input.addEventListener('keydown', event => {
   //TODO: add more shortcuts.

   if (event.key === 'Enter') {
      search_in_liked_sites_btn.click()
   }
}, { passive: true })

addEventListener('change', event => {
   const input_Elem = event.target

   if (input_Elem.type === 'checkbox') {
      sites[input_Elem.parentElement.id].checked = input_Elem.checked
      chrome.storage.local.set({ sites })
   }
}, { passive: true })

//TODO: Fix occassional harmless bug in which 'sites' is null when calling sites.some().