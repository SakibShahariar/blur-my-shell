import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import { update_from_old_settings } from './settings/settings_updater.js';
import { PipelinesManager } from './pipelines/pipelines_manager.js';
import { EffectsManager } from './pipelines/effects_manager.js';
import { Connections } from './conveniences/connections.js';
import { Settings } from './settings/settings.js';
import { KEYS } from './settings/keys.js';

import { PanelBlur } from './components/panel/index.js';
import { enable_system_style, disable_system_style } from './conveniences/style.js';
import { track_painted_views } from './render/backdrop/painted_view.js';
import { SharedBackgrounds } from './render/static_blur/shared_backgrounds.js';
import { clear_snippets } from './render/shader/snippet_cache.js';

export default class MaterialBlur extends Extension {
    enable() {
        global.blur_my_shell = this;

        const gsettings = this.getSettings();
        update_from_old_settings(gsettings);
        this._settings = new Settings(KEYS, gsettings);
        this._connection = new Connections();

        this._connection.connect(Main.uiGroup, 'destroy', () => this.disable());
        track_painted_views(this._connection);
        enable_system_style();

        this._effects_manager = new EffectsManager(this._connection);
        this._pipelines_manager = new PipelinesManager(this._settings);
        this._shared_backgrounds = new SharedBackgrounds(
            this._connection, this._effects_manager, this._pipelines_manager
        );

        this._panel_blur = new PanelBlur(
            new Connections(), this._settings, this._effects_manager
        );

        this._settings.panel.BLUR_changed(() => {
            if (this._settings.panel.BLUR) {
                if (!this._panel_blur.enabled)
                    this._panel_blur.enable();
            } else if (this._panel_blur.enabled) {
                this._panel_blur.disable();
            }
        });

        // Rebuild the panel surface when a panel option changes. This keeps the
        // rendering actor, style classes and geometry in sync with preferences.
        const panelKeys = KEYS.find(bundle => bundle.component === 'panel').schemas;
        panelKeys.filter(key => key.name !== 'blur').forEach(key => {
            const property = this._settings.get_property_name(key.name);
            this._settings.panel[property + '_changed'](() => {
                if (this._panel_blur.enabled)
                    this._panel_blur.reset();
            });
        });

        this._settings.dash_to_panel.BLUR_ORIGINAL_PANEL_changed(() => {
            if (this._panel_blur.enabled)
                this._panel_blur.reset();
        });

        if (this._settings.panel.BLUR)
            this._panel_blur.enable();
    }

    disable() {
        if (!this._settings)
            return;

        this._panel_blur?.disable();
        this._panel_blur = null;

        this._shared_backgrounds?.destroy();
        this._shared_backgrounds = null;
        this._effects_manager?.destroy_all();
        this._effects_manager = null;
        this._pipelines_manager?.destroy();
        this._pipelines_manager = null;

        clear_snippets();
        this._settings.disconnect_all_settings();
        this._connection.disconnect_all();
        disable_system_style();

        delete global.blur_my_shell;
        this._connection = null;
        this._settings = null;
    }
}
