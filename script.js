// ===== GLOBAL CART LOGIC =====
const menuData=[
  {id:1,name:"Veg Thali",price:80,img:"C:/Users/sanja/Downloads/WhatsApp Image 2025-09-30 at 11.47.37 AM (2).jpeg",category:"veg"},
  {id:2,name:"Chicken Biryani",price:120,img:"C:/Users/sanja/Downloads/WhatsApp Image 2025-09-30 at 11.47.37 AM.jpeg",category:"nonveg"},
  {id:3,name:"Masala Dosa",price:60,img:"C:/Users/sanja/Downloads/WhatsApp Image 2025-09-30 at 11.47.37 AM (1).jpeg",category:"veg"},
  {id:4,name:"Fried Rice",price:70,img:"C:/Users/sanja/Downloads/WhatsApp Image 2025-09-30 at 11.47.38 AM (1).jpeg",category:"veg"},
  {id:5,name:"Paneer Butter Masala",price:90,img:"C:/Users/sanja/Downloads/WhatsApp Image 2025-09-30 at 11.47.38 AM.jpeg",category:"veg"},
  {id:6,name:"Samosa",price:15,img:"C:/Users/sanja/Downloads/WhatsApp Image 2025-09-30 at 11.57.23 AM.jpeg",category:"snacks"},
  {id:7,name:"Cold Coffee",price:40,img:"C:/Users/sanja/Downloads/WhatsApp Image 2025-09-30 at 11.57.23 AM (1).jpeg",category:"drinks"},
  {id:8,name:"Chicken Roll",price:50,img:"C:/Users/sanja/Downloads/WhatsApp Image 2025-09-30 at 11.57.24 AM.jpeg",category:"nonveg"}
];

let cart=JSON.parse(localStorage.getItem("cart"))||[];

// ===== TOAST =====
function showToast(msg){
  const toast=document.getElementById("toast");
  if(!toast) return;
  toast.innerText=msg;
  toast.style.display="block";
  setTimeout(()=>{toast.style.display="none";},3000);
}

// ===== UPDATE CART BADGE =====
function updateCartCount(){
  const countEl=document.getElementById("cartCount");
  if(!countEl) return;
  const totalQty=cart.reduce((sum,item)=>sum+item.qty,0);
  countEl.innerText=totalQty;
}

// ===== SAVE CART =====
function saveCart(){
  localStorage.setItem("cart",JSON.stringify(cart));
  updateCartCount();
  const countEl=document.getElementById("cartCount");
  if(countEl){
    countEl.classList.add("bounce");
    setTimeout(()=>countEl.classList.remove("bounce"),300);
  }
}

// ===== ADD TO CART =====
function addToCart(id){
  const item=menuData.find(i=>i.id===id);
  if(!item) return;
  const existing=cart.find(i=>i.id===id);
  if(existing){existing.qty+=1;} else{cart.push({...item,qty:1});}
  saveCart();
  showToast(`${item.name} added to cart!`);
  if(document.getElementById("cartItems")) renderCart();
}

// ===== REMOVE FROM CART =====
function removeFromCart(index){
  cart.splice(index,1);
  saveCart();
  if(document.getElementById("cartItems")) renderCart();
  showToast("Item removed from cart");
}

// ===== RENDER CART =====
function renderCart(){
  const cartContainer=document.getElementById("cartItems");
  if(!cartContainer) return;
  cartContainer.innerHTML="";
  let total= 0, itemsCount = 0;

cart.forEach((item, index) => {
    total += item.price * item.qty;
    itemsCount += item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
        <span>${item.name} (x${item.qty})</span>
        <span>₹${item.price * item.qty}</span>
        <button onclick="removeFromCart(${index})">❌</button>
    `;
    cartContainer.appendChild(div);
});

// Update summary
const totalEl = document.getElementById("totalPrice");
const itemsEl = document.getElementById("totalItems");
if (totalEl) totalEl.innerText = total;
if (itemsEl) itemsEl.innerText = itemsCount;

// Render recommendations (first 3 items from menu not in cart)
const recContainer = document.getElementById("recommendedItems");
if (recContainer) {
    recContainer.innerHTML = "";
    const recommended = menuData.filter(item => !cart.find(ci => ci.id === item.id)).slice(0, 3);
    recommended.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("menu-item");
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        recContainer.appendChild(div);
    });
}
}

// ===== RENDER MENU =====
function renderMenu(items) {
    const menuContainer = document.getElementById("menuItems");
    if (!menuContainer) return;
    menuContainer.innerHTML = "";
    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("menu-item");
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuContainer.appendChild(div);
    });
}

// ===== SEARCH & FILTER =====
if (document.getElementById("menuItems")) {
    renderMenu(menuData);

    document.getElementById("searchBox").addEventListener("input", e => {
        const search = e.target.value.toLowerCase();
        const category = document.getElementById("filterCategory").value;
        const filtered = menuData.filter(item =>
            item.name.toLowerCase().includes(search) &&
            (category === "all" || item.category === category)
        );
        renderMenu(filtered);
    });

    document.getElementById("filterCategory").addEventListener("change", e => {
        const search = document.getElementById("searchBox").value.toLowerCase();
        const category = e.target.value;
        const filtered = menuData.filter(item =>
            item.name.toLowerCase().includes(search) &&
            (category === "all" || item.category === category)
        );
        renderMenu(filtered);
    });
}

// ===== CHECKOUT =====
if (document.getElementById("checkoutForm")) {
    document.getElementById("checkoutForm").addEventListener("submit", function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            showToast("Your cart is empty!");
            return;
        }
        showToast("✅ Order placed successfully!");
        cart = [];
        localStorage.removeItem("cart");
        updateCartCount();
        setTimeout(() => { window.location.href = "index.html"; }, 2000);
    });
}

// ===== INITIALIZE =====
updateCartCount();
if (document.getElementById("cartItems")) renderCart();

