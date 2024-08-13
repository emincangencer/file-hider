import { VisibilityToggleCommand } from './commands/toggleVisibility';
import { VisibilityToggleSetting } from './settings/hiddenToggle';
import { SetDelaySetting } from './settings/setDelay';
import { App, Plugin, PluginSettingTab, TFolder } from 'obsidian';
import { ManageHiddenPaths } from './settings/manageHiddenPaths';
import { changePathVisibility } from './utils';

interface FileHiderSettings {
	hidden: boolean;
	hiddenList: string[];
	delay: number;
};


export default class FileHider extends Plugin {
	settings: FileHiderSettings = {
		hidden: true,
		hiddenList: [],
		delay: 500, //set the default delay to 500
	};

	style: CSSStyleSheet|null = null;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.workspace.on(`file-menu`, (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((i) => {
						if (this.settings.hiddenList.includes(file.path)) {
							i.setTitle(`Unhide Folder`)
							.setIcon(`eye`)
							.onClick(() => {
								this.unhidePath(file.path);
							});
						} else {
							i.setTitle(`Hide Folder`)
							.setIcon(`eye-off`)
							.onClick(() => {
								changePathVisibility(file.path, this.settings.hidden);
								this.settings.hiddenList.push(file.path);
								this.saveSettings();
							});
						};
					});
				} else {
					menu.addItem((i) => {
						if (this.settings.hiddenList.includes(file.path)) {
							i.setTitle(`Unhide File`)
							.setIcon(`eye`)
							.onClick((e) => {
								this.unhidePath(file.path);
							});
						} else {
							i.setTitle(`Hide File`)
							.setIcon(`eye-off`)
							.onClick((e) => {
								changePathVisibility(file.path, this.settings.hidden);
								this.settings.hiddenList.push(file.path);
								this.saveSettings();
							});
						};
					});
				};
			})
		);

		this.app.workspace.onLayoutReady(() => 
		{
			// Use the delay setting from the plugin's settings. Default is 500.
			setTimeout(() => {
				for (const path of this.settings.hiddenList) {
					changePathVisibility(path, this.settings.hidden);
				};
			}, this.settings.delay);
		});

		new VisibilityToggleCommand(this);
		this.addSettingTab(new FileHiderSettingsTab(this.app, this));
	};

	/*
	Loads the config settings, with defaults created where needed.
	*/
	async loadSettings() {
		this.settings = Object.assign({}, this.settings, await this.loadData());
	};

	/* Saves the setting data */
	async saveSettings() {
		await this.saveData(this.settings);
	};

	/*
	Enables/Disables the file visibility based. (gets the stylesheet if needed)
	*/
	toggleVisibility() {
		this.settings.hidden = !this.settings.hidden;
		for (const path of this.settings.hiddenList) {
			changePathVisibility(path, this.settings.hidden);
		};
		this.saveSettings();
	};

	unhidePath(path: string) {
		let i = this.settings.hiddenList.indexOf(path);
		this.settings.hiddenList.splice(i, 1);
		changePathVisibility(path, false);
		this.saveSettings();
	};
};


/**
 * All of the settings for the FileHider
 */
class FileHiderSettingsTab extends PluginSettingTab {
	plugin: FileHider;

	constructor(app: App, plugin: FileHider) {
		super(app, plugin);
		this.plugin = plugin;
	};

	display(): void {
		const { containerEl: container } = this;

		container.empty();
		VisibilityToggleSetting.create(this.plugin, container);
		ManageHiddenPaths.create(this.plugin, container);
		SetDelaySetting.create(this.plugin, container);
	};
};