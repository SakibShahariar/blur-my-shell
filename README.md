# Material Blur

Material Blur is a GNOME Shell panel-blur extension derived from [Blur my Shell](https://github.com/aunetx/blur-my-shell).

It focuses on one job: making the GNOME Shell panel look at home in modern custom layouts, including capsule, pill and segmented panel designs. The initial codebase retains the upstream panel blur engine and its shared rendering pipeline; layout-aware blur surfaces are being developed on top of that foundation.

## Current scope

- GNOME Shell panel blur
- Static and dynamic blur pipelines
- Panel style, corner and proximity controls
- Stock GNOME panel and supported Dash to Panel discovery

## Planned

- Automatic discovery of custom panel surface actors
- Per-segment blur for layouts such as Material GNOME Theme's Segmented Dock and Pill Duo
- Explicit custom-target selection for less common panel layouts
- A focused preferences experience for panel surfaces

Material Blur is independent of [Material GNOME Theme](https://github.com/SakibShahariar/material-gnome-theme) and [Material Panel](https://github.com/SakibShahariar/material-panel). Theme integration is optional.

## Build and install

On Fedora, install the build dependencies:

```sh
sudo dnf install make gettext glib2-devel gnome-shell
```

Then build and install:

```sh
git clone https://github.com/SakibShahariar/blur-my-shell.git
cd blur-my-shell
make install
```

Log out and back in to load the extension. To remove the locally installed extension:

```sh
make remove
```

## Upstream and licensing

Material Blur is derived from [Blur my Shell](https://github.com/aunetx/blur-my-shell) by aunetx and contributors. The upstream panel discovery, blur rendering, effect and pipeline code remains covered by the original GNU General Public License v3 or later. See [LICENSE](LICENSE) for the full license text.

Material Blur-specific changes are also released under GPL-3.0-or-later.
