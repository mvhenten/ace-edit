# ace edit is an editor

Ace edit is an editor, not an IDE. We provide the features of ACE combined with a powerful editing interface.

## Feature goals:

Stage 1 (POC) File system and file tree:

We will focus on happy paths. Per browser tab you can only open one file tree at a time, we don't offer crud or even opening another file tree.

  * File system abstraction
    * Start with a mock file system
    * Local file system APIs
    * Explore ideas for remote file systems (S3 buckets, Git repos, SSM (??))
  * Open file tree
  * Open file, read file, safe file
  * Create file
  * Create dir
  
Stage 2 (FUTURE):

Some ideas that we want to keep on the horizon:

  * File system CRUD
  * Switching file systems (requires scoping the entire layout to a file system)
  * Persisting layout between reloads (requires caching the file system and reconnecting)
  
  
2. ACE editing and configuration. 

Stage 1 (POC): 

Focus on the "demo effect" -> we don't need to do it all but just the thing that make it look nice.

  * Open multiple ACE editor windows in a tabbed view
  * Basic configuration in an edit pane to switch ace options

Stage 2 (FUTURE)

  * configuration can be stored and read from browser storage. 
  * configuration can be stored and read from a file system
  
3. Layout and UX elements

We will focus on a minimal, fixed layout that can be moved to a more dynamic layout compositor. 

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                    │
│   NOTIFICATiON AREA:  [open file tree] [restore previous session]                  │
│                                                                                    │
├─────────────────┬──────────────┬─────────────┬───────────┬───────┬─────────────────┤
│                 │file1.js     X│ file_long. X│ package. x│ etc.  │                 │
│ lib/            ├──────────────┼─────────────┼───────────┼───────┤  COLLAPSIBLE    │
│ ├── runner.js   ├──┼─────────────────────────────────────────────┤  CONFIG PANE    │
│ ├── sim-search. │1 │                                             │  =============  │
│ ├── table.js    │2 │ ace editor. Multi tab layout but simple     │                 │
│ └── table_test.j│3 │                                             │  config pane    │
│                 │4 │                                             │  can be collapsed
│                 │5 │                                             │                 │
│                 │6 │                                             │  feature basic  │
│                 │7 │                                             │  ace config     │
│                 │8 │                                             │                 │
│                 │9 │                                             │                 │
│                 │10│                                             │                 │
│                 │11│                                             │                 │
│                 │12│                                             │                 │
│                 │13│                                             │                 │
│                 │14│                                             │                 │
│                 │15│                                             │                 │
│                 │16│                                             │                 │
│                 │17│                                             │                 │
│                 │18│                                             │                 │
│                 │19│                                             │                 │
│                 │10│                                             │                 │
└─────────────────┴──┴─────────────────────────────────────────────┴─────────────────┘
```





## Tech choices

* Use typescript.
* Use preact for html rendering
https://preactjs.com/
* Use flux/observable components for data updates (we will use a simple in house flux system)
https://github.com/mvhenten/kabinet
* Use ACE/ACE filetree
https://github.com/c9/core/tree/master/plugins/node_modules/ace_tree
* Use webcomponents for tabs 
https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs




  
  
