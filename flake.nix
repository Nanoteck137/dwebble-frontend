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
          npmDepsHash = "sha256-0R0zcjevu3yrKC/+7nJsOq4eXEpE0/Y/4IJ/lgtU9oY=";

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
    ) // {
      nixosModules.default = { config, lib, pkgs, ... }:
        with lib; let
          cfg = config.services.dwebble-frontend;

          # dwebbleConfig = pkgs.writeText "config.toml" ''
          #   listen_addr = "${cfg.host}:${toString cfg.port}"
          #   data_dir = "/var/lib/dwebble"
          #   library_dir = "${cfg.library}"
          #   jwt_secret = "${cfg.jwtSecret}"
          # '';
        in
        {
          options.services.dwebble-frontend = {
            enable = mkEnableOption "Enable the dwebble-frontend service";

            port = mkOption {
              type = types.port;
              default = 7550;
              description = "port to listen on";
            };

            host = mkOption {
              type = types.str;
              default = "";
              description = "hostname or address to listen on";
            };

            apiAddress = mkOption {
              type = types.str;
              description = "address to the api server";
            };

            package = mkOption {
              type = types.package;
              default = self.packages.${pkgs.system}.default;
              description = "package to use for this service (defaults to the one in the flake)";
            };

            user = mkOption {
              type = types.str;
              default = "dwebble-frontend";
              description = lib.mdDoc "user to use for this service";
            };

            group = mkOption {
              type = types.str;
              default = "dwebble-frontend";
              description = lib.mdDoc "group to use for this service";
            };
          };

          config = mkIf cfg.enable {
            systemd.services.dwebble-frontend = {
              description = "Frontend for dwebble";
              wantedBy = [ "multi-user.target" ];

              serviceConfig = {
                User = cfg.user;
                Group = cfg.group;

                Environment = {
                  PORT = toString cfg.port;
                  HOST = cfg.host;
                  API_ADDRESS = cfg.apiAddress;
                };

                ExecStart = "${cfg.package}/bin/dwebble-frontend";

                Restart = "on-failure";
                RestartSec = "5s";

                ProtectHome = true;
                ProtectHostname = true;
                ProtectKernelLogs = true;
                ProtectKernelModules = true;
                ProtectKernelTunables = true;
                ProtectProc = "invisible";
                ProtectSystem = "strict";
                RestrictAddressFamilies = [ "AF_INET" "AF_INET6" "AF_UNIX" ];
                RestrictNamespaces = true;
                RestrictRealtime = true;
                RestrictSUIDSGID = true;
              };
            };

            users.users = mkIf (cfg.user == "dwebble-frontend") {
              dwebble-frontend = {
                group = cfg.group;
                isSystemUser = true;
              };
            };

            users.groups = mkIf (cfg.group == "dwebble-frontend") {
              dwebble-frontend = {};
            };
          };
        };
    };
}
