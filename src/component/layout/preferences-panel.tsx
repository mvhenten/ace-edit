import { OptionsData } from "../application-state";
import { PreferenceItem } from "../preferences";

export type OptionChangeCallback = (key: string, value: any) => void;

type PreferencesControlProps = {
    item: PreferenceItem;
    options: OptionsData;
    onOptionChange: OptionChangeCallback;
};

const PreferencesControl = (props: PreferencesControlProps) => {
    const { item, options, onOptionChange } = props;

    if (item.type === "select" && !item.selectOptions.length) {
        throw new Error("Control of type 'select' must have options.");
    }

    const value = options.get(item.key);
    if (item.type === "select") {
        return (
            <select
                value={value}
                onChange={(e) =>
                    onOptionChange(
                        item.key,
                        (e.target as HTMLSelectElement).value
                    )
                }
            >
                {item.selectOptions!.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.text}
                    </option>
                ))}
            </select>
        );
    } else if (item.type === "integerInput") {
        return (
            <input
                type="number"
                value={value}
                onInput={(e) =>
                    onOptionChange(
                        item.key,
                        parseInt((e.target as HTMLInputElement).value, 10)
                    )
                }
            />
        );
    } else if (item.type === "checkbox") {
        return (
            <input
                type="checkbox"
                checked={value}
                onClick={(e) =>
                    onOptionChange(
                        item.key,
                        (e.target as HTMLInputElement).checked
                    )
                }
            />
        );
    } else {
        throw new Error(`Invalid type '${item.type}'.`);
    }
};

export type PreferencesProps = {
    preferences: PreferenceItem[];
    options: OptionsData;
    onOptionChange: OptionChangeCallback;
};

export const PreferencesPanel = (props: PreferencesProps) => {
    return (
        <div>
            <h3 className="pref-header">Preferences</h3>
            <table>
                {props.preferences.map((item) => (
                    <tr key={item.key}>
                        <td className="pref-label">{item.label}</td>
                        <td className="pref-control">
                            <PreferencesControl
                                item={item}
                                options={props.options}
                                onOptionChange={props.onOptionChange}
                            />
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};
