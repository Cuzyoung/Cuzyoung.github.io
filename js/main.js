// ===== Like Button Functionality with CountAPI =====
(function() {
  const NAMESPACE = 'ziyanggong';
  const KEY = 'homepage_likes';
  const LIKED_KEY = 'ziyang_gong_has_liked';
  const API_BASE = 'https://api.countapi.xyz';

  const likeBtn = document.getElementById('likeBtn');
  const likeCount = document.getElementById('likeCount');
  const likeIcon = document.getElementById('likeIcon');

  if (!likeBtn || !likeCount) return;

  // 检查本地是否已点赞（防止同一浏览器重复点赞）
  function hasLikedLocally() {
    return localStorage.getItem(LIKED_KEY) === 'true';
  }

  // 标记为已点赞
  function setLikedLocally() {
    localStorage.setItem(LIKED_KEY, 'true');
  }

  // 取消本地点赞标记
  function removeLikedLocally() {
    localStorage.removeItem(LIKED_KEY);
  }

  // 获取当前点赞数
  async function fetchCount() {
    try {
      const response = await fetch(`${API_BASE}/get/${NAMESPACE}/${KEY}`);
      const data = await response.json();
      return data.value || 0;
    } catch (err) {
      console.log('Failed to fetch count, using fallback');
      // 失败时使用本地存储作为后备
      return parseInt(localStorage.getItem('like_count_fallback') || '0');
    }
  }

  // 增加点赞数
  async function incrementCount() {
    try {
      const response = await fetch(`${API_BASE}/hit/${NAMESPACE}/${KEY}`);
      const data = await response.json();
      return data.value;
    } catch (err) {
      // 如果API失败，使用本地存储
      const current = parseInt(localStorage.getItem('like_count_fallback') || '0');
      const updated = current + 1;
      localStorage.setItem('like_count_fallback', updated.toString());
      return updated;
    }
  }

  // 获取创建信息（用于判断是否首次创建）
  async function getInfo() {
    try {
      const response = await fetch(`${API_BASE}/info/${NAMESPACE}/${KEY}`);
      return await response.json();
    } catch (err) {
      return null;
    }
  }

  // 更新显示
  async function updateDisplay() {
    const count = await fetchCount();
    const liked = hasLikedLocally();
    likeCount.textContent = count;
    if (liked) {
      likeBtn.classList.add('liked');
      likeIcon.classList.remove('fa-regular');
      likeIcon.classList.add('fa-solid');
    } else {
      likeBtn.classList.remove('liked');
    }
  }

  // 点击事件
  likeBtn.addEventListener('click', async function() {
    if (hasLikedLocally()) {
      // 已点赞，提示或取消（CountAPI不支持减少，这里只做视觉反馈）
      likeBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        likeBtn.style.transform = '';
      }, 150);
      // 可以取消本地标记，但计数器不会减
      // removeLikedLocally();
    } else {
      // 未点赞，增加点赞
      const newCount = await incrementCount();
      setLikedLocally();
      likeCount.textContent = newCount;
      likeBtn.classList.add('liked');

      // 添加动画效果
      likeBtn.style.transform = 'scale(1.2)';
      setTimeout(() => {
        likeBtn.style.transform = '';
      }, 200);
    }
  });

  // 初始化
  updateDisplay();

  // 页面加载时异步初始化计数器（如果不存在）
  (async function initCounter() {
    try {
      // 尝试获取信息，如果不存在会返回404
      const info = await getInfo();
      if (!info) {
        // 计数器不存在，创建一个初始值为0的
        await fetch(`${API_BASE}/create?namespace=${NAMESPACE}&key=${KEY}&value=0&enable_reset=0`);
      }
    } catch (err) {
      // 忽略错误
    }
  })();
})();

// ===== Publications Filter =====
const chips = Array.from(document.querySelectorAll(".filter-tag"));
const pubs = Array.from(document.querySelectorAll(".pub"));

function setActive(filter) {
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === filter)));

  pubs.forEach((p) => {
    const tags = (p.dataset.tags || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const show = filter === "all" || tags.includes(filter);

    if (show) {
      p.style.display = "";
      p.style.opacity = "0";
      p.style.transform = "translateY(8px)";
      requestAnimationFrame(() => {
        p.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        p.style.opacity = "1";
        p.style.transform = "translateY(0)";
      });
    } else {
      p.style.display = "none";
    }
  });
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => setActive(chip.dataset.filter));
});

setActive("all");

// ===== Auto-update Date =====
document.getElementById("lastUpdated").textContent = new Date().toISOString().slice(0, 10);

// ===== "/" Hotkey =====
window.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
    chips[0]?.focus();
  }
});

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('.nav a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

