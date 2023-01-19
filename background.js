//* FUNCTIONS:

const GET_storage = () => {
   chrome.storage.local
      .get('sites')
      .then(response => {
         sites = response.sites ?? []
      })
}

//* GLOBAL VARIABLE + ACTION:

let sites = null
GET_storage()

let URL_state = 'unliked'

//* EVENT LISTENERS:

chrome.commands.onCommand.addListener((command, tab) => {
   if (command === 'go_to_page_search_bar') {
      chrome.tabs
         .sendMessage(tab.id, command)
         .catch(error => {
            console.warn("You can't go to the search bar of the browser's settings because that page can't have a content script. Here is the error message, in case you want to see it:")
            console.error(error)
         })
   }
})

chrome.storage.onChanged.addListener(GET_storage)

// chrome.action.setIcon({ path: './opaque_active_48.png' })

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

   if (changeInfo.url !== undefined) {

      let new_Hostname = changeInfo.url
      new_Hostname = new URL(new_Hostname)
      new_Hostname = new_Hostname.hostname

      const current_Site_Is_Already_Liked = sites.some(site => site.hostname === new_Hostname)

      if (current_Site_Is_Already_Liked) {
         chrome.action.setIcon({ path: './liked_16.png', tabId })
         URL_state = 'liked'
      } else {
         chrome.action.setIcon({ path: './unliked_48.png', tabId })
         URL_state = 'unliked'
      }
   } else if (URL_state === 'liked') {

      chrome.action.setIcon({ path: './liked_16.png', tabId })

   }
})

