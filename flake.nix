{
  description = "Devshell for dwebble-frontend";

  inputs = {
    nixpkgs.url      = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url  = "github:numtide/flake-utils";
    pyrin.url        = "github:nanoteck137/pyrin";
  };

  outputs = { self, nixpkgs, flake-utils, pyrin, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            pyrin.packages.${system}.default
          ];
        };
      }
    );
}
