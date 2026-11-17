import Adw from 'gi://Adw';
import GObject from 'gi://GObject';

import { ui_template } from '../../resources.js';
import { create_subpage } from '../../subpage.js';
import { Panel } from './panel.js';

export const ShellPage = GObject.registerClass({
    GTypeName: 'MaterialBlurShellPage',
    Template: ui_template('pages/shell/shell.ui'),
    InternalChildren: ['panel_row'],
}, class ShellPage extends Adw.PreferencesPage {
    constructor(preferences, pipelines_manager, pipelines_page, window) {
        super({});
        this._window = window;
        this._subpage = null;
        this._panel_row.initialize(preferences.panel, () => this.open_panel(
            preferences, pipelines_manager, pipelines_page
        ));
    }

    open_panel(preferences, pipelines_manager, pipelines_page) {
        if (!this._subpage) {
            this._subpage = create_subpage(
                this._panel_row.title,
                new Panel(preferences, pipelines_manager, pipelines_page)
            );
        }
        this._window.push_subpage(this._subpage);
    }
});
