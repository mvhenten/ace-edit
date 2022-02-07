import modelist = require("ace-builds/src-noconflict/ext-modelist");
import { OptionsData } from "../application-state/interfaces";

export type PreferencesProps = {
    options: OptionsData;
    onOptionChange: (key: string, value: any) => void;
};

export const Preferences = (props: PreferencesProps) => {
    const { options, onOptionChange } = props;

    const handleModeChange = (e) => onOptionChange("mode", e.target.value);
    const handleFontSizeChange = (e) =>
        onOptionChange("fontSize", parseInt(e.target.value, 10));
    const handleShowGatterChange = (e) =>
        onOptionChange("showGutter", e.target.checked);

    return (
        <div>
            <h3 class="pref-header">Preferences</h3>
            <table>
                <tr>
                    <td class="pref-label">Mode:</td>
                    <td class="pref-control">
                        <select
                            value={options.get("mode")}
                            onChange={handleModeChange}
                        >
                            {modelist.modes.map((mode) => (
                                <option value={mode.mode}>
                                    {mode.caption}
                                </option>
                            ))}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="pref-label">Font size:</td>
                    <td class="pref-control">
                        <input
                            type="number"
                            value={options.get("fontSize")}
                            onInput={handleFontSizeChange}
                        />
                    </td>
                </tr>
                <tr>
                    <td class="pref-label">Show Gutter:</td>
                    <td class="pref-control">
                        <input
                            type="checkbox"
                            checked={options.get("showGutter")}
                            onClick={handleShowGatterChange}
                        />
                    </td>
                </tr>
            </table>
        </div>
    );
};
