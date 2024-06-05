{
  description = "Devshell for dwebble-frontend";

  inputs = {
    nixpkgs.url      = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url  = "github:numtide/flake-utils";
    pyrin.url        = "github:nanoteck137/pyrin/v0.1.1";

    gitignore.url = "github:hercules-ci/gitignore.nix";
    gitignore.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, gitignore, pyrin, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        version = self.shortRev or "dirty";

        app = pkgs.buildNpmPackage {
          name = "dwebble-frontend";
          inherit version;

          src = gitignore.lib.gitignoreSource ./.;
          npmDepsHash = "sha256-3hDm1/M3vgLgREyteMX+dKveW2j7x0dpJZfXSuuNqoE=";

          installPhase = ''
            runHook preInstall
            cp -r dist $out/
            runHook postInstall
          '';
        };
      in
      {
        packages.default = app;

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            pyrin.packages.${system}.default
          ];
        };
      }
    );
}
