// JavaScript Logic for Cart and Interactivity
let cart = [];

function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
}

document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });

  // Active category toggle
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ name: name, price: price, qty: 1 });
  }
  updateCartUI();
  openCart(); // Show sidebar instantly on add
}

function changeQty(name, amount) {
  const item = cart.find((item) => item.name === name);
  if (item) {
    item.qty += amount;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.name !== name);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  const listContainer = document.getElementById("cartItemsList");
  const cartCountElement = document.getElementById("cartCount");
  const totalAmountElement = document.getElementById("totalAmount");

  listContainer.innerHTML = "";

  let totalQty = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    listContainer.innerHTML =
      '<p class="empty-msg" id="emptyCartMsg">سلتك فارغة حالياً.. أضف بعض الوجبات اللذيذة!</p>';
  } else {
    cart.forEach((item) => {
      totalQty += item.qty;
      totalPrice += item.price * item.qty;

      const itemRow = document.createElement("div");
      itemRow.className = "cart-item";
      itemRow.innerHTML = `
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <span>${item.price * item.qty} ر.س</span>
                        </div>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="changeQty('${item.name}', -1)">-</button>
                        </div>
                    `;
      listContainer.appendChild(itemRow);
    });
  }

  cartCountElement.innerText = totalQty;
  totalAmountElement.innerText = totalPrice + " ر.س";
}

function sendOrderToWhatsapp() {
  if (cart.length === 0) {
    document.getElementById("emptyCartMsg").style.color = "red";
    return;
  }

  let message = "مرحباً مطعم لذة شاك، أرغب في تسجيل طلب جديد:\n\n";
  let total = 0;

  cart.forEach((item, index) => {
    message += `${index + 1}. *${item.name}* (الكمية: ${item.qty}) -> ${item.price * item.qty} ر.س\n`;
    total += item.price * item.qty;
  });

  message += `\n*الإجمالي الكلي:* ${total} ر.س\n\nأتمنى تجهيز الطلب في أقرب وقت، شكراً لكم!`;

  // Encode custom message text
  const encodedMessage = encodeURIComponent(message);
  // Dynamic custom business number (placeholder or user specified)
  const whatsappUrl = `https://wa.me/+966553832645?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
}
