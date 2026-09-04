/* =========================
   AURA CAFÉ
   FIREBASE + WEBSITE
========================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     FIREBASE
  ========================= */

  const firebaseConfig = {
    apiKey: "AIzaSyBvVyos9QrncuNgP7xgbW6jjGrL_nkUBQg",
    authDomain: "aura-cafe-a6e29.firebaseapp.com",
    databaseURL: "https://aura-cafe-a6e29-default-rtdb.firebaseio.com",
    projectId: "aura-cafe-a6e29",
    storageBucket: "aura-cafe-a6e29.firebasestorage.app",
    messagingSenderId: "299898298819",
    appId: "1:299898298819:web:af2814e6eab14cf15d76"
  };

  firebase.initializeApp(firebaseConfig);

  const database = firebase.database();


  /* =========================
     NAVBAR
  ========================= */

  const navbar = document.querySelector(".navbar");

  function updateNavbar() {

    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
      navbar.style.background = "rgba(10, 8, 6, 0.97)";
    } else {
      navbar.classList.remove("scrolled");
      navbar.style.background = "rgba(13, 10, 8, 0.82)";
    }

  }

  window.addEventListener("scroll", updateNavbar);
  updateNavbar();


  /* =========================
     ORDER MODAL
  ========================= */

  const orderModal =
    document.getElementById("orderModal");

  const closeOrder =
    document.getElementById("closeOrder");

  const orderButtons =
    document.querySelectorAll(".order-btn");

  const selectedItem =
    document.getElementById("selectedItem");

  const selectedPrice =
    document.getElementById("selectedPrice");

  const orderForm =
    document.getElementById("orderForm");

  const orderSuccess =
    document.getElementById("orderSuccess");


  let selectedProduct = "";
  let selectedProductPrice = 0;


  /* =========================
     OPEN ORDER MODAL
  ========================= */

  orderButtons.forEach(button => {

    button.addEventListener("click", () => {

      selectedProduct =
        button.dataset.item || "Item";

      selectedProductPrice =
        button.dataset.price || "0";


      if (selectedItem) {
        selectedItem.textContent =
          selectedProduct;
      }

      if (selectedPrice) {
        selectedPrice.textContent =
          "₹" + selectedProductPrice;
      }


      if (orderModal) {

        orderModal.classList.add("show");

        orderModal.setAttribute(
          "aria-hidden",
          "false"
        );

        document.body.classList.add(
          "modal-open"
        );

      }

    });

  });


  /* =========================
     CLOSE MODAL
  ========================= */

  function closeModal() {

    if (!orderModal) {
      return;
    }

    orderModal.classList.remove("show");

    orderModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "modal-open"
    );

  }


  if (closeOrder) {
    closeOrder.addEventListener(
      "click",
      closeModal
    );
  }


  if (orderModal) {

    orderModal.addEventListener(
      "click",
      event => {

        if (event.target === orderModal) {
          closeModal();
        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeModal();
      }

    }
  );


  /* =========================
     REAL ORDER → FIREBASE
  ========================= */

  if (orderForm) {

    orderForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const name =
          document
            .getElementById("customerName")
            .value
            .trim();

        const phone =
          document
            .getElementById("customerPhone")
            .value
            .trim();

        const quantity =
          document
            .getElementById("quantity")
            .value;


        if (!name || !phone || !quantity) {
          return;
        }


        try {

          await database
            .ref("orders")
            .push({

              name: name,

              phone: phone,

              item: selectedProduct,

              price: Number(selectedProductPrice),

              quantity: Number(quantity),

              total:
                Number(selectedProductPrice) *
                Number(quantity),

              time:
                new Date().toISOString()

            });


          if (orderSuccess) {

            orderSuccess.textContent =
              "✅ Order placed successfully!";

            orderSuccess.style.display =
              "block";

          }


          orderForm.reset();


          setTimeout(() => {

            if (orderSuccess) {
              orderSuccess.style.display =
                "none";
            }

            closeModal();

          }, 2500);


        } catch (error) {

          console.error(
            "Order Error:",
            error
          );

          if (orderSuccess) {

            orderSuccess.textContent =
              "❌ Order failed. Please try again.";

            orderSuccess.style.display =
              "block";

          }

        }

      }
    );

  }


  /* =========================
     RESERVATION
  ========================= */

  const reservationForm =
    document.getElementById(
      "reservationForm"
    );

  const successMessage =
    document.getElementById(
      "successMessage"
    );

const reservationDate = document.getElementById("reservationDate");

if (reservationDate) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  reservationDate.min = `${year}-${month}-${day}`;
}
  
  if (reservationForm) {

    reservationForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const name =
          document
            .getElementById("reservationName")
            .value
            .trim();

        const phone =
          document
            .getElementById("reservationPhone")
            .value
            .trim();

        const date =
          document
            .getElementById("reservationDate")
            .value;

        const guests =
          document
            .getElementById("reservationGuests")
            .value;


        if (
          !name ||
          !phone ||
          !date ||
          !guests
        ) {

          return;

        }


        try {

          await database
            .ref("reservations")
            .push({

              name: name,

              phone: phone,

              date: date,

              guests: guests,

              time:
                new Date().toISOString()

            });


          if (successMessage) {

            successMessage.textContent =
              "✅ Table reserved successfully!";

            successMessage.style.display =
              "block";

          }


          reservationForm.reset();


          setTimeout(() => {

            if (successMessage) {

              successMessage.style.display =
                "none";

            }

          }, 4000);


        } catch (error) {

          console.error(
            "Reservation Error:",
            error
          );

          if (successMessage) {

            successMessage.textContent =
              "❌ Reservation failed. Please try again.";

            successMessage.style.display =
              "block";

          }

        }

      }
    );

  }


  /* =========================
     SMOOTH NAVIGATION
  ========================= */

  const navLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  navLinks.forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const targetId =
          link.getAttribute("href");


        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        const navbarHeight =
          navbar
            ? navbar.offsetHeight
            : 0;


        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight;


        window.scrollTo({

          top: targetPosition,

          behavior: "smooth"

        });

      }
    );

  });


  /* =========================
     REVEAL ANIMATION
  ========================= */

  const revealElements =
    document.querySelectorAll(
      ".menu-card, .about-content, .gallery-box, .form-card, .contact-item"
    );


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
      "translateY(25px)";

    element.style.transition =
      "opacity 0.7s ease, transform 0.7s ease";

    observer.observe(element);

  });


  /* =========================
     REVEAL STYLE
  ========================= */

  const revealStyle =
    document.createElement("style");

  revealStyle.textContent = `
    .menu-card.visible,
    .about-content.visible,
    .gallery-box.visible,
    .form-card.visible,
    .contact-item.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;

  document.head.appendChild(
    revealStyle
  );


  /* =========================
     MINIMUM DATE
  ========================= */

  const dateInput =
    document.getElementById(
      "reservationDate"
    );


  if (dateInput) {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    dateInput.min = today;

  }

});