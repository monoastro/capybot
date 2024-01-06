{ pkgs }: {
	deps = [
		pkgs.neofetch
  pkgs.python39Packages.pip
  pkgs.python39Full
  pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
	];
}