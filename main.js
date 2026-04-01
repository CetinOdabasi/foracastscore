(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var backdrop = document.getElementById("nav-backdrop");

  function setOpen(open) {
    if (toggle && nav) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
      nav.classList.toggle("is-open", open);
    }
    if (backdrop) {
      if (open) {
        backdrop.removeAttribute("hidden");
        backdrop.setAttribute("aria-hidden", "false");
        backdrop.classList.add("is-visible");
      } else {
        backdrop.setAttribute("hidden", "");
        backdrop.setAttribute("aria-hidden", "true");
        backdrop.classList.remove("is-visible");
      }
    }
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 769px)").matches) {
        setOpen(false);
      }
    });
  }

  var liveTime = document.getElementById("live-refresh");
  if (liveTime) {
    function refreshLabel() {
      var now = new Date();
      liveTime.setAttribute("datetime", now.toISOString());
      liveTime.textContent = now.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    refreshLabel();
    setInterval(refreshLabel, 30000);
  }

  var grid = document.getElementById("prediction-grid");
  var search = document.getElementById("prediction-search");
  var emptyMsg = document.getElementById("filter-empty");
  var chips = document.querySelectorAll(".chip-btn");

  if (!grid || !search) return;

  var cards = grid.querySelectorAll(".pred-card");
  var activeLeague = "all";

  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .trim();
  }

  function syncChipPressed() {
    chips.forEach(function (b) {
      var on = b.classList.contains("is-active");
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function applyFilters() {
    var q = normalize(search.value);
    var visible = 0;

    cards.forEach(function (card) {
      var league = card.getAttribute("data-league") || "";
      var blob = normalize(
        card.getAttribute("data-teams") + " " + league + " " + card.textContent
      );
      var leagueOk = activeLeague === "all" || league === activeLeague;
      var searchOk = !q || blob.indexOf(q) !== -1;
      var show = leagueOk && searchOk;
      card.classList.toggle("is-hidden", !show);
      if (show) visible++;
    });

    if (emptyMsg) {
      emptyMsg.classList.toggle("hidden", visible !== 0);
    }
  }

  search.addEventListener("input", applyFilters);

  chips.forEach(function (btn) {
    btn.addEventListener("click", function () {
      chips.forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      activeLeague = btn.getAttribute("data-filter") || "all";
      syncChipPressed();
      applyFilters();
    });
  });

  syncChipPressed();
})();
