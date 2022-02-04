import { h, Component, createRef, render } from "preact";
import htm from "htm";

// Initialize htm with Preact
const html = htm.bind(h);



type FileTreeNode = {
  kind: string
  children?: FileTreeNode[]
  path: string
}

// todo replace this with a real file tree
const FileTree = (props:{tree:{ nodes: FileTreeNode[] }}) => {
  
  // just flatten the thing
  const flatTree:any[] = [];
  const stack = props.tree.nodes;

  const onItemClick = (e:any) => {
    console.log("Click in file tree", e);
  }

  while (true) {
      const element = stack.pop();

      if (!element)
        break;

      if (element.kind == "Directory" && element.children) {
        stack.push(...element.children);
      }
      else {
        const item = html`<li onClick=${onItemClick} data-path=${element.path}>${element.path}</li>`;

        flatTree.push(item);        
      }
  }

  return html`<u>${flatTree}</ul>`;
}


// Types for props
type ExpandableProps = {
  title: string;
};

// Types for state
type ExpandableState = {
  toggled: boolean;
};

class App extends Component<ExpandableProps, ExpandableState> {
  ref = createRef();

  constructor({ name }:{ name:string }) {
    super();
    this.state = { toggled: false };
  }

  componentDidMount() {
    console.log(this.ref.current);
    // Logs: [HTMLDivElement]
  }


  render() {
    return html`
      <div class="app-layout">
        <div class="slot-notifications">notifications</div>
        <div class="app-layout-center">
          <div class="slot-filetree">
            filetree
          </div>
          <div class="slot-editor">
            <pre id="editor">
            edit me
            </pre>
          </div>
          <div class="slot-preferences">
          prefs
          </div>

        
        </div>
        </div>
    `;
  }
}



export const createLayout = (hostElementFactory:() => Element) => {
    const targetDomNode = hostElementFactory();

      console.log("Got dom node", targetDomNode);

    render(html`<${App} name="World" />`, targetDomNode);
}
