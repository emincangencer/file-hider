import { Setting } from "obsidian";
import FileHider from "../main";

export class SetDelaySetting {

	public static create(plugin: FileHider, container: HTMLElement) {
		return new Setting(container)
		.setName(`Set Delay`)
		.setDesc(`Set the delay for hiding after explorer loads.`)
		.addText(text => {
			text
			.setValue(plugin.settings.delay.toString())
			.onChange(value => {
				const delay = parseInt(value, 10);
				if (!isNaN(delay)) {
					plugin.settings.delay = delay;
					plugin.saveSettings();
				}
			});
		});
	};
};