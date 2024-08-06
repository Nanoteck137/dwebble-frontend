{
  description = "Devshell for dwebble-frontend";

  inputs = {
    nixpkgs.url      = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url  = "github:numtide/flake-utils";
    pyrin.url        = "github:nanoteck137/pyrin/v0.4.0";

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

        version = pkgs.lib.strings.fileContents "${self}/version";
        rev = self.dirtyShortRev or self.shortRev or "dirty";
        fullVersion = ''${version}-${rev}'';

        app = pkgs.buildNpmPackage {
          name = "dwebble-frontend";
          version = fullVersion;

          src = gitignore.lib.gitignoreSource ./.;
          npmDepsHash = "sha256-+lWfe52MGdvMHcGs7gta+VPr5o2eWhuzLZcglRUrt1E=";

          PUBLIC_VERSION=version;
          PUBLIC_COMMIT=self.rev or "dirty";

          installPhase = ''
            runHook preInstall
            cp -r build $out/
            echo '{ "type": "module" }' > $out/package.json

            mkdir $out/bin
            echo -e "#!${pkgs.runtimeShell}\n${pkgs.nodejs}/bin/node $out\n" > $out/bin/dwebble-frontend
            chmod +x $out/bin/dwebble-frontend

            runHook postInstall
          '';
        };
      in
      {
        packages.default = app;

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            python3
            pyrin.packages.${system}.default
          ];
        };
      }
    );
}
