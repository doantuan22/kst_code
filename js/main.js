const products = [
  {
    id: "p1",
    name: "Smart Tools",
    type: "tool",
    version: "v1.0",
    size: "320 MB",
    description: "Phần mềm đa tính năng",
    detailIntro: `Smart Tools là một phần mềm đa năng được thiết kế nhằm tối ưu hóa công việc và nâng cao hiệu suất cho người dùng thông qua nhiều tính năng công nghệ thông minh.

1. Tóm tắt văn bản bằng AI
Smart Tools tích hợp các mô hình AI mạnh mẽ giúp tóm tắt nội dung văn bản một cách nhanh chóng và chính xác. Phần mềm hỗ trợ tóm tắt cả tiếng Việt và tiếng Anh, giúp người dùng tiết kiệm đáng kể thời gian đọc và xử lý tài liệu. Ngoài ra, người dùng có thể lựa chọn sử dụng API AI do chúng tôi phát triển với tốc độ phản hồi cực nhanh. Hiện tại API này vẫn đang trong quá trình hoàn thiện, vì vậy mỗi người dùng có thể sử dụng tối đa 5 lượt trong vòng 24 giờ.

2. Chuyển đổi và xử lý file tiện lợi
Phần mềm cung cấp nhiều công cụ xử lý tài liệu hữu ích như chuyển đổi PDF sang Word, chuyển ảnh sang PDF, ghép (nối) nhiều file PDF, cùng nhiều thao tác xử lý file khác. Những công cụ này giúp người dùng làm việc với tài liệu nhanh chóng và thuận tiện hơn.

3. Tải video TikTok và YouTube chất lượng cao
Smart Tools cho phép tải video từ TikTok và YouTube với tốc độ nhanh và độ phân giải cao. Người dùng chỉ cần dán link video, phần mềm sẽ ngay lập tức xử lý và cung cấp link tải trực tiếp, giúp việc lưu trữ video trở nên đơn giản và hiệu quả.

✨ Smart Tools hướng tới việc cung cấp một bộ công cụ gọn nhẹ nhưng mạnh mẽ, giúp người dùng xử lý tài liệu, nội dung và media một cách nhanh chóng – tiện lợi – hiệu quả chỉ trong một phần mềm duy nhất.`,
    image: "assets/images/tool-design.svg",
    downloadUrl:
      "https://drive.google.com/file/d/1lFT41--tA9O_cU6kEHWgsUX-bYHmjvp1/view?usp=drive_link"
  }
];

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const yearNow = document.querySelector("#yearNow");
const zaloToggle = document.querySelector("#zaloToggle");
const zaloInfo = document.querySelector("#zaloInfo");
const serviceCard = document.querySelector(".service-card");
const zaloCard = document.querySelector(".zalo-card");
const productDetailModal = document.querySelector("#productDetailModal");
const productDetailOverlay = document.querySelector("#productDetailOverlay");
const productDetailTitle = document.querySelector("#productDetailTitle");
const productDetailMeta = document.querySelector("#productDetailMeta");
const productDetailContent = document.querySelector("#productDetailContent");
const productDetailClose = document.querySelector("#productDetailClose");
const contactNavTrigger = document.querySelector("#contactNavTrigger");
const contactModal = document.querySelector("#contactModal");
const contactModalOverlay = document.querySelector("#contactModalOverlay");
const contactModalClose = document.querySelector("#contactModalClose");

let activeFilter = "all";
let lastDetailTrigger = null;
let lastContactTrigger = null;
let contactModalTimer = null;

const tiltRegistry = new WeakSet();

function getTypeLabel(type) {
  return type === "tool" ? "Tool" : "Phan mem";
}

function createCard(product) {
  return `
    <article class="product-card" data-id="${product.id}">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="card-body">
        <div class="product-meta">
          <span class="badge">${getTypeLabel(product.type)}</span>
          <span>${product.version}  ${product.size}</span>
        </div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-actions">
          <a
            class="btn-sm btn-download"
            href="${product.downloadUrl}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tải xuống
          </a>
          <button
            class="btn-sm btn-detail"
            type="button"
            data-action="show-detail"
            data-product-id="${product.id}"
            aria-haspopup="dialog"
          >
           Giới thiệu
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(list) {
  if (!list.length) {
    productGrid.innerHTML =
      '<div class="empty-state">Không tìm thấy phần mềm phù hợp.</div>';
    setupCardTilt();
    return;
  }

  productGrid.innerHTML = list.map(createCard).join("");
  setupCardTilt();
}

function getFilteredProducts() {
  const keyword = searchInput.value.trim().toLowerCase();

  return products.filter((item) => {
    const matchFilter = activeFilter === "all" || item.type === activeFilter;
    const matchKeyword = item.name.toLowerCase().includes(keyword);
    return matchFilter && matchKeyword;
  });
}

function updateView() {
  renderProducts(getFilteredProducts());
}

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      updateView();
    });
  });

  searchInput.addEventListener("input", updateView);
}

function setupCardTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  const bindTilt = (card, maxTilt) => {
    if (tiltRegistry.has(card)) {
      return;
    }

    tiltRegistry.add(card);

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - y) * maxTilt * 2;

      card.style.setProperty("--rx", `${rotateX}deg`);
      card.style.setProperty("--ry", `${rotateY}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  };

  const featureCards = document.querySelectorAll(".tilt-card");
  const productCards = document.querySelectorAll(".product-card");

  featureCards.forEach((card) => bindTilt(card, 8));
  productCards.forEach((card) => bindTilt(card, 10));
}

function updateBodyModalState() {
  const hasProductModal =
    productDetailModal && !productDetailModal.hasAttribute("hidden");
  const hasContactModal = contactModal && !contactModal.hasAttribute("hidden");

  document.body.classList.toggle(
    "modal-open",
    Boolean(hasProductModal || hasContactModal)
  );
}

function openContactModal(trigger) {
  if (!contactModal) {
    return;
  }

  if (contactModalTimer) {
    window.clearTimeout(contactModalTimer);
    contactModalTimer = null;
  }

  lastContactTrigger = trigger || null;
  contactModal.removeAttribute("hidden");
  contactModal.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    contactModal.classList.add("is-open");
  });

  updateBodyModalState();

  if (contactModalClose) {
    contactModalClose.focus();
  }
}

function closeContactModal() {
  if (!contactModal || contactModal.hasAttribute("hidden")) {
    return;
  }

  contactModal.classList.remove("is-open");
  contactModal.setAttribute("aria-hidden", "true");

  if (contactModalTimer) {
    window.clearTimeout(contactModalTimer);
  }

  contactModalTimer = window.setTimeout(() => {
    contactModal.setAttribute("hidden", "");
    updateBodyModalState();

    if (lastContactTrigger) {
      lastContactTrigger.focus();
    }
  }, 260);
}

function setupContactModal() {
  if (!contactNavTrigger || !contactModal) {
    return;
  }

  contactNavTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    openContactModal(contactNavTrigger);
  });

  if (contactModalClose) {
    contactModalClose.addEventListener("click", closeContactModal);
  }

  if (contactModalOverlay) {
    contactModalOverlay.addEventListener("click", closeContactModal);
  }
}

function syncServiceBoxesHeight() {
  if (!serviceCard || !zaloCard || !zaloInfo) {
    return;
  }

  if (window.matchMedia("(max-width: 900px)").matches) {
    document.documentElement.style.removeProperty("--service-box-height");
    return;
  }

  const wasExpanded = !zaloInfo.hasAttribute("hidden");

  if (wasExpanded) {
    zaloInfo.setAttribute("hidden", "");
  }

  document.documentElement.style.removeProperty("--service-box-height");
  const baseHeight = Math.max(serviceCard.offsetHeight, zaloCard.offsetHeight);
  document.documentElement.style.setProperty(
    "--service-box-height",
    `${baseHeight}px`
  );

  if (wasExpanded) {
    zaloInfo.removeAttribute("hidden");
  }
}

function setupZaloToggle() {
  if (!zaloToggle || !zaloInfo) {
    return;
  }

  zaloToggle.addEventListener("click", () => {
    const isHidden = zaloInfo.hasAttribute("hidden");

    if (isHidden) {
      zaloInfo.removeAttribute("hidden");
      zaloToggle.setAttribute("aria-expanded", "true");
      zaloToggle.textContent = "Ẩn thông tin Zalo";
      return;
    }

    zaloInfo.setAttribute("hidden", "");
    zaloToggle.setAttribute("aria-expanded", "false");
    syncServiceBoxesHeight();
    zaloToggle.textContent = "Thông tin Zalo";
  });
}

function openProductDetail(product) {
  if (
    !productDetailModal ||
    !productDetailTitle ||
    !productDetailMeta ||
    !productDetailContent
  ) {
    return;
  }

  productDetailTitle.textContent = product.name;
  productDetailMeta.textContent = `${getTypeLabel(product.type)} - ${product.version} - ${product.size}`;
  productDetailContent.textContent =
    product.detailIntro ||
    product.description ||
    "Phần mềm chưa có nội giới thiệu chi tiết.";

  productDetailModal.removeAttribute("hidden");
  productDetailModal.setAttribute("aria-hidden", "false");
  updateBodyModalState();

  if (productDetailClose) {
    productDetailClose.focus();
  }
}

function closeProductDetail() {
  if (!productDetailModal) {
    return;
  }

  productDetailModal.setAttribute("hidden", "");
  productDetailModal.setAttribute("aria-hidden", "true");
  updateBodyModalState();

  if (lastDetailTrigger) {
    lastDetailTrigger.focus();
  }
}

function setupProductDetailModal() {
  if (!productGrid || !productDetailModal) {
    return;
  }

  productGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest('[data-action="show-detail"]');

    if (!trigger) {
      return;
    }

    const product = products.find(
      (item) => item.id === trigger.dataset.productId
    );

    if (!product) {
      return;
    }

    lastDetailTrigger = trigger;
    openProductDetail(product);
  });

  if (productDetailClose) {
    productDetailClose.addEventListener("click", closeProductDetail);
  }

  if (productDetailOverlay) {
    productDetailOverlay.addEventListener("click", closeProductDetail);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (contactModal && !contactModal.hasAttribute("hidden")) {
      closeContactModal();
      return;
    }

    if (productDetailModal && !productDetailModal.hasAttribute("hidden")) {
      closeProductDetail();
    }
  });
}

function init() {
  if (yearNow) {
    yearNow.textContent = new Date().getFullYear();
  }

  setupFilters();
  setupContactModal();
  setupZaloToggle();
  setupProductDetailModal();
  syncServiceBoxesHeight();
  window.addEventListener("resize", syncServiceBoxesHeight);
  updateView();
}

init();
