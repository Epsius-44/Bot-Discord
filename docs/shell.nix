with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    nodejs_22
    pre-commit
  ];

  shellHook = ''
    echo "Chargement des dépendances du projet :"
    echo " - Node.JS ($(node -v))"
    echo " - NPM ($(npm -v))"
    echo ""
    echo "Configuration spécifique pour NixOS"
    mkdir -p .nix-node
    export NODE_PATH=$PWD/.nix-node
    export NPM_CONFIG_PREFIX=$PWD/.nix-node
    export PATH=$NODE_PATH/bin:$PATH
  '';
}
