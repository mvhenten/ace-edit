# Ace Edit is an Editor

Ace edit is an editor, not an IDE. 
We provide the features of ACE combined with a powerful editing interface.


## Getting started

```
git clone https://github.com/mvhenten/ace-edit.git
cd ace-edit
npm install
npm run server
```


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




  
  
