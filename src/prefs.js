import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import { update_from_old_settings } from './settings/settings_updater.js';
import { PipelinesManager } from './pipelines/pipelines_manager.js';
import { Settings } from './settings/settings.js';
import { KEYS } from './settings/keys.js';

import { ICONS_RESOURCE_PATH } from './preferences/resources.js';
import { addMenu } from './preferences/menu.js';
import { ShellPage } from './preferences/pages/shell/index.js';
import { Pipelines } from './preferences/pages/pipelines/index.js';

export default class MaterialBlurPreferences extends ExtensionPreferences {
    constructor(metadata) {
        super(metadata);
        Gtk.IconTheme.get_for_display(Gdk.Display.get_default())
            .add_resource_path(ICONS_RESOURCE_PATH);
    }

    fillPreferencesWindow(window) {
        const gsettings = this.getSettings();
        update_from_old_settings(gsettings);

        const preferences = new Settings(KEYS, gsettings);
        const pipelinesManager = new PipelinesManager(preferences);
        addMenu(window, preferences);

        const pipelinesPage = new Pipelines(preferences, pipelinesManager, window);
        window.add(new ShellPage(preferences, pipelinesManager, pipelinesPage, window));
        window.add(pipelinesPage);
        window.set_default_size(640, 760);

        window.connect('close-request', () => {
            pipelinesPage.cleanup();
            pipelinesManager.destroy();
            preferences.disconnect_all_settings();
            return false;
        });

        window.search_enabled = true;
    }
}
