/* DeliverEase - Utility Functions
 * Helper functions for currency formatting, image handling, and product generation
 */

// Currency settings (Egyptian Pound)
const CURRENCY = { code: 'EGP', symbol: 'ج.م', label: 'EGP' };

/**
 * Format currency value in Egyptian Pound
 * @param {number} v - Value to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(v) {
  return `${Number(v || 0).toFixed(2)} EGP`;
}

/**
 * Get product image based on product name
 * @param {string} category - Product category
 * @param {string} restId - Restaurant ID
 * @param {string} itemName - Product name
 * @returns {string} Image path
 */
function getProductImage(category, restId, itemName = '') {
  if (!itemName) return 'photos/plain.jpg';
  let nameLower = itemName.toLowerCase().trim().replace(/\s+/g, ' ');
  const cat = category.toLowerCase();
  
  // McDonald's specific images
  if (restId === 'mcd') {
    if ((nameLower.includes('fries') || nameLower.includes('french')) && cat === 'sides') return 'photos/mc Fries.jpg';
    if (cat === 'drinks') {
      if (nameLower.includes('cola') || nameLower.includes('coke') || (nameLower.includes('coca') && nameLower.includes('cola'))) return 'photos/mc coca.jpg';
      if (nameLower.includes('sprite')) return 'photos/mc sprite.jpg.png';
      if (nameLower.includes('fanta')) return 'photos/mc fatnta.jpg';
    }
  }
  
  // Try exact match
  if (productImageMap[nameLower]) return `photos/${productImageMap[nameLower]}`;
  const nameNoParens = nameLower.replace(/[()]/g, '').trim();
  if (productImageMap[nameNoParens]) return `photos/${productImageMap[nameNoParens]}`;
  
  // Try partial matches
  for (const [key, image] of Object.entries(productImageMap)) {
    const keyClean = key.replace(/[()]/g, '').trim();
    const nameClean = nameLower.replace(/[()]/g, '').trim();
    if ((nameClean.includes(keyClean) || keyClean.includes(nameClean)) && keyClean.length > 3) return `photos/${image}`;
  }
  
  // Try word-by-word matching
  const nameWords = nameLower.split(/\s+/);
  for (const word of nameWords) {
    const cleanWord = word.replace(/[()]/g, '').trim();
    if (cleanWord.length > 3 && productImageMap[cleanWord]) return `photos/${productImageMap[cleanWord]}`;
  }
  
  // Fallback for other restaurants
  if (restId !== 'mcd') {
    if (nameLower.includes('fries') && (cat === 'sides' || cat === 'fries')) return 'photos/Fries.jpg';
    if (nameLower.includes('cola') || nameLower.includes('coke')) return 'photos/coke.jpg';
    if (nameLower.includes('sprite')) return 'photos/sprite.jpg';
    if (nameLower.includes('fanta')) return 'photos/fanta.jpg';
  }
  if (nameLower.includes('apple') && nameLower.includes('pie')) return 'photos/chocolate-fudge.jpg';
  if (nameLower.includes('hash') && nameLower.includes('brown')) return 'photos/plain.jpg';
  
  // Fallback based on category
  const categoryLower = category.toLowerCase();
  const categoryImageMap = {
    'burgers': 'Double-Big-Tasty.jpg.png',
    'whoppers': 'Double-Big-Tasty.jpg.png',
    'chicken': 'chickn.jpg',
    'fries': 'Fries.jpg',
    'sides': 'Fries.jpg',
    'drinks': 'coke.jpg',
    'desserts': 'chocolate-fudge.jpg',
    'breakfast': 'plain.jpg',
    'pizzas': 'pizza.jpg.webp',
    'pasta': 'pizza.jpg.webp',
    'wings': 'wings.jpg',
    'subs': 'subway.jpg.jpg',
    'wraps': 'subway.jpg.jpg',
    'salads': 'plain.jpg',
    'buckets': '8pc Chicken Bucket.jpg',
    'sandwiches': 'zinger,jpg.png',
    'combos': 'Double-McRoyale .jpg.png',
    'meals': 'zingermeal.jpg',
    'kids': 'plain.jpg'
  };
  
  return `photos/${categoryImageMap[categoryLower] || 'plain.jpg'}`;
}

/**
 * Setup image fallback handler
 * @param {HTMLElement} img - Image element
 * @param {string} fallbackText - Fallback text to display
 */
function setupImageFallback(img, fallbackText = 'Image') {
  if (!img || img.dataset.fallbackSetup === 'true') return;
  img.loading = 'lazy';
  img.dataset.fallbackSetup = 'true';
  img.onerror = function() {
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.image-placeholder')) {
      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder';
      placeholder.style.cssText = 'width:100%;height:200px;min-height:200px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:16px;text-align:center;padding:20px;box-sizing:border-box;border-radius:8px';
      placeholder.textContent = fallbackText || 'Image';
      img.style.display = 'none';
      parent.insertBefore(placeholder, img);
    }
  };
  img.onload = function() {
    const placeholder = img.parentElement?.querySelector('.image-placeholder');
    if (placeholder) { placeholder.remove(); img.style.display = ''; }
  };
}

/**
 * Get realistic price for a product based on restaurant and product name
 * @param {string} restId - Restaurant ID
 * @param {string} category - Category name
 * @param {string} productName - Product name
 * @returns {number} Price in EGP
 */
function getProductPrice(restId, category, productName) {
  const nameLower = productName.toLowerCase();
  
  // McDonald's prices (realistic Egyptian market prices)
  if (restId === 'mcd') {
    // Burgers
    if (nameLower.includes('big mac')) return 85.00;
    if (nameLower.includes('double big tasty')) return 120.00;
    if (nameLower.includes('mcroyale')) return 75.00;
    if (nameLower.includes('quarter pounder')) return 95.00;
    if (nameLower.includes('double cheeseburger')) return 65.00;
    if (nameLower.includes('cheeseburger')) return 45.00;
    
    // Combos
    if (nameLower.includes('big mac meal')) return 140.00;
    if (nameLower.includes('double big tasty meal')) return 175.00;
    if (nameLower.includes('mcroyale meal')) return 130.00;
    if (nameLower.includes('quarter pounder meal')) return 150.00;
    if (nameLower.includes('chicken meal')) return 125.00;
    
    // Chicken
    if (nameLower.includes('mcnuggets') && nameLower.includes('6pc')) return 55.00;
    if (nameLower.includes('mcnuggets') && nameLower.includes('9pc')) return 75.00;
    if (nameLower.includes('mcchicken')) return 60.00;
    if (nameLower.includes('spicy mcchicken')) return 65.00;
    if (nameLower.includes('crispy chicken')) return 70.00;
    
    // Sides
    if (nameLower.includes('fries') && nameLower.includes('small')) return 25.00;
    if (nameLower.includes('fries') && nameLower.includes('medium')) return 35.00;
    if (nameLower.includes('fries') && nameLower.includes('large')) return 45.00;
    if (nameLower.includes('apple pie')) return 30.00;
    if (nameLower.includes('hash browns')) return 20.00;
    
    // Drinks
    if (nameLower.includes('cola') || nameLower.includes('coke') || nameLower.includes('sprite') || nameLower.includes('fanta')) return 22.00;
    
    // Desserts
    if (nameLower.includes('chocolate fudge')) return 35.00;
    if (nameLower.includes('velvet cake')) return 40.00;
  }
  
  // KFC prices
  if (restId === 'kfc') {
    // Buckets
    if (nameLower.includes('8pc')) return 280.00;
    if (nameLower.includes('12pc')) return 380.00;
    if (nameLower.includes('16pc')) return 480.00;
    if (nameLower.includes('family bucket')) return 450.00;
    
    // Sandwiches
    if (nameLower.includes('zinger sandwich')) return 75.00;
    if (nameLower.includes('twister wrap')) return 70.00;
    if (nameLower.includes('chicken fillet')) return 65.00;
    if (nameLower.includes('crispy chicken sandwich')) return 70.00;
    
    // Sides
    if (nameLower.includes('coleslaw')) return 25.00;
    if (nameLower.includes('cheese fries')) return 35.00;
    if (nameLower.includes('fries')) return 30.00;
    if (nameLower.includes('rice')) return 20.00;
    if (nameLower.includes('corn')) return 25.00;
    
    // Drinks
    if (nameLower.includes('pepsi') || nameLower.includes('7up') || nameLower.includes('mirinda')) return 22.00;
    if (nameLower.includes('orange juice')) return 25.00;
    if (nameLower.includes('coffee')) return 30.00;
    
    // Meals
    if (nameLower.includes('zinger meal')) return 120.00;
    if (nameLower.includes('twister meal')) return 115.00;
    if (nameLower.includes('family meal')) return 350.00;
  }
  
  // Burger King prices
  if (restId === 'bk') {
    // Burgers & Whoppers
    if (nameLower.includes('whopper') && !nameLower.includes('jr')) return 95.00;
    if (nameLower.includes('double whopper')) return 130.00;
    if (nameLower.includes('triple whopper')) return 160.00;
    if (nameLower.includes('whopper jr')) return 70.00;
    if (nameLower.includes('bacon whopper')) return 110.00;
    if (nameLower.includes('double burger')) return 85.00;
    if (nameLower.includes('double cheeseburger meal')) return 140.00;
    if (nameLower.includes('cheeseburger')) return 50.00;
    
    // Chicken
    if (nameLower.includes('chicken royale')) return 75.00;
    if (nameLower.includes('crispy chicken')) return 70.00;
    if (nameLower.includes('nuggets') && nameLower.includes('6pc')) return 55.00;
    if (nameLower.includes('nuggets') && nameLower.includes('9pc')) return 75.00;
    
    // Fries
    if (nameLower.includes('fries') && nameLower.includes('small')) return 25.00;
    if (nameLower.includes('fries') && nameLower.includes('medium')) return 35.00;
    if (nameLower.includes('fries') && nameLower.includes('large')) return 45.00;
    if (nameLower.includes('onion rings')) return 40.00;
    
    // Drinks
    if (nameLower.includes('cola') || nameLower.includes('coke') || nameLower.includes('sprite') || nameLower.includes('fanta')) return 22.00;
    if (nameLower.includes('orange juice')) return 25.00;
    if (nameLower.includes('coffee')) return 30.00;
  }
  
  // Pizza Hut prices
  if (restId === 'ph') {
    // Pizzas
    if (nameLower.includes('margherita')) return 120.00;
    if (nameLower.includes('pepperoni')) return 140.00;
    if (nameLower.includes('chicken pizza')) return 150.00;
    if (nameLower.includes('supreme')) return 160.00;
    if (nameLower.includes('hawaiian')) return 145.00;
    if (nameLower.includes('meat lovers')) return 170.00;
    
    // Pasta
    if (nameLower.includes('spaghetti')) return 95.00;
    if (nameLower.includes('fettuccine')) return 100.00;
    if (nameLower.includes('penne')) return 90.00;
    if (nameLower.includes('mac & cheese')) return 85.00;
    
    // Wings
    if (nameLower.includes('wings') && nameLower.includes('6pc')) return 80.00;
    if (nameLower.includes('wings') && nameLower.includes('12pc')) return 140.00;
    if (nameLower.includes('bbq wings')) return 85.00;
    if (nameLower.includes('spicy wings')) return 85.00;
    
    // Drinks
    if (nameLower.includes('pepsi') || nameLower.includes('7up') || nameLower.includes('mirinda')) return 22.00;
    if (nameLower.includes('orange juice')) return 25.00;
  }
  
  // Fallback prices based on category
  const categoryLower = category.toLowerCase();
  if (categoryLower === 'combos' || categoryLower === 'meals' || categoryLower === 'buckets') {
    return 120.00;
  } else if (categoryLower === 'desserts' || categoryLower === 'sides') {
    return 30.00;
  } else if (categoryLower === 'drinks') {
    return 22.00;
  } else {
    return 70.00;
  }
}

/**
 * Generate sample items for a category in a restaurant
 * FIXED: Now returns ALL items instead of just 3
 * @param {string} category - Product category name
 * @param {string} restId - Restaurant ID
 * @returns {Array} Array of product items
 */
function sampleItems(category, restId) {
  const restProducts = productNames[restId] || {};
  const names = restProducts[category] || [];
  
  if (names.length === 0) {
    console.log(`No items found for restaurant: ${restId}, category: ${category}`);
    return [];
  }
  
  const desc = productDescriptions[category] || `Delicious ${category} made to order.`;
  
  // FIXED: Return ALL items, not just first 3
  return names.map((name, index) => ({
    id: `${restId}-${category}-${index}`,
    name: name,
    desc: desc,
    price: getProductPrice(restId, category, name),
    image: getProductImage(category, restId, name)
  }));
}