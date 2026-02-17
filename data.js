/* DeliverEase - Data Configuration
 * Contains all restaurant data, product names, images, and descriptions
 */

const restaurants = [
  {
    id: 'mcd', name: "McDonald's", cover: 'photos/mc.jpg.jpg',
    desc: 'World-famous burgers and fries.',
    categories: ['Burgers','Combos','Chicken','Sides','Drinks','Desserts']
  },
  {
    id: 'kfc', name: 'KFC', cover: 'photos/KFC.jpg.jpg',
    desc: 'Original recipe fried chicken.',
    categories: ['Buckets','Sandwiches','Sides','Drinks','Meals']
  },
  {
    id: 'bk', name: 'Burger King', cover: 'photos/king.jpg.jpeg',
    desc: 'Flame-grilled burgers and more.',
    categories: ['Burgers','Whoppers','Chicken','Fries','Drinks']
  },
  {
    id: 'ph', name: 'Pizza Hut', cover: 'photos/pizza.jpg.webp',
    desc: 'Pizzas, sides and pasta.',
    categories: ['Pizzas','Pasta','Wings','Drinks']
  }
];

// Direct mapping of product names to images
const productImageMap = {
  // McDonald's products
  'big mac': 'bigmc.jpg.avif',
  'double big tasty': 'Double-Big-Tasty.jpg.png',
  'mcroyale': 'mcroyal.jpg.png',
  'quarter pounder': 'Double-Big-Tasty.jpg.png',
  'cheeseburger': 'Double-Big-Tasty.jpg.png',
  'double cheeseburger': 'DoubleCheeseburger.jpg',
  'mcchicken': 'chickn.jpg',
  'chicken mcnuggets': 'chickn.jpg',
  'chicken mcnuggets (6pc)': 'chickn.jpg',
  'chicken mcnuggets (9pc)': 'chickn.jpg',
  'spicy mcchicken': 'chickn.jpg',
  'crispy chicken': 'Crispy Chicken,jpg.png',
  'french fries': 'mc Fries.jpg',
  'french fries (small)': 'mc Fries.jpg',
  'french fries (medium)': 'mc Fries.jpg',
  'french fries (large)': 'mc Fries.jpg',
  'french fries small': 'mc Fries.jpg',
  'french fries medium': 'mc Fries.jpg',
  'french fries large': 'mc Fries.jpg',
  'fries': 'mc Fries.jpg',
  'apple pie': 'chocolate-fudge.jpg',
  'hash browns': 'plain.jpg',
  'coca cola': 'mc coca.jpg',
  'coca-cola': 'mc coca.jpg',
  'coke': 'mc coca.jpg',
  'sprite': 'mc sprite.jpg.png',
  'fanta': 'mc fatnta.jpg',
  'orange juice': 'mc fatnta.jpg',
  'coffee': 'mc coca.jpg',
  'milkshake': 'coca.jpg',
  'chocolate fudge': 'chocolate-fudge.jpg',
  'mcflurry': 'chocolate-fudge.jpg',
  'sundae': 'chocolate-fudge.jpg',
  'velvet cake': 'velvet-cake.jpg',
  'blueberry muffin': 'blueberry-muffin.jpg',
  'egg mcmuffin': 'plain.jpg',
  'sausage mcmuffin': 'plain.jpg',
  'hotcakes': 'blueberry-muffin.jpg',
  'breakfast wrap': 'plain.jpg',
  'garden salad': 'plain.jpg',
  'caesar salad': 'plain.jpg',
  'chicken salad': 'plain.jpg',
  'greek salad': 'plain.jpg',
  
  // KFC products
  'chicken bucket': '8pc Chicken Bucket.jpg',
  '8pc chicken bucket': '8pc Chicken Bucket.jpg',
  '12pc chicken bucket': '12pc Chicken Bucket,jpg.png',
  '16pc chicken bucket': '8pc Chicken Bucket.jpg',
  'family bucket': '12pc Chicken Bucket,jpg.png',
  'zinger sandwich': 'zinger,jpg.png',
  'zinger meal': 'zingermeal.jpg',
  'twister wrap': 'twister,jpg.png',
  'twister meal': 'twistermeal.jpg',
  'chicken fillet': 'chickenfillet.jpg',
  'chicken fillet meal': 'dinnerplus.jpg',
  'crispy chicken sandwich': 'zinger,jpg.png',
  'crispy chicken': 'Crispy Chicken,jpg.png',
  'family meal': 'dinnerplus.jpg',
  'zinger wrap': 'chickn.jpg',
  'chicken wrap': 'chickn.jpg',
  'spicy wrap': 'chickn.jpg',
  'coleslaw': 'Coleslaw.jpg',
  'mashed potatoes': 'plain.jpg',
  'cheese fries': 'cheesefries.jpg',
  'kfc fries': 'kfcfries,jpg.png',
  'rice': 'plain.jpg',
  'corn on the cob': 'plain.jpg',
  'chocolate chip cookie': 'chocolate-fudge.jpg',
  'brownie': 'chocolate-fudge.jpg',
  'pepsi': 'pepsi.jpg',
  '7up': '7up.jpg',
  'mirinda': 'mirinda.jpg',
  
  // Burger King products
  'whopper': 'whopper.jpg',
  'double whopper': 'whopper.jpg',
  'double cheeseburger meal': 'Double-McRoyale .jpg.png',
  'triple whopper': 'whopper.jpg',
  'double burger': 'Double Burger,jpg.png',
  'whopper jr': 'whopper.jpg',
  'bacon whopper': 'whopper.jpg',
  'chicken royale': 'chicken royal.jpg',
  'chicken nuggets': 'chickn.jpg',
  'chicken nuggets (6pc)': 'chickn.jpg',
  'chicken nuggets (9pc)': 'chickn.jpg',
  'chicken nuggets (4pc)': 'chickn.jpg',
  'onion rings': 'Fries.jpg',
  'french fries': 'bk fries.jpg',
  'french fries (small)': 'bk fries.jpg',
  'french fries (medium)': 'bk fries.jpg',
  'french fries (large)': 'bk fries.jpg',
  'hershey\'s sundae': 'chocolate-fudge.jpg',
  'ice cream': 'chocolate-fudge.jpg',
  'croissan\'wich': 'plain.jpg',
  'sausage & egg': 'plain.jpg',
  'kids meal': 'plain.jpg',
  'kids burger': 'Double-Big-Tasty.jpg.png',
  
  // Subway products
  'italian b.m.t': 'subway.jpg.jpg',
  'turkey breast': 'subway.jpg.jpg',
  'chicken teriyaki': 'subway.jpg.jpg',
  'meatball marinara': 'subway.jpg.jpg',
  'tuna': 'subway.jpg.jpg',
  'veggie delite': 'subway.jpg.jpg',
  'subway club': 'subway.jpg.jpg',
  'chicken teriyaki wrap': 'subway.jpg.jpg',
  'turkey wrap': 'subway.jpg.jpg',
  'veggie wrap': 'subway.jpg.jpg',
  'tuna wrap': 'subway.jpg.jpg',
  'chicken teriyaki salad': 'plain.jpg',
  'turkey salad': 'plain.jpg',
  'veggie salad': 'plain.jpg',
  'tuna salad': 'plain.jpg',
  'cookies': 'chocolate-fudge.jpg',
  'cookies (3pc)': 'chocolate-fudge.jpg',
  'chips': 'Fries.jpg',
  'apple slices': 'plain.jpg',
  'breakfast sandwich': 'subway.jpg.jpg',
  'breakfast wrap': 'subway.jpg.jpg',
  'kids sub': 'subway.jpg.jpg',
  'chocolate chip cookie': 'chocolate-fudge.jpg',
  'oatmeal raisin cookie': 'chocolate-fudge.jpg',
  'white chip cookie': 'chocolate-fudge.jpg',
  
  // Pizza Hut products
  'margherita pizza': 'margherita.jpg',
  'pepperoni pizza': 'peproni.jpg',
  'chicken pizza': 'chicken,jpg.png',
  'supreme pizza': 'pizza.jpg.webp',
  'hawaiian pizza': 'pizza.jpg.webp',
  'meat lovers': 'pizza.jpg.webp',
  'spaghetti bolognese': 'Spaghetti Bolognese.jpg',
  'fettuccine alfredo': 'Fettuccine Alfredo.jpg',
  'penne arrabbiata': 'pizza.jpg.webp',
  'mac & cheese': 'pizza.jpg.webp',
  'buffalo wings': 'wings.jpg',
  'buffalo wings (6pc)': 'wings.jpg',
  'buffalo wings (12pc)': 'wings.jpg',
  'bbq wings': 'bbqwings.jpg',
  'spicy wings': 'wings.jpg'
};

// Product names database for each category and restaurant
const productNames = {
  'mcd': {
    'Burgers': ['Big Mac', 'Double Big Tasty', 'McRoyale', 'Quarter Pounder', 'Cheeseburger', 'Double Cheeseburger'],
    'Combos': ['Big Mac Meal', 'Double Big Tasty Meal', 'McRoyale Meal', 'Quarter Pounder Meal', 'Chicken Meal'],
    'Chicken': ['McChicken', 'Chicken McNuggets (6pc)', 'Chicken McNuggets (9pc)', 'Spicy McChicken', 'Crispy Chicken'],
    'Sides': ['French Fries (Small)', 'French Fries (Medium)', 'French Fries (Large)', 'Apple Pie', 'Hash Browns'],
    'Drinks': ['Coca Cola', 'Sprite', 'Fanta'],
    'Desserts': ['Chocolate Fudge', 'Velvet Cake']
  },
  'kfc': {
    'Buckets': ['8pc Chicken Bucket', '12pc Chicken Bucket', '16pc Chicken Bucket', 'Family Bucket'],
    'Sandwiches': ['Zinger Sandwich', 'Twister Wrap', 'Chicken Fillet', 'Crispy Chicken Sandwich'],
    'Sides': ['Coleslaw', 'Cheese Fries', 'Fries', 'Rice', 'Corn on the Cob'],
    'Drinks': ['Pepsi', '7UP', 'Mirinda', 'Orange Juice', 'Coffee'],
    'Meals': ['Zinger Meal', 'Twister Meal', 'Family Meal']
  },
  'bk': {
    'Burgers': ['Whopper', 'Double Cheeseburger Meal', 'Double Burger', 'Whopper Jr', 'Bacon Whopper', 'Cheeseburger'],
    'Whoppers': ['Whopper', 'Double Cheeseburger Meal', 'Double Burger', 'Whopper Jr', 'Bacon Whopper'],
    'Chicken': ['Chicken Royale', 'Crispy Chicken', 'Chicken Nuggets (6pc)', 'Chicken Nuggets (9pc)'],
    'Fries': ['French Fries (Small)', 'French Fries (Medium)', 'French Fries (Large)', 'Onion Rings'],
    'Drinks': ['Coca Cola', 'Sprite', 'Fanta', 'Orange Juice', 'Coffee']
  },
  'ph': {
    'Pizzas': ['Margherita Pizza', 'Pepperoni Pizza', 'Chicken Pizza', 'Supreme Pizza', 'Hawaiian Pizza', 'Meat Lovers'],
    'Pasta': ['Spaghetti Bolognese', 'Fettuccine Alfredo', 'Penne Arrabbiata', 'Mac & Cheese'],
    'Wings': ['Buffalo Wings (6pc)', 'Buffalo Wings (12pc)', 'BBQ Wings', 'Spicy Wings'],
    'Drinks': ['Pepsi', '7UP', 'Mirinda', 'Orange Juice']
  }
};

// Product descriptions
const productDescriptions = {
  'Burgers': 'Juicy beef patty with fresh vegetables and special sauce',
  'Combos': 'Complete meal with burger, fries, and drink',
  'Chicken': 'Crispy chicken with our signature seasoning',
  'Sides': 'Perfect side to complement your meal',
  'Drinks': 'Refreshing beverage to quench your thirst',
  'Desserts': 'Sweet treat to end your meal perfectly',
  'Breakfast': 'Start your day with our delicious breakfast',
  'Salads': 'Fresh and healthy salad with premium ingredients',
  'Buckets': 'Family-sized bucket of our famous fried chicken',
  'Sandwiches': 'Tender chicken in a soft bun',
  'Wraps': 'Fresh wrap with your favorite fillings',
  'Meals': 'Complete meal deal with main, sides, and drink',
  'Whoppers': 'Flame-grilled beef patty with fresh toppings',
  'Fries': 'Crispy golden fries, perfectly seasoned',
  'Kids': 'Specially sized meal for kids',
  'Pizzas': 'Freshly baked pizza with premium toppings',
  'Pasta': 'Authentic pasta dish with rich sauce',
  'Wings': 'Spicy chicken wings with your choice of sauce',
  'Subs': 'Fresh sub sandwich made to order'
};

