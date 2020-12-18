import {DefaultTextInputTagsRenderer} from "@intellective/core";

import {ErrorAwareOptionTag} from "./ErrorAwareOptionTag";

export default (props) => DefaultTextInputTagsRenderer({...props, OptionTag: ErrorAwareOptionTag});