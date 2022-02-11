import { FileTree } from "../application-state";
import { AceLogo } from "./lib/AceLogo";

export const WelcomePage = (props: { fileTree: FileTree }) => {
    if (props.fileTree.nodes.length) return null;

    return (
        <article
            className="padding-6"
            style={{
                minWidth: "520px",
                maxWidth: "620px",
            }}
        >
            <header
                style={{
                    gap: "30px",
                }}
                className="flex row type margin-right-1"
            >
                <h1
                    style={{
                        flex: 1,
                        fontWeight: "800",
                        fontSize: "48px",
                        lineHeight: "48px",
                    }}
                    className="text-default bolder"
                >
                    The high performance code editor for the web.
                </h1>
                <div style={{ flex: 1, textAlign: "right" }}>
                    <AceLogo width={170} />
                </div>
            </header>
            <section className="type lighten text-default padding-top-4 xxlarge">
                <ul
                    style={{
                        columns: "2",
                        columnGap: "5em",
                        padding: 0,
                        lineHeight: "24px",
                    }}
                >
                    <li>
                        Syntax highlighting for over 110 languages
                        (TextMate/Sublime Text.tmlanguage files can be imported)
                    </li>
                    <li>
                        Over 20 themes (TextMate/Sublime Text .tmtheme files can
                        be imported)
                    </li>
                    <li>
                        Automatic indent and outdent, an optional command line
                    </li>
                    <li>Multiple cursors and selections</li>
                    <li>
                        Handles huge documents (four million lines seems to be
                        the limit!)
                    </li>
                    <li>
                        Fully customizable key bindings including vim and Emacs
                        modes,
                    </li>
                    <li>Search and replace with regular expressions</li>
                    <li>Highlight matching parentheses</li>
                    <li>Toggle between soft tabs and real tabs</li>
                </ul>
            </section>
        </article>
    );
};
