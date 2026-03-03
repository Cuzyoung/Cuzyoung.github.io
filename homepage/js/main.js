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
