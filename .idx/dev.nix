# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.openssl.dev
    pkgs.postgresql_14
  ];

  services.postgres = {
    enable = true;
  };

  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "nrwl.angular-console"
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "firsttris.vscode-jest-runner"
      # "vscodevim.vim"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        # api = {
        #   command = ["nx" "build" "api"];
        #   manager = "api";
        # };
        # video = {
        #   command = ["nx" "serve" "video"];
        #   manager = "video";
        # };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        postgres-setup = ''
          initdb -D local
          psql --dbname=postgres -c "ALTER USER \"nolo\" PASSWORD '0Ht%@cs.zJ5cA2>d.+W';"
          psql --dbname=postgres -c "CREATE DATABASE say;"
        '';
        # Example: install JS dependencies from NPM

        npm-install = "npm install";
        prisma-migrate = "npm run migrate";
        prisma-generate = "npm run generate";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start a background task to watch and re-build backend code
        watch-api = "nx serve api";
        watch-video = "nx serve video";
      };
    };
  };
}
