import twemoji from "twemoji";

// Vérifier si nous sommes côté client
if (typeof window !== "undefined") {
  // Configuration globale de Twemoji
  const twemojiOptions = {
    folder: "svg",
    ext: ".svg",
    size: "svg",
    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
    className: "twemoji",
    attributes: () => ({
      loading: "lazy",
      "aria-hidden": "true"
    })
  };

  // Fonction pour parser les emojis
  function parseTwemoji() {
    // Parser le contenu principal
    const content = document.querySelector("#__docusaurus");
    if (content) {
      twemoji.parse(content, twemojiOptions);
    }
  }

  // Observer pour les changements de contenu (navigation SPA)
  const observer = new MutationObserver((mutations) => {
    let shouldParse = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            shouldParse = true;
          }
        });
      }
    });

    if (shouldParse) {
      // Délai pour s'assurer que le contenu est rendu
      setTimeout(parseTwemoji, 100);
    }
  });

  // Initialisation
  function initTwemoji() {
    // Parser initial
    parseTwemoji();

    // Observer les changements
    const targetNode = document.querySelector("#__docusaurus");
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true
      });
    }
  }

  // Démarrer quand le DOM est prêt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTwemoji);
  } else {
    initTwemoji();
  }

  // Parser aussi lors des navigations
  window.addEventListener("popstate", () => {
    setTimeout(parseTwemoji, 100);
  });
}
