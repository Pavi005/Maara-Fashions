// Notification function for "Add to Cart" and "Add to Wishlist"
function showNotification(message, className) {
    const existingNotification = document.querySelector(`.${className}`);
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.classList.add(className);
    notification.textContent = message;

    document.querySelector(".showNotification").appendChild(notification);

    setTimeout(() => {
        notification.style.display = "flex";
        notification.style.animation = "slideIn 0.5s ease-out";
    }, 50);

    setTimeout(() => {
        notification.style.animation = "fadeOut 0.5s ease-out";
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 1000);
}

// Cart functionality
let totalAmount = 0;

document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.querySelector(".showItems");

    // Add Cart heading
    const heading = document.createElement("h5");
    heading.innerText = "Cart";
    heading.classList.add("cart-heading");
    cartContainer.prepend(heading);

    // Total amount section
    const totalAmountContainer = document.createElement("div");
    totalAmountContainer.classList.add("total-amount-container");

    const totalAmountLabel = document.createElement("span");
    totalAmountLabel.innerText = "Total Amount: ";

    const totalAmountValue = document.createElement("span");
    totalAmountValue.id = "totalAmountValue";
    totalAmountValue.innerText = "₹0.00";

    totalAmountContainer.appendChild(totalAmountLabel);
    totalAmountContainer.appendChild(totalAmountValue);
    cartContainer.appendChild(totalAmountContainer);

    // Buttons container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("cart-buttons");

    const checkoutButton = document.createElement("button");
    checkoutButton.innerText = "Checkout";
    checkoutButton.classList.add("btn", "btn-primary", "me-2");
    checkoutButton.addEventListener("click", () => {
        if (totalAmount > 0) {
            window.open("cart.html", "_blank");
        } else {
            alert("Your cart is empty!");
        }
    });

    const clearCartButton = document.createElement("button");
    clearCartButton.innerText = "Clear Cart";
    clearCartButton.classList.add("btn", "btn-danger");
    clearCartButton.addEventListener("click", () => {
        document.querySelectorAll(".cart-item").forEach(item => item.remove());
        totalAmount = 0;
        updateTotalAmount();
    });

    buttonContainer.appendChild(checkoutButton);
    buttonContainer.appendChild(clearCartButton);
    cartContainer.appendChild(buttonContainer);

    // Add to Cart functionality
    document.querySelectorAll(".addToBag").forEach(button => {
        button.addEventListener("click", (event) => {
            showNotification("Added to Cart", "addToCartNotification");

            const card = event.target.closest(".card");
            if (!card) return;

            const productName = card.querySelector(".productName").textContent;
            const productPrice = parseFloat(card.querySelector(".productPrice").textContent.replace(/[^0-9.]/g, ""));
            const productImgSrc = card.querySelector(".card-img-top").src;

            let existingItem = [...document.querySelectorAll(".cart-item")].find(item =>
                item.querySelector(".cart-product-name").textContent === productName
            );

            if (existingItem) {
                const quantityDisplay = existingItem.querySelector(".cart-quantity");
                const totalPriceElement = existingItem.querySelector(".cart-total-price");
                let quantity = parseInt(quantityDisplay.textContent);
                quantity++;
                quantityDisplay.textContent = quantity;

                const newTotalPrice = productPrice * quantity;
                totalPriceElement.textContent = `₹${newTotalPrice.toFixed(2)}`;

                totalAmount += productPrice;
                updateTotalAmount();
                return;
            }

            const listItem = document.createElement("div");
            listItem.classList.add("cart-item");

            const imgElement = document.createElement("img");
            imgElement.classList.add("cart-product-img");
            imgElement.src = productImgSrc;
            imgElement.alt = productName;

            const nameElement = document.createElement("h6");
            nameElement.classList.add("cart-product-name");
            nameElement.textContent = productName;

            const quantityContainer = document.createElement("div");
            quantityContainer.classList.add("quantity-container");

            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "-";
            decreaseButton.classList.add("quantity-btn");

            const quantityDisplay = document.createElement("span");
            quantityDisplay.classList.add("cart-quantity");
            quantityDisplay.textContent = "1";

            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.classList.add("quantity-btn");

            quantityContainer.appendChild(decreaseButton);
            quantityContainer.appendChild(quantityDisplay);
            quantityContainer.appendChild(increaseButton);

            const totalPriceElement = document.createElement("p");
            totalPriceElement.classList.add("cart-total-price");
            totalPriceElement.textContent = `₹${productPrice.toFixed(2)}`;

            listItem.appendChild(imgElement);
            listItem.appendChild(nameElement);
            listItem.appendChild(quantityContainer);
            listItem.appendChild(totalPriceElement);

            cartContainer.insertBefore(listItem, totalAmountContainer);

            totalAmount += productPrice;
            updateTotalAmount();

            increaseButton.addEventListener("click", () => {
                let quantity = parseInt(quantityDisplay.textContent);
                quantity++;
                quantityDisplay.textContent = quantity;

                const newTotalPrice = productPrice * quantity;
                totalPriceElement.textContent = `₹${newTotalPrice.toFixed(2)}`;

                totalAmount += productPrice;
                updateTotalAmount();
            });

            decreaseButton.addEventListener("click", () => {
                let quantity = parseInt(quantityDisplay.textContent);
                if (quantity > 1) {
                    quantity--;
                    quantityDisplay.textContent = quantity;

                    const newTotalPrice = productPrice * quantity;
                    totalPriceElement.textContent = `₹${newTotalPrice.toFixed(2)}`;

                    totalAmount -= productPrice;
                    updateTotalAmount();
                } else {
                    listItem.remove();
                    totalAmount -= productPrice;
                    updateTotalAmount();
                }
            });
        });
    });

    // Add to Wishlist functionality
    document.querySelectorAll(".addToWishlist").forEach(button => {
        button.addEventListener("click", () => {
            showNotification("Added to Wishlist", "addToWishlistNotification");
        });
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll(".fade-in-left, .fade-in-right, .fade-up").forEach(el => {
        observer.observe(el);
    });
});

// Update total amount display
function updateTotalAmount() {
    document.getElementById("totalAmountValue").textContent = `₹${totalAmount.toFixed(2)}`;
}