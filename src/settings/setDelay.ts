import { Setting } from "obsidian";
import FileHider from "../main";

export class SetDelaySetting {

    public static create(plugin: FileHider, container: HTMLElement) {
        return new Setting(container)
            .setName(`Set Delay`)
            .setDesc(`Set the delay for hiding after the explorer loads. "X seconds Y milliseconds". Default: "0s 500ms".`)
            .addText(text => {
                // Convert milliseconds to seconds and milliseconds
                const seconds = Math.floor(plugin.settings.delay / 1000);
                const milliseconds = plugin.settings.delay % 1000;

                text
                    .setValue(`${seconds}s ${milliseconds}ms`)
                    .onChange(value => {
                        // Regular expression to match the input format "Xs Yms"
                        const match = value.match(/(?:(\d+)s)?\s*(\d*)ms?/);
                        if (match) {
                            const seconds = parseInt(match[1] || "0", 10);
                            const milliseconds = parseInt(match[2] || "0", 10);
                            const delay = (seconds * 1000) + milliseconds;

                            if (!isNaN(delay)) {
                                plugin.settings.delay = delay;
                                plugin.saveSettings();
                            };
                        } else {
                            // Handle invalid format input
                            text.setValue(`${Math.floor(plugin.settings.delay / 1000)}s ${plugin.settings.delay % 1000}ms`);
                        };
                    });
            });
    };
};
