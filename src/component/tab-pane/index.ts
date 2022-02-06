/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TabBody } from "./lib/tab-body";
import { TabHeader } from "./lib/tab-header";
import { TabContainer } from "./lib/tab-container";

/* eslint-disable */
declare module "preact/src/jsx" {
    namespace JSXInternal {
        import HTMLAttributes = JSXInternal.HTMLAttributes;

        interface IntrinsicElements {
            "tab-container": HTMLAttributes<TabContainer>;
            "tab-header": HTMLAttributes<TabHeader>;
            "tab-body": HTMLAttributes<TabBody>;
        }
    }
}

export const setupTabPane = () => {
    customElements.define("tab-container", TabContainer);
    customElements.define("tab-header", TabHeader);
    customElements.define("tab-body", TabBody);
};
