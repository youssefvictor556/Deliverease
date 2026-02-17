/* DeliverEase - Application State
 * Manages global application state and DOM references
 */

// App state
const state = {
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null')
};

// DOM references (initialized in init)
let restaurantList;
let menuSection;
let restaurantsSection;
let menuItems;
let categoryTabs;
let menuHeader;
let cartCount;

let modal;
let modalBody;
let modalClose;
let _lastActiveElement = null;

